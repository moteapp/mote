import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './login/loginPage';
import { HomePage } from './home/homePage';

export const router = createBrowserRouter([
    {
      path: '/',
      element: <LoginPage />,
    },
    {
      path: '/home/*',
      element: <HomePage />,
    }
]);