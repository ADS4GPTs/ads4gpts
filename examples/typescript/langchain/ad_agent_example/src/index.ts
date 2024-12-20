// install the example's dependencies
// npm install

// Import the ADS4GPTs Agent
import { getADS4GPTsAgent } from 'ads4gpts-langchain';
import { ADS4GPTsBannerTool } from 'ads4gpts-langchain';

const testADS4GPTsToolkit = async () => {
    try {
        // Initialize the Agent with an ADS4GPTs API key and an OpenAI API key from environment variables
        const adsAgent = await getADS4GPTsAgent();

        const adInput = {
            messages: [
                'Context here. Dummy context for this example: Advertising practices',
            ],
            ad_prompt:
                'Generate a single Banner Ad based on the context provided.',
        };
        // Invoke the Agent with a prompt
        const response = await adsAgent.invoke(adInput);

        // Retrieve the tool call from the response
        const toolCalls = response.tool_calls;

        if (!toolCalls || toolCalls.length === 0)
            throw new Error('No tool calls found in the response');

        console.log(`The ADS4GPTs Agent tool calls are: \n\n`, toolCalls);

        // Call the appropriate tools using the args from the model's response
        // As instructed by the prompt, the Agent is calling the ads4gpts_banner_tool, so we will use that one
        const toolArgs = toolCalls[0].args;

        // Initialize the Banner Tool with an ADS4GPTs API key from environment variables
        const bannerTool = new ADS4GPTsBannerTool();

        // Call the Banner Tool with the toolArgs
        const ads = await bannerTool._call(toolArgs);
        console.log('\n Retrieved Ad is: \n\n', ads);

        return;
    } catch (e: any) {
        console.error(`Error while testing ADS4GPTs Agent : ${e.message}`);
    }
};

testADS4GPTsToolkit();
