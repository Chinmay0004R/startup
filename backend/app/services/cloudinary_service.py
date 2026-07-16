from typing import Any, Dict, Optional

from cloudinary import config as cloudinary_config
from cloudinary.uploader import destroy as cloudinary_destroy, upload as cloudinary_upload
from fastapi import UploadFile

from app.core.config import settings


if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
    cloudinary_config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )


ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
ALLOWED_IMAGE_MIME_TYPES = {'image/jpeg', 'image/jpg', 'image/png', 'image/webp'}
ALLOWED_DOCUMENT_EXTENSIONS = {'.pdf'}
ALLOWED_DOCUMENT_MIME_TYPES = {'application/pdf'}
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB


def _detect_resource_type(filename: Optional[str] = None, content_type: Optional[str] = None) -> str:
    if content_type:
        lower_type = content_type.lower()
        if lower_type.startswith("image/"):
            return "image"
        if lower_type == "application/pdf":
            return "raw"
        if lower_type.startswith("video/"):
            return "video"
    if filename:
        lower_name = filename.lower()
        if lower_name.endswith(".pdf"):
            return "raw"
        if lower_name.endswith(('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg')):
            return "image"
        if lower_name.endswith(('.mp4', '.mov', '.avi', '.webm')):
            return "video"
    return "auto"


def _is_allowed_image(upload_file: UploadFile) -> bool:
    content_type = (upload_file.content_type or '').lower()
    if content_type in ALLOWED_IMAGE_MIME_TYPES:
        return True
    filename = (upload_file.filename or '').lower()
    return any(filename.endswith(ext) for ext in ALLOWED_IMAGE_EXTENSIONS)


def _is_allowed_document(upload_file: UploadFile) -> bool:
    content_type = (upload_file.content_type or '').lower()
    if content_type in ALLOWED_DOCUMENT_MIME_TYPES:
        return True
    filename = (upload_file.filename or '').lower()
    return any(filename.endswith(ext) for ext in ALLOWED_DOCUMENT_EXTENSIONS)


async def _validate_upload_size(upload_file: UploadFile) -> None:
    await upload_file.seek(0)
    data = await upload_file.read(MAX_UPLOAD_SIZE + 1)
    await upload_file.seek(0)
    if len(data) > MAX_UPLOAD_SIZE:
        raise ValueError("Maximum upload size is 10 MB.")


async def _read_upload_data(upload_file: UploadFile) -> bytes:
    await upload_file.seek(0)
    data = await upload_file.read()
    await upload_file.seek(0)
    return data


def _require_cloudinary_config() -> None:
    if not settings.CLOUDINARY_CLOUD_NAME or not settings.CLOUDINARY_API_KEY or not settings.CLOUDINARY_API_SECRET:
        raise ValueError("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.")


async def _upload_file(
    upload_file: UploadFile,
    resource_type: Optional[str] = None,
    folder: Optional[str] = None,
) -> Dict[str, Any]:
    _require_cloudinary_config()

    if resource_type is None:
        resource_type = _detect_resource_type(upload_file.filename, upload_file.content_type)

    file_bytes = await _read_upload_data(upload_file)
    options = {
        "resource_type": resource_type,
        "folder": (folder or "healthcare_hub").rstrip("/"),
        "use_filename": True,
        "unique_filename": True,
        "overwrite": False,
    }

    result = cloudinary_upload(file_bytes, **options)
    return {
        "public_id": result.get("public_id"),
        "secure_url": result.get("secure_url"),
        "resource_type": result.get("resource_type"),
        "bytes": result.get("bytes"),
        "format": result.get("format"),
    }


async def upload_image(upload_file: UploadFile, folder: Optional[str] = None) -> Dict[str, Any]:
    """Upload an image file to Cloudinary and return the secure URL and public_id."""
    if not _is_allowed_image(upload_file):
        raise ValueError("Unsupported image MIME type. Allowed types: jpg, jpeg, png, webp.")
    await _validate_upload_size(upload_file)
    return await _upload_file(upload_file, resource_type="image", folder=folder)


async def upload_pdf(upload_file: UploadFile, folder: Optional[str] = None) -> Dict[str, Any]:
    """Upload a PDF file to Cloudinary and return the secure URL and public_id."""
    if not _is_allowed_document(upload_file):
        raise ValueError("Unsupported document MIME type. Only PDF is allowed.")
    await _validate_upload_size(upload_file)
    return await _upload_file(upload_file, resource_type="raw", folder=folder)


async def upload_asset(upload_file: UploadFile, folder: Optional[str] = None) -> Dict[str, Any]:
    """Upload any supported asset and let Cloudinary detect the resource type automatically."""
    if not (_is_allowed_image(upload_file) or _is_allowed_document(upload_file)):
        raise ValueError("Unsupported file type. Allowed types: jpg, jpeg, png, webp, pdf.")
    await _validate_upload_size(upload_file)
    return await _upload_file(upload_file, resource_type=None, folder=folder)


def delete_asset(public_id: str, resource_type: Optional[str] = None) -> Dict[str, Any]:
    """Delete a Cloudinary asset by public_id and return the delete result."""
    options = {"resource_type": resource_type or "auto"}
    return cloudinary_destroy(public_id, **options)
