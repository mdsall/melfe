// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteLoader } from '@/components/layout/SiteLoader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MELHFA - Voiles Mauritaniennes Authentiques',
  description: 'Découvrez notre collection exclusive de melhfa mauritaniennes traditionnelles. Qualité premium, artisanat authentique.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SiteLoader minLoadingTime={2500} showWelcomeText={true}>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </SiteLoader>
      </body>
    </html>
  );
}

