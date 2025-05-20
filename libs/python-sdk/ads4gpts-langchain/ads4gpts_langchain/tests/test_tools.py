import pytest
import os
from unittest.mock import patch, MagicMock
from ads4gpts_langchain.tools import (
    Ads4gptsInlineSponsoredResponseTool,
    Ads4gptsSuggestedPromptTool,
    Ads4gptsInlineConversationalTool,
    Ads4gptsInlineBannerTool,
    Ads4gptsSuggestedBannerTool,
    Ads4gptsBaseTool,
    Ads4gptsInlineReferralTool,
)
from ads4gpts_langchain.toolkit import Ads4gptsToolkit


@pytest.fixture
def base_tool():
    return Ads4gptsBaseTool(
        ads4gpts_api_key="test_api_key",
        base_url="https://ads-api-fp3g.onrender.com/",
        ads_endpoint="api/v1/ads",
    )


@pytest.fixture
def inline_sponsored_response_tool():
    return Ads4gptsInlineSponsoredResponseTool(
        ads4gpts_api_key="test_api_key",
        base_url="https://ads-api-fp3g.onrender.com/",
    )


@pytest.fixture
def suggested_prompts_tool():
    return Ads4gptsSuggestedPromptTool(
        ads4gpts_api_key="test_api_key",
        base_url="https://ads-api-fp3g.onrender.com/",
    )


@pytest.fixture
def toolkit():
    return Ads4gptsToolkit(
        ads4gpts_api_key="test_api_key",
        base_url="https://new_base_url.com",
        another_arg="value",
    )


def test_base_tool_initialization(base_tool):
    assert base_tool.ads4gpts_api_key == "test_api_key"
    assert base_tool.base_url == "https://ads-api-fp3g.onrender.com/"
    assert base_tool.ads_endpoint == "api/v1/ads"


@patch("ads4gpts_langchain.tools.get_ads")
def test_base_tool_run(mock_get_ads, base_tool):
    mock_get_ads.return_value = {"ads": "test_ad"}
    result = base_tool._run(
        id="test_id",
        user_gender="FEMALE",  # updated from "female"
        user_age_range="25-34",
        user_persona="test_persona",
        ad_recommendation="test_recommendation",
        undesired_ads="test_undesired_ads",
        context="test_context",
        num_ads=1,
        min_bid=0.5,
        session_id="test_session",
        tool_call_id="test_call_id",
    )
    mock_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}


@patch("ads4gpts_langchain.tools.async_get_ads")
@pytest.mark.asyncio
async def test_base_tool_arun(mock_async_get_ads, base_tool):
    mock_async_get_ads.return_value = {"ads": "test_ad"}
    result = await base_tool._arun(
        id="test_id",
        user_gender="FEMALE",  # updated from "female"
        user_age_range="25-34",
        user_persona="test_persona",
        ad_recommendation="test_recommendation",
        undesired_ads="test_undesired_ads",
        context="test_context",
        num_ads=1,
        min_bid=0.5,
        session_id="test_session",
        tool_call_id="test_call_id",
    )
    mock_async_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}


def test_inline_sponsored_response_tool_initialization(
    inline_sponsored_response_tool,
):
    assert inline_sponsored_response_tool.ads4gpts_api_key == "test_api_key"
    assert (
        inline_sponsored_response_tool.base_url == "https://ads-api-fp3g.onrender.com/"
    )
    assert inline_sponsored_response_tool.ads_endpoint == "api/v1/ads/"


@patch("ads4gpts_langchain.tools.get_ads")
def test_inline_sponsored_response_tool_run(
    mock_get_ads, inline_sponsored_response_tool
):
    mock_get_ads.return_value = {"ads": "test_ad"}
    result = inline_sponsored_response_tool._run(
        id="test_id",
        user_gender="FEMALE",  # updated from "female"
        user_age_range="25-34",
        user_persona="test_persona",
        ad_recommendation="test_recommendation",
        undesired_ads="test_undesired_ads",
        context="test_context",
        num_ads=1,
        min_bid=0.5,
        session_id="test_session",
        tool_call_id="test_call_id",
        ad_format="INLINE_SPONSORED_RESPONSE",
    )
    mock_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}


@patch("ads4gpts_langchain.tools.async_get_ads")
@pytest.mark.asyncio
async def test_inline_sponsored_response_tool_arun(
    mock_async_get_ads, inline_sponsored_response_tool
):
    mock_async_get_ads.return_value = {"ads": "test_ad"}
    result = await inline_sponsored_response_tool._arun(
        id="test_id",
        user_gender="FEMALE",  # updated from "female"
        user_age_range="25-34",
        user_persona="test_persona",
        ad_recommendation="test_recommendation",
        undesired_ads="test_undesired_ads",
        context="test_context",
        num_ads=1,
        min_bid=0.5,
        session_id="test_session",
        tool_call_id="test_call_id",
        ad_format="INLINE_SPONSORED_RESPONSE",
    )
    mock_async_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}


def test_suggested_prompts_tool_initialization(suggested_prompts_tool):
    assert suggested_prompts_tool.ads4gpts_api_key == "test_api_key"
    assert suggested_prompts_tool.base_url == "https://ads-api-fp3g.onrender.com/"
    assert suggested_prompts_tool.ads_endpoint == "api/v1/ads/"


