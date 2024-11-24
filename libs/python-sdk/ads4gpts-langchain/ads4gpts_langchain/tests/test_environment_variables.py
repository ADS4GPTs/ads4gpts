import unittest
import os
from unittest.mock import patch


class TestEnvironmentVariables(unittest.TestCase):
    @patch.dict(os.environ, {}, clear=True)
    def test_ads4gpts_api_key_default(self):
        from ads4gpts_langchain.toolkit import Ads4GPTsToolkit

        ADS4GPTS_API_KEY = os.getenv("ADS4GPTS_API_KEY", "default_key")
        self.assertEqual(ADS4GPTS_API_KEY, "default_key")

        toolkit = Ads4GPTsToolkit(ads4gpts_api_key=ADS4GPTS_API_KEY)
        self.assertEqual(toolkit.ads4gpts_api_key, "default_key")

    @patch.dict(os.environ, {"ADS4GPTS_API_KEY": "env_ads4gpts_api_key"}, clear=True)
    def test_ads4gpts_api_key_from_env(self):
        from ads4gpts_langchain.toolkit import Ads4GPTsToolkit

        ADS4GPTS_API_KEY = os.getenv("ADS4GPTS_API_KEY", "default_key")
        self.assertEqual(ADS4GPTS_API_KEY, "env_ads4gpts_api_key")

        toolkit = Ads4GPTsToolkit(ads4gpts_api_key=ADS4GPTS_API_KEY)
        self.assertEqual(toolkit.ads4gpts_api_key, "env_ads4gpts_api_key")


if __name__ == "__main__":
    unittest.main()
