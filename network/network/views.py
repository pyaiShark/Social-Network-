import json
from typing import Any, Type, Dict, List
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.core.paginator import Paginator, EmptyPage
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import User, Post, Follow, Like


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@login_required(login_url="login")
def new_post(request):
    if request.method != "POST":
        return JsonResponse({"error": "GET request not allowed", "ok": False}, status=400)
    user = User.objects.get(username=request.user)

    content = json.loads(request.body)

    obj = Post.objects.create(user=user, content=content)
    obj.save()

    return JsonResponse({"message": "Post added successfully", "ok": True}, status=201)


def logged_in(request):
    try:
        if request.user.is_authenticated:
            return JsonResponse({"is_authenticated": True}, status=201)
        else:
            return JsonResponse({"is_authenticated": False}, status=201)
    except Exception:
        return JsonResponse({"is_authenticated": False}, status=500)
    


def profile(request, username):

    user = User.objects.get(username=username)
    followers = Follow.objects.filter(followed=user.pk).count() # Total no of follower
    followings = Follow.objects.filter(follower=user.pk).count() # Total no of following
    posts = Post.objects.filter(user=user.pk).count()

    follows = False
    if request.user.is_authenticated:
        follows = Follow.objects.filter(
                    follower=request.user, 
                    followed=user
                ).exists()

    show_followBtn = False
    if request.user.is_authenticated:
        if username != request.user.username:
            show_followBtn = True
    return JsonResponse({"username": username, "showBtn":show_followBtn,  "followers": followers, "following": followings, "follows": follows, "posts": posts}, status=201)


def post_paginator(total_posts, user, page_number: int=1, posts_per_page: int=10) -> dict[str, Any]:
    """
    Retrieve paginated posts
    
    Args:
        total_posts: Username to filter posts
        page_number (int): Current page number
        posts_per_page = 10 (int): Number of posts per page, Default not to pass
    
    Returns:
        dict: Pagination results with posts, next page availability, and current page
    """
    # total_no of post is a queryset or object of Post
    queryset = total_posts
    
    # Create paginator
    paginator = Paginator(queryset, posts_per_page)
    
    try:
        # Get the specific page
        page = paginator.page(page_number)
        posts = [post.serialize(user=user) for post in page.object_list]
        return {
            'posts': posts,
            'has_next': page.has_next(),
            'page_number': page_number,
            'total_pages': paginator.num_pages
        }
    except EmptyPage:
        return {
            'posts': [],
            'has_next': False,
            'page_number': page_number,
            'total_pages': 0
        }


def get_posts(request, username, page_number):

    if request.user.is_authenticated:
        if request.method == 'GET' and (request.headers.get('x-requested-with') == 'XMLHttpRequest'):
            user = User.objects.get(username=username)
            user_posts = Post.objects.filter(user=user)

            # Provide the object_list of posts in reverse chronological order
            posts = post_paginator(user_posts.order_by("-timestamp"), user=request.user, page_number=page_number)
            return JsonResponse({"posts":[post_obj for post_obj in posts["posts"]], "has_next": posts["has_next"], "page_number": posts["page_number"], "total_pages": posts["total_pages"], "logged_username": request.user.username})
        
        else:
            posts_objs = Post.objects.all()

            # Provide the object_list of posts in reverse chronological order
            posts = post_paginator(posts_objs.order_by("-timestamp"), user=request.user, page_number=page_number)
            return JsonResponse({"posts":[post_obj for post_obj in posts["posts"]], "has_next": posts["has_next"], "page_number": posts["page_number"], "total_pages": posts["total_pages"], "logged_username": request.user.username})
    else:

        # Provide the object_list of posts in reverse chronological order
        posts = post_paginator(Post.objects.all().order_by("-timestamp"), user=None, page_number=page_number)
        return JsonResponse({"posts":[post_obj for post_obj in posts["posts"]], "has_next": posts["has_next"], "page_number": posts["page_number"], "total_pages": posts["total_pages"], "logged_username": "all"})


