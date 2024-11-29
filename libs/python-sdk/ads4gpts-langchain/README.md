# Ads4GPTs Langchain Toolkit

This is the LangChain toolkit for Ads4GPTs.

A Python package that integrates Ads4GPTs functionalities into LangChain applications, allowing for seamless retrieval of relevant advertisements based on contextual input.

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Initialization](#initialization)
  - [Examples](#examples)
- [API Reference](#api-reference)
  - [Ads4GPTsTool](#ads4gptstool)
  - [Ads4GPTsToolkit](#ads4gptstoolkit)
  - [get_ads4gpts_agent Function](#get_ads4gpts_agent-function)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Introduction

**Ads4GPTs LangChain Integration** is a Python package designed to seamlessly incorporate Ads4GPTs functionalities into your LangChain applications. It provides tools and utilities to retrieve contextually relevant advertisements, leveraging the power of LangChain's agentic framework.

Whether you're building a chatbot, a recommendation system, or any application that can benefit from targeted ads, this package offers a robust and production-ready solution.

---

## Features

- **Easy Integration**: Quickly integrate ad retrieval capabilities into your LangChain agents.
- **Contextual Ad Retrieval**: Fetch relevant ads based on the provided context to enhance user engagement.
- **Asynchronous Support**: Both synchronous and asynchronous operations are supported for flexibility.
- **Robust Error Handling**: Comprehensive error handling and logging for reliable production deployments.

---

## Installation

### Using pip

You can install the package directly from PyPI:

```bash
pip install ads4gpts-langchain
```

### From Source

Alternatively, you can install the package from source:

``` bash
git clone https://github.com/ADS4GPTs/ads4gpts.git
cd ads4gpts/libs/python-sdk/ads4gpts-langchain
pip install .
```
## Usage

### Prerequisites

- Python 3.11+
- (Optional) OpenAI Account and API Key
  - In order to use the ads4gpts_agent you 
  - Sign up at OpenAI and obtain an API key.
- Ads4GPTs API Key
  - Obtain an API key for the Ads4GPTs service at https://www.ads4gpts.com


## Environment Variables

The package requires certain environment variables for API authentication:

- OPENAI_API_KEY: Your OpenAI API key.
- ADS4GPTS_API_KEY: Your Ads4GPTs API key.

Set them in your environment:
```bash
export OPENAI_API_KEY='your-openai-api-key'
export ADS4GPTS_API_KEY='your-ads4gpts-api-key'
```
Alternatively, you can pass the API keys directly when initializing classes or set up a .env file.

## Initialization

Import the necessary classes and functions in your Python script:

```python
from ads4gpts_langchain import Ads4GPTsTool, Ads4GPTsToolkit, get_ads4gpts_agent
```

## Examples

Example 1: Using Ads4GPTsTool Directly

```python
from ads4gpts_langchain import Ads4GPTsTool

# Instantiate the tool (API key retrieved from environment variable)
ads_tool = Ads4GPTsTool()

# Retrieve ads synchronously
ads = ads_tool._run(context="Looking for the latest smartphone deals", num_ads=2)
print(ads)

# Retrieve ads asynchronously
import asyncio

async def fetch_ads():
    ads = await ads_tool._arun(context="Best travel packages to Europe", num_ads=3)
    print(ads)

asyncio.run(fetch_ads())

from ads4gpts_langchain import Ads4GPTsToolkit

# Initialize the toolkit
toolkit = Ads4GPTsToolkit()

# Get the list of tools
tools = toolkit.get_tools()

# Use the tool from the toolkit
ads = tools[0]._run(context="Healthy recipes and cooking tips", num_ads=1)
print(ads)
```

Examples for using them in your LangChain and LangGraph application exist in the examples folder of the parent repo.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the Repository: Click the "Fork" button at the top right of the repository page.
2. Clone Your Fork:
```bash
git clone git@github.com:ADS4GPTs/ads4gpts.git
```
3. Create a Branch:
``` bash
git checkout -b feature/your-feature-name
```
4. Make Changes: Implement your feature or bug fix.
5. Run Tests: Ensure all tests pass.
```bash
pip install pytest pytest-asyncio
python -m unittest discover tests
```
Formal tests are still under development.
6. Commit Changes:
```bash
git commit -am 'Add your commit message here'
```
7. Push to Your Fork:
```bash
git push origin feature/your-feature-name
```
8. Open a Pull Request: Navigate to the original repository and click "New pull request".

## License

This project is licensed under the License of the Ads4GPTs repository.

## Contact

- Author: Ioannis Bakagiannis
- Email: contact@ads4gpts.com
- GitHub: @ads4gpts

For issues and feature requests, please use the GitHub issues page.


