from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.db.utils import IntegrityError
from django.dispatch import receiver

class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100,unique=True)
    phone = models.CharField(max_length=200, default='+000 000000') # +234 (456) - 789
    country = models.CharField(max_length=100)

    def profile(self):
        profile = Profile.objects.get(user=self)



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=200, default='+000 000000') # +234 (456) - 789
    country = models.CharField(max_length=100)
    image = models.ImageField(upload_to="user_images", default="default.jpg")


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        try:
            Profile.objects.create(user=instance)
        except IntegrityError:
            # If a profile for this user already exists, do nothing
            pass
        except Exception as e:
            # Handle other exceptions appropriately, such as logging them
            print("Error creating profile:", str(e))

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)