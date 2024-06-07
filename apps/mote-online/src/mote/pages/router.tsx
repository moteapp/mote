import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './login/loginPage';
import { AuthenticatedRoutes } from './authenticated/authenticatedRoutes';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />,
    },
    AuthenticatedRoutes
]);