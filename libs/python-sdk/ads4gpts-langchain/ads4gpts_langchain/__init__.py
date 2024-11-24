# Version: 0.1.1
"""
Ads4GPTs LangChain Integration Package
======================================

This package provides tools, toolkits, and agent initialization functions for integrating
Ads4GPTs functionalities into LangChain applications.

Modules:
- tools.py: Contains the Ads4GPTsTool class for ad retrieval.
- toolkit.py: Contains the Ads4GPTsToolkit class for grouping tools.
- agent.py: Contains the get_ads4gpts_agent function for agent initialization.

Usage:
```python
from ads4gpts_langchain import Ads4GPTsTool, Ads4GPTsToolkit, get_ads4gpts_agent

# Initialize the Ads4GPTs agent
agent = get_ads4gpts_agent(ads4gpts_api_key='your_api_key')
"""

import logging

# Configure package-level logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Stream handler for logging
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# Import public classes and functions
from .tools import Ads4GPTsTool
from .toolkit import Ads4GPTsToolkit
from .agent import get_ads4gpts_agent

# Define __all__ for explicit export
__all__ = [
    "Ads4GPTsTool",
    "Ads4GPTsToolkit",
    "get_ads4gpts_agent",
]
