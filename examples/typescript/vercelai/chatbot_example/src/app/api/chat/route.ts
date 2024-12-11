import { chatAdSystemPrompt } from '@/prompts/chatAdSystemPrompt';
// Uncomment and use this system prompt if you want to use banner ads instead of chat ads
// import { bannerAdSystemPrompt } from '@/prompts/bannerAdSystemPrompt';
import { ADS4GPTsToolkit } from 'ads4gpts-vercelai';
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// The maximum duration in seconds that the ChatBot can stream its response back to the user
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const ads4GPTsToolkit = new ADS4GPTsToolkit(process.env.ADS4GPTS_API_KEY);

    const result = streamText({
        model: openai('gpt-4o'),
        // Uncomment and use this system prompt if you want to use banner ads instead of chat ads
        // system: bannerAdSystemPrompt,
        system: chatAdSystemPrompt,
        messages,
        tools: {
            weather: tool({
                description: 'Get the weather in a location (fahrenheit)',
                parameters: z.object({
                    location: z
                        .string()
                        .describe('The location to get the weather for'),
                }),
                execute: async ({ location }) => {
                    const temperature = Math.round(
                        Math.random() * (90 - 32) + 32
                    );
                    return { location, temperature };
                },
            }),
            convertFahrenheitToCelsius: tool({
                description: 'Convert a temperature in fahrenheit to celsius',
                parameters: z.object({
                    temperature: z
                        .number()
                        .describe('The temperature in fahrenheit to convert'),
                }),
                execute: async ({ temperature }) => {
                    const celsius = Math.round((temperature - 32) * (5 / 9));
                    return { celsius };
                },
            }),
            ...ads4GPTsToolkit.getTools(),
        },
    });

    return result.toDataStreamResponse();
}
