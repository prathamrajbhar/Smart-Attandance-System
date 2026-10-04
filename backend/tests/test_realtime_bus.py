import pytest
import json
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from app.api.ws import ConnectionManager
from app.services.realtime_bus import RealtimeBus, _WORKER_ID, _CHANNEL


@pytest.mark.asyncio
async def test_realtime_bus_publish(mock_redis):
    mock_redis.publish = AsyncMock(return_value=1)
    bus = RealtimeBus()

    test_msg = {"type": "attendance_updated", "status": "Present", "session_id": "ses-101"}
    await bus.publish(
        event_type="personal",
        message=test_msg,
        target_id="stu-101",
    )

    mock_redis.publish.assert_called_once()
    args = mock_redis.publish.call_args[0]
    assert args[0] == _CHANNEL
    payload = json.loads(args[1])
    assert payload["origin_worker"] == _WORKER_ID
    assert payload["event_type"] == "personal"
    assert payload["target_id"] == "stu-101"
    assert payload["message"]["status"] == "Present"


@pytest.mark.asyncio
async def test_realtime_bus_listener_dispatch_to_manager():
    bus = RealtimeBus()
    manager = ConnectionManager()
    manager.deliver_personal_message = AsyncMock()
    manager.deliver_broadcast = AsyncMock()

    # Message from another worker
    other_worker_msg = {
        "type": "message",
        "data": json.dumps({
            "origin_worker": "other-worker-999",
            "event_type": "personal",
            "target_id": "stu-202",
            "message": {"type": "attendance_updated", "status": "Present"},
        }),
    }

    # Message from same worker (should be skipped)
    same_worker_msg = {
        "type": "message",
        "data": json.dumps({
            "origin_worker": _WORKER_ID,
            "event_type": "personal",
            "target_id": "stu-202",
            "message": {"type": "attendance_updated", "status": "Present"},
        }),
    }

    mock_pubsub = MagicMock()
    # Return remote message first, then self message, then stop
    mock_pubsub.get_message = AsyncMock(side_effect=[
        other_worker_msg,
        same_worker_msg,
        asyncio.CancelledError(),
    ])
    mock_pubsub.subscribe = AsyncMock()

    mock_redis = MagicMock()
    mock_redis.pubsub = MagicMock(return_value=mock_pubsub)

    with patch("app.db.redis.get_redis", return_value=mock_redis):
        bus._running = True
        await bus._listen_loop(manager)

    # deliver_personal_message should only be called ONCE (for other worker, not self)
    assert manager.deliver_personal_message.call_count == 1
    manager.deliver_personal_message.assert_called_with(
        {"type": "attendance_updated", "status": "Present"},
        "stu-202",
    )


@pytest.mark.asyncio
async def test_connection_manager_delegation():
    manager = ConnectionManager()
    mock_ws = AsyncMock()
    await manager.connect_client(mock_ws, user_id="usr-test-1", role="STUDENT", profile_id="stu-test-1")

    with patch("app.services.realtime_bus.realtime_bus.publish", new_callable=AsyncMock) as mock_pub:
        msg = {"type": "attendance_updated", "status": "Present"}
        await manager.send_personal_message(msg, target_id="usr-test-1")

        # Local delivery verified
        mock_ws.send_json.assert_called_with(msg)
        # Distributed publish verified
        await asyncio.sleep(0.01)
        mock_pub.assert_called_once_with("personal", msg, target_id="usr-test-1")
