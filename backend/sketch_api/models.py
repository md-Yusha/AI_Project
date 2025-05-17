from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
import os


class Sketch(models.Model):
    """Model for storing Ghibli style art images with titles"""
    
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='sketches/')
    sketch_image = models.ImageField(upload_to='sketches/', blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)
    style = models.CharField(max_length=20, default='ghibli')
    
    def __str__(self):
        return self.title