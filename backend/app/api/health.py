import time
from datetime import datetime, timezone
from typing import Dict
from fastapi import APIRouter, Response, status

from app.core.config import settings
from app.db.client import db
from app.db.redis import get_redis
from app.schemas.health import HealthResponse, ServiceHealth
from app.services.s3_service import s3_service

router = APIRouter(tags=["System Health & Maintenance"])


async def check_database() -> ServiceHealth:
    start = time.perf_counter()
    try:
        await db.query_raw("SELECT 1;")
        latency = round((time.perf_counter() - start) * 1000, 2)
        return ServiceHealth(
            status="healthy",
            latency_ms=latency,
            details={"engine": "PostgreSQL (Prisma ORM)"},
        )
    except Exception as err:
        latency = round((time.perf_counter() - start) * 1000, 2)
        return ServiceHealth(
            status="unhealthy",
            latency_ms=latency,
            details={"error": str(err)},
        )


async def check_redis() -> ServiceHealth:
    start = time.perf_counter()
    try:
        redis_client = get_redis()
        pong = await redis_client.ping()
        latency = round((time.perf_counter() - start) * 1000, 2)
        if pong:
            return ServiceHealth(
                status="healthy",
                latency_ms=latency,
                details={"mode": "Async Redis Client"},
            )
        return ServiceHealth(
            status="degraded",
            latency_ms=latency,
            details={"error": "Ping returned false"},
        )
    except Exception as err:
        latency = round((time.perf_counter() - start) * 1000, 2)
        return ServiceHealth(
            status="unhealthy",
            latency_ms=latency,
            details={"error": str(err)},
        )


def check_s3() -> ServiceHealth:
    start = time.perf_counter()
    try:
        bucket = s3_service.bucket_name
        region = s3_service.region_name
        endpoint = s3_service.endpoint_url or "Native AWS S3"
        latency = round((time.perf_counter() - start) * 1000, 2)
        return ServiceHealth(
            status="healthy",
            latency_ms=latency,
            details={
                "bucket": bucket,
                "region": region,
                "endpoint": endpoint,
            },
        )
    except Exception as err:
        latency = round((time.perf_counter() - start) * 1000, 2)
        return ServiceHealth(
            status="unhealthy",
            latency_ms=latency,
            details={"error": str(err)},
        )


@router.get("/health", response_model=HealthResponse, summary="Comprehensive System Health Check")
async def get_health_status(response: Response) -> HealthResponse:
    db_health = await check_database()
    redis_health = await check_redis()
    s3_health = check_s3()

    services: Dict[str, ServiceHealth] = {
        "database": db_health,
        "redis": redis_health,
        "storage": s3_health,
    }

    if db_health.status == "unhealthy":
        overall_status = "unhealthy"
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    elif redis_health.status == "unhealthy" or s3_health.status == "unhealthy":
        overall_status = "degraded"
        response.status_code = status.HTTP_200_OK
    else:
        overall_status = "healthy"
        response.status_code = status.HTTP_200_OK

    return HealthResponse(
        status=overall_status,
        app_name=settings.PROJECT_NAME,
        environment=settings.ENVIRONMENT,
        version="1.0.0",
        timestamp=datetime.now(timezone.utc),
        services=services,
    )