def test_toolkit_initialization(toolkit):
    assert toolkit.ads4gpts_api_key == "test_api_key"
    assert toolkit.tool_args["base_url"] == "https://new_base_url.com"
    assert toolkit.tool_args["another_arg"] == "value"


def test_toolkit_get_tools(toolkit):
    tools = toolkit.get_tools()
    assert len(tools) == 6
    assert isinstance(tools[0], Ads4gptsInlineSponsoredResponseTool)
    assert isinstance(tools[1], Ads4gptsSuggestedPromptTool)
    assert isinstance(tools[2], Ads4gptsInlineConversationalTool)
    assert isinstance(tools[3], Ads4gptsInlineBannerTool)
    assert isinstance(tools[4], Ads4gptsSuggestedBannerTool)
    assert isinstance(tools[5], Ads4gptsInlineReferralTool)
    assert tools[0].base_url == "https://new_base_url.com"
    assert tools[1].base_url == "https://new_base_url.com"
    assert tools[2].base_url == "https://new_base_url.com"
    assert tools[3].base_url == "https://new_base_url.com"
    assert tools[4].base_url == "https://new_base_url.com"
    assert tools[5].base_url == "https://new_base_url.com"
    # Instead of asserting another_arg is set, verify it is not present:
    assert not hasattr(tools[0], "another_arg")
    assert not hasattr(tools[1], "another_arg")
    assert not hasattr(tools[2], "another_arg")
    assert not hasattr(tools[3], "another_arg")
    assert not hasattr(tools[4], "another_arg")
    assert not hasattr(tools[5], "another_arg")


@pytest.fixture
def toolkit_subset():
    tools = [
        "ads4gpts_inline_sponsored_response",
        "ads4gpts_suggested_prompt",
        "ads4gpts_inline_referral",
    ]
    return Ads4gptsToolkit(
        ads4gpts_api_key="test_api_key",
        tools=tools,
        base_url="https://new_base_url.com",
        another_arg="value",
    )


@pytest.fixture
def toolkit_render():
    tool_render_agents = {
        "ads4gpts_inline_sponsored_response": "render_agent_1",
        "ads4gpts_suggested_prompt": "render_agent_2",
        "ads4gpts_inline_referral": "render_agent_3",
    }
    return Ads4gptsToolkit(
        ads4gpts_api_key="test_api_key",
        tool_render_agents=tool_render_agents,
        base_url="https://new_base_url.com",
        another_arg="value",
    )


def test_toolkit_get_tools_subset(toolkit_subset):
    tools = toolkit_subset.get_tools()
    assert len(tools) == 3
    assert isinstance(tools[0], Ads4gptsInlineSponsoredResponseTool)
    assert isinstance(tools[1], Ads4gptsSuggestedPromptTool)
    assert isinstance(tools[2], Ads4gptsInlineReferralTool)


def test_toolkit_get_tools_with_render_agents(toolkit_render):
    tools = toolkit_render.get_tools()
    assert tools[0].ads4gpts_render_agent == "render_agent_1"
    assert tools[1].ads4gpts_render_agent == "render_agent_2"
    assert tools[2].ads4gpts_render_agent is None
    assert tools[3].ads4gpts_render_agent is None
    assert tools[4].ads4gpts_render_agent is None
    assert tools[5].ads4gpts_render_agent == "render_agent_3"


def test_toolkit_set_api_key_from_env():
    with patch.dict(os.environ, {"ADS4GPTS_API_KEY": "env_api_key"}):
        toolkit = Ads4gptsToolkit(
            ads4gpts_api_key=None,
            base_url="https://new_base_url.com",
            another_arg="value",
        )
        assert toolkit.ads4gpts_api_key == "env_api_key"


@pytest.fixture
def referral_tool():
    return Ads4gptsInlineReferralTool(
        ads4gpts_api_key="test_api_key",
        base_url="https://ads-api-fp3g.onrender.com/",
    )


def test_referral_tool_initialization(referral_tool):
    assert referral_tool.ads4gpts_api_key == "test_api_key"
    assert referral_tool.base_url == "https://ads-api-fp3g.onrender.com/"
    assert referral_tool.ads_endpoint == "api/v1/ads/"


@patch("ads4gpts_langchain.tools.get_ads")
def test_referral_tool_run(mock_get_ads, referral_tool):
    mock_get_ads.return_value = {"ads": "test_ad"}
    result = referral_tool._run(
        id="test_id",
        user_gender="FEMALE",
        user_age_range="25-34",
        user_persona="test_persona",
        ad_recommendation="test_recommendation",
        undesired_ads="test_undesired_ads",
        context="test_context",
        num_ads=1,
        min_bid=0.5,
        session_id="test_session",
        tool_call_id="test_call_id",
        ad_format="INLINE_REFERRAL",
    )
    mock_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}


@patch("ads4gpts_langchain.tools.async_get_ads")
@pytest.mark.asyncio
async def test_referral_tool_arun(mock_async_get_ads, referral_tool):
    mock_async_get_ads.return_value = {"ads": "test_ad"}
    result = await referral_tool._arun(
        id="test_id",
        user_gender="FEMALE",
        user_age_range="25-34",
        user_persona="test_persona",
        ad_recommendation="test_recommendation",
        undesired_ads="test_undesired_ads",
        context="test_context",
        num_ads=1,
        min_bid=0.5,
        session_id="test_session",
        tool_call_id="test_call_id",
        ad_format="INLINE_REFERRAL",
    )
    mock_async_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}
