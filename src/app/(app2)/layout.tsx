import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BASE_URL, SITE_DESCRIPTION, SITE_TITLE } from '@/site/config';
import { Metadata } from 'next/types';
import '@/site/globals.css';
import '@/site/sonner.css';
export const metadata: Metadata = {
	title: SITE_TITLE,
	description: SITE_DESCRIPTION,
	...(BASE_URL && { metadataBase: new URL(BASE_URL) }),
	openGraph: {
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
	},
	twitter: {
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
	},
	icons: [
		{
			url: '/favicon.ico',
			rel: 'icon',
			type: 'image/png',
			sizes: '180x180',
		},
		{
			url: '/favicons/light.png',
			rel: 'icon',
			media: '(prefers-color-scheme: light)',
			type: 'image/png',
			sizes: '32x32',
		},
		{
			url: '/favicons/dark.png',
			rel: 'icon',
			media: '(prefers-color-scheme: dark)',
			type: 'image/png',
			sizes: '32x32',
		},
		{
			url: '/favicons/apple-touch-icon.png',
			rel: 'icon',
			type: 'image/png',
			sizes: '180x180',
		},
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<main>{children}</main>
				<Analytics debug={false} />
				<SpeedInsights />
			</body>
		</html>
	);
}
