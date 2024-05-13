import * as ranges from 'mote/base/common/ranges';
import { EditorSelection } from "../common/core/selection";

export function createRange(element: Node, startIdx: number, endIdx: number) {
    const start = getContainerWithOffset(element, startIdx);
    const end = getContainerWithOffset(element, endIdx);
    return ranges.rangeFromContainerOffsets(start, end)
}

function getContainerWithOffset(element: Node, offset: number) {
    if (offset === 0) {
        return {
            container: element,
            offset: 0
        }
    }

    let idx = offset;

    for (let i =0; i<element.childNodes.length; i++) {
        const child = element.childNodes[i];
        const contentLength = child.textContent?.length || 0;
        if (i === element.childNodes.length - 1 ? (idx - contentLength) <= 0 : (idx - contentLength) < 0) {

            if (child.nodeType === Node.TEXT_NODE) {
                return {
                    container: child,
                    offset: idx
                }
            }
        }
    }
    return {
        container: element,
        offset: 0
    }
}