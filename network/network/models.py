from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError


class User(AbstractUser):
    pass


class Post(models.Model):
    user = models.ForeignKey(User, related_name="post", on_delete=models.CASCADE)
    content = models.TextField(blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self, user):
        return {
            "id": self.pk,
            "user": self.user.username,
            "likes": self.likes.count() or 0, #type:ignore
            "liked": self.likes.filter(user=user, like=True).exists(), #type:ignore
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %P")
        }
    def __str__(self) -> str:
        return f"Id: {self.pk}, User: {self.user}, content: {self.content} Timestamp: {self.timestamp}"


class Like(models.Model):
    user = models.ForeignKey(User, related_name="likes", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name="likes", on_delete=models.CASCADE) 
    like = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # Ensures a user can only like a post once


class Follow(models.Model):
    follower = models.ForeignKey(User, related_name="following", on_delete=models.CASCADE) # This is the follower of second column and following of first column
    followed = models.ForeignKey(User, related_name="followers", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def clean(self) -> None:
        if self.follower == self.followed:
            raise ValidationError("User cannot follow themselves")

    def save(self, *args, **kwargs) -> None:
        self.full_clean()
        return super().save(*args, **kwargs)
    
    def __str__(self) -> str:
        return f"Id: {self.pk}, {self.follower}, username: {self.followed}"


    class Meta:
        unique_together = ("follower", "followed")
        indexes = [
            models.Index(fields=["follower"]),
            models.Index(fields=["followed"])
        ]