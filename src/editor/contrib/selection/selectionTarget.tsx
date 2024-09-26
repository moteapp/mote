import { CSSProperties, PropsWithChildren } from 'react';
import { SelectType } from 'mote/editor/common/editorCommon';

export type SelectionTargetProps = PropsWithChildren & {
    id: string;
    type: SelectType;
    style?: CSSProperties;
    className?: string;
};

export function SelectionTarget({
    id,
    type = SelectType.None,
    className = '',
    style,
    children,
}: SelectionTargetProps) {
    return (
        <div
            id={`selectionTarget-${id}`}
            className={`selectionTarget ${className}`}
            style={style}
            data-id={id}
            data-type={type}
        >
            {children}
        </div>
    );
}
