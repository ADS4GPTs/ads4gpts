'use client';
import React, { useState } from 'react';
import AdCard from '@/components/AdCard';

type StylesType = {
    container: string;
    image: string;
    title: string;
    adBadge: string;
    body: string;
    link: string;
};

export default function Home() {
    // Initialize state with default styles
    const [styles, setStyles] = useState<StylesType>({
        container:
            'flex flex-row max-w-full md:max-w-[60%] bg-gray-100 rounded-lg shadow-md transition-transform duration-200 ease-in-out hover:translate-y-[-3px] hover:shadow-lg overflow-hidden p-2 box-border',
        image: 'w-16 h-16 object-cover rounded-lg mr-2 self-center',
        title: 'm-0 text-gray-800 text-sm font-semibold',
        adBadge: 'rounded-lg h-fit text-sm text-gray-200 bg-gray-400 px-1',
        body: 'm-0 text-gray-600 text-xs leading-tight',
        link: 'text-gray-600 text-xs underline hover:text-gray-700 w-fit',
    });

    // Handler for style changes
    const handleStyleChange =
        (styleKey: keyof StylesType) =>
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setStyles({
                ...styles,
                [styleKey]: event.target.value,
            });
        };

    return (
        <main className="flex flex-col justify-between h-screen p-4">
            {/* First div: AdCard component */}
            <div className="flex-grow flex justify-center items-center">
                <AdCard
                    ad_creative="https://cdn.prod.website-files.com/673d9c01098f16900da8bc69/673d9d93374bed277a9a4048_Ads4GPTs%20LogoMark%20webicon.png"
                    ad_title="Bringing Freemium to the AI Era"
                    ad_body="ADS4GPTs enable AI, LLM and GPT applications to power their growth with a Free model, supercharging adoption without breaking the bank."
                    ad_link="https://www.ads4gpts.com"
                    ad_link_cta="Join our Ad Network of AI Apps"
                    styles={styles}
                />
            </div>

            {/* Second div: Textareas for editing styles */}
            <div className="mt-4">
                <h2 className="text-2xl font-bold mb-4 text-blue-950">
                    Edit Styles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(Object.keys(styles) as Array<keyof StylesType>).map(
                        (styleKey) => (
                            <div
                                key={styleKey}
                                className="flex flex-col gap-1 mb-2"
                            >
                                <label className="block text-base font-semibold text-blue-950">
                                    {styleKey}
                                </label>
                                <textarea
                                    className="w-full p-2 border rounded-xl font-medium text-gray-600 border-black focus-visible:border-0 focus-visible:outline-none"
                                    rows={3}
                                    value={styles[styleKey]}
                                    onChange={handleStyleChange(styleKey)}
                                />
                            </div>
                        )
                    )}
                </div>
            </div>
        </main>
    );
}
