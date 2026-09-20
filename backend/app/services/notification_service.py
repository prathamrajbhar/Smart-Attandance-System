import asyncio
from typing import Any, Dict, List, Optional
from datetime import datetime

from app.core.logging_config import get_logger
from app.db.client import db

logger = get_logger("app.notification")

try:
    import firebase_admin
    from firebase_admin import credentials, messaging

    _cred_path = "firebase-credentials.json"
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate(_cred_path)
            firebase_admin.initialize_app(cred)
        _fcm_available = True
        logger.info("Firebase Admin SDK initialized successfully")
    except Exception as e:
        _fcm_available = False
        logger.warning("Firebase Admin SDK not available: %s. Push notifications disabled.", e)

except ImportError:
    _fcm_available = False
    logger.info("firebase-admin not installed. Push notifications disabled.")


async def send_push_notification(token: str, title: str, body: str, data: Optional[dict] = None) -> bool:
    if not _fcm_available or not token:
        return False

    try:
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            data={k: str(v) for k, v in (data or {}).items()},
            token=token,
        )
        response = await asyncio.to_thread(messaging.send, message)
        logger.info("FCM sent: %s", response)
        return True
    except Exception as e:
        logger.warning("FCM send failed: %s", e)
        return False


async def create_in_app_notification(
    title: str,
    message: str,
    user_id: Optional[str] = None,
    role: Optional[str] = None,
    type: str = "info",
    category: str = "system",
    link: Optional[str] = None,
) -> Dict[str, Any]:
    try:
        notif = await db.notification.create(
            data={
                "title": title,
                "message": message,
                "userId": user_id,
                "role": role,
                "type": type,
                "category": category,
                "link": link,
                "isRead": False,
            }
        )

        # Broadcast real-time event via WebSocket
        try:
            from app.api.ws import manager
            payload = {
                "event": "NOTIFICATION_RECEIVED",
                "data": {
                    "id": notif.id,
                    "user_id": notif.userId,
                    "role": notif.role,
                    "title": notif.title,
                    "message": notif.message,
                    "type": notif.type,
                    "category": notif.category,
                    "link": notif.link,
                    "is_read": notif.isRead,
                    "created_at": notif.createdAt.isoformat(),
                },
            }
            if user_id:
                await manager.send_personal_message(payload, user_id)
            else:
                await manager.broadcast(payload)
        except Exception as ws_err:
            logger.debug("WebSocket notification broadcast skipped: %s", ws_err)

        return {
            "id": notif.id,
            "user_id": notif.userId,
            "role": notif.role,
            "title": notif.title,
            "message": notif.message,
            "type": notif.type,
            "category": notif.category,
            "link": notif.link,
            "is_read": notif.isRead,
            "created_at": notif.createdAt,
        }
    except Exception as err:
        logger.error("Failed to create in-app notification: %s", err, exc_info=True)
        return {}


async def get_user_notifications(
    user_id: str,
    user_role: str,
    unread_only: bool = False,
    category: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
) -> Dict[str, Any]:
    where_conditions: List[Dict[str, Any]] = [
        {"OR": [{"userId": user_id}, {"role": user_role}, {"role": None}]}
    ]

    if unread_only:
        where_conditions.append({"isRead": False})
    if category and category != "all":
        where_conditions.append({"category": category})

    where_query = {"AND": where_conditions}

    total_count = await db.notification.count(where=where_query)
    unread_query = {"AND": [{"OR": [{"userId": user_id}, {"role": user_role}, {"role": None}]}, {"isRead": False}]}
    unread_count = await db.notification.count(where=unread_query)

    skip = (max(1, page) - 1) * page_size
    items = await db.notification.find_many(
        where=where_query,
        order={"createdAt": "desc"},
        skip=skip,
        take=page_size,
    )

    formatted_items = [
        {
            "id": item.id,
            "user_id": item.userId,
            "role": item.role,
            "title": item.title,
            "message": item.message,
            "type": item.type,
            "category": item.category,
            "link": item.link,
            "is_read": item.isRead,
            "created_at": item.createdAt,
        }
        for item in items
    ]

    return {
        "items": formatted_items,
        "total_count": total_count,
        "unread_count": unread_count,
    }


