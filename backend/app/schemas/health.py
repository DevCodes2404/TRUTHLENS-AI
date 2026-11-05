from typing import Dict, Literal
from pydantic import BaseModel, Field


class ServiceStatus(BaseModel):
    database: Literal["connected", "disconnected", "pending"] = Field(
        ..., description="Current status of PostgreSQL connection"
    )
    inference: Literal["available", "unavailable", "pending"] = Field(
        ..., description="Current status of AI model inference engine"
    )


class HealthCheckResponse(BaseModel):
    status: Literal["healthy", "degraded", "down"] = Field(
        ..., description="Overall platform API operational status"
    )
    version: str = Field(..., description="API Version identifier")
    timestamp: str = Field(..., description="ISO 8601 formatted UTC timestamp")
    services: ServiceStatus = Field(..., description="Subsystem service statuses")

