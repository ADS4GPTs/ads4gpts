import os
import logging
from typing import Any, Dict, Union, List, Optional, Type

from pydantic import BaseModel, Field, root_validator
from langchain_core.tools import BaseTool
from ads4gpts_langchain.utils import get_from_dict_or_env, get_ads, async_get_ads

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Stream handler for logging
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)


class Ads4GPTsBaseInput(BaseModel):
    """Base Input schema for Ads4GPTs tools."""

    context: str = Field(..., description="Context to retrieve relevant ads.")
    num_ads: int = Field(
        default=1, ge=1, description="Number of ads to retrieve (must be >= 1)."
    )


class Ads4GPTsBannerInput(BaseModel):
    """Input schema for Ads4GPTsBannerTool."""

    context: str = Field(..., description="Context to retrieve relevant ads.")
    num_ads: int = Field(
        default=1, ge=1, description="Number of ads to retrieve (must be >= 1)."
    )


class Ads4GPTsChatInput(BaseModel):
    """Input schema for Ads4GPTsChatTool."""

    context: str = Field(..., description="Context to retrieve relevant ads.")
    num_ads: int = Field(
        default=1, ge=1, description="Number of ads to retrieve (must be >= 1)."
    )
    # last_message: str = Field(..., description="Last conversation message.")


class Ads4GPTsBaseTool(BaseTool):
    """Base tool for Ads4GPTs."""

    ads4gpts_api_key: str = Field(
        default=None, description="API key for authenticating with the ads database."
    )
    base_url: str = Field(
        default="https://ads-api-fp3g.onrender.com",
        description="Base URL for the ads API endpoint.",
    )
    ads_endpoint: str = Field(
        default="", description="Endpoint path for retrieving ads."
    )
    args_schema: Type[Ads4GPTsBaseInput] = Ads4GPTsBaseInput

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

    def _run(self, **kwargs) -> Union[Dict, List[Dict]]:
        """Synchronous method to retrieve ads."""
        try:
            # Validate kwargs against args_schema
            validated_args = self.args_schema(**kwargs)
            url = f"{self.base_url}{self.ads_endpoint}"
            headers = {"Authorization": f"Bearer {self.ads4gpts_api_key}"}
            payload = validated_args.dict()
            return get_ads(url=url, headers=headers, payload=payload)
        except Exception as e:
            logger.error(f"An error occurred in _run: {e}")
            return {"error": str(e)}

    async def _arun(self, **kwargs) -> Union[Dict, List[Dict]]:
        """Asynchronous method to retrieve ads."""
        try:
            # Validate kwargs against args_schema
            validated_args = self.args_schema(**kwargs)
            url = f"{self.base_url}{self.ads_endpoint}"
            headers = {"Authorization": f"Bearer {self.ads4gpts_api_key}"}
            payload = validated_args.dict()
            return await async_get_ads(url=url, headers=headers, payload=payload)
        except Exception as e:
            logger.error(f"An error occurred in _arun: {e}")
            return {"error": str(e)}


class Ads4GPTsBannerTool(Ads4GPTsBaseTool):
    name: str = "ads4gpts_banner_tool"
    description: str = """
        Tool for retrieving relevant Banner Ads based on the provided context.
    Args:
        context (str): Context that will help retrieve the most relevant ads from the ad database. The richer the context, the better the ad fit.
        num_ads (int): Number of ads to retrieve. Defaults to 1.
    Returns:
        Union[Dict, List[Dict]]: A single ad or a list of ads, each containing the ad creative, ad header, ad copy, and CTA link.
    """
    args_schema: Type[Ads4GPTsBannerInput] = Ads4GPTsBannerInput
    ads_endpoint: str = Field(
        default="/api/v1/banner_ads", description="Endpoint path for retrieving ads."
    )


class Ads4GPTsChatTool(Ads4GPTsBaseTool):
    name: str = "ads4gpts_chat_tool"
    description: str = """
        Tool for retrieving relevant Chat Ads based on the provided context.
    Args:
        context (str): Context that will help retrieve the most relevant ads from the ad database. The richer the context, the better the ad fit.
        num_ads (int): Number of ads to retrieve. Defaults to 1.
    Returns:
        Union[Dict, List[Dict]]: A single ad or a list of ads, each containing the Ad Text.
    """
    args_schema: Type[Ads4GPTsChatInput] = Ads4GPTsChatInput
    ads_endpoint: str = Field(
        default="/api/v1/chat_ads", description="Endpoint path for retrieving ads."
    )


# class Ads4GPTsBannerInput(BaseModel):
#     """Input schema for Ads4GPTsTool."""

#     context: str = Field(..., description="Context to retrieve relevant ads.")
#     num_ads: int = Field(
#         default=1, ge=1, description="Number of ads to retrieve (must be >= 1)."
#     )


# class Ads4GPTsBannerTool(BaseTool):
#     name: str = "ads4gpts_banner_tool"
#     description: str = """
#         Tool for retrieving relevant Banner ads based on the provided context.
#     Args:
#         context (str): Context that will help retrieve the most relevant ads from the ad database. The richer the context, the better the ad fit.
#         num_ads (int): Number of ads to retrieve. Defaults to 1.
#     Returns:
#         Union[Dict, List[Dict]]: A single ad or a list of ads, each containing the ad creative, ad header, ad copy, and CTA link.
#     """
#     args_schema: Type[Ads4GPTsBannerInput] = Ads4GPTsBannerInput

