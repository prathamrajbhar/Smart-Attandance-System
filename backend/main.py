import os

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "3")
os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")
os.environ.setdefault("CUDA_VISIBLE_DEVICES", "-1")



from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging_config import setup_logging, get_logger
from app.db.client import connect_db, disconnect_db
from app.db.redis import connect_redis, disconnect_redis
from app.services.s3_service import s3_service
from app.services.scheduler import session_scheduler
from app.api import auth, student, teacher, admin, logs, health, notifications, ws as ws_module, search, super_admin, scim, timetable
from app.middleware.request_logging import RequestLoggingMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.middleware.tenant import TenantResolutionMiddleware


setup_logging(level=settings.LOG_LEVEL)
logger = get_logger("app.main")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("Starting server...")
    await connect_db()
    await connect_redis()
    s3_service.ensure_bucket_exists()
    ws_module.manager.start_heartbeat()
    session_scheduler.start()
    logger.info("Server ready")
    yield
    logger.info("Shutting down...")
    session_scheduler.stop()
    ws_module.manager.stop_heartbeat()
    await disconnect_db()
    await disconnect_redis()
    logger.info("Shutdown complete")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Asynchronous AI-powered Multi-Layered Smart Attendance verification backend.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(TenantResolutionMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_URL.split(",") if "," in settings.FRONTEND_URL else [settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(super_admin.router, prefix=settings.API_V1_STR)
app.include_router(student.router, prefix=settings.API_V1_STR)
app.include_router(teacher.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(logs.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(ws_module.router, prefix=settings.API_V1_STR)
app.include_router(search.router, prefix=settings.API_V1_STR)
app.include_router(scim.router, prefix=settings.API_V1_STR)
app.include_router(timetable.router, prefix=settings.API_V1_STR)



@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    details = []
    for err in exc.errors():
        loc = err.get("loc", ())
        field_parts = [str(part) for part in loc if str(part) not in ("body", "query", "path", "header", "cookie")]
        field_name = ".".join(field_parts) if field_parts else "payload"
        details.append({
            "field": field_name,
            "message": err.get("msg", "Invalid value"),
            "issue": err.get("msg", "Invalid value"),
            "type": err.get("type", "value_error"),
        })
    logger.warning("Validation error on %s %s: %s", request.method, request.url.path, details)
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request payload",
                "details": details,
            },
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.critical("Unhandled exception: %s %s — %s", request.method, request.url.path, str(exc))
    return JSONResponse(status_code=500, content={"detail": "Something went wrong"})

