import os
import logging
from typing import Any, Dict, Union, List, Optional, Type, Literal

from pydantic import BaseModel, Field, model_validator
from enum import Enum
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


class Ads4gptsBaseInput(BaseModel):
    """Base Input schema for Ads4gpts tools."""

    id: str = Field(
        ...,
        description="Unique identifier for the session or user (hashed or anonymized to ensure privacy).",
    )
    user: Dict[Literal["gender", "age_range", "persona"], str] = Field(
        ...,
        description="User attributes of gender, age_range, and persona.",
        json_schema_extra={
            "example": {
                "gender": "female",
                "age_range": "25-34",
                "persona": "fitness-focused frequent traveler with an interest in adventure sports",
            }
        },
    )
    ad_recommendation: str = Field(
        ...,
        description="A free-text description of ads relevant to the user.",
        json_schema_extra={
            "example": "budget airline promos, hiking gear discounts, local travel insurance offers",
        },
    )
    undesired_ads: str = Field(
        ...,
        description="A free-text or enumerated reference to ads the user does not wish to see.",
        json_schema_extra={
            "example": "luxury travel packages, gambling, diet supplements",
        },
    )
    context: str = Field(
        ...,
        description="A summary of the context the ad is going to be in.",
        json_schema_extra={
            "example": "user browsing travel blogs",
        },
    )
    num_ads: int = Field(
        default=1,
        ge=1,
        description="Number of ads to retrieve (must be >= 1).",
        json_schema_extra={
            "example": 3,
        },
    )
    style: str = Field(
        default="neutral",
        description="The style description of the AI application, defaults to 'neutral'.",
        json_schema_extra={
            "example": "neutral",
        },
    )

    @model_validator(mode="before")
    def validate_user(cls, values):
        """Validate user field to ensure it contains required keys and valid values."""
        user = values.get("user", {})
        required_keys = {"gender", "age_range", "persona"}
        if not required_keys.issubset(user.keys()):
            raise ValueError(f"user field must contain keys: {required_keys}")

        gender = user.get("gender")
        age_range = user.get("age_range")

        valid_genders = {"male", "female", "non_binary", "undisclosed"}
        valid_age_ranges = {
            "under_18",
            "18-24",
            "25-34",
            "35-44",
            "45-54",
            "55-64",
            "65_over",
            "undisclosed",
        }

        if gender not in valid_genders:
            raise ValueError(
                f"Invalid gender value: {gender}. Must be one of {valid_genders}"
            )
        if age_range not in valid_age_ranges:
            raise ValueError(
                f"Invalid age_range value: {age_range}. Must be one of {valid_age_ranges}"
            )

        return values


class AdFormat(str, Enum):
    INLINE_SPONSORED_RESPONSES = "INLINE_SPONSORED_RESPONSES"
    SUGGESTED_PROMPTS = "SUGGESTED_PROMPTS"


class Ads4gptsInlineSponsoredResponsesInput(Ads4gptsBaseInput):
    """Input schema for ADS4GPTsInlineSponsoredResponsesTool."""

    ad_format: AdFormat = AdFormat.INLINE_SPONSORED_RESPONSES


class Ads4gptsSuggestedPromptsInput(Ads4gptsBaseInput):
    """Input schema for Ads4GPTsSuggestedPromptsTool."""

    ad_format: AdFormat = AdFormat.SUGGESTED_PROMPTS


class Ads4gptsBaseTool(BaseTool):
    """Base tool for Ads4gpts."""

    name: str = "ads4gpts_base_tool"
    description: str = """
        Base tool that sets up the core functionality for retrieving ads. This class should not be used directly.
    """
    ads4gpts_api_key: str = Field(
        default=None, description="API key for authenticating with the ads database."
    )
    base_url: str = Field(
        default="https://with.Ads4gpts.com",
        description="Base URL for the ads API endpoint.",
    )
    ads_endpoint: str = Field(
        default="", description="Endpoint path for retrieving ads."
    )
    args_schema: Type[Ads4gptsBaseInput] = Ads4gptsBaseInput

    @model_validator(mode="before")
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
            payload = validated_args.model_dump()
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
            payload = validated_args.model_dump()
            return await async_get_ads(url=url, headers=headers, payload=payload)
        except Exception as e:
            logger.error(f"An error occurred in _arun: {e}")
            return {"error": str(e)}


