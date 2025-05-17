"""
ASGI config for sketch_project project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sketch_project.settings')

application = get_asgi_application()