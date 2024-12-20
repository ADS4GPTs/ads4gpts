# ADS4GPTs Ad Agent Usage

There are multiple ways that you can integrate Ads into your AI application with ADS4GPTs. And since we provide native LangChain support with the ads4gpts-langchain package this becomes super easy.

The most basic way to incorporate ADS4GPTs into your application is with our prebuilt Ad Agent.

### Prerequisites

-   OpenAI API Key (but you can use any other provider)
-   ADS4GPTs API Key (use the default_api_key to run the examples)

### How it works

-   Import getADS4GPTsAgent from ads4gpts-langchain
-   Call getADS4GPTsAgent with an ADS4GPTs API key and an OpenAI API key to instantiate the ADS4GPTs Agent
-   Give context through "messages" and declare what kind of Ads you want in the ad_prompt
-   Get Ad Tool output

### Running the example

-   Clone the repo

```bash
git clone git@github.com:ADS4GPTs/ads4gpts.git
```

-   Navigate to the example's root folder

```bash
cd path/to/project/ads4gpts/examples/typescript/langchain/ad_agent_example
```

-   Install the example's dependencies

```bash
npm install
```

-   Create a .env file in the root directory and provide the appropriate values for the OPENAI_API_KEY and ADS4GPTS_API_KEY environment variables. Use the .env.example file as a reference template.

-   Run the example code

```bash
npm run example
```

You can view and modify the example code in the src/index.ts file to customize its functionality as needed.
