'use client';

import { type ReactNode, Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { MotionConfig } from 'motion/react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import Footer from '~/widgets/Footer/Footer';
import Sidebar from '~/widgets/Sidebar/Sidebar';
import { Header } from '~/widgets/Header';
import { ErrorBoundary } from './providers/ErrorBoundary';
import { StoreProvider } from './providers/StoreProvider/ui/StoreProvider';
import { createAppI18n } from '~/shared/config/i18n';
import { type AppLanguage, normalizeLanguage } from '~/shared/config/language';
import { ThemeProvider } from './providers/ThemeProvider';
import { AccountProvider } from '~/entities/Account/AccountProvider';

export const App = ({ children, language, }: { children: ReactNode; language: AppLanguage }) => {
  const [instance] = useState(() => createAppI18n(language));
  return <I18nextProvider i18n={instance}><AppShell>{children}</AppShell></I18nextProvider>;
};

// Hides the progress bar instrumentation-client.ts shows, once the new URL has rendered.
const NavigationEnd = () => {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(() => { delete document.documentElement.dataset.navigating; }, [pathname, search]);
  return null;
};

const AppShell = ({ children, }: { children: ReactNode }) => {
  const { t, i18n: instance, } = useTranslation();
  useEffect(() => {
    document.documentElement.lang = normalizeLanguage(instance.resolvedLanguage);
  }, [instance.resolvedLanguage]);
  return (
    <ErrorBoundary>
      <StoreProvider>
        <ThemeProvider>
          <AccountProvider>
            <MotionConfig reducedMotion="user" transition={{ duration: 0.28, }}>
              <Suspense fallback={null}><NavigationEnd /></Suspense>
              <a href="#main-content" className="skip-link action">
                {t('skip-content')}
              </a>
              <Header />
              <Sidebar />
              <main id="main-content" tabIndex={-1}>
                <div>
                  {children}
                </div>
              </main>
              <Footer />
            </MotionConfig>
          </AccountProvider>
        </ThemeProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
};
