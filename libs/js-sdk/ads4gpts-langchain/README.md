# ADS4GPTs Langchain JS

This is the Langchain JS toolkit for ADS4GPTs.

An npm Typescript package that integrates ADS4GPTs functionalities into applications built with Langchain JS, allowing for seamless retrieval of relevant advertisements based on contextual input.

---

## Table of Contents

-   [Introduction](#introduction)
-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Prerequisites](#prerequisites)
    -   [Environment Variables](#environment-variables)
    -   [Initialization](#initialization)
    -   [Examples](#examples)
-   [Contributing](#contributing)
-   [License](#license)
-   [Contact](#contact)

---

## Introduction

**Ads4GPTs LangChain JS Integration** is a Typescript package designed to seamlessly incorporate Ads4GPTs functionalities into your [LangChain JS](https://github.com/langchain-ai/langchainjs) applications. It provides tools and utilities to retrieve contextually relevant advertisements, leveraging the power of LangChain's agentic framework.

Whether you're building a chatbot, a recommendation system, or any application that can benefit from targeted ads, this package offers a robust and production-ready solution.

### Show Your Support

If you find our ADS4GPTs project helpful, please give it a star ⭐️

[![GitHub Stars](https://img.shields.io/github/stars/ADS4GPTs/ads4gpts?style=social)](https://github.com/ADS4GPTs/ads4gpts/stargazers)

---

## Features

-   **Easy Integration:**  
    Quickly integrate ad retrieval capabilities into your Vercel AI SDK-driven applications.
-   **Contextual Ad Retrieval:**  
    Fetch relevant ads based on the provided context to enhance user engagement.
-   **Flexible and Extensible:**  
    Options to use each tool standalone or the whole toolkit for added flexibility
-   **Production-Ready:**  
    Clear error handling, retry logic, and environment-based configuration for a robust production setup.
-   **Privacy-First**
    User data are provided not mined. You control what is being sent over.

---

## Installation

You can install the package directly from npm:

```bash
npm install ads4gpts-langchain
```

### From Source

Alternatively, you can install the package from source:

1. Clone the repository:

```bash
git clone https://github.com/ADS4GPTs/ads4gpts.git
```

2. Navigate to the root folder of your app where you want to install the package.
3. Install the package:

```bash
npm install path/to/project/ads4gpts/libs/js-sdk/ads4gpts-langchain
```

### Linking the package from source

To link the package's source with your app's project and reflect changes in real-time, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/ADS4GPTs/ads4gpts.git
```

2. Navigate to the package's directory:

```bash
cd ads4gpts/libs/js-sdk/ads4gpts-langchain
```

3. Link the package globally:

```bash
npm link
```

4. Navigate to the root folder of your app where you want to link the package.
5. Link the package to your app:

```bash
npm link ads4gpts-langchain
```

## Usage

### Prerequisites

-   Node.js 18.0.0+
-   (Optional) OpenAI Account and API Key
    -   In order to use the ads4gpts_agent you
    -   Sign up at OpenAI and obtain an API key.
-   ADS4GPTs API Key
    -   Obtain an API key for the ADS4GPTs service at https://ads4gpts.com/contact-us

### Environment Variables

The package requires certain environment variables for API authentication:

-   (Optional) OPENAI_API_KEY: Your OpenAI API key.
-   ADS4GPTS_API_KEY: Your ADS4GPTs API key.

Set them in your environment:

```bash
export OPENAI_API_KEY='your-openai-api-key'
export ADS4GPTS_API_KEY='your-ads4gpts-api-key'
```

Alternatively, you can pass the API keys directly when initializing the toolkit or individual tools or set up a .env file.

### Initialization

Import the necessary toolkit class or tools in your Typescript code:

```typescript
import {
    ADS4GPTsToolkit,
    ADS4GPTsChatTool,
    ADS4GPTsBannerTool,
    getADS4GPTsAgent,
} from 'ads4gpts-langchain';
```

### Examples

Example 1: Using the ADS4GPTs Toolkit

```typescript
import { ADS4GPTsToolkit } from 'ads4gpts-langchain';

// Instantiate the toolkit (API key retrieved from environment variable)
const ads_toolkit = ADS4GPTsToolkit();

// Get the array of tools from the toolkit
const ads_tools = ads_toolkit.getTools();

// Retrieve ads using one of the tools
const chatArgs = {
    context: 'Looking for the latest smartphone deals',
    num_ads: 1,
};
const ads = await ads_tools[0]._call(chatArgs);
console.log(ads);
```

Example 2: Using the tools Directly

```typescript
import { ADS4GPTsChatTool } from 'ads4gpts-langchain';

// Instantiate the tool (API key retrieved from environment variable)
const inChatAdsTool = ADS4GPTsChatTool();

// Retrieve ads
const chatArgs = {
    context: 'Looking for the latest smartphone deals',
    num_ads: 1,
};
const ads = await inChatAdsTool._call(chatArgs);
console.log(ads);
```

Examples for using them in your LangChain application exist in the examples folder of the parent repo.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the Repository: Click the "Fork" button at the top right of the repository page.
2. Clone Your Fork:

```bash
git clone git@github.com:ADS4GPTs/ads4gpts.git
```

3. Create a Branch:

```bash
git checkout -b feature/your-feature-name
```

4. Make Changes: Implement your feature or bug fix.
5. Run Tests: Ensure all tests pass.

```bash
npm run test
# Or to automatically rerun tests when files change.
npm run test:watch
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

This project is licensed under the License of the ADS4GPTs repository.

## Contact

-   Author: ADS4GPTs
-   Email: contact@ads4gpts.com
-   GitHub: @ads4gpts

For issues and feature requests, please use the GitHub issues page.