async def mark_notification_read(notification_id: str, user_id: str) -> bool:
    try:
        await db.notification.update(
            where={"id": notification_id},
            data={"isRead": True},
        )
        return True
    except Exception:
        return False


async def mark_all_notifications_read(user_id: str, user_role: str) -> int:
    try:
        result = await db.notification.update_many(
            where={
                "AND": [
                    {"OR": [{"userId": user_id}, {"role": user_role}, {"role": None}]},
                    {"isRead": False},
                ]
            },
            data={"isRead": True},
        )
        return result
    except Exception as err:
        logger.error("Failed to mark all notifications read: %s", err)
        return 0


async def delete_notification(notification_id: str, user_id: str) -> bool:
    try:
        await db.notification.delete(where={"id": notification_id})
        return True
    except Exception:
        return False


async def broadcast_announcement(
    title: str,
    message: str,
    target_role: Optional[str] = "ALL",
    type: str = "info",
    category: str = "system",
    link: Optional[str] = None,
) -> Dict[str, Any]:
    role_enum = target_role if target_role and target_role != "ALL" else None
    notif = await create_in_app_notification(
        title=title,
        message=message,
        role=role_enum,
        type=type,
        category=category,
        link=link,
    )
    if role_enum in (None, "STUDENT"):
        try:
            students = await db.student.find_many(where={"fcmToken": {"not": None}})
            for st in students:
                if st.fcmToken:
                    asyncio.create_task(
                        send_push_notification(
                            token=st.fcmToken,
                            title=title,
                            body=message,
                            data={"route": "/notifications", "type": type, "category": category},
                        )
                    )
        except Exception as fcm_err:
            logger.debug("Broadcast push dispatch error: %s", fcm_err)
    return notif


async def notify_student_attendance_flagged(student_fcm_token: str, student_name: str, class_name: str, attendance_id: str):
    await send_push_notification(
        token=student_fcm_token,
        title="Attendance Flagged",
        body=f"Hi {student_name}, your attendance for {class_name} has been flagged and requires review.",
        data={"route": "/flagged_detail", "attendance_id": attendance_id},
    )


async def notify_teacher_attendance_flagged(teacher_user_id: str, student_name: str, class_name: str, attendance_id: str):
    await create_in_app_notification(
        user_id=teacher_user_id,
        title="Flagged Attendance Record",
        message=f"{student_name}'s attendance for {class_name} was flagged by verification and awaits your review.",
        type="warning",
        category="attendance",
        link=f"/teacher/review/{attendance_id}",
    )


async def notify_teacher_session_concluded(teacher_user_id: str, class_name: str, session_id: str, present_count: int, total_count: int, flagged_count: int = 0):
    pct = (present_count / max(1, total_count)) * 100
    flagged_msg = f" ({flagged_count} flagged)" if flagged_count > 0 else ""
    await create_in_app_notification(
        user_id=teacher_user_id,
        title=f"Session Concluded: {class_name}",
        message=f"Attendance closed. {present_count}/{total_count} present ({pct:.1f}%){flagged_msg}.",
        type="success" if pct >= 75 else "warning",
        category="attendance",
        link=f"/teacher/sessions/{session_id}",
    )


async def notify_teacher_leave_submitted(teacher_user_id: str, student_name: str, class_name: str):
    await create_in_app_notification(
        user_id=teacher_user_id,
        title="New Leave Request",
        message=f"{student_name} submitted a leave application for {class_name}.",
        type="info",
        category="leave",
        link="/teacher/leaves",
    )


async def notify_student_attendance_reviewed(student_fcm_token: str, status: str, class_name: str):
    await send_push_notification(
        token=student_fcm_token,
        title=f"Attendance {status}",
        body=f"Your attendance for {class_name} has been reviewed and marked as {status}.",
        data={"route": "/history"},
    )


async def notify_student_leave_status(student_fcm_token: str, status: str):
    await send_push_notification(
        token=student_fcm_token,
        title=f"Leave {status}",
        body=f"Your leave request has been {status.lower()}.",
        data={"route": "/leave/history"},
    )

