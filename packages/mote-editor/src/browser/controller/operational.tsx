import { KeyboardStackEntry } from "./keyboardStack"

export interface IOperationalProps {
    id: string;
    children: React.ReactNode;
    onArrowUp?: () => boolean;
    onArrowDown?: () => boolean;
    onArrowLeft?: () => boolean;
    onArrowRight?: () => boolean;
    onEnter?: () => boolean;
    onInput?: () => boolean;
}

export const Operational = (props: IOperationalProps) => {

    const shortcuts = {
        ArrowUp: props.onArrowUp,
        ArrowDown: props.onArrowDown,
        ArrowLeft: props.onArrowLeft,
        ArrowRight: props.onArrowRight,
        Enter: props.onEnter,
        Input: props.onInput,
    }

    return (
        <KeyboardStackEntry id={props.id} shortcuts={shortcuts}>
            {props.children}
        </KeyboardStackEntry>
    )
}
