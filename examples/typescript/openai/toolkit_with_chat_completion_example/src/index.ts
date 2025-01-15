import {
    ADS4GPTsToolkit,
    ADS4GPTsBannerTool,
    ADS4GPTsChatTool,
} from 'ads4gpts-openai';

import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

// Initializes OpenAI API with key from environment variable OPENAI_API_KEY
const openai = new OpenAI();

async function ADS4GPTsToolkitExample() {
    // Initializes the ADS4GPTs toolkit with key from environment variable ADS4GPTS_API_KEY
    const adsToolkit = new ADS4GPTsToolkit();

    console.log(`
     ========================================================================
     =================== TOOLKIT USAGE IN CHAT COMPLETION ===================
     ========================================================================
     `);

    console.log(`
     =========================== WITH STREAM() ==============================
     ========================================================================
     `);
    const stream_toolkit_response = openai.beta.chat.completions.stream({
        model: 'gpt-4o-mini',
        // Use the toolkit's tools - make sure you set the proper tool type as argument
        tools: adsToolkit.getTools('stream'),
        messages: [
            {
                role: 'system',
                content: 'Please use the functions to get a relevant ad.',
            },
            {
                role: 'user',
                content:
                    'Get two banner ads for the context: "User is looking for GTM strategies".',
            },
        ],
    });

    const stream_toolkit_final_response =
        await stream_toolkit_response.finalChatCompletion();

    // Get the function arguments from the final response
    const stream_toolkit_args =
        stream_toolkit_final_response.choices[0].message.tool_calls[0].function
            .arguments;

    console.log(
        'Function args are: \n',
        JSON.stringify(stream_toolkit_args, null, 2)
    );

    /** Execute the proper tool with the retrieved args
     *
     * Use the toolkit's executeTool() method with the appropriate tool type
     * ("ads4gpts_chat_tool" or "ads4gpts_banner_tool") as the first argument
     * and the arguments retrieved from the final response as the second argument.
     */
    const stream_toolkit_execution_response = await adsToolkit.executeTool(
        'ads4gpts_banner_tool',
        JSON.parse(stream_toolkit_args)
    );
    console.log('\n'.repeat(2));
    console.log(
        '<=== Final response for toolkit with stream() for banner ads ===> \n \n',
        stream_toolkit_execution_response
    );

    console.log(`
     =========================== WITH CREATE() ==============================
     ========================================================================
     `);

    const toolkit_create_response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        // Use the toolkit's tools - make sure you set the proper tool type as argument
        tools: adsToolkit.getTools('stream'),
        messages: [
            {
                role: 'system',
                content: 'Please use the functions to get a relevant ad.',
            },
            {
                role: 'user',
                content:
                    'Get a chat ad for the context: "User is looking for GTM strategies".',
            },
        ],
        stream: true,
    });

    let toolkit_create_args = '';

    // Get the function arguments from the create() response chunk by chunk
    for await (const chunk of toolkit_create_response) {
        toolkit_create_args +=
            chunk.choices[0]?.delta?.tool_calls?.[0]?.function?.arguments || '';
    }
    console.log('Function args are: \n', toolkit_create_args);

    /** Execute the proper tool with the retrieved args
     *
     * Use the toolkit's executeTool() method with the appropriate tool type
     * ("ads4gpts_chat_tool" or "ads4gpts_banner_tool") as the first argument
     * and the arguments retrieved from the final response as the second argument.
     */
    const create_toolkit_execution_response = await adsToolkit.executeTool(
        'ads4gpts_chat_tool',
        JSON.parse(toolkit_create_args)
    );
    console.log('\n'.repeat(2));
    console.log(
        '<=== Final response for toolkit with create() for in chat ads ===> \n \n',
        create_toolkit_execution_response
    );

    console.log(`
        ========================== WITH RUNTOOLS() =============================
        ========================================================================
        `);

    const toolkit_runner = openai.beta.chat.completions
        .runTools({
            model: 'gpt-4o-mini',
            // Use the toolkit's tools - make sure you set the proper tool type as argument
            tools: adsToolkit.getTools('run-tool'),
            messages: [
                {
                    role: 'system',
                    content: 'Please use the functions to get a relevant ad.',
                },
                {
                    role: 'user',
                    content:
                        'Get a single banner ad for the context: "User is looking for GTM strategies".',
                },
            ],
        })
        .on('functionCallResult', (functionCallResult) =>
            console.log(
                '<=== Final response for toolkit with runTools() for in chat ads ===> \n \n',
                JSON.stringify(JSON.parse(functionCallResult), null, 2)
            )
        );

    await new Promise((resolve) => setTimeout(resolve, 3000));
}

