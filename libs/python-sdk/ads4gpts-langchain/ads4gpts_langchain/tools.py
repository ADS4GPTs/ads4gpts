import os
import logging
from typing import Any, Dict, Union, List, Optional, Type, Literal, Annotated

from pydantic import BaseModel, Field, model_validator
from enum import Enum
from langchain_core.tools import BaseTool
from ads4gpts_langchain.utils import get_from_dict_or_env, get_ads, async_get_ads
from langgraph.types import Command
from langchain_core.tools.base import InjectedToolCallId
from langchain_core.messages import ToolMessage

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
    user_gender: Literal["MALE", "FEMALE", "OTHER", "UNDISCLOSED"] = Field(
        default="UNDISCLOSED", description="Gender of the user."
    )
    user_age_range: str = Field(
        default="UNDISCLOSED", description="Age range of the user."
    )
    user_persona: str = Field(
        default="UNDISCLOSED",
        description="A descriptive persona of the user based on their interests and behaviors.",
    )
    ad_recommendation: str = Field(
        ..., description="A free-text description of ads relevant to the user."
    )
    undesired_ads: str = Field(
        ...,
        description="A free-text or enumerated reference to ads the user does not wish to see.",
    )
    context: str = Field(
        ..., description="A summary of the context the ad is going to be in."
    )
    num_ads: int = Field(
        default=1, ge=1, description="Number of ads to retrieve (must be >= 1)."
    )
    min_bid: float = Field(
        default=0.01,
        ge=0.01,
        description="Minimum bid for the ad placement (must be >= 0.01).",
    )
    session_id: Optional[str] = Field(
        default=None,
        description="Session ID for tracking purposes.",
    )
    tool_call_id: Annotated[str, InjectedToolCallId] = Field(
        ..., description="The unique identifier for the tool call."
    )

    @model_validator(mode="before")
    def validate_user(cls, values):
        """Validate user fields to ensure they contain valid values."""
        gender = values.get("user_gender")

        valid_genders = {"MALE", "FEMALE", "OTHER", "UNDISCLOSED"}

        if gender not in valid_genders:
            raise ValueError(
                f"Invalid gender value: {gender}. Must be one of {valid_genders}"
            )

        return values


class AdFormat(str, Enum):
    INLINE_SPONSORED_RESPONSE = "INLINE_SPONSORED_RESPONSE"
    SUGGESTED_PROMPT = "SUGGESTED_PROMPT"
    INLINE_CONVERSATIONAL = "INLINE_CONVERSATIONAL"
    INLINE_BANNER = "INLINE_BANNER"
    SUGGESTED_BANNER = "SUGGESTED_BANNER"
    INLINE_REFERRAL = "INLINE_REFERRAL"


class Ads4gptsInlineSponsoredResponseInput(Ads4gptsBaseInput):
    """Input schema for Ads4gptsInlineSponsoredResponseTool."""

    ad_format: AdFormat = AdFormat.INLINE_SPONSORED_RESPONSE


class Ads4gptsSuggestedPromptInput(Ads4gptsBaseInput):
    """Input schema for Ads4gptsSuggestedPromptTool."""

    ad_format: AdFormat = AdFormat.SUGGESTED_PROMPT


class Ads4gptsInlineConversationalInput(Ads4gptsBaseInput):
    """Input schema for Ads4gptsInlineConversationalTool."""

    ad_format: AdFormat = AdFormat.INLINE_CONVERSATIONAL

    @model_validator(mode="before")
    def validate_num_ads(cls, values):
        num_ads = values.get("num_ads")
        if num_ads != 1:
            raise ValueError("num_ads must be exactly 1 for Inline Conversational ads.")
        return values


class Ads4gptsInlineBannerInput(Ads4gptsBaseInput):
    """Input schema for Ads4gptsInlineBannerTool."""

    ad_format: AdFormat = AdFormat.INLINE_BANNER


class Ads4gptsSuggestedBannerInput(Ads4gptsBaseInput):
    """Input schema for Ads4gptsSuggestedBannerTool."""

    ad_format: AdFormat = AdFormat.SUGGESTED_BANNER


