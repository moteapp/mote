/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface PerformanceMark {
	readonly name: string;
	readonly startTime: number;
}

export function mark(name: string): void {
    performance.mark(name);
}

/**
 * Returns all marks, sorted by `startTime`.
 */
export function getMarks(): PerformanceMark[] {
    let timeOrigin = performance.timeOrigin;
    if (typeof timeOrigin !== 'number') {
        // safari: there is no timerOrigin but in renderers there is the timing-property
        // see https://bugs.webkit.org/show_bug.cgi?id=174862
        timeOrigin = performance.timing.navigationStart || performance.timing.redirectStart || performance.timing.fetchStart;
    }
    const result = [{ name: 'code/timeOrigin', startTime: Math.round(timeOrigin) }];
    for (const entry of performance.getEntriesByType('mark')) {
        result.push({
            name: entry.name,
            startTime: Math.round(timeOrigin + entry.startTime)
        });
    }
    return result;
}
