import os

import pytest
from unittest.mock import patch, MagicMock
from ads4gpts_langchain import Ads4GPTsTool, Ads4GPTsInput


@pytest.fixture
def ads4gpts_tool():
    """Fixture for initializing Ads4GPTsTool with mock API key."""
    return Ads4GPTsTool(ads4gpts_api_key="mock_api_key")


@pytest.fixture
def valid_input():
    """Fixture for providing valid input data."""
    return {"context": "test context", "num_ads": 2}


# Test API key initialization
def test_api_key_from_env(monkeypatch):
    """Test if the API key is correctly retrieved from environment variables."""
    monkeypatch.setenv("ADS4GPTS_API_KEY", "test_api_key")
    tool = Ads4GPTsTool()
    assert tool.ads4gpts_api_key == "test_api_key"


# Test synchronous get_ads method
@patch("ads4gpts_tool.requests.Session")
def test_get_ads_success(mock_session, ads4gpts_tool, valid_input):
    """Test successful retrieval of ads synchronously."""
    mock_response = MagicMock()
    mock_response.json.return_value = {
        "data": {"ads": [{"ad": "Ad Content 1"}, {"ad": "Ad Content 2"}]}
    }
    mock_response.raise_for_status = MagicMock()
    mock_session.return_value.post.return_value = mock_response

    result = ads4gpts_tool.get_ads(**valid_input)
    assert isinstance(result, list)
    assert len(result) == 2
    assert result[0]["ad"] == "Ad Content 1"


# Test synchronous get_ads method with error
@patch("ads4gpts_tool.requests.Session")
def test_get_ads_http_error(mock_session, ads4gpts_tool, valid_input):
    """Test HTTP error handling in get_ads method."""
    mock_response = MagicMock()
    mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("Error")
    mock_session.return_value.post.return_value = mock_response

    result = ads4gpts_tool.get_ads(**valid_input)
    assert "error" in result
    assert result["error"] == "Error"


# Test asynchronous _async_get_ads method
@patch("ads4gpts_tool.httpx.AsyncClient")
@pytest.mark.asyncio
async def test_async_get_ads_success(mock_async_client, ads4gpts_tool, valid_input):
    """Test successful retrieval of ads asynchronously."""
    mock_response = MagicMock()
    mock_response.json.return_value = {
        "data": {"ads": [{"ad": "Ad Content 1"}, {"ad": "Ad Content 2"}]}
    }
    mock_response.raise_for_status = MagicMock()
    mock_async_client.return_value.post.return_value = mock_response

    result = await ads4gpts_tool._async_get_ads(**valid_input)
    assert isinstance(result, list)
    assert len(result) == 2
    assert result[0]["ad"] == "Ad Content 1"


# Test asynchronous _async_get_ads method with retry
@patch("ads4gpts_tool.httpx.AsyncClient")
@pytest.mark.asyncio
async def test_async_get_ads_retry(mock_async_client, ads4gpts_tool, valid_input):
    """Test retry logic in asynchronous method."""
    mock_response = MagicMock()
    mock_response.raise_for_status.side_effect = [
        httpx.RequestError("Temporary error"),
        None,
    ]
    mock_response.json.return_value = {"data": {"ads": [{"ad": "Ad Content"}]}}
    mock_async_client.return_value.post.return_value = mock_response

    result = await ads4gpts_tool._async_get_ads(**valid_input)
    assert isinstance(result, dict)
    assert result["ad"] == "Ad Content"


# Test schema validation
def test_args_schema_validation(ads4gpts_tool):
    """Test if input schema validation works correctly."""
    input_data = {"context": "test", "num_ads": 0}  # Invalid num_ads
    with pytest.raises(ValueError):
        ads4gpts_tool.args_schema(**input_data)


# Test description and name
def test_tool_metadata(ads4gpts_tool):
    """Test the tool's metadata."""
    assert ads4gpts_tool.name == "ads4gpts_tool"
    assert "Tool for retrieving relevant ads" in ads4gpts_tool.description
