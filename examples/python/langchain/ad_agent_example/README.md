# ADS4GPTs Ad Agent

There are multiple ways that you can integrate Ads into your AI application with ADS4GPTs. And since we provide native LangChain support with the ads4gpts-langchain package this becomes super easy.

The most basic way to incorporate ADS4GPTs into your application is with our prebuilt Ad Agent.

### Prerequisites

- OpenAI API Key
- ADS4GPTs API Key (use the default_api_key to run the examples)

### How it works

- Import Ad agent from ads4gpts-langchain
- Instantiate Ad Agent with the the ADS4GPTs API Key
- Give context through "messages" and declare what kind of Ads you want in the ad_prompt
- Get Ad Tool output


