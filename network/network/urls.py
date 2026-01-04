
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new_post", views.new_post, name="new_post"),
    path("logged_in", views.logged_in, name="logged_in"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("get_post/<str:username>/<int:page_number>", views.get_posts, name="post"),
    path("follow_Unfollow/<str:username>", views.followToggle, name="follow_Unfollow"),
    path("follower_post/<int:page_number>", views.get_following_post, name="follower_post"),
    path("like_post/<int:id>", views.like_post, name="post")
]