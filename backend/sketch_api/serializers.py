from rest_framework import serializers
from .models import Sketch
from django.conf import settings


class SketchSerializer(serializers.ModelSerializer):
    """Serializer for the Sketch model"""
    image_url = serializers.SerializerMethodField()
    sketch_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Sketch
        fields = ['id', 'title', 'image', 'image_url', 'sketch_image', 'sketch_image_url', 'uploaded_at', 'processed', 'style']
        read_only_fields = ['id', 'image_url', 'sketch_image', 'sketch_image_url', 'uploaded_at', 'processed']
    
    def get_image_url(self, obj):
        """Get the full URL for the original image"""
        if not obj.image or not hasattr(obj.image, 'url'):
            return None
            
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        
        # Fallback if no request in context
        return f"http://localhost:8000{obj.image.url}"
        
    def get_sketch_image_url(self, obj):
        """Get the full URL for the sketch image"""
        if not obj.sketch_image or not hasattr(obj.sketch_image, 'url'):
            return None
            
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.sketch_image.url)
        
        # Fallback if no request in context
        return f"http://localhost:8000{obj.sketch_image.url}" if obj.sketch_image else None