@login_required(login_url="login")
@csrf_exempt
def followToggle(request, username):
    if request.method != "POST":
        return JsonResponse({"message": "GET not allowed"}, status=400)


    try:
        user = User.objects.get(username=username)

        if user == request.user:
            return JsonResponse({"message": "Cannot follow yourself"}, status=400)

        existing_follow = Follow.objects.filter(follower=request.user, followed=user).exists()
        if existing_follow:
            existed_obj = Follow.objects.filter(follower=request.user, followed=user)
            existed_obj.delete()
            followers = Follow.objects.filter(followed=user.pk).count() # Total no of follower
            followings = Follow.objects.filter(follower=user.pk).count() # Total no of following
            return JsonResponse({"message": "Unfollowed successfully", "follows": False, "followers": followers, "following": followings}, status=201)
        else:
            follow_obj = Follow.objects.create(follower=request.user, followed=user)
            follow_obj.save()
            followers = Follow.objects.filter(followed=user.pk).count() # Total no of follower
            followings = Follow.objects.filter(follower=user.pk).count() # Total no of following
            return JsonResponse({"message": "Followed successfully", "follows": True, "followers": followers, "following": followings}, status=201)

    except Exception:
        return JsonResponse({"error": "User not found"}, status=404)


@login_required(login_url="login")
def get_following_post(request, page_number):
    if request.user.is_authenticated:
        try:
            user = User.objects.get(username=request.user.username)
            all_username = Follow.objects.filter(follower=user)
            if len(all_username) > 1:
                username = [username.followed.username for username in all_username]
                user_ids = User.objects.filter(username__in=username).values_list('id', flat=True)
                posts_objs = Post.objects.filter(user_id__in=user_ids)
                
                if len(posts_objs) > 1:

                    # Provide the object_list of posts in reverse chronological order
                    posts = post_paginator(posts_objs.order_by("-timestamp"), user=request.user, page_number=page_number)
                    return JsonResponse({"posts":[post_obj for post_obj in posts["posts"]], "has_next": posts["has_next"], "page_number": posts["page_number"], "total_pages": posts["total_pages"], "logged_username": "all"})

                # Provide the object_list of posts in reverse chronological order
                posts = post_paginator(posts_objs.order_by("-timestamp"), user= request.user, page_number=page_number)
                return JsonResponse({"posts": [posts_objs[0].serialize(request.user)], "has_next": posts["has_next"], "page_number": posts["page_number"], "total_pages": posts["total_pages"], "logged_username": "all"})

            elif len(all_username) > 0:
                posts_objs = Post.objects.filter(user=all_username[0].followed.pk)
                if len(posts_objs) > 1:
                    posts = post_paginator(posts_objs.order_by("-timestamp"), user=request.user, page_number=page_number)
                    return JsonResponse({"posts":[post_obj for post_obj in posts["posts"]], "has_next": posts["has_next"], "page_number": posts["page_number"], "total_pages": posts["total_pages"], "logged_username": "all"})

                return JsonResponse({"posts":[posts_objs[0].serialize(request.user)], "has_next": False, "page_number": 1, "total_pages": 0, "logged_username": "all"})
            else:
                return JsonResponse([], safe=False)
        except Exception:
            return JsonResponse({"Bad_request": "Username not found"}, status=401)
    return JsonResponse({"Bad_request": "Username not found"}, status=401)


@csrf_exempt
@login_required(login_url="login")
def like_post(request, id):
    if request.method != "POST":
        return JsonResponse({"message": "GET not allowed"}, status=401)

    try:
        post = Post.objects.get(pk=id)
        if Like.objects.filter(user=request.user, post=post).exists():
            Like.objects.filter(user=request.user, post=post).delete()
            return JsonResponse({"message": "Unliked successfully", "is_liked": False, "like_count": post.likes.count()}, status=201)#type:ignore
        else:
            like = Like.objects.create(user=request.user, post=post)
            like.save()
            return JsonResponse({"message": "liked successfully", "is_liked":True, "like_count": post.likes.count()}, status=201) #type:ignore
    except Exception:
        return JsonResponse({"message": "Error"}, status=401)