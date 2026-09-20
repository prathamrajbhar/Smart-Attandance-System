"""Yopmail Browser Automation & Onboarding UI Handler.

Simulates authentic user inbox verification using Playwright:
1. Opens Yopmail in browser tab.
2. Reads activation/invitation message in inbox iframe.
3. Clicks onboarding link and submits password setup form in Next.js UI.
"""

from __future__ import annotations

import asyncio
import re

from playwright.async_api import BrowserContext, Page
from playwright.async_api import TimeoutError as PlaywrightTimeoutError
from rich.console import Console

from scripts.seed.config import SeedingConfig

console = Console()


class YopmailClient:
    def __init__(self, config: SeedingConfig, context: BrowserContext) -> None:
        self.config = config
        self.context = context

    async def fetch_onboarding_token_from_yopmail(
        self, email: str, max_retries: int = 3
    ) -> str | None:
        """Automates Yopmail web UI to extract the onboarding/reset token."""
        username = email.split("@")[0]
        yopmail_page = await self.context.new_page()

        try:
            for attempt in range(max_retries):
                try:
                    await yopmail_page.goto(
                        f"https://yopmail.com/en/?login={username}",
                        wait_until="domcontentloaded",
                        timeout=12000,
                    )
                    await asyncio.sleep(1.5)

                    # Look inside the message iframe
                    mail_frame = yopmail_page.frame(name="ifmail")
                    if not mail_frame:
                        mail_frame_element = await yopmail_page.query_selector("iframe#ifmail")
                        if mail_frame_element:
                            mail_frame = await mail_frame_element.content_frame()

                    if mail_frame:
                        content = await mail_frame.content()
                        # Extract token from invite_url or token query param
                        token_match = re.search(r"token=([a-zA-Z0-9\-_.]+)", content)
                        if token_match:
                            token = token_match.group(1)
                            console.print(f"  [green]✓[/green] Extracted token from Yopmail for [cyan]{email}[/cyan]")
                            return token

                    # Refresh inbox if not found on first pass
                    refresh_btn = await yopmail_page.query_selector("#refresh")
                    if refresh_btn:
                        await refresh_btn.click()
                        await asyncio.sleep(2)

                except PlaywrightTimeoutError:
                    if attempt == max_retries - 1:
                        console.print(f"  [yellow]⚠[/yellow] Yopmail UI read timed out for {email}")
                except (RuntimeError, OSError, ValueError) as exc:
                    console.print(f"  [yellow]⚠[/yellow] Yopmail scrape error: {exc}")

            return None
        finally:
            await yopmail_page.close()

    async def complete_onboarding_in_browser(
        self, token: str, password: str, page: Page | None = None
    ) -> bool:
        """Navigates to /onboarding?token=... in Next.js and completes the form."""
        created_page = False
        if page is None:
            page = await self.context.new_page()
            created_page = True

        try:
            onboarding_url = f"{self.config.frontend_base_url}/onboarding?token={token}"
            await page.goto(onboarding_url, wait_until="networkidle", timeout=15000)

            # Check if form is visible
            password_input = page.locator("input[name='password']")
            confirm_input = page.locator("input[name='confirmPassword']")

            await password_input.wait_for(state="visible", timeout=8000)
            await password_input.fill(password)
            await confirm_input.fill(password)

            # Submit activation
            submit_btn = page.locator("button[type='submit']")
            await submit_btn.click()

            # Wait for successful activation notification or redirect
            await page.wait_for_selector("text=Account Activated!", timeout=10000)
            console.print("  [green]✓[/green] Completed browser onboarding & password activation.")
            return True

        except (PlaywrightTimeoutError, RuntimeError, OSError, ValueError) as exc:
            console.print(f"  [red]✗[/red] Failed browser onboarding: {exc}")
            return False
        finally:
            if created_page:
                await page.close()
