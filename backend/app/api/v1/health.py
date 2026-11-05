from fastapi import APIRouter
from backend.app.schemas.health import HealthCheckResponse
from backend.app.services.health_service import HealthService

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Platform Health Check",
    description="Returns the current operational status of the TRUTHLENS AI backend and subsystem services.",
)
async def check_health() -> HealthCheckResponse:
    return HealthService.get_health_status()

