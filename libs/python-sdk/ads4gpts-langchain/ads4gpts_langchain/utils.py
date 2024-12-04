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


import os
import logging
from typing import Any, Dict, Union, List, Optional, Type

import requests
import httpx
import asyncio
from pydantic import BaseModel, Field, root_validator
from langchain_core.tools import BaseTool
from ads4gpts_langchain.utils import get_from_dict_or_env

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Stream handler for logging
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)


def get_ads(
    url: str, headers: Dict[str, str], payload: Dict[str, Any]
) -> Union[Dict, List[Dict]]:
    session = requests.Session()
    retries = requests.adapters.Retry(
        total=5,
        backoff_factor=0.2,
        status_forcelist=[500, 502, 503, 504],
        allowed_methods=["POST"],
    )
    adapter = requests.adapters.HTTPAdapter(max_retries=retries)
    session.mount("http://", adapter)
    session.mount("https://", adapter)

    try:
        response = session.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        response_json = response.json()
        if isinstance(response_json["data"]["ads"], dict):
            return response_json["data"]["ads"]
        elif isinstance(response_json["data"]["ads"], list):
            return (
                response_json["data"]["ads"]
                if payload["num_ads"] > 1
                else response_json["data"]["ads"][0]
            )
        else:
            return {"error": "Returned object is not a Dictionary or Array"}
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
    url: str, headers: Dict[str, str], payload: Dict[str, Any]
) -> Union[Dict, List[Dict]]:
    """Fetch ads asynchronously with manual retry mechanism."""
    max_retries = 5
    backoff_factor = 0.2

    async with httpx.AsyncClient() as client:
        for attempt in range(1, max_retries + 1):
            try:
                response = await client.post(
                    url, json=payload, headers=headers, timeout=10.0
                )
                response.raise_for_status()
                response_json = response.json()
                if isinstance(response_json["data"]["ads"], dict):
                    return response_json["data"]["ads"]
                elif isinstance(response_json["data"]["ads"], list):
                    return (
                        response_json["data"]["ads"]
                        if payload["num_ads"] > 1
                        else response_json["data"]["ads"][0]
                    )
                else:
                    return {"error": "Returned object is not a Dictionary or Array"}
            except httpx.HTTPStatusError as http_err:
                logger.error(
                    f"HTTP error on attempt {attempt} of {max_retries}: {http_err}"
                )
                if attempt == max_retries:
                    return {"error": str(http_err)}
                await asyncio.sleep(backoff_factor * (2 ** (attempt - 1)))
            except (httpx.ConnectError, httpx.ReadTimeout) as conn_err:
                logger.error(
                    f"Connection error on attempt {attempt} of {max_retries}: {conn_err}"
                )
                if attempt == max_retries:
                    return {"error": str(conn_err)}
                await asyncio.sleep(backoff_factor * (2 ** (attempt - 1)))
            except Exception as err:
                logger.error(f"General error: {err}")
                return {"error": str(err)}