class Ads4gptsInlineReferralInput(Ads4gptsBaseInput):
    """Input schema for Ads4gptsInlineReferralTool."""

    ad_format: AdFormat = AdFormat.INLINE_REFERRAL


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
        default="https://with.ads4gpts.com/",
        description="Base URL for the ads API endpoint.",
    )
    ads_endpoint: str = Field(
        default="api/v1/ads/", description="Endpoint path for retrieving ads."
    )
    ads4gpts_render_agent: Optional[str] = Field(
        default=None,
        description="The render agent to use for rendering ads. Defaults to None.",
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
            validated_args = self.args_schema(**kwargs)
            url = f"{self.base_url}{self.ads_endpoint}"
            headers = {"Authorization": f"Bearer {self.ads4gpts_api_key}"}
            payload = validated_args.model_dump()
            tool_call_id = payload.pop("tool_call_id", None)
            if self.ads4gpts_render_agent:
                return Command(
                    goto=self.ads4gpts_render_agent,
                    update={
                        "messages": [
                            ToolMessage(
                                content=get_ads(
                                    url=url, headers=headers, payload=payload
                                ),
                                name=self.name,
                                tool_call_id=tool_call_id,
                            )
                        ]
                    },
                )
            else:
                return get_ads(url=url, headers=headers, payload=payload)
        except Exception as e:
            logger.error(f"An error occurred in _run: {e}")
            return {"error": str(e)}

    async def _arun(self, **kwargs) -> Union[Dict, List[Dict]]:
        """Asynchronous method to retrieve ads."""
        try:
            validated_args = self.args_schema(**kwargs)
            url = f"{self.base_url}{self.ads_endpoint}"
            headers = {"Authorization": f"Bearer {self.ads4gpts_api_key}"}
            payload = validated_args.model_dump()
            tool_call_id = payload.pop("tool_call_id", None)
            ads = await async_get_ads(url=url, headers=headers, payload=payload)
            if self.ads4gpts_render_agent:
                return Command(
                    goto=self.ads4gpts_render_agent,
                    update={
                        "messages": [
                            ToolMessage(
                                content=ads,
                                name=self.name,
                                tool_call_id=tool_call_id,
                            )
                        ]
                    },
                )
            else:
                return ads
        except Exception as e:
            logger.error(f"An error occurred in _arun: {e}")
            return {"error": str(e)}


class Ads4gptsInlineSponsoredResponseTool(Ads4gptsBaseTool):
    name: str = "ads4gpts_inline_sponsored_response"
    description: str = """
        Tool for retrieving relevant Inline Sponsored Responses (Native Ads) based on the provided user attributes and context.

        Args:
            id (str): Unique identifier for the session or user (hashed or anonymized to ensure privacy).
            user_gender (str): Gender of the user.
            user_age (str): Age range of the user.
            user_persona (str): A descriptive persona of the user based on their interests and behaviors.
            ad_recommendation (str): A free-text description of ads relevant to the user.
            undesired_ads (str): A free-text or enumerated reference to ads the user does not wish to see.
            context (str): A summary of the context the ad is going to be in.
            num_ads (int): Number of ads to retrieve (must be >= 1).
            min_bid (float): Minimum bid for the ad placement (must be >= 0.01).
            session_id (Optional[str]): Session ID for tracking purposes.

        Returns:
            Dict: Contains the "advertiser_agents" key with a list of ads.
    """
    args_schema: Type[Ads4gptsInlineSponsoredResponseInput] = (
        Ads4gptsInlineSponsoredResponseInput
    )


class Ads4gptsSuggestedPromptTool(Ads4gptsBaseTool):
    name: str = "ads4gpts_suggested_prompt"
    description: str = """
        Tool for retrieving Suggested Prompts (Pre-Chat Ads) that engage users with relevant prompts before a conversation begins.

        Args:
            id (str): Unique identifier for the session or user (hashed or anonymized to ensure privacy).
            user_gender (str): Gender of the user.
            user_age (str): Age range of the user.
            user_persona (str): A descriptive persona of the user based on their interests and behaviors.
            ad_recommendation (str): A free-text description of ads relevant to the user.
            undesired_ads (str): A free-text or enumerated reference to ads the user does not wish to see.
            context (str): A summary of the context the ad is going to be in.
            num_ads (int): Number of ads to retrieve (must be >= 1).
            min_bid (float): Minimum bid for the ad placement (must be >= 0.01).
            session_id (Optional[str]): Session ID for tracking purposes.

        Returns:
            Dict: Contains the "advertiser_agents" key with a list of ads.
    """
    args_schema: Type[Ads4gptsSuggestedPromptInput] = Ads4gptsSuggestedPromptInput


class Ads4gptsInlineConversationalTool(Ads4gptsBaseTool):
    name: str = "ads4gpts_inline_conversational"
    description: str = """
        Tool for retrieving Inline Conversational ads that flow naturally within the conversation context.

        Args:
            id (str): Unique identifier for the session or user (hashed or anonymized to ensure privacy).
            user_gender (str): Gender of the user.
            user_age (str): Age range of the user.
            user_persona (str): A descriptive persona of the user based on their interests and behaviors.
            ad_recommendation (str): A free-text description of ads relevant to the user.
            undesired_ads (str): A free-text or enumerated reference to ads the user does not wish to see.
            context (str): A summary of the context the ad is going to be in.
            num_ads (int): Number of ads to retrieve. Hard set to 1 for this format.
            min_bid (float): Minimum bid for the ad placement (must be >= 0.01).
            session_id (Optional[str]): Session ID for tracking purposes.

        Returns:
            Dict: Contains the "advertiser_agents" key with a list of ads.
    """
    args_schema: Type[Ads4gptsInlineConversationalInput] = (
        Ads4gptsInlineConversationalInput
    )


class Ads4gptsInlineBannerTool(Ads4gptsBaseTool):
    name: str = "ads4gpts_inline_banner"
    description: str = """
        Tool for retrieving Inline Banner ads that can be displayed within the conversation interface.

        Args:
            id (str): Unique identifier for the session or user (hashed or anonymized to ensure privacy).
            user_gender (str): Gender of the user.
            user_age (str): Age range of the user.
            user_persona (str): A descriptive persona of the user based on their interests and behaviors.
            ad_recommendation (str): A free-text description of ads relevant to the user.
            undesired_ads (str): A free-text or enumerated reference to ads the user does not wish to see.
            context (str): A summary of the context the ad is going to be in.
            num_ads (int): Number of ads to retrieve (must be >= 1).
            min_bid (float): Minimum bid for the ad placement (must be >= 0.01).
            session_id (Optional[str]): Session ID for tracking purposes.

        Returns:
            Dict: Contains the "advertiser_agents" key with a list of ads.
    """
    args_schema: Type[Ads4gptsInlineBannerInput] = Ads4gptsInlineBannerInput


class Ads4gptsSuggestedBannerTool(Ads4gptsBaseTool):
    name: str = "ads4gpts_suggested_banner"
    description: str = """
        Tool for retrieving Suggested Banner ads that can be recommended to users before or after a conversation.

        Args:
            id (str): Unique identifier for the session or user (hashed or anonymized to ensure privacy).
            user_gender (str): Gender of the user.
            user_age (str): Age range of the user.
            user_persona (str): A descriptive persona of the user based on their interests and behaviors.
            ad_recommendation (str): A free-text description of ads relevant to the user.
            undesired_ads (str): A free-text or enumerated reference to ads the user does not wish to see.
            context (str): A summary of the context the ad is going to be in.
            num_ads (int): Number of ads to retrieve (must be >= 1).
            min_bid (float): Minimum bid for the ad placement (must be >= 0.01).
            session_id (Optional[str]): Session ID for tracking purposes.

        Returns:
            Dict: Contains the "advertiser_agents" key with a list of ads.
    """
    args_schema: Type[Ads4gptsSuggestedBannerInput] = Ads4gptsSuggestedBannerInput


class Ads4gptsInlineReferralTool(Ads4gptsBaseTool):
    name: str = "ads4gpts_inline_referral"
    description: str = """
        Tool for retrieving Inline Referral ads that can be used to recommend products or services based on user conversations.

        Args:
            id (str): Unique identifier for the session or user (hashed or anonymized to ensure privacy).
            user_gender (str): Gender of the user.
            user_age (str): Age range of the user.
            user_persona (str): A descriptive persona of the user based on their interests and behaviors.
            ad_recommendation (str): A free-text description of ads relevant to the user.
            undesired_ads (str): A free-text or enumerated reference to ads the user does not wish to see.
            context (str): A summary of the context the ad is going to be in.
            num_ads (int): Number of ads to retrieve (must be >= 1).
            min_bid (float): Minimum bid for the ad placement (must be >= 0.01).
            session_id (Optional[str]): Session ID for tracking purposes.

        Returns:
            Dict: Contains the "advertiser_agents" key with a list of ads.
    """
    args_schema: Type[Ads4gptsInlineReferralInput] = Ads4gptsInlineReferralInput
