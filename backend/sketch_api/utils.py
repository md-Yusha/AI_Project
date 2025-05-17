import os
import logging
from django.conf import settings
from gradio_client import Client, handle_file

# Set up logging
logger = logging.getLogger(__name__)

# Hugging Face API token
HF_TOKEN = os.getenv('HF_TOKEN')

def create_art_from_image(image_path, style='ghibli'):
    """
    Convert an image to Studio Ghibli style art using Hugging Face AI models
    
    Args:
        image_path: Path to the original image
        style: Art style to apply (default is 'ghibli')
        
    Returns:
        Path to the created art image
    """
    try:
        logger.info(f"Creating Studio Ghibli art from image at {image_path}")
        
        filename = os.path.basename(image_path)
        name, ext = os.path.splitext(filename)
        
        # Initialize the Hugging Face client for Ghibli style
        client = Client("jamesliu1217/EasyControl_Ghibli", hf_token=HF_TOKEN)
            
        # Make the prediction
        result = client.predict(
                prompt="Ghibli Studio style, Charming hand-drawn anime-style illustration",
                spatial_img=handle_file(image_path),
                height=768,
                width=768,
                seed=42,
                control_type="Ghibli",
                use_zero_init=False,
                zero_steps=1,
                api_name="/single_condition_generate_image"
            )
            
        output_filename = f"{name}_ghibli{ext}"
        
        logger.info(f"Studio Ghibli art created successfully at {result}")
        
        # The result is the path to the generated image
        # We need to copy it to our media directory
        output_path = os.path.join(os.path.dirname(image_path), output_filename)
        
        # Copy the file from the result path to our desired location
        import shutil
        shutil.copy(result, output_path)
        
        return output_path
    except Exception as e:
        logger.error(f"Error creating Studio Ghibli art: {str(e)}")
        raise

