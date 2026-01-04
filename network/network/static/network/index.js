document.addEventListener("DOMContentLoaded", function () {
    logged_in(add_post_form);
    logged_in(add_post);
    logged_in(load_logged_user_profile);
    index();
});

function add_post_form() {
    document.querySelector('#following_page').addEventListener('click', function (event) {
        event.preventDefault();
        following_post();
    });
}
function index(page_number = 1) {
    document.querySelector('#view_post').innerHTML = '';
    let username = 'all';
    if (document.querySelector('#profile_page')) {
        username = document.querySelector('#profile_page').innerText;
    }
    fetch(`/get_post/${username}/${page_number}`)
        .then(response => response.json())
        .then((data) => {
            data.posts.forEach(post => {
                const post_obj = createPost(post, data.logged_username, username);
                document.querySelector('#view_post').appendChild(post_obj);
            });
            post_pagination(index, data.page_number, data.total_pages);
        })
        .catch(error => console.log(error));
}

// Add a new post
function add_post(content = '') {
    if (content !== '') {
        document.querySelector('#post_data').value = content;
        window.scrollTo(0, 0);
    };
    document.querySelector("#post").onsubmit = (event) => {
        event.preventDefault();
        const filedContent = document.querySelector("#post_data").value;
        const csrf_token = document
            .querySelector("[name=csrfmiddlewaretoken]")
            .value.trim();

        fetch("/new_post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrf_token, // Pass the CSRF token
            },
            body: JSON.stringify(filedContent),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.ok) {
                    const alert = document.querySelector("#alert");
                    alert.className = "alert alert-success";
                    if (content === '') {
                        alert.innerHTML = data.message || "An error occurred.";
                        alert.style.display = "block";
                    } else {
                        alert.innerHTML = 'Post updated successfully';
                        alert.style.display = "block";
                    }
                    document.querySelector("#post_data").value = "";
                    setTimeout(hide, 2000);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        return false;
    };
}

// Hide alert in 2 sec
function hide() {
    document.querySelector("#alert").style.display = "none";
    index();
}

// Like the post
function liked(id, isLiked, like_count) {
    document.querySelector(`#like${id}`).innerHTML = "";
    const icon = iconConfig();
    const heartIcon = icon[1];
    const heartPath = icon[2];
    const span = icon[3];
    span.innerHTML = like_count;
    if (isLiked) {
        heartIcon.setAttribute("fill", "red");
        heartPath.setAttribute(
            "d",
            "M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1"
        );
        heartIcon.addEventListener("click", function (event) {
            event.preventDefault();
            like_unlike(id);
        });
    } else {
        heartIcon.setAttribute("fill", "currentColor");
        heartPath.setAttribute(
            "d",
            "m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"
        );
        heartIcon.addEventListener("click", function (event) {
            event.preventDefault();
            like_unlike(id);
        });
    }
    heartIcon.setAttribute("class", "bi bi-suit-heart-fill mb-1 mt-1");
    heartIcon.setAttribute("viewBox", "0 0 16 16");

    heartIcon.appendChild(heartPath);

    const heartElement = document.querySelector(`#like${id}`);
    heartElement.appendChild(heartIcon);
    heartElement.appendChild(span);
}

// If user is logged in call the provided function
function logged_in(func, content) {
    fetch("/logged_in")
        .then((response) => response.json())
        .then((result) => {
            if (result.is_authenticated) {
                func(content);
            }
        })
        .catch((error) => console.log(error));
}

// Display the user's profile page
function load_logged_user_profile() {
    document.querySelector("#profile_page").addEventListener("click", function (event) {
        event.preventDefault();
        const username = document.querySelector('#profile_page').innerText;
        load_profile(username);
    });
}

function load_profile(username, page_number = 1) {

    if (document.querySelector("#body")) {
        document.querySelector("#body").remove();
    }
    document.querySelector('#following_post').style.display = 'none';
    const h3_profile = document.createElement("h3");
    h3_profile.innerHTML = "Profile Page";
    document.querySelector("#profile").innerHTML = ''; // Clear the div
    document.querySelector("#profile").appendChild(h3_profile);
    document.querySelector('#view_post').innerHTML = '';

    fetch(`/profile/${username}`)
        .then(response => response.json())
        .then(data => {
            const profile = createProfile(data);
            document.querySelector("#profile").innerHTML = profile;
            showBtn(data.showBtn, data.follows, username);

            const h3Posts = document.createElement("h3");
            h3Posts.innerHTML = 'Posts';
            document.querySelector("#profile").appendChild(h3Posts);

            // Return the next fetch
            return fetch(`/get_post/${username}/${page_number}`, {
                method: "GET",
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });
        })
        .then(response => response.json())
        .then(data => {
            data.posts.forEach(post => {
                const post_obj = createPost(post);
                document.querySelector('#view_post').appendChild(post_obj);
            });
            post_pagination(load_profile, data.page_number, data.total_pages, username);
        })
        .catch(error => console.log(error));
};

