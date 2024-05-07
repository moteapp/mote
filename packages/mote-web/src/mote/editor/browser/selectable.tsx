export interface SelectableProps {
    children: React.ReactNode;
}

export const Selectable = (props: SelectableProps) => {
    return (
        <div className="selectable">
            {props.children}
        </div>
    )
}