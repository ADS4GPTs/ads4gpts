# ADS4GPTs Vercel AI SDK Toolkit

This is the Vercel AI SDK toolkit for ADS4GPTs.

An npm package that integrates ADS4GPTs functionalities into applications built with Vercel AI SDK, allowing for seamless retrieval of relevant advertisements based on contextual input.

---

## Table of Contents

-   [Introduction](#introduction)
-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Prerequisites](#prerequisites)
    -   [Environment Variables](#environment-variables)
    -   [Initialization](#initialization)
    -   [System Prompt Templates](#system-prompt-templates)
    -   [Examples](#examples)
-   [Contributing](#contributing)
-   [License](#license)
-   [Contact](#contact)

---

## Introduction

**ADS4GPTs Vercel AI SDK Toolkit** is an npm package designed to seamlessly incorporate ADS4GPTs functionalities into your Vercel AI SDK based applications. It provides tools and utilities to retrieve contextually relevant advertisements, leveraging the power of Vercel AI SDK.

Whether you're building a chatbot or an Gen AI weather app and you want to monetize and grow through Ads, this package offers a robust and production-ready solution.

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

Install the package from npm:

```bash
npm install ads4gpts-vercelai
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
npm install path/to/project/ads4gpts/libs/js-sdk/vercelai
```

### Linking the package from source

To link the package's source with your app's project and reflect changes in real-time, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/ADS4GPTs/ads4gpts.git
```

2. Navigate to the package's directory:

```bash
cd ads4gpts/libs/js-sdk/vercelai
```

3. Link the package globally:

```bash
npm link
```

4. Navigate to the root folder of your app where you want to link the package.
5. Link the package to your app:

```bash
npm link ads4gpts-vercelai
```

## Usage

### Prerequisites

-   Node.js 18.0.0+
-   ADS4GPTs API Key
    -   Obtain an API key for the ADS4GPTs service at https://ads4gpts.com/contact-us

### Environment Variables

The package requires certain environment variables for API authentication:

-   ADS4GPTS_API_KEY: Your ADS4GPTs API key.

Set them in your environment:

```bash
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
} from 'ads4gpts-vercelai';
```

### System Prompt Templates

When using the ADS4GPTs Toolkit with Vercel AI SDK, it's essential to include a system prompt that aligns with the ad retrieval functionalities. This ensures the toolkit's tools operate correctly and return contextually relevant advertisements with the desired frequency and in chat integration.

To simplify the process, ADS4GPTs provides ready-to-use prompt templates as starting points. These templates are designed to help you quickly integrate or enhance your app's functionality with ADS4GPTs tools.
Available Prompt Templates:

-   [System prompt for Chat ads](https://raw.githubusercontent.com/ADS4GPTs/ads4gpts/refs/heads/main/libs/js-sdk/ads4gpts-vercelai/prompt_templates/chatAdSystemPrompt.txt):
    A template tailored for integrating contextually relevant chat-based advertisements.

-   [System prompt for Banner ads](https://raw.githubusercontent.com/ADS4GPTs/ads4gpts/refs/heads/main/libs/js-sdk/ads4gpts-vercelai/prompt_templates/bannerAdSystemPrompt.txt):
    A template for incorporating banner-style ads into your application.

Simply adapt these templates to your application's specific requirements and include them in your system prompt during initialization. Using these prompts ensures optimal ad performance and a seamless user experience.

### Examples

Example 1: Using the ADS4GPTs Toolkit

```typescript
import { ADS4GPTsToolkit} from 'ads4gpts-vercelai';

# Instantiate the toolkit (API key retrieved from environment variable)
const ads_toolkit = ADS4GPTsToolkit()

# Add to your streamText function call
const result = streamText({
        model: openai('gpt-4o'),
        system: systemPrompt,
        messages,
        tools: { ...ads_toolkit.getTools() },
    });
```

Example 2: Using the tools Directly

```typescript
import { ADS4GPTsChatTool } from 'ads4gpts-vercelai';

# Instantiate the tool (API key retrieved from environment variable)
const inChatAdsTool = ADS4GPTsChatTool()

# Add to your streamText function call
const result = streamText({
        model: openai('gpt-4o'),
        system: systemPrompt,
        messages,
        tools: { ads4gpts_chat_tool : inChatAdsTool },
    });
```

Examples for using them in your Vercel AI SDK applications exist in the examples folder of the parent repo.

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
