from typing import List, Dict, Any, Union, Optional
import os


def get_from_env(key: str, env_key: str, default: Optional[str] = None) -> str:
    """Retrieve a value from an environment variable."""
    value = os.getenv(env_key)
    if value:
        return value
    elif default is not None:
        return default
    else:
        raise ValueError(
            f"'{key}' not found. Please set the '{env_key}' environment variable or provide '{key}' as a parameter."
        )


def get_from_dict_or_env(
    data: Dict[str, Any],
    key: Union[str, List[str]],
    env_key: str,
    default: Optional[str] = None,
) -> str:
    """Retrieve a value from a dictionary or environment variable."""
    if isinstance(key, (list, tuple)):
        for k in key:
            if data.get(k):
                return data[k]
    elif data.get(key):
        return data[key]

    return get_from_env(key, env_key, default)


import logging
import requests
import httpx
import asyncio


# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Stream handler for logging
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)


def get_ads(
    url: str,
    headers: Dict[str, str],
    payload: Dict[str, Any],
    num_retries: int = 3,
    backoff_factor: float = 0.2,
    timeout: float = 10.0,
) -> Dict:
    session = requests.Session()
    retries = requests.adapters.Retry(
        total=num_retries,
        backoff_factor=backoff_factor,
        status_forcelist=[500, 502, 503, 504],
        allowed_methods=["POST"],
    )
    adapter = requests.adapters.HTTPAdapter(max_retries=retries)
    session.mount("http://", adapter)
    session.mount("https://", adapter)

    try:
        response = session.post(url, json=payload, headers=headers, timeout=timeout)
        response.raise_for_status()
        response_json = response.json()
        payload = response_json.get("payload", {})
        status = payload.get("status", None)
        if status == "success":
            advertiser_agents = payload.get("data", {}).get("advertiser_agents", None)
            if advertiser_agents:
                return {"advertiser_agents": advertiser_agents}
            return {"error": "No advertiser_agents found in response data"}
        elif status == "error":
            error_msg = payload.get("error", {}).get("message", "Unknown error")
            return {"error": error_msg}

        return {"error": "Unexpected response format"}
    except requests.exceptions.HTTPError as http_err:
        logger.error(f"HTTP error: {http_err}")
        return {"error": str(http_err)}
    except requests.exceptions.RequestException as req_err:
        logger.error(f"Request error: {req_err}")
        return {"error": str(req_err)}
    except Exception as err:
        logger.error(f"General error: {err}")
        return {"error": str(err)}
    finally:
        session.close()


async def async_get_ads(
    url: str,
    headers: Dict[str, str],
    payload: Dict[str, Any],
    num_retries: int = 3,
    backoff_factor: float = 0.2,
    timeout: float = 10.0,
) -> Dict:
    """Fetch ads asynchronously with manual retry mechanism."""

    async with httpx.AsyncClient() as client:
        for attempt in range(1, num_retries + 1):
            try:
                response = await client.post(
                    url, json=payload, headers=headers, timeout=timeout
                )
                response.raise_for_status()
                response_json = response.json()

                payload = response_json.get("payload", {})
                status = payload.get("status", None)
                if status == "success":
                    advertiser_agents = payload.get("data", {}).get(
                        "advertiser_agents", None
                    )
                    if advertiser_agents:
                        return {"advertiser_agents": advertiser_agents}
                    return {"error": "No advertiser_agents found in response data"}
                elif status == "error":
                    error_msg = payload.get("error", {}).get("message", "Unknown error")
                    return {"error": error_msg}

                return {"error": "Unexpected response format"}
            except httpx.HTTPStatusError as http_err:
                logger.error(
                    f"HTTP error on attempt {attempt} of {num_retries}: {http_err}"
                )
                if attempt == num_retries:
                    return {"error": str(http_err)}
                await asyncio.sleep(backoff_factor * (2 ** (attempt - 1)))
            except (httpx.ConnectError, httpx.ReadTimeout) as conn_err:
                logger.error(
                    f"Connection error on attempt {attempt} of {num_retries}: {conn_err}"
                )
                if attempt == num_retries:
                    return {"error": str(conn_err)}
                await asyncio.sleep(backoff_factor * (2 ** (attempt - 1)))
            except Exception as err:
                logger.error(f"General error: {err}")
                return {"error": str(err)}