async function ADS4GPTsToolExample() {
    // Initializes the ADS4GPTs tools with key from environment variable ADS4GPTS_API_KEY
    // Comment out if you want to use the banner tool
    const adsTool = new ADS4GPTsChatTool();

    // Uncomment if you want to use the banner tool
    // const adsTool = new ADS4GPTsBannerTool();

    console.log(`
     ========================================================================
     =============== STANDALONE TOOL USAGE IN CHAT COMPLETION ===============
     ========================================================================
     `);

    console.log(`
     =========================== WITH STREAM() ==============================
     ========================================================================
     `);
    const stream_tool_response = openai.beta.chat.completions.stream({
        model: 'gpt-4o-mini',
        // Use the initialized tool - make sure you set the proper tool type as argument
        tools: adsTool.getTool('stream'),
        messages: [
            {
                role: 'system',
                content: 'Please use the functions to get a relevant ad.',
            },
            {
                role: 'user',
                // Also tweak the content as needed if you would like to use banner ads instead
                content:
                    'Get two chat ads for the context: "User is looking for GTM strategies".',
            },
        ],
    });

    const stream_tool_final_response =
        await stream_tool_response.finalChatCompletion();

    // Get the function arguments from the final response
    const stream_tool_args =
        stream_tool_final_response.choices[0].message.tool_calls[0].function
            .arguments;

    console.log(
        'Function args are: \n',
        JSON.stringify(stream_tool_args, null, 2)
    );

    /** Execute the tool with the retrieved args
     *
     * Use the tool's execute() method with the arguments retrieved from the final response as argument
     */
    const stream_tool_execution_response = await adsTool.execute(
        JSON.parse(stream_tool_args)
    );
    console.log('\n'.repeat(2));
    console.log(
        '<=== Final response for Chat Ads tool with stream() ===> \n \n',
        stream_tool_execution_response
    );

    console.log(`
     =========================== WITH CREATE() ==============================
     ========================================================================
     `);

    const tool_create_response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        // Use the initialized tool - make sure you set the proper tool type as argument
        tools: adsTool.getTool('stream'),
        messages: [
            {
                role: 'system',
                content: 'Please use the functions to get a relevant ad.',
            },
            {
                role: 'user',
                // Also tweak the content as needed if you would like to use banner ads instead
                content:
                    'Get a chat ad for the context: "User is looking for GTM strategies".',
            },
        ],
        stream: true,
    });

    let tool_create_args = '';

    // Get the function arguments from the create() response chunk by chunk
    for await (const chunk of tool_create_response) {
        tool_create_args +=
            chunk.choices[0]?.delta?.tool_calls?.[0]?.function?.arguments || '';
    }
    console.log('Function args are: \n', tool_create_args);

    /** Execute the tool with the retrieved args
     *
     * Use the tool's execute() method with the arguments retrieved from the final response as argument
     */
    const create_tool_execution_response = await adsTool.execute(
        JSON.parse(tool_create_args)
    );
    console.log('\n'.repeat(2));
    console.log(
        '<=== Final response for Chat Ads tool with with create() ===> \n \n',
        create_tool_execution_response
    );

    console.log(`
        ========================== WITH RUNTOOLS() =============================
        ========================================================================
        `);

    const tool_runner = openai.beta.chat.completions
        .runTools({
            model: 'gpt-4o-mini',
            // Use the initialized tool - make sure you set the proper tool type as argument
            tools: adsTool.getTool('run-tool'),
            messages: [
                {
                    role: 'system',
                    content: 'Please use the functions to get a relevant ad.',
                },
                {
                    role: 'user',
                    // Also tweak the content as needed if you would like to use banner ads instead
                    content:
                        'Get a single chat ad for the context: "User is looking for GTM strategies".',
                },
            ],
        })
        .on('functionCallResult', (functionCallResult) =>
            console.log(
                '<=== Final response for Chat Ads tool with runTools() ===> \n \n',
                JSON.stringify(JSON.parse(functionCallResult), null, 2)
            )
        );
}

async function main() {
    await ADS4GPTsToolkitExample();
    await ADS4GPTsToolExample();
}

main();
