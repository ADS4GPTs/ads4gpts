# ADS4GPTs Toolkit Usage

There are multiple ways that you can integrate Ads into your AI application with ADS4GPTs. And since we provide native OpenAI support with the ads4gpts-openai package this becomes super easy.

One way that gives a lot of control to the developer is through the ADS4GPTs OpenAI Toolkit. This toolkit binds into the Chat LLM and can be called through the model.

### Prerequisites

-   ADS4GPTs API Key (use the default_api_key to run the examples)
-   OpenAI API Key

### How it works

-   Import ADS4GPTsToolkit from ads4gpts-openai
-   Instantiate ADS4GPTsToolkit with the the ADS4GPTs API Key
-   Run the toolkit and get the specified Ads!

### Running the example

-   Clone the repo

```bash
git clone git@github.com:ADS4GPTs/ads4gpts.git
```

-   Navigate to the example's root folder

```bash
cd path/to/project/ads4gpts/examples/typescript/openai/toolkit_with_chat_completion_example
```

-   Install the example's dependencies

```bash
npm install
```

-   Create a .env file in the root directory and provide the appropriate values for the OPENAI_API_KEY and ADS4GPTS_API_KEY environment variable. Use the .env.example file as a reference template.

-   Run the example code

```bash
npm run example
```

You can view and modify the example code in the src/index.ts file to customize its functionality as needed.
