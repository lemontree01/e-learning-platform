'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { MotionConfig } from 'motion/react';
import { useTranslation } from 'react-i18next';
import Footer from '~/widgets/Footer/Footer';
import Sidebar from '~/widgets/Sidebar/Sidebar';
import { Header } from '~/widgets/Header';
import { ErrorBoundary } from './providers/ErrorBoundary';
import { StoreProvider } from './providers/StoreProvider/ui/StoreProvider';
import i18n from '~/shared/config/i18n';
import { type AppLanguage, normalizeLanguage } from '~/shared/config/language';
import { ThemeProvider } from './providers/ThemeProvider';
import { AccountProvider } from '~/entities/Account/AccountProvider';

export const App = ({ children, language, }: { children: ReactNode; language: AppLanguage }) => {
  const applied = useRef(false);
  if (!applied.current) {
    applied.current = true;
    if (normalizeLanguage(i18n.resolvedLanguage) !== language) {
      void i18n.changeLanguage(language);
    }
  }
  const { t, i18n: instance, } = useTranslation();
  useEffect(() => {
    document.documentElement.lang = normalizeLanguage(instance.resolvedLanguage);
    document.title = t('app-title');
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('app-description'));
  }, [instance.resolvedLanguage, t]);
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
