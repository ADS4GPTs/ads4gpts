'use client';

import AdCard from '@/components/AdCard';
import { useChat } from 'ai/react';
import Markdown from 'react-markdown';

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        maxSteps: 10,
    });
    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            {messages.map((m) => {
                // Only render if the role is 'user' or 'ai'
                if (m.role !== 'user' && m.role !== 'assistant') {
                    return null;
                }

                return (
                    <div key={m.id} className="">
                        <div className="font-bold text-xl">
                            {m.role === 'user'
                                ? 'User '
                                : m.toolInvocations
                                ? null
                                : 'AI '}
                        </div>
                        <Markdown className="prose text-lg whitespace-normal">
                            {m.content}
                        </Markdown>
                        {/* If tool invocations are present, iterate through them to check for an ADS4GPTs tool call in the 'result' state */}
                        {m.toolInvocations &&
                            m.toolInvocations.length > 0 &&
                            m.toolInvocations.map((tool, index) => {
                                if (
                                    tool.toolName === 'ads4gpts_banner_tool' &&
                                    tool.state === 'result'
                                ) {
                                    // Render the AdCard component if the tool is an ADS4GPTs banner ad tool
                                    return (
                                        <AdCard
                                            key={index}
                                            ad_title={tool.result.ad_title}
                                            ad_creative={
                                                tool.result.ad_creative
                                            }
                                            ad_body={tool.result.ad_body}
                                            ad_link={tool.result.ad_link}
                                            ad_link_cta={
                                                tool.result.ad_link_cta
                                            }
                                        />
                                    );
                                }
                                return null; // Ensure only the relevant tools are displayed
                            })}
                    </div>
                );
            })}

            <form onSubmit={handleSubmit}>
                <input
                    className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
                    value={input}
                    placeholder="Say something..."
                    onChange={handleInputChange}
                />
            </form>
        </div>
    );
}
