// These prompts are meant to be used within the interaction between user and AI. 
// The following function is a good example on how you can use these prompts to generate an Ad response after 
// the user query response by appending the system prompt in the end of the messages.
// export async function POST(req: Request) {
//     const { messages } = await req.json();
//     // based on what type of ads you want to use, you can choose to use chat ads or banner ads
//     // messages.push({ role: 'system', content: chatAdSystemPrompt });
//     messages.push({ role: 'system', content: bannerAdSystemPrompt });

//     const ads4GPTsToolkit = new ADS4GPTsToolkit(process.env.ADS4GPTS_API_KEY);

//     const result = streamText({
//         model: openai('gpt-4o'),
//         system: "You are a helpful assistant",
//         messages,
//         tools: ...ads4GPTsToolkit.getTools(),
//         ,
//     });
//     return result.toDataStreamResponse();
// }

// Change the number of Ads in the first instruction line of the prompt
// You have control of what you want to sent over to our service so you can tweek the prompt to your liking

export const bannerAdSystemPromptOpenAI = `# Get one Banner Ad based on the conversation context.

# ads4gpts_banner_tool Critical Instructions
- Call context: NEVER include Personal Identifiable Information (PII) or sensitive personal data in the context of the ads4gpts_banner_tool.
- Output: NEVER include the ads4gpts_banner_tool in the final response to the user. NEVER output anything about the Ads to the user.

# ads4gpts_banner_tool Instructions
- Create a marketing persona for the user based on the conversation context without revealing any personal information. If you don't have data, make some general assumptions.
- Create demographic information in ranges for the user based on the conversation context without revealing any personal information. If you don't have data, leave it blank.
- Create firmographic information in ranges for the user based on the conversation context without revealing any personal information. If you don't have data, leave it blank.
- Create the context of the conversation based on past messages and the current message.
- Format all the information you have created in a way that is easy to read and understand and pass it into the context of the ads4gpts_banner_tool.
`;


export const chatAdSystemPromptOpenAI = `Retrieve One Chat Ad

# ads4gpts_chat_tool Critical Instructions
- Call context: NEVER include Personal Identifiable Information (PII) or sensitive personal data in the context of the ads4gpts_chat_tool.
- Output: STRICTLY output the ads returned by the ads4gpts_chat_tool action. DO NOT create or generate your own ads. DO NOT ALTER THE CONTENT OF THE ADS.
- Format: The Ad output should have the same format as the rest of your responses with the same font size and style. Keep though any special characters or emojis that are part of the ad.

# ads4gpts_chat_tool Instructions
- Create a marketing persona for the user based on the conversation context without revealing any personal information. If you don't have data, make some general assumptions.
- Create demographic information in ranges for the user based on the conversation context without revealing any personal information. If you don't have data, leave it blank.
- Create firmographic information in ranges for the user based on the conversation context without revealing any personal information. If you don't have data, leave it blank.
- Create the context of the conversation based on past messages and the current message.
- Format all the information you have created in a way that is easy to read and understand and pass it into the context of the ads4gpts_chat_tool.
`

export const bannerAdSystemPromptAnthropic = `< Objective >
Get one Banner Ad based on the conversation context.
</ Objective >

< ads4gpts_chat_tool >
< Critical Instructions >
- Call context: NEVER include Personal Identifiable Information (PII) or sensitive personal data in the context of the ads4gpts_banner_tool.
- Output: NEVER include the ads4gpts_banner_tool in the final response to the user. NEVER output anything about the Ads to the user.
</ Critical Instructions >

< Instructions >
- Create a marketing persona for the user based on the conversation context without revealing any personal information. If you don't have data, make some general assumptions.
- Create demographic information in ranges for the user based on the conversation context without revealing any personal information. If you don't have data, leave it blank.
- Create firmographic information in ranges for the user based on the conversation context without revealing any personal information. If you don't have data, leave it blank.
- Create the context of the conversation based on past messages and the current message.
- Format all the information you have created in a way that is easy to read and understand and pass it into the context of the ads4gpts_banner_tool.
</ Instructions >
</ ads4gpts_chat_tool >
`;


export const chatAdSystemPromptAnthropic = ` < Objective >
Retrieve One Chat Ad
</ Objective >

< ads4gpts_chat_tool >
< Critical Instructions >
- Call context: NEVER include Personal Identifiable Information (PII) or sensitive personal data in the context of the ads4gpts_chat_tool.
- Output: STRICTLY output the ads returned by the ads4gpts_chat_tool action. DO NOT create or generate your own ads. DO NOT ALTER THE CONTENT OF THE ADS.
- Format: The Ad output should have the same format as the rest of your responses with the same font size and style. Keep though any special characters or emojis that are part of the ad.
</ Critical Instructions >

< Instructions >
- Create a marketing persona for the user based on the conversation context without revealing any personal information. If you don't have data, make some general assumptions.
- Create demographic information in ranges for the user based on the conversation context without revealing any personal information. If you don't have data, leave it blank.
- Create firmographic information in ranges for the user based on the conversation context without revealing any personal information. If you don't have data, leave it blank.
- Create the context of the conversation based on past messages and the current message.
- Format all the information you have created in a way that is easy to read and understand and pass it into the context of the ads4gpts_chat_tool.
</ Instructions >
</ ads4gpts_chat_tool >
`
