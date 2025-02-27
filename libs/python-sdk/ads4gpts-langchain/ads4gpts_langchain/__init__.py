# Version: 0.1.1
"""
Ads4GPTs LangChain Integration Package
======================================

This package provides tools, toolkits, and agent initialization functions for integrating
Ads4GPTs functionalities into LangChain applications.

Modules:
- tools.py: Contains the Ads4GPTsBannerTool and Ads4GPTsChatTool classes for ad retrieval.
- toolkit.py: Contains the Ads4GPTsToolkit class for grouping tools.

Usage:
```python
from ads4gpts_langchain import Ads4gptsInlineSponsoredResponsesTool, Ads4gptsSuggestedPromptsTool, Ads4gptsToolkit
```


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
from .tools import Ads4gptsInlineSponsoredResponsesTool, Ads4gptsSuggestedPromptsTool
from .toolkit import Ads4gptsToolkit

# Define __all__ for explicit export
__all__ = [
    "Ads4gptsInlineSponsoredResponsesTool",
    "Ads4gptsSuggestedPromptsTool",
    "Ads4gptsToolkit",
]
