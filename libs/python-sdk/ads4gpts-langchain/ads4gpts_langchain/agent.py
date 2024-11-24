import os
import logging
from typing import Optional

from langchain_openai import ChatOpenAI
from ads4gpts_langchain.toolkit import Ads4GPTsToolkit
from ads4gpts_langchain.prompts import ads4gpts_agent_prompt
from ads4gpts_langchain.utils import get_from_dict_or_env

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Stream handler for logging
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)


from util import get_from_env, get_from_dict_or_env


def get_ads4gpts_agent(*args, **kwargs):
    """
    Initialize and return the Ads4GPTs agent with the given API keys.

    Args:
        *args: Positional arguments (not used directly but maintained for extensibility).
        **kwargs: Keyword arguments for passing API keys and other optional parameters.

    Keyword Args:
        ads4gpts_api_key (str): API key for the Ads4GPTs service. If not provided, it will
                                attempt to retrieve it from the 'ADS4GPTS_API_KEY' environment variable.
        openai_api_key (str): API key for the OpenAI service. If not provided, it will
                              attempt to retrieve it from the 'OPENAI_API_KEY' environment variable.

    Returns:
        An initialized Ads4GPTs agent ready for use.

    Raises:
        ValueError: If required API keys are not provided or found in environment variables.
        Exception: If any other error occurs during initialization.
    """
    try:
        # Extract API keys from kwargs or environment variables
        openai_api_key = get_from_dict_or_env(
            kwargs, key="openai_api_key", env_key="OPENAI_API_KEY"
        )
        ads4gpts_api_key = get_from_dict_or_env(
            kwargs, key="ads4gpts_api_key", env_key="ADS4GPTS_API_KEY"
        )

        # Initialize the language model
        ads4gpts_agent_llm = ChatOpenAI(
            model="gpt-4o-mini", temperature=0.2, openai_api_key=openai_api_key
        )
        logger.info("ChatOpenAI model initialized successfully.")

        # Initialize the toolkit
        ads4gpts_toolkit = Ads4GPTsToolkit(ads4gpts_api_key=ads4gpts_api_key)
        tools = ads4gpts_toolkit.get_tools()
        logger.info("Ads4GPTsToolkit initialized and tools retrieved.")

        # Bind tools to the agent
        ads4gpts_agent = ads4gpts_agent_prompt | ads4gpts_agent_llm.bind_tools(tools)
        logger.info("Ads4GPTs agent created successfully.")

        return ads4gpts_agent

    except ValueError as e:
        logger.error(f"Missing API key: {e}")
        raise e
    except Exception as e:
        logger.error(f"Error initializing Ads4GPTs agent: {e}")
        raise e


# def get_ads4gpts_agent(ads4gpts_api_key: Optional[str] = None, openai_api_key: Optional[str] = None):
#     """
#     Initialize and return the Ads4GPTs agent with the given API keys.

#     Args:
#         ads4gpts_api_key (Optional[str]): API key for authenticating with the Ads4GPTs service.
#             If not provided, it will attempt to retrieve it from the 'ADS4GPTS_API_KEY' environment variable.

#     Returns:
#         An initialized Ads4GPTs agent ready for use.

#     Raises:
#         ValueError: If the required API keys are not provided or found in environment variables.
#         Exception: If any other error occurs during initialization.
#     """
#     try:
#         # Retrieve OpenAI API key from environment

#         if not openai_api_key:
#             openai_api_key = os.environ.get("OPENAI_API_KEY")
#             error_msg = "OPENAI_API_KEY environment variable is not set."
#             logger.error(error_msg)
#             raise ValueError(error_msg)

#         # Retrieve Ads4GPTs API key from argument or environment
#         if not ads4gpts_api_key:
#             ads4gpts_api_key = os.environ.get("ADS4GPTS_API_KEY")
#             if not ads4gpts_api_key:
#                 error_msg = "Ads4GPTs API key is required but not provided."
#                 logger.error(error_msg)
#                 raise ValueError(error_msg)

#         # Initialize the language model
#         ads4gpts_agent_llm = ChatOpenAI(
#             model="gpt-4", temperature=0.2, openai_api_key=openai_api_key
#         )
#         logger.info("ChatOpenAI model initialized successfully.")

#         # Initialize the toolkit
#         ads4gpts_toolkit = Ads4GPTsToolkit(ads4gpts_api_key=ads4gpts_api_key)
#         tools = ads4gpts_toolkit.get_tools()
#         logger.info("Ads4GPTsToolkit initialized and tools retrieved.")

#         # Bind tools to the agent
#         ads4gpts_agent = ads4gpts_agent_prompt | ads4gpts_agent_llm.bind_tools(tools)
#         logger.info("Ads4GPTs agent created successfully.")

#         return ads4gpts_agent

#     except Exception as e:
#         logger.error(f"Error initializing Ads4GPTs agent: {e}")
#         raise e  # Optionally re-raise the exception after logging
