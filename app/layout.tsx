import type {Metadata} from 'next';
import { Outfit } from 'next/font/google';
import './globals.css'; // Global styles

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'SpringManggom',
  description: 'Manggom Interactive Seasonal Experience',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-outfit" suppressHydrationWarning>{children}</body>
    </html>
  );
}
