from typing import Any, Dict, Optional
import httpx
from scripts.seeder.config import config


class SeederApiError(Exception):
    def __init__(self, method: str, url: str, status_code: int, response_text: str):
        self.method = method
        self.url = url
        self.status_code = status_code
        self.response_text = response_text
        super().__init__(f"API Error {method} {url} [{status_code}]: {response_text}")


class ApiClient:
    def __init__(self, base_url: str = config.base_url):
        self.base_url = base_url.rstrip("/")
        self.token: Optional[str] = None
        self.tenant_id: Optional[str] = None
        self.client = httpx.AsyncClient(timeout=config.timeout_seconds)

    def set_auth(self, token: Optional[str]) -> None:
        self.token = token

    def set_tenant(self, tenant_id: Optional[str]) -> None:
        self.tenant_id = tenant_id

    def _headers(self) -> Dict[str, str]:
        headers: Dict[str, str] = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        if self.tenant_id:
            headers["X-Tenant-ID"] = self.tenant_id
        return headers

    async def authenticate(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate user against /auth/login and store JWT access token."""
        url = f"{self.base_url}/auth/login"
        payload = {"email": email, "password": password}
        headers: Dict[str, str] = {"Content-Type": "application/json"}
        if self.tenant_id:
            headers["X-Tenant-ID"] = self.tenant_id
        resp = await self.client.post(url, json=payload, headers=headers)
        if resp.status_code != 200:
            raise SeederApiError("POST", url, resp.status_code, resp.text)
        data = resp.json()
        self.token = data.get("access_token")
        return data

    async def get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Any:
        url = f"{self.base_url}{endpoint}"
        resp = await self.client.get(url, params=params, headers=self._headers())
        if resp.status_code not in (200, 201):
            raise SeederApiError("GET", url, resp.status_code, resp.text)
        return resp.json()

    async def post(self, endpoint: str, json_data: Optional[Dict[str, Any]] = None) -> Any:
        url = f"{self.base_url}{endpoint}"
        resp = await self.client.post(url, json=json_data, headers=self._headers())
        if resp.status_code not in (200, 201):
            raise SeederApiError("POST", url, resp.status_code, resp.text)
        return resp.json()

    async def put(self, endpoint: str, json_data: Optional[Dict[str, Any]] = None) -> Any:
        url = f"{self.base_url}{endpoint}"
        resp = await self.client.put(url, json=json_data, headers=self._headers())
        if resp.status_code not in (200, 201):
            raise SeederApiError("PUT", url, resp.status_code, resp.text)
        return resp.json()

    async def close(self) -> None:
        await self.client.aclose()
