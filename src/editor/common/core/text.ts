import { ISegment } from "../blockCommon";

export class TextUtils {

    public static merge(record: ISegment[], segments: ISegment[], start: number) {
        if (record.length === 0) {
            return segments;
        }
        const newRecord: ISegment[] = [];
        let offset = 0;
        let merged = false;
        for (const segment of record) {
            const txt = segment[0];
            const annotations = segment[1];

            let currentOffset = offset;
            let end = offset + txt.length;
            // [start, txtBefore, segments, txtAfter, end]
            if (start >= currentOffset && start <= end && !merged) {
                const index = start - currentOffset;
                const txtBefore = txt.slice(0, index);
                const txtAfter = txt.slice(index);
                if (txtBefore.length > 0) {
                    newRecord.push([txtBefore, annotations]);
                }
                for (const seg of segments) {
                    newRecord.push(seg);
                }
                if (txtAfter.length > 0) {
                    newRecord.push([txtAfter, annotations]);
                }
                merged = true;
            } else {
                newRecord.push(segment);
            }
            offset = end;
        }
        return newRecord;
    }

    public static remove(record: ISegment[], start: number, end: number) {
        if (record.length === 0) {
            return record;
        }
        const newRecord: ISegment[] = [];
        let offset = 0;
        for (const segment of record) {
            const txt = segment[0];
            const annotations = segment[1];

            const segmentStart = offset;
            const segmentEnd = segmentStart + txt.length;
            
            // case 1: the text that need to be removed is not in the current segment
            if (segmentEnd <= start || segmentStart >= end) {
                newRecord.push(segment);
            }
            // case 2: the text that need to be removed is in the current segment
            else if (segmentStart >= start && segmentEnd <= end) {
                // do nothing
            }
            // case 3: the text that need to be removed is partially in the current segment
            else {
                const startOffset = start - segmentStart;
                const endOffset = end - segmentStart;
                const content = Array.from(txt).filter((_, idx) => idx < startOffset || idx > endOffset - 1).join('');
                if (content.length > 0) {
                    newRecord.push([content, annotations]);
                }
            }
            offset = segmentEnd;
        }
        return newRecord;
    }

    /**
     * Split the record into two parts at the start position
     * @param record 
     * @param start 
     * @returns 
     */
    public static split(record: ISegment[], start: number): { before: ISegment[], after: ISegment[] } {
        if (record.length === 0) {
            return {before: record, after: []};
        }
        const before: ISegment[] = [];
        const after: ISegment[] = [];
        let offset = 0;
        for (const segment of record) {
            const txt = segment[0];
            const annotations = segment[1];

            const segmentStart = offset;
            const segmentEnd = segmentStart + txt.length;
            
            // case 1: start position is after the current segment
            // [segment] [start] [segment] [segment]
            if (segmentEnd <= start || segmentStart >= start) {
                before.push(segment);
            }
            // case 2: start position is before the current segment
            // [start] [segment] [segment] [segment]
            else if (segmentStart >= start) {
                after.push(segment);
            }
            // case 3: the text that need to be split is in the current segment
            else {
                const startOffset = start - segmentStart;
                const txtBefore = txt.slice(0, startOffset);
                const txtAfter = txt.slice(startOffset);
                if (txtBefore.length > 0) {
                    before.push([txtBefore, annotations]);
                }
                if (txtAfter.length > 0) {
                    after.push([txtAfter, annotations]);
                }
            }
            offset = segmentEnd;
        }
        return {after, before};
    }
}