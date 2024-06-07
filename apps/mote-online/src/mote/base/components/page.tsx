import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { Header } from '../parts/header';
import { CenteredContent } from './centeredContent';

export interface IPageProps {
    title: string;

    /** A component to display on the left side of the header */
    left?: ReactNode;

    /** A component to display on the right side of the header */
    actions?: ReactNode;

    children: ReactNode;

    /** Whether to center the content horizontally with the standard maximum width (default: true) */
    centered?: boolean;

    /** Whether to use the full width of the screen (default: false) */
    wide?: boolean;
}

export const Page = ({
    title, left, actions, children, wide, centered
}: IPageProps) => {
    return (
        <FullWidth>
            <PageTitle title={title} />
            <Header 
                left={left}
                actions={actions}
            />
            {centered !== false ? (
                <CenteredContent maxWidth={wide ? "100vw" : undefined} withStickyHeader>
                    {children}
                </CenteredContent>
                ) : (
                children
            )}
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