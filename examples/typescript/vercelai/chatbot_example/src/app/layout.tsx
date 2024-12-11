import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Vercel AI - Ads4GPTs Toolkit',
    description: 'A simple Vercel AI with Ads4GPTs Toolkit example',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
