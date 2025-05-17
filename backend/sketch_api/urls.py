from django.urls import path
from .views import SketchUploadView

urlpatterns = [
    path('sketches/', SketchUploadView.as_view(), name='sketch-upload'),
]