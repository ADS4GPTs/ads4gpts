# ADS4GPTs Toolkit Usage

There are multiple ways that you can integrate Ads into your AI application with ADS4GPTs. And since we provide native LangChain support with the ads4gpts-langchain package this becomes super easy.

One way that gives a lot of control to the developer is through the ADS4GPTs LangChain Toolkit. This toolkit binds into the Chat LLM and can be called through the model.

### Prerequisites

- OpenAI API Key (but you can use any other provider)
- ADS4GPTs API Key (use the default_api_key to run the examples)

### How it works

- Import Ads4GPTsToolkit from ads4gpts-langchain
- Instantiate Ads4GPTsToolkit with the the ADS4GPTs API Key
- Bind the toolkit to the model of your choice
- Give a prompt to the model requesting for Ads
- Run the toolkit and get the specified Ads!