function createPost(post, logged_username = '', username = '') {
    // Create the main card element
    const card = document.createElement("div");
    card.className = "card mb-3";

    // Create card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Title
    const titleElement = document.createElement("h5");
    titleElement.className = "card-title mb-2";
    titleElement.innerHTML = `<span class="clickable-username">${post.user}</span>`;
    if (username !== 'all' && post.user !== username) {
        const usernameSpan = titleElement.querySelector('.clickable-username');
        usernameSpan.style.cursor = 'pointer';
        usernameSpan.addEventListener('click', function (event) {
            event.preventDefault();
            load_profile(post.user);
        });
        usernameSpan.addEventListener('mouseenter', function () {
            this.style.textDecoration = 'underline';
            this.style.textDecorationColor = '#6593d4';
        });
        usernameSpan.addEventListener('mouseleave', function () {
            this.style.textDecoration = 'none';
            this.style.textDecorationColor = '';
        });
    }

    // Content
    const contentElement = document.createElement("p");
    contentElement.className = "card-text mb-1";
    contentElement.textContent = post.content;

    // Date subtitle
    const dateElement = document.createElement("p");
    dateElement.className = "card-subtitle text-muted small";
    dateElement.textContent = post.timestamp;

    // Heart icon
    const icon = iconConfig();
    const icon_div = icon[0];
    const heartIcon = icon[1];
    const heartPath = icon[2];
    const span = icon[3];
    span.innerHTML = post.likes;
    icon_div.id = `like${post.id}`;
    heartIcon.addEventListener("click", function (event) {
        event.preventDefault();
        like_unlike(post.id);
    });
    if (post.liked) {
        heartIcon.setAttribute("fill", "red");
        heartPath.setAttribute(
            "d",
            "M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1"
        );
    } else {
        heartIcon.setAttribute("fill", "currentColor");
        heartPath.setAttribute(
            "d",
            "m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"
        );
    }
    heartIcon.setAttribute("class", "bi bi-suit-heart-fill mb-1 mt-1");
    heartIcon.setAttribute("viewBox", "0 0 16 16");

    // Append path to SVG
    heartIcon.appendChild(heartPath);
    icon_div.appendChild(heartIcon);
    icon_div.appendChild(span);

    let item_list = [
        contentElement,
        dateElement,
        icon_div,
    ];
    cardBody.append(titleElement);
    if (post.user === logged_username) {
        // Edit Post btn
        const editLink = document.createElement("a");
        editLink.id = 'edit_post';
        editLink.style.color = 'blue';
        editLink.className = "card-link mb-1";
        editLink.textContent = "Edit";
        editLink.addEventListener('click', function (event) {
            event.preventDefault();
            edit_post(post.content);
        });
        editLink.addEventListener('mouseenter', function () {
            this.style.color = '#87d048ff';
        });
        editLink.addEventListener('mouseleave', function () {
            this.style.color = 'blue';
        });
        cardBody.append(editLink);
    };

    for (item in item_list) {
        cardBody.append(item_list[item]);
    }

    card.appendChild(cardBody);
    return card;
}

function iconConfig() {
    const icon_div = document.createElement("div");
    // Heart icon
    const heartIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );
    const heartPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );
    const span = document.createElement("span");

    span.className = "small text-muted ml-1";
    span.innerText = "600";
    heartIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    heartIcon.setAttribute("width", "16");
    heartIcon.setAttribute("height", "18");

    return [icon_div, heartIcon, heartPath, span];
}


