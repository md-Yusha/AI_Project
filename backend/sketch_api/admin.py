from django.contrib import admin
from .models import Sketch

@admin.register(Sketch)
class SketchAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploaded_at')
    search_fields = ('title',)
    readonly_fields = ('uploaded_at',)