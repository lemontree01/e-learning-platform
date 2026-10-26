import React, { type ErrorInfo, type ReactNode, type JSX, Suspense } from 'react';
import { ErrorPage } from '~/screens/ErrorPage';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
ErrorBoundaryProps,
ErrorBoundaryState
> {
  constructor (props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, };
  }

  static getDerivedStateFromError () {
    return { hasError: true, };
  }

  componentDidCatch (error: Error, errorInfo: ErrorInfo) {
    console.log(error, errorInfo);
  }

  render (): JSX.Element | null {
    const { hasError, } = this.state;
    const { children, } = this.props;

    if (hasError) {
      return (
        <Suspense fallback="">
          <ErrorPage />
        </Suspense>
      );
    }

    return <>{children}</>;
  }
}

export default ErrorBoundary;
