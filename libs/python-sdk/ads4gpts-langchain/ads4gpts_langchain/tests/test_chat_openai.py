import unittest
from unittest.mock import patch, MagicMock
from langchain_openai import ChatOpenAI


class TestChatOpenAI(unittest.TestCase):
    def setUp(self):
        self.api_key = "test_openai_api_key"
        self.model = "gpt-4o-mini"
        self.temperature = 0.2
        self.llm = ChatOpenAI(
            model_name=self.model,  # Use model_name instead of model
            temperature=self.temperature,
            openai_api_key=self.api_key,  # Use openai_api_key instead of api_key
        )

    def test_llm_initialization(self):
        self.assertEqual(self.llm.model_name, self.model)
        self.assertEqual(self.llm.temperature, self.temperature)
        self.assertEqual(self.llm.openai_api_key, self.api_key)

    @patch("langchain_openai.ChatOpenAI.invoke")
    def test_invoke_method(self, mock_invoke):
        prompt = "Test prompt"
        mock_invoke.return_value = "Test response"

        response = self.llm.invoke(prompt)
        mock_invoke.assert_called_with(prompt)
        self.assertEqual(response, "Test response")


if __name__ == "__main__":
    unittest.main()
