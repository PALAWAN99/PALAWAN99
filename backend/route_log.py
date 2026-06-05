"""
ส่ง route logs ไปยัง Next.js ingest API (PostgreSQL ผ่าน Prisma)
"""

from __future__ import annotations

import asyncio
import logging
import os
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

INGEST_URL = os.environ.get(
    "ROUTE_LOG_INGEST_URL",
    "http://localhost:3000/api/logs/route",
)
INGEST_SECRET = os.environ.get("ROUTE_LOG_INGEST_SECRET", "")


def _infer_fastapi_action(method: str, path: str) -> str:
    path_only = path.split("?")[0]
    patterns: list[tuple[str, str]] = [
        ("/api/readers/reset", "card.readers.reset"),
        ("/api/read-card-stream", "card.read_stream"),
        ("/api/card-events-stream", "card.events_stream"),
        ("/api/read-card/photo", "card.read_photo"),
        ("/api/read-card", "card.read"),
        ("/api/readers", "card.readers.list"),
        ("/api/rfid/read", "card.rfid.read"),
        ("/api/export/json", "card.export.json"),
        ("/api/export/csv", "card.export.csv"),
        ("/api/diagnostic", "card.diagnostic"),
        ("/ws/card-events", "card.ws.events"),
    ]
    for prefix, base in patterns:
        if path_only == prefix or path_only.startswith(prefix + "/"):
            return f"{base}.{method.lower()}"
    clean = path_only.strip("/").replace("/", ".") or "root"
    return f"fastapi.{clean}.{method.lower()}"


async def send_route_log(
    *,
    method: str,
    path: str,
    status_code: int,
    duration_ms: int,
    error_message: Optional[str] = None,
    client_host: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> None:
    if os.environ.get("ROUTE_LOG_ENABLED", "true").lower() == "false":
        return

    payload = {
        "logs": [
            {
                "source": "BACKEND_FASTAPI",
                "level": "ERROR" if status_code >= 500 else ("WARN" if status_code >= 400 else "INFO"),
                "method": method[:10],
                "path": path[:500],
                "action": _infer_fastapi_action(method, path),
                "statusCode": status_code,
                "durationMs": duration_ms,
                "ipAddress": client_host,
                "userAgent": user_agent,
                "errorMessage": error_message,
            }
        ]
    }

    headers = {"Content-Type": "application/json"}
    if INGEST_SECRET:
        headers["X-Route-Log-Secret"] = INGEST_SECRET

    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            await client.post(INGEST_URL, json=payload, headers=headers)
    except Exception as exc:
        logger.debug("Route log ingest failed: %s", exc)


def schedule_route_log(**kwargs) -> None:
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(send_route_log(**kwargs))
    except RuntimeError:
        pass