#     ads4gpts_api_key: str = Field(
#         default=None, description="API key for authenticating with the ads database."
#     )
#     base_url: str = Field(
#         default="https://ads-api-fp3g.onrender.com",
#         description="Base URL for the ads API endpoint.",
#     )
#     ads_endpoint: str = Field(
#         default="/api/v1/banner_ads", description="Endpoint path for retrieving ads."
#     )

#     @root_validator(pre=True)
#     def set_api_key(cls, values):
#         """Validate and set the API key from input or environment."""
#         api_key = values.get("ads4gpts_api_key")
#         if not api_key:
#             api_key = get_from_dict_or_env(
#                 values, "ads4gpts_api_key", "ADS4GPTS_API_KEY"
#             )
#             values["ads4gpts_api_key"] = api_key
#         return values

#     def _run(self, context: str, num_ads: int = 1) -> Union[Dict, List[Dict]]:
#         """Synchronous method to retrieve ads."""
#         try:
#             url = f"{self.base_url}{self.ads_endpoint}"
#             headers = {"Authorization": f"Bearer {self.ads4gpts_api_key}"}
#             payload = {"context": context, "num_ads": num_ads}
#             return get_ads(url=url, headers=headers, payload=payload)
#         except Exception as e:
#             logger.error(f"An error occurred in _run: {e}")
#             return {"error": str(e)}

#     async def _arun(self, context: str, num_ads: int = 1) -> Union[Dict, List[Dict]]:
#         """Asynchronous method to retrieve ads."""
#         try:
#             url = f"{self.base_url}{self.ads_endpoint}"
#             headers = {"Authorization": f"Bearer {self.ads4gpts_api_key}"}
#             payload = {"context": context, "num_ads": num_ads}
#             return await async_get_ads(url=url, headers=headers, payload=payload)
#         except Exception as e:
#             logger.error(f"An error occurred in _arun: {e}")
#             return {"error": str(e)}


# class Ads4GPTsChatInput(BaseModel):
#     """Input schema for Ads4GPTsTool."""

#     context: str = Field(..., description="Context to retrieve relevant ads.")
#     last_message: str = Field(..., description="Last conversation message.")
#     num_ads: int = Field(
#         default=1, ge=1, description="Number of ads to retrieve (must be >= 1)."
#     )


# class Ads4GPTsChatTool(BaseTool):
#     name: str = "ads4gpts_chat_tool"
#     description: str = """
#         Tool for retrieving relevant Chat Ads based on the provided context.
#     Args:
#         context (str): Context that will help retrieve the most relevant ads from the ad database. The richer the context, the better the ad fit.
#         num_ads (int): Number of ads to retrieve. Defaults to 1.
#     Returns:
#         Union[Dict, List[Dict]]: A single ad or a list of ads, each containing the Ad Text.
#     """
#     args_schema: Type[Ads4GPTsChatInput] = Ads4GPTsChatInput

#     ads4gpts_api_key: str = Field(
#         default=None, description="API key for authenticating with the ads database."
#     )
#     base_url: str = Field(
#         default="https://ads-api-fp3g.onrender.com",
#         description="Base URL for the ads API endpoint.",
#     )
#     ads_endpoint: str = Field(
#         default="/api/v1/chat_ads", description="Endpoint path for retrieving ads."
#     )

#     @root_validator(pre=True)
#     def set_api_key(cls, values):
#         """Validate and set the API key from input or environment."""
#         api_key = values.get("ads4gpts_api_key")
#         if not api_key:
#             api_key = get_from_dict_or_env(
#                 values, "ads4gpts_api_key", "ADS4GPTS_API_KEY"
#             )
#             values["ads4gpts_api_key"] = api_key
#         return values

#     def _run(self, context: str, num_ads: int = 1) -> Union[Dict, List[Dict]]:
#         """Synchronous method to retrieve ads."""
#         try:
#             url = f"{self.base_url}{self.ads_endpoint}"
#             headers = {"Authorization": f"Bearer {self.ads4gpts_api_key}"}
#             payload = {"context": context, "num_ads": num_ads}
#             return get_ads(url=url, headers=headers, payload=payload)
#         except Exception as e:
#             logger.error(f"An error occurred in _run: {e}")
#             return {"error": str(e)}

#     async def _arun(self, context: str, num_ads: int = 1) -> Union[Dict, List[Dict]]:
#         """Asynchronous method to retrieve ads."""
#         try:
#             url = f"{self.base_url}{self.ads_endpoint}"
#             headers = {"Authorization": f"Bearer {self.ads4gpts_api_key}"}
#             payload = {"context": context, "num_ads": num_ads}
#             return await async_get_ads(url=url, headers=headers, payload=payload)
#         except Exception as e:
#             logger.error(f"An error occurred in _arun: {e}")
#             return {"error": str(e)}
