import logging

from fastapi import APIRouter, status

from app.core.logging_config import get_logger
from app.schemas.log import LogEvent
from app.schemas.common import MessageResponse

router = APIRouter(prefix="/logs", tags=["Logging"])

logger = get_logger("app.client")


@router.post("", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def ingest_log(log_event: LogEvent) -> MessageResponse:
    logger.log(
        getattr(logging, log_event.level.upper(), logging.INFO),
        "[%s] [%s] %s",
        log_event.source, log_event.timestamp, log_event.message,
    )
    return MessageResponse(status="success", message="Log ingested successfully.")
