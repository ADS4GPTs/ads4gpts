import pytest
from unittest.mock import patch, MagicMock
from ads4gpts_langchain.agent import get_ads4gpts_agent, get_ads4gpts_advertiser
from ads4gpts_langchain.utils import get_from_dict_or_env


@pytest.fixture
def mock_env_openai_api_key(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test_openai_api_key")


@pytest.fixture
def mock_env_ads4gpts_api_key(monkeypatch):
    monkeypatch.setenv("ADS4GPTS_API_KEY", "test_ads4gpts_api_key")


def test_get_ads4gpts_agent_success(mock_env_openai_api_key, mock_env_ads4gpts_api_key):
    with patch("ads4gpts_langchain.agent.ChatOpenAI") as mock_chat_openai, patch(
        "ads4gpts_langchain.agent.Ads4GPTsToolkit"
    ) as mock_toolkit, patch(
        "ads4gpts_langchain.agent.ads4gpts_agent_prompt"
    ) as mock_prompt:
        mock_llm = MagicMock()
        mock_chat_openai.return_value = mock_llm
        mock_toolkit_instance = MagicMock()
        mock_toolkit.return_value = mock_toolkit_instance
        mock_toolkit_instance.get_tools.return_value = ["tool1", "tool2"]
        mock_agent = MagicMock()
        mock_prompt.__or__.return_value = mock_agent

        agent = get_ads4gpts_agent()

        mock_chat_openai.assert_called_once_with(
            model="gpt-4o-mini", temperature=0.2, openai_api_key="test_openai_api_key"
        )
        mock_toolkit.assert_called_once_with(ads4gpts_api_key="test_ads4gpts_api_key")
        mock_toolkit_instance.get_tools.assert_called_once()
        mock_prompt.__or__.assert_called_once_with(
            mock_llm.bind_tools(["tool1", "tool2"])
        )
        assert agent == mock_agent


def test_get_ads4gpts_agent_missing_openai_api_key(mock_env_ads4gpts_api_key):
    with patch(
        "ads4gpts_langchain.agent.get_from_dict_or_env"
    ) as mock_get_from_dict_or_env:
        mock_get_from_dict_or_env.side_effect = ValueError("Missing API key")
        with pytest.raises(ValueError, match="Missing API key"):
            get_ads4gpts_agent()


def test_get_ads4gpts_agent_missing_ads4gpts_api_key(mock_env_openai_api_key):
    with patch(
        "ads4gpts_langchain.agent.get_from_dict_or_env"
    ) as mock_get_from_dict_or_env:
        mock_get_from_dict_or_env.side_effect = ValueError("Missing API key")
        with pytest.raises(ValueError, match="Missing API key"):
            get_ads4gpts_agent()


def test_get_ads4gpts_agent_other_exception(
    mock_env_openai_api_key, mock_env_ads4gpts_api_key
):
    with patch("ads4gpts_langchain.agent.ChatOpenAI") as mock_chat_openai:
        mock_chat_openai.side_effect = Exception("Initialization error")
        with pytest.raises(Exception, match="Initialization error"):
            get_ads4gpts_agent()


@pytest.fixture
def mock_env_openai_api_key(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test_openai_api_key")


def test_get_ads4gpts_advertiser_success(mock_env_openai_api_key):
    with patch("ads4gpts_langchain.agent.ChatOpenAI") as mock_chat_openai, patch(
        "ads4gpts_langchain.agent.ads4gpts_advertiser_prompt"
    ) as mock_prompt:
        mock_llm = MagicMock()
        mock_chat_openai.return_value = mock_llm
        mock_agent = MagicMock()
        mock_prompt.__or__.return_value = mock_agent

        agent = get_ads4gpts_advertiser()

        mock_chat_openai.assert_called_once_with(
            model="gpt-4o", temperature=0.2, openai_api_key="test_openai_api_key"
        )
        mock_prompt.__or__.assert_called_once_with(mock_llm)
        assert agent == mock_agent


def test_get_ads4gpts_advertiser_missing_api_key():
    with patch(
        "ads4gpts_langchain.agent.get_from_dict_or_env"
    ) as mock_get_from_dict_or_env:
        mock_get_from_dict_or_env.side_effect = ValueError("Missing API key")
        with pytest.raises(ValueError, match="Missing API key"):
            get_ads4gpts_advertiser()


def test_get_ads4gpts_advertiser_other_exception(mock_env_openai_api_key):
    with patch("ads4gpts_langchain.agent.ChatOpenAI") as mock_chat_openai:
        mock_chat_openai.side_effect = Exception("Initialization error")
        with pytest.raises(Exception, match="Initialization error"):
            get_ads4gpts_advertiser()
