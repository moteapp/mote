import { RouteObject } from "react-router-dom";
import { AuthenticatedLayout } from "./authenticatedLayout";
import { NewDocumentPage } from "./document/newDocumentPage";
import { HomePage } from "./home/homePage";

export const AuthenticatedRoutes: RouteObject = {
    element: <AuthenticatedLayout />,
    children: [
        {
            path: '/home/*',
            element: <HomePage />,
        },
        {
            path: '/doc/new',
            element: <NewDocumentPage />,
        }
    ]
}