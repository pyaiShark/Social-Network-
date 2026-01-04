from django.contrib import admin
from .models import Post, Follow, Like, User
# Register your models here.
admin.site.register(Post)
admin.site.register(Follow)
admin.site.register(Like)
admin.site.register(User)