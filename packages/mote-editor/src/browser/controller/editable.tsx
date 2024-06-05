import { Draggable } from "./draggable";
import { Operational } from "./operational";

export interface EditableProps {
    id: string;
    onArrowUp?: () => boolean;
    onArrowDown?: () => boolean;
    onEnter?: () => boolean;
    onArrowLeft?: () => boolean;
    onArrowRight?: () => boolean;
    onInput?: () => boolean;
    render: () => React.ReactNode;
}

export const Editable = (props: EditableProps) => {

    const renderDraggable = () => {
        return (
            <Draggable render={()=>props.render()}/>
        )
    }

    return (
        <Operational 
            id={props.id}
            onArrowDown={props.onArrowDown}
            onArrowUp={props.onArrowUp}
            onArrowLeft={props.onArrowLeft}
            onArrowRight={props.onArrowRight}
            onEnter={props.onEnter}
            onInput={props.onInput}
        >
            {renderDraggable()}
        </Operational>
    )
}