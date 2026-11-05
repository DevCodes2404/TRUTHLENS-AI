from datetime import datetime, timezone
from backend.app.schemas.health import HealthCheckResponse, ServiceStatus
from backend.app.core.config import settings


class HealthService:
    @staticmethod
    def get_health_status() -> HealthCheckResponse:
        """
        Evaluate subsystem status and return overall platform health.
        In Phase 1, detection inference is marked pending (no fake inference),
        and database integration is staged.
        """
        return HealthCheckResponse(
            status="healthy",
            version=settings.VERSION,
            timestamp=datetime.now(timezone.utc).isoformat(),
            services=ServiceStatus(
                database="pending",
                inference="pending",
            ),
        )

