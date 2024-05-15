
export function get(): Range | undefined {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        return selection.getRangeAt(0);
    }
}

export function set(toSet: Range) {
    const selection = window.getSelection();
    if (selection) {
        const range = document.createRange();
        range.setStart(toSet.startContainer, toSet.startOffset);
        range.setEnd(toSet.endContainer, toSet.endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

export function isEqual(range1?: Range, range2?: Range) {
    if (!range1 || !range2) {
        return false;
    }
    return range1.startContainer === range2.startContainer
        && range1.startOffset === range2.startOffset
        && range1.endContainer === range2.endContainer
        && range1.endOffset === range2.endOffset;
}

export function getRect(range: Range) {
    if (!range) {
        return;
    }

    let domRect: DOMRect;
    if (range.collapsed) {
        domRect = range.getClientRects()[0];
    } else {
        domRect = range.getBoundingClientRect();
    }

    if (domRect) {
        return {
            left: domRect.left,
            top: domRect.top,
            width: domRect.width,
            height: domRect.height,
        };
    }

    if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
        if (0 === range.startOffset) {
            domRect = (range.startContainer as Element).getBoundingClientRect();
            return {
                left: domRect.left,
                top: domRect.top,
                width: 0,
                height: domRect.height,
            };
        }

        const prevNode = range.startContainer.childNodes[range.startOffset - 1];
        if (prevNode && prevNode.nodeType === Node.ELEMENT_NODE) {
            domRect = (prevNode as Element).getBoundingClientRect();
            return {
                left: domRect.right,
                top: domRect.top,
                width: 0,
                height: domRect.height,
            };
        }

        const childNode = range.startContainer.childNodes[range.startOffset];
        if (childNode && childNode.nodeType === Node.ELEMENT_NODE) {
            domRect = (childNode as Element).getBoundingClientRect();
            return {
                left: domRect.left,
                top: domRect.top,
                width: 0,
                height: domRect.height,
            };
        }
    }
}

interface ContainerWithOffset {
    container: Node | null;
    offset: number;
}

export function rangeFromContainerOffsets(start: ContainerWithOffset, end: ContainerWithOffset) {
    const range = document.createRange();
    if (start.container) {
        try {
            range.setStart(start.container, start.offset)
        } catch (i) {
            console.info(i)
        }
    }
    if (end.container) {
        try {
            range.setEnd(end.container, end.offset)
        } catch (i) {
            console.info(i)
        }
    }
    return range
}