import { MouseEventHandler, PropsWithChildren } from "react";
import { DropType } from "mote/editor/common/editorCommon";

export type DragTargetProps = PropsWithChildren & {
    id: string;
    rootId: string;
    cacheKey?: string;
    targetContextId?: string;
    style?: number;
    dropType: DropType;
    className?: string;
    canDropMiddle?: boolean;
    isTargetTop?: boolean;
    isTargetBottom?: boolean;
    isTargetColumn?: boolean;
    isReversed?: boolean;

    onClick?: MouseEventHandler<HTMLDivElement>;
};

export function DragTarget({
    id,
    rootId,
    style,
    className,
    children,
    dropType,
    cacheKey,
    isTargetTop,
    isTargetBottom,
    isTargetColumn,

    onClick,
}: DragTargetProps) {
    const key = [dropType, cacheKey || id];
    const cn = [
        'dropTarget',
        'isDroppable',
        'root-' + rootId,
        'drop-target-' + id,
    ];

    if (className) {
        cn.push(className);
    }
    if (isTargetTop) {
        cn.push('targetTop');
        key.push('top');
    }
    if (isTargetBottom) {
        cn.push('targetBot');
        key.push('bot');
    }
    if (isTargetColumn) {
        cn.push('targetCol');
        key.push('col');
    }

    return (
        <div
            key={'drop-target-' + id}
            className={cn.join(' ')}
            data-drop-type={dropType}
            data-root-id={rootId}
            onClick={onClick}
        >
            {children}
        </div>
    );
}