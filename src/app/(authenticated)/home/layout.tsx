import { Heading } from "mote/app/components/heading";
import { NavTab, NavTabs } from "mote/app/components/nav-tabs";
import { PageLayout } from "mote/app/components/page-layout";
import { useI18n } from "mote/platform/i18n/common/i18n";

export default async function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { t } = await useI18n();
    const home = t('Home');
    return (
        <PageLayout>
            <Heading>{home}</Heading>
            <NavTabs>
                <NavTab to="/home">{t('Recently viewed')}</NavTab>
                <NavTab to="/home/recent">{t('Recently updated')}</NavTab>
                <NavTab to="/home/by-me">{t('Created by me')}</NavTab>
            </NavTabs>
            {children}
        </PageLayout>
    )
}