import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Ads4GPTs React TS Playground',
    description:
        'Start tailoring your Ad Components to your needs with Ads4GPTs',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="h-dvh bg-[#25b1c1]">{children}</body>
        </html>
    );
}
