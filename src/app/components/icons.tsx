import { icons, type LucideProps } from 'lucide-react';

export type IconProps = LucideProps & {
    name?: keyof typeof icons;
}

export type IconName = IconProps['name'];

const DefaultIcon = <div style={{ background: '#ddd', width: 24, height: 24 }}/>

export const Icon = ({ name, ...props }: IconProps) => {
    if (!name) {
        return DefaultIcon;
    }
    const LucideIcon = (icons as any)[name];

    return <LucideIcon {...props} />;
};
