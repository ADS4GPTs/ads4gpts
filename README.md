<h3 align="center">
  <a name="readme-top"></a>
  <img
    src="https://cdn.prod.website-files.com/673d9c01098f16900da8bc69/673d9e478727677924833f4d_Ads4GPTs%20Wordlogo%20Large.png"
    height="200"
  >
</h3>
<div align="center">
<a href="https://GitHub.com/ADS4GPTs/ads4gpts/graphs/contributors">
  <img src="https://img.shields.io/github/contributors/ADS4GPTs/ads4gpts.svg" alt="GitHub Contributors">
</a>
<a href="https://ads4gpts.com">
  <img src="https://img.shields.io/badge/Visit-ads4gpts.com-orange" alt="Visit ads4gpts.com">
</a>
</div>

# Ads4GPTs

A comprehensive monorepo for Ads4GPTs, providing SDKs and integrations for both Python and JavaScript/TypeScript. This monorepo includes support for AI frameworks like LangChain, OpenAI (implemented), Anthropic, LlamaIndex and others (coming soon). Extensive examples are available in the `/examples` folder, and frontend components for displaying ads are provided in the `/frontend` folder, built with React and Tailwind CSS.

---

## Table of Contents

- [Introduction](#introduction)
- [Join our Network](#join-our-network)
- [Repository Structure](#repository-structure)
- [Installation](#installation)
  - [Installing Individual Packages](#installing-individual-packages)
- [Usage](#usage)
  - [Python SDKs](#python-sdks)
  - [JavaScript/TypeScript SDKs](#javascripttypescript-sdks)
- [AI Frameworks](#ai-framework)
  - [LangChain](#langchain)
  - [LlamaIndex (Coming Soon)](#llamaindex-coming-soon)
- [Examples](#examples)
- [Frontend Components](#frontend-components)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Introduction

**Ads4GPTs** is a platform that enables developers to integrate contextually relevant advertisements into their applications effortlessly. By leveraging advanced AI models and popular frameworks, Ads4GPTs ensures that ads are meaningful and engaging to users.

This monorepo hosts multiple SDKs and integrations for both Python and JavaScript (coming soon), organized in a way that each package can be installed separately. The monorepo itself is not meant to be installed as a whole.

## Join our Network

AI, LLM and GPT applications can apply to join our network AI, LLM, and GPT application developers are invited to join our network by visiting our website at https://www.ads4gpts.com. Discover how our platform can help you integrate tailored advertising solutions designed specifically for AI-driven applications through our website at https://www.ads4gpts.com/contact-us 

## Repository Structure

```bash
ads4gpts/
├── libs/
│   ├── custom-gpts-openapi/         # Integration with OpenAI's Custom GPTs through Actions
│   ├── python-sdk/
│   │   ├── ads4gpts-langchain/      # LangChain integration for Python (implemented)
│   │   ├── ads4gpts-openai/         # Native OpenAI integration for Python (coming soon)
│   │   └── ads4gpts-llama-index/    # LlamaIndex integration for Python (coming soon)
│   ├── js-sdk/
│   │   ├── ads4gpts-langchain/      # LangChain integration for JavaScript/TypeScript (coming soon)
│   │   ├── ads4gpts-openai/         # Native OpenAI integration for JavaScript/TypeScript (coming soon)
│   │   └── ads4gpts-llama-index/    # LlamaIndex integration for JavaScript/TypeScript (coming soon)
├── examples/                        # Extensive examples for SDKs and integrations
├── frontend/                        # React components with Tailwind CSS for displaying ads (coming soon)
├── README.md                        # Project documentation
└── LICENSE                          # Licensing information
```

## Installation

### Installing Individual Packages

Each SDK or integration is located within its respective directory under `libs/`. To use any of the packages, navigate to its directory and follow the instruction details.

## Usage

You will find usage guides in each package folder within the monorepo.

## AI Frameworks

### LangChain / LangGraph
The LangChain integration for Ads4GPTs allows you to incorporate ad retrieval seamlessly within LangChain and LangGraph agents.

#### Python Package
Location: /libs/python-sdk/ads4gpts-langchain

#### JavaScript/TypeScript Package
Location: /libs/js-sdk/ads4gpts-langchain (Not implemented - In roadmap)

## Examples

Extensive examples are available in the /examples directory, demonstrating how to use the SDKs and integrations in various scenarios.

## Frontend Components

The /frontend directory contains React components styled with Tailwind CSS for displaying ads retrieved using Ads4GPTs.

## Contributing

Contributions are welcome! Please follow the guides in each package library within the monorepo.

## License

This project is licensed under the License of the Ads4GPTs repository.

## Contact

- Author: Ioannis Bakagiannis
- Email: contact@ads4gpts.com
- GitHub: @blackbak

For issues and feature requests, please use the GitHub issues page.


