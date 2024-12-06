//import dynamic from 'next/dynamic'
import { LucideProps, icons } from 'lucide-react';
import { lazy, Suspense } from 'react';

export interface IconProps extends LucideProps {
    name?: keyof typeof icons;
}

export type IconName = IconProps['name'];

const DefaultIcon = <div style={{ background: '#ddd', width: 24, height: 24 }}/>

export const Icon = ({ name, ...props }: IconProps) => {
    if (!name) {
        return DefaultIcon;
    }
    const LucideIcon = icons[name];

    return <LucideIcon {...props} />;
};
