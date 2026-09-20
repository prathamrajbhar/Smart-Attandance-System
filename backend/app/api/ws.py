import asyncio
import json
from typing import Dict, Set

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.api.dependencies import get_current_user_from_token
from app.core.logging_config import get_logger

logger = get_logger("app.websocket")

router = APIRouter(prefix="/ws", tags=["WebSocket"])

_PING_INTERVAL = 25
_PONG_TIMEOUT = 15


class ConnectionManager:
    def __init__(self):
        self.user_connections: Dict[str, Set[WebSocket]] = {}
        self.role_connections: Dict[str, Set[WebSocket]] = {"STUDENT": set(), "TEACHER": set(), "ADMIN": set()}
        self.student_connections: Dict[str, Set[WebSocket]] = {}
        self.teacher_connections: Dict[str, Set[WebSocket]] = {}
        self._heartbeat_task: asyncio.Task | None = None

    async def connect_client(self, websocket: WebSocket, user_id: str, role: str, profile_id: str | None = None):
        self.user_connections.setdefault(user_id, set()).add(websocket)
        self.role_connections.setdefault(role, set()).add(websocket)
        if role == "STUDENT" and profile_id:
            self.student_connections.setdefault(profile_id, set()).add(websocket)
        elif role == "TEACHER" and profile_id:
            self.teacher_connections.setdefault(profile_id, set()).add(websocket)
        logger.info("WebSocket connected: user=%s role=%s profile=%s", user_id, role, profile_id)

    def disconnect_client(self, websocket: WebSocket, user_id: str, role: str, profile_id: str | None = None):
        if user_id in self.user_connections:
            self.user_connections[user_id].discard(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
        if role in self.role_connections:
            self.role_connections[role].discard(websocket)
        if role == "STUDENT" and profile_id and profile_id in self.student_connections:
            self.student_connections[profile_id].discard(websocket)
            if not self.student_connections[profile_id]:
                del self.student_connections[profile_id]
        elif role == "TEACHER" and profile_id and profile_id in self.teacher_connections:
            self.teacher_connections[profile_id].discard(websocket)
            if not self.teacher_connections[profile_id]:
                del self.teacher_connections[profile_id]
        logger.info("WebSocket disconnected: user=%s role=%s", user_id, role)

    async def send_personal_message(self, message: dict, target_id: str):
        conns = self.user_connections.get(target_id) or self.student_connections.get(target_id) or self.teacher_connections.get(target_id) or set()
        disconnected = set()
        for connection in list(conns):
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.warning("Failed to send message to %s: %s", target_id, e)
                disconnected.add(connection)
        for conn in disconnected:
            conns.discard(conn)

    async def broadcast(self, message: dict, target_role: str | None = None):
        targets: Set[WebSocket] = set()
        if target_role and target_role in self.role_connections:
            targets.update(self.role_connections[target_role])
        else:
            for role_set in self.role_connections.values():
                targets.update(role_set)

        disconnected = set()
        for conn in list(targets):
            try:
                await conn.send_json(message)
            except Exception:
                disconnected.add(conn)
        for dead in disconnected:
            for s in self.role_connections.values():
                s.discard(dead)

    async def broadcast_to_teachers(self, message: dict):
        await self.broadcast(message, target_role="TEACHER")

    async def _heartbeat_loop(self):
        while True:
            await asyncio.sleep(_PING_INTERVAL)
            ping = {"type": "ping"}
            for role, conns in list(self.role_connections.items()):
                for conn in list(conns):
                    try:
                        await asyncio.wait_for(conn.send_json(ping), timeout=_PONG_TIMEOUT)
                    except Exception:
                        conns.discard(conn)

    def start_heartbeat(self):
        if self._heartbeat_task is None:
            self._heartbeat_task = asyncio.create_task(self._heartbeat_loop())

    def stop_heartbeat(self):
        if self._heartbeat_task is not None:
            self._heartbeat_task.cancel()
            self._heartbeat_task = None

    @property
    def total_connections(self) -> int:
        return sum(len(c) for c in self.user_connections.values())


manager = ConnectionManager()


@router.websocket("/connect")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await websocket.accept()
        auth_data = await websocket.receive_text()
        auth_json = json.loads(auth_data)

        if auth_json.get("type") != "auth" or not auth_json.get("token"):
            await websocket.close(code=1008, reason="Authentication required")
            return

        user = await get_current_user_from_token(auth_json["token"])
        if not user:
            await websocket.close(code=1008, reason="Unauthorized")
            return

        profile_id = user.student.id if (user.role == "STUDENT" and user.student) else (user.teacher.id if (user.role == "TEACHER" and user.teacher) else None)
        await manager.connect_client(websocket, user.id, user.role, profile_id)
        await websocket.send_json({"type": "connected", "message": "WebSocket connection established", "user_id": user.id, "role": user.role.lower()})

        try:
            while True:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=_PING_INTERVAL)
                if data == "ping" or '"type":"ping"' in data:
                    await websocket.send_json({"type": "pong"})
        except asyncio.TimeoutError:
            pass
        except WebSocketDisconnect:
            pass
        finally:
            manager.disconnect_client(websocket, user.id, user.role, profile_id)

    except Exception as e:
        logger.error("WebSocket error: %s", e, exc_info=True)
        try:
            await websocket.close(code=1011, reason="Internal server error")
        except Exception:
            pass


