import { useAppSelector } from "mote/app/hooks";
import { selectAuthStatus } from "mote/app/slices/user/userSlice";
import Fade from "mote/base/components/fade/fade";
import { Layout } from "mote/base/components/layout"
import { LoadingIndicator } from "mote/base/components/loading/loadingIndicator";
import { SidebarPart } from "mote/base/parts/sidebar/sidebarPart";
import { ReactNode } from "react";
import { Outlet, Route, Routes, redirect } from "react-router-dom";

export interface IAuthenticatedLayoutProps {
   
}

export const AuthenticatedLayout = ({
    
}: IAuthenticatedLayoutProps) => {

    const authStatus = useAppSelector(selectAuthStatus);

    switch (authStatus) {
        case "idle":
        case "loading":
            return <LoadingIndicator />
    }

    const sidebar = (
        <Fade>
            <SidebarPart />
        </Fade>
    );

    return (
        <Layout
            sidebar={sidebar}
        >
            <Outlet />
        </Layout>
    )
}