import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { Header } from '../parts/header';

export interface IPageProps {
    title: string;
    centered?: boolean;
    children: ReactNode;
}

export const Page = ({title, children}: IPageProps) => {
    return (
        <FullWidth>
            <PageTitle title={title} />
            <Header 
            />
            {children}
        </FullWidth>
    );
}

export interface IPageTitleProps {
    title: ReactNode;
    favicon?: string;
}

const originalShortcutHref = document
  .querySelector('link[rel="shortcut icon"]')
  ?.getAttribute("href") as string;

export const PageTitle = ({ title, favicon }: IPageTitleProps) => {
    return (
        <Helmet>
            <title>{title}</title>
            <link
                rel="shortcut icon"
                type="image/png"
                href={favicon ?? originalShortcutHref}
                key={favicon ?? originalShortcutHref}
            />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Helmet>
    )
}

const FullWidth = styled.div`
  width: 100%;
`;