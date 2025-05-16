import os
import logging
import inspect
from typing import List, Dict, Optional, Type

from langchain_core.tools import BaseTool, BaseToolkit
from pydantic import Field, model_validator, ValidationError
from ads4gpts_langchain.utils import get_from_dict_or_env
from ads4gpts_langchain.tools import (
    Ads4gptsInlineSponsoredResponseTool,
    Ads4gptsSuggestedPromptTool,
    Ads4gptsInlineConversationalTool,
    Ads4gptsInlineBannerTool,
    Ads4gptsSuggestedBannerTool,
    Ads4gptsInlineReferralTool,
)
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)


class Ads4gptsToolkit(BaseToolkit):
    ads4gpts_api_key: str = Field(
        default=None, description="API key for authenticating with the ads database."
    )
    tool_args: dict = Field(
        default_factory=dict, description="Arguments for the tools."
    )
    tools: Optional[List[str]] = Field(
        default=None,
        description="List of tool names to include. If None, all available tools are included.",
    )
    tool_render_agents: Optional[Dict[str, str]] = Field(
        default=None,
        description="Mapping of tool names to specific ads4gpts_render_agent values.",
    )

    # Move the registry of available tool classes to a class attribute.
    available_tool_classes: List[Type[BaseTool]] = [
        Ads4gptsInlineSponsoredResponseTool,
        Ads4gptsSuggestedPromptTool,
        Ads4gptsInlineConversationalTool,
        Ads4gptsInlineBannerTool,
        Ads4gptsSuggestedBannerTool,
        Ads4gptsInlineReferralTool,
    ]

    def __init__(
        self,
        ads4gpts_api_key: str,
        tools: Optional[List[str]] = None,
        tool_render_agents: Optional[Dict[str, str]] = None,
        **kwargs,
    ):
        if not ads4gpts_api_key:
            ads4gpts_api_key = os.environ.get("ADS4GPTS_API_KEY")
        if not ads4gpts_api_key:
            raise ValueError("ads4gpts_api_key is required")
        # Call the parent constructor to ensure proper initialization.
        super().__init__(ads4gpts_api_key=ads4gpts_api_key, **kwargs)
        self.ads4gpts_api_key = ads4gpts_api_key
        self.tool_args = kwargs
        # If tools is None, include all available tools.
        self.tools = tools
        # Dictionary mapping tool names to their specific render agents.
        self.tool_render_agents = tool_render_agents or {}

    def filter_tool_args(self, tool_class, args):
        """Filter the arguments to only include those accepted by the tool's __init__ method."""
        valid_fields = set(tool_class.model_fields.keys())
        return {k: v for k, v in args.items() if k in valid_fields}

    def get_tools(self) -> List[BaseTool]:
        """
        Returns a list of tools in the toolkit.
        If a subset of tool names is provided via the 'tools' parameter,
        only those tools will be instantiated.
        Each tool's 'ads4gpts_render_agent' is updated if specified.
        """
        tools_to_use = []
        for tool_class in self.available_tool_classes:
            # Instantiate the tool first
            tool_instance = tool_class(
                ads4gpts_api_key=self.ads4gpts_api_key,
                **self.filter_tool_args(tool_class, self.tool_args),
            )
            # Now filter based on the instance's name attribute
            if self.tools is not None and tool_instance.name not in self.tools:
                continue
            if tool_instance.name in self.tool_render_agents:
                tool_instance.ads4gpts_render_agent = self.tool_render_agents[
                    tool_instance.name
                ]
            tools_to_use.append(tool_instance)
        return tools_to_use
