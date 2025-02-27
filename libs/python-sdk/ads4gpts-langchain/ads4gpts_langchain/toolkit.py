import os
import logging
from typing import List, Any, Dict, Union, Optional

from langchain_core.tools import BaseTool, BaseToolkit
from pydantic import Field, model_validator, ValidationError
from ads4gpts_langchain.tools import (
    Ads4gptsInlineSponsoredResponsesTool,
    Ads4gptsSuggestedPromptsTool,
)
from ads4gpts_langchain.utils import get_from_dict_or_env

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Stream handler for logging
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)


class Ads4gptsToolkit(BaseToolkit):
    ads4gpts_api_key: str = Field(
        default=None, description="API key for authenticating with the ads database."
    )

    @model_validator(mode="before")
    def set_api_key(cls, values):
        """Validate and set the API key from input or environment."""
        api_key = values.get("ads4gpts_api_key")
        if not api_key:
            try:
                api_key = get_from_dict_or_env(
                    values, "ads4gpts_api_key", "ADS4GPTS_API_KEY"
                )
                values["ads4gpts_api_key"] = api_key
            except ValueError as e:
                logger.error(f"Error retrieving API key: {e}")
                raise ValueError("ads4gpts_api_key is required")
        return values

    def get_tools(self) -> List[BaseTool]:
        """
        Returns a list of tools in the toolkit.
        """
        try:
            ads4gpts_inline_sponsored_responses_tool = (
                Ads4gptsInlineSponsoredResponsesTool(
                    ads4gpts_api_key=self.ads4gpts_api_key
                )
            )
            ads4gpts_suggested_prompts_tool = Ads4gptsSuggestedPromptsTool(
                ads4gpts_api_key=self.ads4gpts_api_key
            )
            return [
                ads4gpts_inline_sponsored_responses_tool,
                ads4gpts_suggested_prompts_tool,
            ]
        except Exception as e:
            logger.error(f"Error initializing Ads4GPTs Tools: {e}")
            return []
