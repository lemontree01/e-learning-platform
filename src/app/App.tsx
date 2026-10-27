'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import Footer from '~/widgets/Footer/Footer';
import Sidebar from '~/widgets/Sidebar/Sidebar';
import { Header } from '~/widgets/Header';
import { ErrorBoundary } from './providers/ErrorBoundary';
import { StoreProvider } from './providers/StoreProvider/ui/StoreProvider';
import { createAppI18n } from '~/shared/config/i18n';
import { getPageMetadata } from '~/shared/lib/metadata/pageMetadata';
import { type AppLanguage, normalizeLanguage } from '~/shared/config/language';
import { ThemeProvider } from './providers/ThemeProvider';
import { AccountProvider } from '~/entities/Account/AccountProvider';

export const App = ({ children, language, }: { children: ReactNode; language: AppLanguage }) => {
  const [instance] = useState(() => createAppI18n(language));
  return <I18nextProvider i18n={instance}><AppShell>{children}</AppShell></I18nextProvider>;
};

const AppShell = ({ children, }: { children: ReactNode }) => {
  const { t, i18n: instance, } = useTranslation();
  const pathname = usePathname();
  useEffect(() => {
    const metadata = getPageMetadata(pathname, t);
    document.documentElement.lang = normalizeLanguage(instance.resolvedLanguage);
    document.title = metadata.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', metadata.description);
  }, [instance.resolvedLanguage, pathname, t]);
  return (
    <ErrorBoundary>
      <StoreProvider>
        <ThemeProvider>
          <AccountProvider>
            <MotionConfig reducedMotion="user" transition={{ duration: 0.28, }}>
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