class Ads4gptsInlineSponsoredResponsesTool(Ads4gptsBaseTool):
    name: str = "ads4gpts_inline_sponsored_responses"
    description: str = """
        Tool for retrieving relevant Inline Sponsored Responses (Native Ads) based on the provided user attributes and context.
        
        Args:
            id (str): Unique identifier for the session or user (hashed or anonymized to ensure privacy).
            user (Dict[Literal["gender", "age_range", "persona"], str]): User attributes of gender, age_range, and persona.
            ad_recommendation (str): A free-text description of ads relevant to the user.
            undesired_ads (str): A free-text or enumerated reference to ads the user does not wish to see.
            context (str): A summary of the context the ad is going to be in.
            num_ads (int): Number of ads to retrieve. Defaults to 1.
            style (str): The style description of the AI application, defaults to 'neutral'.
        
        Returns:
            Union[Dict, List[Dict]]: A single ad or a list of ads, each containing the ad creative, ad header, ad copy, and CTA link.
    """
    ads_endpoint: str = "/ads"
    args_schema: Type[Ads4gptsInlineSponsoredResponsesInput] = (
        Ads4gptsInlineSponsoredResponsesInput
    )


class Ads4gptsSuggestedPromptsTool(Ads4gptsBaseTool):
    name: str = "ads4gpts_suggested_prompts"
    description: str = """
        Tool for retrieving Suggested Prompts (Pre-Chat Ads) that engage users with relevant prompts before a conversation begins.
        
        Args:
            id (str): Unique identifier for the session or user (hashed or anonymized to ensure privacy).
            user (Dict[Literal["gender", "age_range", "persona"], str]): User attributes of gender, age_range, and persona.
            ad_recommendation (str): A free-text description of ads relevant to the user.
            undesired_ads (str): A free-text or enumerated reference to ads the user does not wish to see.
            context (str): A summary of the context the ad is going to be in.
            num_ads (int): Number of ads to retrieve. Defaults to 1.
            style (str): The style description of the AI application, defaults to 'neutral'.
        
        Returns:
            Union[Dict, List[Dict]]: A single prompt or a list of suggested prompts, each containing the ad creative, ad header, ad copy, and CTA link.
    """
    ads_endpoint: str = "/ads"
    args_schema: Type[Ads4gptsSuggestedPromptsInput] = Ads4gptsSuggestedPromptsInput


# class Ads4GPTsBannerInput(Ads4gptsBaseInput):
#     """Input schema for Ads4GPTsBannerTool."""

#     pass


# class Ads4GPTsChatInput(Ads4gptsBaseInput):
#     """Input schema for Ads4GPTsChatTool."""

#     pass

# class Ads4GPTsChatTool(Ads4gptsBaseTool):
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
#     ads_endpoint: str = Field(
#         default="/api/v1/chat_ads", description="Endpoint path for retrieving ads."
#     )


# class Ads4GPTsBannerTool(Ads4gptsBaseTool):
#     name: str = "ads4gpts_banner_tool"
#     description: str = """
#         Tool for retrieving relevant Banner Ads based on the provided context.
#     Args:
#         context (str): Context that will help retrieve the most relevant ads from the ad database. The richer the context, the better the ad fit.
#         num_ads (int): Number of ads to retrieve. Defaults to 1.
#     Returns:
#         Union[Dict, List[Dict]]: A single ad or a list of ads, each containing the ad creative, ad header, ad copy, and CTA link.
#     """
#     args_schema: Type[Ads4GPTsBannerInput] = Ads4GPTsBannerInput
#     ads_endpoint: str = Field(
#         default="/api/v1/banner_ads", description="Endpoint path for retrieving ads."
#     )
