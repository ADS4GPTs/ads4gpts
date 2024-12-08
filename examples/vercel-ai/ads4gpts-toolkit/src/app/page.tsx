'use client';

import { useChat } from 'ai/react';
import Markdown from 'react-markdown';

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        maxSteps: 10,
    });
    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            {messages.map((m) => {
                // console.log('Message:', m);
                // Only render if the role is 'user' or 'ai'
                if (m.role !== 'user' && m.role !== 'assistant') {
                    return null;
                }

                return (
                    <div key={m.id} className="whitespace-pre-wrap">
                        <div>
                            {m.role === 'user'
                                ? 'User: '
                                : m.toolInvocations
                                ? null
                                : 'AI: '}
                        </div>
                        <Markdown className="">{m.content}</Markdown>
                        {/* {m.toolInvocations ? (
                            <pre>
                                {JSON.stringify(m.toolInvocations, null, 2)}
                            </pre>
                        ) : null} */}
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
