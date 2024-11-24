import unittest
from unittest.mock import patch, MagicMock
from ads4gpts_langchain.toolkit import Ads4GPTsToolkit


class TestAds4GPTsToolkit(unittest.TestCase):
    def setUp(self):
        self.api_key = "test_ads4gpts_api_key"
        self.toolkit = Ads4GPTsToolkit(ads4gpts_api_key=self.api_key)

    def test_toolkit_initialization(self):
        self.assertEqual(self.toolkit.ads4gpts_api_key, self.api_key)

    def test_get_tools_returns_list(self):
        tools = self.toolkit.get_tools()
        self.assertIsInstance(tools, list)

    @patch("ads4gpts_langchain.toolkit.Ads4GPTsTool")
    def test_get_tools_contains_ads4gpts_tool(self, mock_tool):
        tools = self.toolkit.get_tools()
        mock_tool.assert_called_with(api_key=self.api_key)
        self.assertEqual(len(tools), 1)
        self.assertEqual(tools[0], mock_tool())


if __name__ == "__main__":
    unittest.main()
