from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Sketch
from .serializers import SketchSerializer
from .utils import create_art_from_image
import logging
import os
from django.core.files import File
import threading

logger = logging.getLogger(__name__)

def process_image_async(sketch_obj_id):
    """
    Process the image asynchronously to create Ghibli style art using the Hugging Face model
    
    Args:
        sketch_obj_id: ID of the Sketch object to process
    """
    try:
        # Get the sketch object
        sketch_obj = Sketch.objects.get(id=sketch_obj_id)
        
        # Get the path of the saved image
        original_image_path = sketch_obj.image.path
        
        # Create Ghibli art from the original image using Hugging Face model
        output_image_path = create_art_from_image(original_image_path)
        
        # Update the sketch object with the processed image
        with open(output_image_path, 'rb') as f:
            output_filename = os.path.basename(output_image_path)
            sketch_obj.sketch_image.save(output_filename, File(f), save=False)
        
        sketch_obj.processed = True
        sketch_obj.save()
        
        logger.info(f"Successfully processed Ghibli art for ID {sketch_obj_id}")
    except Exception as e:
        logger.error(f"Error processing image asynchronously: {str(e)}")

class SketchUploadView(APIView):
    """API view for uploading images for Ghibli art transformation"""
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        """Handle POST requests to upload an image"""
        try:
            serializer = SketchSerializer(
                data=request.data,
                context={'request': request}
            )
            
            if serializer.is_valid():
                # Save the original image first
                sketch_obj = serializer.save()
                
                # Start processing the image asynchronously
                # This allows the API to respond quickly while the AI model processes the image
                thread = threading.Thread(
                    target=process_image_async,
                    args=(sketch_obj.id,)
                )
                thread.daemon = True
                thread.start()
                
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED
                )
            
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error in POST: {str(e)}")
            return Response(
                {"error": "An error occurred while processing your request."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request, *args, **kwargs):
        """Handle GET requests to list all images"""
        try:
            sketches = Sketch.objects.all().order_by('-uploaded_at')
            serializer = SketchSerializer(
                sketches,
                many=True,
                context={'request': request}
            )
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in GET: {str(e)}")
            return Response(
                {"error": "An error occurred while retrieving images."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, *args, **kwargs):
        """Handle DELETE requests to delete an image"""
        try:
            sketch_id = request.query_params.get('id')
            if not sketch_id:
                return Response(
                    {"error": "Image ID is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                sketch = Sketch.objects.get(id=sketch_id)
            except Sketch.DoesNotExist:
                return Response(
                    {"error": f"Image with ID {sketch_id} not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Delete the image
            sketch.delete()
            
            return Response(
                {"success": f"Image with ID {sketch_id} deleted successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error in DELETE: {str(e)}")
            return Response(
                {"error": "An error occurred while deleting the image."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )