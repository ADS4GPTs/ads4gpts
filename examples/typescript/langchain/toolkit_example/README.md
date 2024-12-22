# ADS4GPTs Toolkit Usage

There are multiple ways that you can integrate Ads into your AI application with ADS4GPTs. And since we provide native LangChain support with the ads4gpts-langchain package this becomes super easy.

One way that gives a lot of control to the developer is through the ADS4GPTs LangChain Toolkit. This toolkit binds into the Chat LLM and can be called through the model.

### Prerequisites

-   ADS4GPTs API Key (use the default_api_key to run the examples)

### How it works

-   Import ADS4GPTsToolkit from ads4gpts-langchain
-   Instantiate ADS4GPTsToolkit with the the ADS4GPTs API Key
-   Run the toolkit and get the specified Ads!

### Running the example

-   Clone the repo

```bash
git clone git@github.com:ADS4GPTs/ads4gpts.git
```

-   Navigate to the example's root folder

```bash
cd path/to/project/ads4gpts/examples/typescript/langchain/toolkit_example
```

-   Install the example's dependencies

```bash
npm install
```

-   Create a .env file in the root directory and provide the appropriate values for the ADS4GPTS_API_KEY environment variable. Use the .env.example file as a reference template.

-   Run the example code

```bash
npm run example
```

You can view and modify the example code in the src/index.ts file to customize its functionality as needed.
