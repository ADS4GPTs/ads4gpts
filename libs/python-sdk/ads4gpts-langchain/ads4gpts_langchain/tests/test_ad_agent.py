import unittest
from unittest.mock import patch, MagicMock
from langchain_openai import ChatOpenAI
from ads4gpts_langchain.toolkit import Ads4GPTsToolkit


class TestAdAgent(unittest.TestCase):
    def setUp(self):
        self.openai_api_key = "test_openai_api_key"
        self.ads4gpts_api_key = "test_ads4gpts_api_key"
        self.model = "gpt-4o-mini"
        self.temperature = 0.2
        self.ad_prompt = "This is a dummy context. It talks about Go To Market activities. Get a single Ad based on the context provided"

        self.llm = ChatOpenAI(
            model=self.model, temperature=self.temperature, api_key=self.openai_api_key
        )
        self.toolkit = Ads4GPTsToolkit(ads4gpts_api_key=self.ads4gpts_api_key)
        self.ad_agent = self.llm.bind_tools(self.toolkit.get_tools())

    @patch("langchain_openai.ChatOpenAI.invoke")
    def test_ad_generation(self, mock_invoke):
        mock_invoke.return_value = MagicMock(
            tool_calls=["Test tool call"], __str__=lambda x: "Generated Ad"
        )

        ad = self.ad_agent.invoke(self.ad_prompt)
        mock_invoke.assert_called_with(self.ad_prompt)
        self.assertEqual(str(ad), "Generated Ad")
        self.assertEqual(ad.tool_calls, ["Test tool call"])

    @patch("ads4gpts_langchain.toolkit.Ads4GPTsTool.invoke")
    def test_ads4gpts_tool_invoke(self, mock_tool_invoke):
        ad_response = MagicMock(tool_calls=["Test tool call"])
        ads4gpts_tool = self.toolkit.get_tools()[0]

        ads4gpts_tool.invoke(ad_response.tool_calls[0])
        mock_tool_invoke.assert_called_with("Test tool call")


if __name__ == "__main__":
    unittest.main()
