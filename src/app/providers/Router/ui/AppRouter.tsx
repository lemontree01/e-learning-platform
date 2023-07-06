import { memo, Suspense, useCallback } from 'react';
import { Route, Routes, type RouteProps } from 'react-router-dom';
import { RouteConfig } from '../config/RouteConfig';

const AppRouter = () => {
  const renderWithWrapper = useCallback((route: RouteProps) => {
    return (
            <Route
                key={route.path}
                path={route.path}
                element={<Suspense fallback={
                <div>Loading...</div>}>{route.element}</Suspense>}
            />
    );
  }, []);

  return <Routes>{Object.values(RouteConfig).map(renderWithWrapper)}</Routes>;
};

export default memo(AppRouter);
