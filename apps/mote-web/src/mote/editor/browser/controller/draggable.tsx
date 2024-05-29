export interface IDraggableProps {
    render: () => React.ReactNode;
}

export const Draggable = (props: IDraggableProps) => {
    return props.render();
}