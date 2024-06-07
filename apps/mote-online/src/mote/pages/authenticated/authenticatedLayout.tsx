import Fade from "mote/base/components/fade/fade";
import { Layout } from "mote/base/components/layout"
import { SidebarPart } from "mote/base/parts/sidebar/sidebarPart";
import { ReactNode } from "react";
import { Outlet, Route, Routes } from "react-router-dom";

export interface IAuthenticatedLayoutProps {
   
}

export const AuthenticatedLayout = ({
    
}: IAuthenticatedLayoutProps) => {

    const sidebar = (
        <Fade>
            <Routes>
                <Route element={<SidebarPart />} />
            </Routes>
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