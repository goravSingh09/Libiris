import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app

def save_private_document(file_storage, subfolder: str) -> str:
    """
    Saves an uploaded file into private storage:
    <STORAGE_FOLDER>/<subfolder>/<uuid>.<ext>
    Returns the relative storage path: e.g. 'photos/abc123.jpg'
    """
    if not file_storage or not file_storage.filename:
        raise ValueError("No file provided")
    
    filename = secure_filename(file_storage.filename)
    ext = os.path.splitext(filename)[1].lower().lstrip(".")
    
    allowed = current_app.config.get("ALLOWED_EXTENSIONS", {"png", "jpg", "jpeg", "pdf"})
    if ext not in allowed:
        raise ValueError(f"File type '.{ext}' is not allowed. Allowed types: {', '.join(allowed)}")
    
    storage_root = current_app.config["STORAGE_FOLDER"]
    target_dir = os.path.join(storage_root, subfolder)
    os.makedirs(target_dir, exist_ok=True)
    
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    full_path = os.path.join(target_dir, unique_name)
    
    # Save file
    file_storage.save(full_path)
    
    # Return normalized relative path
    return f"{subfolder}/{unique_name}"

def resolve_private_path(relative_path: str) -> str:
    """
    Resolves relative path against STORAGE_FOLDER while preventing directory traversal attacks.
    """
    storage_root = os.path.abspath(current_app.config["STORAGE_FOLDER"])
    # Handle possible legacy prefix 'uploads/'
    if relative_path.startswith("uploads/"):
        relative_path = relative_path.replace("uploads/", "", 1)
    
    full_path = os.path.abspath(os.path.join(storage_root, relative_path))
    
    if not full_path.startswith(storage_root):
        raise PermissionError("Path traversal detected")
        
    return full_path
