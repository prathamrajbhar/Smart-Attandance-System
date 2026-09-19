import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any, Dict, Optional
import aiosmtplib
from jinja2 import Environment, FileSystemLoader, select_autoescape

from app.core.config import settings
from app.core.logging_config import get_logger

logger = get_logger("app.services.email")

_TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates", "email")

_jinja_env = Environment(
    loader=FileSystemLoader(_TEMPLATES_DIR),
    autoescape=select_autoescape(["html", "xml"]),
)


class EmailService:
    @staticmethod
    async def send_email(to_email: str, subject: str, template_name: str, context: Dict[str, Any]) -> bool:
        if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            logger.warning("SMTP not configured. Skipping email to %s (subject: %s)", to_email, subject)
            return False

        try:
            template = _jinja_env.get_template(template_name)
            merged_context = {
                "system_name": settings.PROJECT_NAME,
                "frontend_url": settings.FRONTEND_URL,
                "subject": subject,
                **context,
            }
            html_content = template.render(**merged_context)

            message = MIMEMultipart("alternative")
            message["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
            message["To"] = to_email
            message["Subject"] = subject

            # Plaintext fallback
            plain_fallback = f"{subject}\n\nPlease view this email in an HTML-compatible client.\n{settings.FRONTEND_URL}"
            message.attach(MIMEText(plain_fallback, "plain", "utf-8"))
            message.attach(MIMEText(html_content, "html", "utf-8"))

            await aiosmtplib.send(
                message,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.SMTP_USER,
                password=settings.SMTP_PASSWORD,
                start_tls=settings.SMTP_TLS,
                use_tls=settings.SMTP_SSL,
                timeout=15.0,
            )
            logger.info("Email sent successfully: recipient=%s subject='%s'", to_email, subject)
            return True
        except Exception as e:
            logger.error("Failed to send email to %s: %s", to_email, e, exc_info=True)
            return False

    async def send_invitation_email(
        self,
        to_email: str,
        recipient_name: str,
        role: str,
        invite_token: str = "",
        identifier_label: Optional[str] = None,
        identifier_value: Optional[str] = None,
        temp_password: Optional[str] = None,
    ) -> bool:
        invite_url = f"{settings.FRONTEND_URL}/onboarding?token={invite_token}" if invite_token else f"{settings.FRONTEND_URL}/login"
        login_url = f"{settings.FRONTEND_URL}/login"
        role_display = "Student" if role == "STUDENT" else ("Teacher" if role == "TEACHER" else "Administrator")
        return await self.send_email(
            to_email=to_email,
            subject=f"Welcome to {settings.PROJECT_NAME} - Your Account Credentials",
            template_name="user_invite.html",
            context={
                "recipient_name": recipient_name,
                "role_title": role_display,
                "email": to_email,
                "invite_url": invite_url,
                "login_url": login_url,
                "temp_password": temp_password,
                "expire_hours": settings.INVITATION_TOKEN_EXPIRE_HOURS,
                "identifier_label": identifier_label,
                "identifier_value": identifier_value,
            },
        )


    async def send_password_reset_email(self, to_email: str, recipient_name: str, reset_token: str) -> bool:
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        return await self.send_email(
            to_email=to_email,
            subject=f"Reset Your Password - {settings.PROJECT_NAME}",
            template_name="password_reset.html",
            context={
                "recipient_name": recipient_name,
                "email": to_email,
                "reset_url": reset_url,
                "expire_minutes": settings.RESET_TOKEN_EXPIRE_MINUTES,
            },
        )

    async def send_device_change_requested_email(
        self,
        to_email: str,
        recipient_name: str,
        enrollment_number: str,
        new_device_uuid: str,
        reason: Optional[str] = None,
    ) -> bool:
        return await self.send_email(
            to_email=to_email,
            subject=f"Device Change Request Submitted - {settings.PROJECT_NAME}",
            template_name="device_change_requested.html",
            context={
                "recipient_name": recipient_name,
                "enrollment_number": enrollment_number,
                "new_device_uuid": new_device_uuid,
                "reason": reason,
            },
        )

    async def send_device_change_reviewed_email(
        self,
        to_email: str,
        recipient_name: str,
        enrollment_number: str,
        status: str,
    ) -> bool:
        subject_status = "Approved" if status == "APPROVED" else "Rejected"
        return await self.send_email(
            to_email=to_email,
            subject=f"Device Change Request {subject_status} - {settings.PROJECT_NAME}",
            template_name="device_change_reviewed.html",
            context={
                "recipient_name": recipient_name,
                "enrollment_number": enrollment_number,
                "status": status,
            },
        )


email_service = EmailService()
