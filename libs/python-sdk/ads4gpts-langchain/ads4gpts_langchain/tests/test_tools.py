import pytest
from unittest.mock import patch, MagicMock
from ads4gpts_langchain.tools import (
    Ads4gptsBaseTool,
    Ads4gptsInlineSponsoredResponseTool,
    Ads4gptsSuggestedPromptTool,
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
        user_gender="female",
        user_age="25-34",
        user_persona="test_persona",
        ad_recommendation="test_recommendation",
        undesired_ads="test_undesired_ads",
        context="test_context",
        num_ads=1,
        style="neutral",
    )
    mock_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}


@patch("ads4gpts_langchain.tools.async_get_ads")
@pytest.mark.asyncio
async def test_base_tool_arun(mock_async_get_ads, base_tool):
    mock_async_get_ads.return_value = {"ads": "test_ad"}
    result = await base_tool._arun(
        id="test_id",
        user_gender="female",
        user_age="25-34",
        user_persona="test_persona",
        ad_recommendation="test_recommendation",
        undesired_ads="test_undesired_ads",
        context="test_context",
        num_ads=1,
        style="neutral",
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
        user_gender="female",
        user_age="25-34",
        user_persona="test_persona",
        ad_recommendation="test_recommendation",
        undesired_ads="test_undesired_ads",
        context="test_context",
        num_ads=1,
        style="neutral",
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
        user_gender="female",
        user_age="25-34",
        user_persona="test_persona",
        ad_recommendation="test_recommendation",
        undesired_ads="test_undesired_ads",
        context="test_context",
        num_ads=1,
        style="neutral",
        ad_format="INLINE_SPONSORED_RESPONSE",
    )
    mock_async_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}


def test_suggested_prompts_tool_initialization(suggested_prompts_tool):
    assert suggested_prompts_tool.ads4gpts_api_key == "test_api_key"
    assert suggested_prompts_tool.base_url == "https://ads-api-fp3g.onrender.com/"
    assert suggested_prompts_tool.ads_endpoint == "api/v1/ads/"


@patch("ads4gpts_langchain.tools.get_ads")
def test_suggested_prompt_tool_run(mock_get_ads, suggested_prompts_tool):
    mock_get_ads.return_value = {"ads": "test_ad"}
    result = suggested_prompts_tool._run(
        id="test_id",
        user_gender="female",
        user_age="25-34",
        user_persona="test_persona",
        ad_recommendation="test_recommendation",
        undesired_ads="test_undesired_ads",
        context="test_context",
        num_ads=1,
        style="neutral",
        ad_format="SUGGESTED_PROMPT",
    )
    mock_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}


@patch("ads4gpts_langchain.tools.async_get_ads")
@pytest.mark.asyncio
async def test_suggested_prompts_tool_arun(mock_async_get_ads, suggested_prompts_tool):
    mock_async_get_ads.return_value = {"ads": "test_ad"}
    result = await suggested_prompts_tool._arun(
        id="test_id",
        user_gender="female",
        user_age="25-34",
        user_persona="test_persona",
        ad_recommendation="test_recommendation",
        undesired_ads="test_undesired_ads",
        context="test_context",
        num_ads=1,
        style="neutral",
        ad_format="SUGGESTED_PROMPT",
    )
    mock_async_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}


def test_toolkit_initialization(toolkit):
    assert toolkit.ads4gpts_api_key == "test_api_key"
    assert toolkit.tool_args["base_url"] == "https://new_base_url.com"
    assert toolkit.tool_args["another_arg"] == "value"


def test_toolkit_get_tools(toolkit):
    tools = toolkit.get_tools()
    assert len(tools) == 2
    assert isinstance(tools[0], Ads4gptsInlineSponsoredResponseTool)
    assert isinstance(tools[1], Ads4gptsSuggestedPromptTool)
    assert tools[0].base_url == "https://new_base_url.com"
    assert tools[1].base_url == "https://new_base_url.com"
    # Instead of asserting another_arg is set, verify it is not present:
    assert not hasattr(tools[0], "another_arg")
