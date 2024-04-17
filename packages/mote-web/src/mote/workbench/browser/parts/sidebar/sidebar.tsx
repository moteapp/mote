import { Listbox, ListboxItem } from '@nextui-org/react';
import { SVGIcon } from 'mote/base/component/icon/svgIcon';
import { Section } from './section';

const items = [
    {
      key: "home",
      label: "Home",
      icon: <SVGIcon name="home" />,
    },
    {
      key: "copy",
      label: "Copy link",
      icon: <SVGIcon name="home" />,
    },
]

interface SidebarProps {
    width: number;
}

export const Sidebar = (props: SidebarProps) => {
    return (
        <div style={{width: props.width, backgroundColor: '#f8f8f8', height: '100vh'}}>
            <Listbox items={items}>
                {(item) => (
                    <ListboxItem
                        key={item.key}
                        color={item.key === "delete" ? "danger" : "default"}
                        className={item.key === "delete" ? "text-danger" : ""}
                    >
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <div style={{height: 32}}>{item.icon}</div>
                            <div>{item.label}</div>
                        </div>
                    </ListboxItem>
                )}
            </Listbox>
            <Section />
        </div>
    );
};