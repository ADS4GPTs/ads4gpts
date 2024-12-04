import pytest
from unittest.mock import patch, MagicMock
from ads4gpts_langchain.tools import (
    Ads4GPTsBaseTool,
    Ads4GPTsBannerTool,
    Ads4GPTsChatTool,
)


@pytest.fixture
def base_tool():
    return Ads4GPTsBaseTool(
        ads4gpts_api_key="test_api_key",
        base_url="https://ads-api-fp3g.onrender.com",
        ads_endpoint="/api/v1/ads",
    )


@pytest.fixture
def banner_tool():
    return Ads4GPTsBannerTool(
        ads4gpts_api_key="test_api_key",
        base_url="https://ads-api-fp3g.onrender.com",
    )


@pytest.fixture
def chat_tool():
    return Ads4GPTsChatTool(
        ads4gpts_api_key="test_api_key",
        base_url="https://ads-api-fp3g.onrender.com",
    )


def test_base_tool_initialization(base_tool):
    assert base_tool.ads4gpts_api_key == "test_api_key"
    assert base_tool.base_url == "https://ads-api-fp3g.onrender.com"
    assert base_tool.ads_endpoint == "/api/v1/ads"


def test_banner_tool_initialization(banner_tool):
    assert banner_tool.ads4gpts_api_key == "test_api_key"
    assert banner_tool.base_url == "https://ads-api-fp3g.onrender.com"
    assert banner_tool.ads_endpoint == "/api/v1/banner_ads"


@patch("ads4gpts_langchain.tools.get_ads")
def test_banner_tool_run(mock_get_ads, banner_tool):
    mock_get_ads.return_value = {"ads": "test_ad"}
    result = banner_tool._run(context="test_context", num_ads=1)
    mock_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}


@patch("ads4gpts_langchain.tools.async_get_ads")
@pytest.mark.asyncio
async def test_banner_tool_arun(mock_async_get_ads, banner_tool):
    mock_async_get_ads.return_value = {"ads": "test_ad"}
    result = await banner_tool._arun(context="test_context", num_ads=1)
    mock_async_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}


def test_chat_tool_initialization(chat_tool):
    assert chat_tool.ads4gpts_api_key == "test_api_key"
    assert chat_tool.base_url == "https://ads-api-fp3g.onrender.com"
    assert chat_tool.ads_endpoint == "/api/v1/chat_ads"


@patch("ads4gpts_langchain.tools.get_ads")
def test_chat_tool_run(mock_get_ads, chat_tool):
    mock_get_ads.return_value = {"ads": "test_ad"}
    result = chat_tool._run(context="test_context", num_ads=1)
    mock_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}


@patch("ads4gpts_langchain.tools.async_get_ads")
@pytest.mark.asyncio
async def test_chat_tool_arun(mock_async_get_ads, chat_tool):
    mock_async_get_ads.return_value = {"ads": "test_ad"}
    result = await chat_tool._arun(context="test_context", num_ads=1)
    mock_async_get_ads.assert_called_once()
    assert result == {"ads": "test_ad"}

    @pytest.fixture
    def base_tool():
        return Ads4GPTsBaseTool(
            ads4gpts_api_key="test_api_key",
            base_url="https://ads-api-fp3g.onrender.com",
            ads_endpoint="/api/v1/ads",
            name="ads4gpts_base_tool",
            description="Base tool for retrieving ads.",
        )

    @pytest.fixture
    def banner_tool():
        return Ads4GPTsBannerTool(
            ads4gpts_api_key="test_api_key",
            base_url="https://ads-api-fp3g.onrender.com",
            name="ads4gpts_banner_tool",
            description="Tool for retrieving banner ads.",
        )

    @pytest.fixture
    def chat_tool():
        return Ads4GPTsChatTool(
            ads4gpts_api_key="test_api_key",
            base_url="https://ads-api-fp3g.onrender.com",
            name="ads4gpts_chat_tool",
            description="Tool for retrieving chat ads.",
        )

    def test_base_tool_initialization(base_tool):
        assert base_tool.ads4gpts_api_key == "test_api_key"
        assert base_tool.base_url == "https://ads-api-fp3g.onrender.com"
        assert base_tool.ads_endpoint == "/api/v1/ads"
        assert base_tool.name == "ads4gpts_base_tool"
        assert base_tool.description == "Base tool for retrieving ads."

    @patch("ads4gpts_langchain.tools.get_ads")
    def test_base_tool_run(mock_get_ads, base_tool):
        mock_get_ads.return_value = {"ads": "test_ad"}
        result = base_tool._run(context="test_context", num_ads=1)
        mock_get_ads.assert_called_once()
        assert result == {"ads": "test_ad"}

    @patch("ads4gpts_langchain.tools.async_get_ads")
    @pytest.mark.asyncio
    async def test_base_tool_arun(mock_async_get_ads, base_tool):
        mock_async_get_ads.return_value = {"ads": "test_ad"}
        result = await base_tool._arun(context="test_context", num_ads=1)
        mock_async_get_ads.assert_called_once()
        assert result == {"ads": "test_ad"}
