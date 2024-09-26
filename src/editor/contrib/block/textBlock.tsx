import { useEffect, useRef } from "react";
import { clearNode } from "mote/base/browser/dom";
import { FastDomNode } from "mote/base/browser/fastDomNode";
import { ViewController } from "mote/editor/browser/view/viewController";
import { ContentEditableInput } from "mote/editor/browser/controller/contentEditableInput";


export function TextBlock() {
    const nodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (nodeRef.current) {
            clearNode(nodeRef.current);
            const input = new ContentEditableInput(new ViewController());
            nodeRef.current.appendChild(input.getDomNode().domNode);
        }
    }, [nodeRef]);

    return (
        <div className="flex" ref={nodeRef}>
            <div className="markers"></div>
        </div>
    );
}