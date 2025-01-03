// install the example's dependencies
// npm install

// Import the ADS4GPTs toolkit
import { ADS4GPTsToolkit } from 'ads4gpts-langchain';

const testADS4GPTsToolkit = async () => {
    try {
        // Initialize the toolkit with an ADS4GPTs API key from environment variables
        const ads4GPTsToolkit = new ADS4GPTsToolkit();

        // Get the tools from the toolkit
        const ads4gptsTools = ads4GPTsToolkit.getTools();

        // Retrieve ads using one of the tools
        const chatArgs = {
            context: 'Looking for the latest smartphone deals',
            num_ads: 2,
        };

        const index = 0;
        const ads = await ads4gptsTools[index]._call(chatArgs);
        console.log(
            `The ADS4GPTs toolkit's ${ads4gptsTools[
                index
            ].getName()} tool returned the following ads: \n\n`,
            ads
        );

        return;
    } catch (e: any) {
        console.error(`Error while testing ADS4GPTs Toolkit : ${e.message}`);
    }
};

testADS4GPTsToolkit();
