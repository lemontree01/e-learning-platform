import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './providers/Router';
import Footer from '~/widgets/Footer/Footer';
import Sidebar from '~/widgets/Sidebar/Sidebar';
import { Header } from '~/widgets/Header';
import './styles/app.scss';
import { ErrorBoundary } from './providers/ErrorBoundary';
import { StoreProvider } from './providers/StoreProvider/ui/StoreProvider';
import '~/shared/config/i18n';

export const App = () => {
  return (
      <ErrorBoundary>
        <StoreProvider>
          <BrowserRouter>
              <Header />
              <Sidebar />
              <AppRouter />
              <Footer />
          </BrowserRouter>
        </StoreProvider>
      </ErrorBoundary>
  );
};
