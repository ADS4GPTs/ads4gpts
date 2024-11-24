import os
import logging
from typing import Any, Dict, Union, List, Optional, Type

import requests
import httpx
import asyncio  # Added asyncio for sleep
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
logger.addHandler(handler)


class Ads4GPTsInput(BaseModel):
    """Input schema for Ads4GPTsTool."""

    context: str = Field(..., description="Context to retrieve relevant ads.")
    num_ads: int = Field(
        default=1, ge=1, description="Number of ads to retrieve (must be >= 1)."
    )


class Ads4GPTsTool(BaseTool):
    name: str = "ads4gpts_tool"
    description: str = """
        Tool for retrieving relevant ads based on the provided context.
    Args:
        context (str): Context that will help retrieve the most relevant ads from the ad database. The richer the context, the better the ad fit.
        num_ads (int): Number of ads to retrieve. Defaults to 1.
    Returns:
        Union[Dict, List[Dict]]: A single ad or a list of ads, each containing the ad creative, ad header, ad copy, and CTA link.
    """
    args_schema: Type[Ads4GPTsInput] = Ads4GPTsInput

    ads4gpts_api_key: str = Field(
        default=None, description="API key for authenticating with the ads database."
    )
    base_url: str = Field(
        default="https://ads-api-fp3g.onrender.com",
        description="Base URL for the ads API endpoint.",
    )
    ads_endpoint: str = Field(
        default="/api/v1/ads", description="Endpoint path for retrieving ads."
    )

    @root_validator(pre=True)
    def set_api_key(cls, values):
        """Validate and set the API key from input or environment."""
        api_key = values.get("ads4gpts_api_key")
        if not api_key:
            api_key = get_from_dict_or_env(
                values, "ads4gpts_api_key", "ADS4GPTS_API_KEY"
            )
            values["ads4gpts_api_key"] = api_key
        return values

    def _run(self, context: str, num_ads: int = 1) -> Union[Dict, List[Dict]]:
        """Synchronous method to retrieve ads."""
        try:
            return self.get_ads(context, num_ads)
        except Exception as e:
            logger.error(f"An error occurred in _run: {e}")
            return {"error": str(e)}

    async def _arun(self, context: str, num_ads: int = 1) -> Union[Dict, List[Dict]]:
        """Asynchronous method to retrieve ads."""
        try:
            return await self._async_get_ads(context, num_ads)
        except Exception as e:
            logger.error(f"An error occurred in _arun: {e}")
            return {"error": str(e)}

    def get_ads(self, context: str, num_ads: int) -> Union[Dict, List[Dict]]:
        """Fetch ads synchronously."""
        url = f"{self.base_url}{self.ads_endpoint}"
        headers = {"Authorization": f"Bearer {self.ads4gpts_api_key}"}
        payload = {"context": context, "num_ads": num_ads}

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
                    if num_ads > 1
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

    async def _async_get_ads(
        self, context: str, num_ads: int
    ) -> Union[Dict, List[Dict]]:
        """Fetch ads asynchronously with manual retry mechanism."""
        url = f"{self.base_url}{self.ads_endpoint}"
        headers = {"Authorization": f"Bearer {self.ads4gpts_api_key}"}
        payload = {"context": context, "num_ads": num_ads}

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
                            if num_ads > 1
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
