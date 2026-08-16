import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '700'],
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sai Dheeraj Gantala — AI Agent Platform Builder',
  description:
    'Senior software engineer building enterprise AI agent platforms with LangGraph, Temporal, and Google ADK. Multi-cloud DevOps, full-stack development, and certified cloud architect.',
  metadataBase: new URL('https://saidheerajgantala.me'),
  openGraph: {
    title: 'Sai Dheeraj Gantala — AI Agent Platform Builder',
    description: 'Building the operating layer where AI meets engineering.',
    url: 'https://saidheerajgantala.me',
    siteName: 'saidheerajgantala.me',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
