import io
import mimetypes
import uuid
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from fastapi import UploadFile

from app.core.config import settings
from app.core.logging_config import get_logger

logger = get_logger("app.s3")


class S3Service:
    def __init__(self) -> None:
        self.bucket_name = settings.S3_BUCKET_NAME
        self.endpoint_url = settings.AWS_ENDPOINT_URL
        self.region_name = settings.AWS_DEFAULT_REGION
        self.client = boto3.client(
            "s3",
            endpoint_url=self.endpoint_url,
            region_name=self.region_name,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            config=Config(s3={"addressing_style": "path"}),
        )

    def ensure_bucket_exists(self) -> None:
        try:
            self.client.head_bucket(Bucket=self.bucket_name)
            logger.info("S3 Bucket '%s' verified.", self.bucket_name)
        except ClientError:
            try:
                if self.region_name == "us-east-1":
                    self.client.create_bucket(Bucket=self.bucket_name)
                else:
                    self.client.create_bucket(
                        Bucket=self.bucket_name,
                        CreateBucketConfiguration={"LocationConstraint": self.region_name},
                    )
                logger.info("S3 Bucket '%s' created successfully.", self.bucket_name)
            except Exception as exc:
                logger.error("Failed to create S3 bucket '%s': %s", self.bucket_name, exc)

    def upload_bytes(
        self,
        file_bytes: bytes,
        key: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        self.client.put_object(
            Bucket=self.bucket_name,
            Key=key,
            Body=file_bytes,
            ContentType=content_type,
        )
        return self.get_file_url(key)

    async def upload_uploadfile(self, upload_file: UploadFile, folder: str) -> tuple[str, str, bytes]:
        contents = await upload_file.read()
        await upload_file.seek(0)
        ext = mimetypes.guess_extension(upload_file.content_type or "") or ".jpg"
        if ext == ".jpe":
            ext = ".jpg"
        key = f"{folder}/{uuid.uuid4()}{ext}"
        content_type = upload_file.content_type or "image/jpeg"
        url = self.upload_bytes(contents, key, content_type=content_type)
        return key, url, contents

    def download_bytes(self, key_or_url: str) -> bytes:
        key = self._extract_key(key_or_url)
        response = self.client.get_object(Bucket=self.bucket_name, Key=key)
        return response["Body"].read()

    def delete_file(self, key_or_url: str) -> bool:
        if not key_or_url:
            return False
        try:
            key = self._extract_key(key_or_url)
            self.client.delete_object(Bucket=self.bucket_name, Key=key)
            return True
        except Exception as exc:
            logger.warning("Failed to delete S3 object '%s': %s", key_or_url, exc)
            return False

    def get_file_url(self, key: str) -> str:
        clean_endpoint = self.endpoint_url.rstrip("/")
        return f"{clean_endpoint}/{self.bucket_name}/{key}"

    def _extract_key(self, key_or_url: str) -> str:
        if key_or_url.startswith("http://") or key_or_url.startswith("https://"):
            prefix = f"{self.endpoint_url.rstrip('/')}/{self.bucket_name}/"
            if key_or_url.startswith(prefix):
                return key_or_url[len(prefix):]
            parts = key_or_url.split(f"/{self.bucket_name}/")
            if len(parts) > 1:
                return parts[1]
        return key_or_url.lstrip("/")


s3_service = S3Service()