function createProfile(user) {
    return `
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <div class="d-flex flex-column align-items-center">
                            <h5 class="card-title mb-3" style="font-size: 1.25rem;">Username: ${user.username}</h5>
                            <div class="d-flex justify-content-between w-100 mb-3">
                                <div class="text-center flex-grow-1">
                                    <strong>Posts: </strong>
                                    <span id="postCount">${user.posts}</span>
                                </div>
                                <div class="text-center flex-grow-1">
                                    <strong>Followers: </strong>
                                    <span id="followerCount">${user.followers}</span>
                                </div>
                                <div class="text-center flex-grow-1">
                                    <strong>Following: </strong>
                                    <span id="followingCount">${user.following}</span>
                                </div>
                            </div>
                            <div class="mt-3 w-100">
                                <button class="btn btn-primary w-100" id="follow" style="display: none;">Follow</button>
                                <button class="btn btn-secondary w-100" id="Unfollow" style="display: none;">Unfollow</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Show and hide follow btn based on who the user is and also chose the type btn follow or unfollow
function showBtn(is_true, follows, username) {
    if (is_true) {
        if (!follows) {
            document.querySelector('#Unfollow').style.display = 'none';
            const btn = document.querySelector('#follow');
            btn.style.display = 'block';
            btn.onclick = function (event) {
                event.preventDefault();
                followToggle(username);
            };
        } else {
            document.querySelector('#follow').style.display = 'none';
            const btn = document.querySelector('#Unfollow');
            btn.style.display = 'block';
            btn.onclick = function (event) {
                event.preventDefault();
                followToggle(username);
            };
        }
    }
    return '';
}

// Change the follow state, if followed change to Unfollowed and vice versa
function followToggle(username) {
    fetch(`/follow_Unfollow/${username}`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            showBtn(true, data.follows, username)
            document.querySelector('#followerCount').innerHTML = data.followers;
            document.querySelector('#followingCount').innerHTML = data.following;
        })
        .catch(error => console.log(error));
}

// Load all posts from the all user followed by the logged user
function following_post(page_number = 1) {
    // Clear the previous content
    if (document.querySelector("#body")) {
        document.querySelector("#body").remove();
    }
    document.querySelector("#profile").innerHTML = '';

    // Set up heading
    const h3_profile = document.createElement("h3");
    h3_profile.innerHTML = "Following";
    const flw_head = document.querySelector("#following_post");
    flw_head.innerHTML = ''; // Clear the div
    flw_head.appendChild(h3_profile);
    flw_head.style.display = 'block';
    fetch(`/follower_post/${page_number}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('#view_post').innerHTML = '';
            // Check the no follower case
            if (data.length !== 0) {
                data.posts.forEach(post => {
                    const post_obj = createPost(post, data.logged_username);
                    document.querySelector('#view_post').appendChild(post_obj);
                });
                post_pagination(following_post, data.page_number, data.total_pages);
            } else {
                document.querySelector('#next').style.display = 'none';
            }

        })
        .catch(error => console.error(error));
};


function post_pagination(fun, page_number, total_pages, username = '') {
    const next = document.querySelector('#next');
    const previous = document.querySelector('#previous');

    // Remove all existing event listeners by cloning nodes
    const nextClone = next.cloneNode(true);
    const previousClone = previous.cloneNode(true);

    next.parentNode.replaceChild(nextClone, next);
    previous.parentNode.replaceChild(previousClone, previous);

    if (total_pages <= 1) {
        // hide both buttons
        nextClone.style.display = 'none';
        previousClone.style.display = 'none';
    } else if (page_number === 1) {
        previousClone.style.display = 'none';
        nextClone.style.display = 'block';
    } else if (page_number === total_pages) {
        nextClone.style.display = 'none';
        previousClone.style.display = 'block';
    } else {
        nextClone.style.display = 'block';
        previousClone.style.display = 'block';
    }

    nextClone.addEventListener('click', function (event) {
        event.preventDefault();

        // Only navigate if not on last page
        if (page_number < total_pages) {
            if (username !== '') {
                fun(username, page_number + 1);
            } else {
                fun(page_number + 1);
            };
        };
    });

    previousClone.addEventListener('click', function (event) {
        event.preventDefault();

        // Only navigate if not on first page
        if (page_number > 1) {
            if (username !== '') {
                fun(username, page_number - 1);
            } else {
                fun(page_number - 1);
            }
        }
    });
}

// Edit the logged user's post
function edit_post(content) {
    // Only able to edit if the user has logged in; it is not possible for any other user to edit.
    logged_in(add_post, content);
};

// Like or unlike the post
function like_unlike(id) {
    fetch(`like_post/${id}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            liked(id, data.is_liked, data.like_count);
        })
        .catch(error => window.location.href = '/login');
}