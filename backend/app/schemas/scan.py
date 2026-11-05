from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field


MediaType = Literal["image", "video"]
ScanStatus = Literal["pending", "processing", "complete", "failed", "unavailable"]
AuthenticityLabel = Literal["authentic", "ai_generated", "manipulated", "inconclusive", "unknown"]


class ScanBase(BaseModel):
    filename: str = Field(..., max_length=255)
    file_size: int = Field(..., description="File size in bytes")
    media_type: MediaType


class ScanCreate(ScanBase):
    pass


class ScanResponse(ScanBase):
    id: str
    status: ScanStatus
    label: AuthenticityLabel
    created_at: datetime
    duration_ms: Optional[int] = None
    thumbnail_url: Optional[str] = None

    class Config:
        from_attributes = True

