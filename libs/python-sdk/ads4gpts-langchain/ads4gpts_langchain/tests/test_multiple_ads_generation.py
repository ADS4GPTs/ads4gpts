import unittest
from unittest.mock import patch, MagicMock
from langchain_openai import ChatOpenAI
from ads4gpts_langchain.toolkit import Ads4GPTsToolkit


class TestMultipleAdsGeneration(unittest.TestCase):
    def setUp(self):
        self.openai_api_key = "test_openai_api_key"
        self.ads4gpts_api_key = "test_ads4gpts_api_key"
        self.model = "gpt-4o-mini"
        self.temperature = 0.2
        self.ad_prompt_two_ads = "This is a dummy context. It talks about Go To Market activities. Get two Ads based on the context provided"

        self.llm = ChatOpenAI(
            model=self.model, temperature=self.temperature, api_key=self.openai_api_key
        )
        self.toolkit = Ads4GPTsToolkit(ads4gpts_api_key=self.ads4gpts_api_key)
        self.ad_agent = self.llm.bind_tools(self.toolkit.get_tools())

    @patch("langchain_openai.ChatOpenAI.invoke")
    def test_two_ads_generation(self, mock_invoke):
        mock_invoke.return_value = MagicMock(
            tool_calls=["Test tool call 1", "Test tool call 2"],
            __str__=lambda x: "Generated Ad 1\nGenerated Ad 2",
        )

        two_ads = self.ad_agent.invoke(self.ad_prompt_two_ads)
        mock_invoke.assert_called_with(self.ad_prompt_two_ads)
        self.assertEqual(str(two_ads), "Generated Ad 1\nGenerated Ad 2")
        self.assertEqual(two_ads.tool_calls, ["Test tool call 1", "Test tool call 2"])

    @patch("ads4gpts_langchain.toolkit.Ads4GPTsTool.invoke")
    def test_ads4gpts_tool_multiple_invokes(self, mock_tool_invoke):
        two_ads_response = MagicMock(
            tool_calls=["Test tool call 1", "Test tool call 2"]
        )
        ads4gpts_tool = self.toolkit.get_tools()[0]

        for tool_call in two_ads_response.tool_calls:
            ads4gpts_tool.invoke(tool_call)

        calls = [
            unittest.mock.call("Test tool call 1"),
            unittest.mock.call("Test tool call 2"),
        ]
        mock_tool_invoke.assert_has_calls(calls, any_order=False)


if __name__ == "__main__":
    unittest.main()
