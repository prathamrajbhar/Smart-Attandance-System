import asyncio
import time
from typing import Any, Dict, Optional, Tuple
from redis.asyncio import Redis
from app.core.config import settings
from app.core.logging_config import get_logger

logger = get_logger("app.redis")


class InMemoryFallbackRedis:
    """High-performance TTL-aware in-memory fallback for Redis."""
    def __init__(self) -> None:
        self._store: Dict[str, Tuple[str, Optional[float]]] = {}
        self._lock = asyncio.Lock()

    def _is_expired(self, expiry: Optional[float]) -> bool:
        return expiry is not None and time.time() > expiry

    async def ping(self) -> bool:
        return True

    async def get(self, name: str) -> Optional[str]:
        async with self._lock:
            if name not in self._store:
                return None
            val, expiry = self._store[name]
            if self._is_expired(expiry):
                del self._store[name]
                return None
            return val

    async def set(
        self,
        name: str,
        value: Any,
        ex: Optional[int] = None,
        px: Optional[int] = None,
    ) -> bool:
        async with self._lock:
            expiry = None
            if ex is not None:
                expiry = time.time() + ex
            elif px is not None:
                expiry = time.time() + (px / 1000.0)
            self._store[name] = (str(value), expiry)
            return True

    async def setex(self, name: str, time_sec: int, value: Any) -> bool:
        return await self.set(name, value, ex=time_sec)

    async def delete(self, *names: str) -> int:
        async with self._lock:
            count = 0
            for name in names:
                if name in self._store:
                    del self._store[name]
                    count += 1
            return count

    async def exists(self, *names: str) -> int:
        async with self._lock:
            count = 0
            for name in names:
                if name in self._store:
                    _, expiry = self._store[name]
                    if not self._is_expired(expiry):
                        count += 1
                    else:
                        del self._store[name]
            return count

    async def close(self) -> None:
        async with self._lock:
            self._store.clear()


redis_client: Any = None
_fallback_client: InMemoryFallbackRedis = InMemoryFallbackRedis()


async def connect_redis() -> Any:
    global redis_client
    if redis_client is None:
        try:
            client = Redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_timeout=2.0,
                socket_connect_timeout=2.0,
            )
            await client.ping()
            redis_client = client
            logger.info("Connected to Redis at %s", settings.REDIS_URL)
        except Exception as err:
            logger.warning(
                "Redis connection failed (%s). Falling back to in-memory cache without crashing.",
                err,
            )
            redis_client = _fallback_client
    return redis_client


async def disconnect_redis() -> None:
    global redis_client
    if redis_client is not None and redis_client is not _fallback_client:
        try:
            await redis_client.close()
        except Exception as err:
            logger.warning("Error closing Redis connection: %s", err)
        finally:
            redis_client = None


def get_redis() -> Any:
    global redis_client
    if redis_client is None:
        return _fallback_client
    return redis_client
