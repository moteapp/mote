import { Listbox, ListboxItem } from '@nextui-org/react';
import { SVGIcon } from 'mote/base/component/icon/svgIcon';

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

export const Sidebar = () => {
    return (
        <div style={{width: 280, backgroundColor: '#f8f8f8', height: '100vh'}}>
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
        </div>
    );
};