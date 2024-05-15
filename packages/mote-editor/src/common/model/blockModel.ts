import { URI } from "vs/base/common/uri";
import { IBlockRecord, IPointer, IRecord, IRecordProvider, ISegment, getTextFromSegments } from "../recordCommon";
import { RecordModel } from "./recordModel";
import { EditorRange, IRange } from "../core/range";
import { IPosition, Position } from "../core/position";
import { BugIndicatingError } from "vs/base/common/errors";

export class BlockModel extends RecordModel<IBlockRecord> {

    static createChildBlockModel(
        parent: RecordModel<string[]>, 
        uri: URI, 
        recordProvider: IRecordProvider
    ) : BlockModel {
        let childModel = parent.getChildModel(uri, []) as BlockModel;
        if (childModel) {
            return childModel;
        }
        childModel = new BlockModel(uri, recordProvider);
        parent.addChildModel(childModel);
        return childModel;
    }

    constructor(
        uri: URI,
        recordProvider: IRecordProvider
    ) {
        super(uri, [], recordProvider);
    }

    get type() {
        return this.value.type;
    }

    getLineCount() {
        return this.getContentModel().value.length;
    }

    getLineContent(lineNumber: number) {
        if (lineNumber < 0 || lineNumber > this.getLineCount()) {
            throw new BugIndicatingError('Illegal value for lineNumber:' + lineNumber);
        }
        if (lineNumber == 0) {
            return this.getText();
        }
        const lineModel = this.getChildrenModels()[lineNumber-1];
        return lineModel.getText();
    }

    getLineMaxColumn(lineNumber: number) {
        return this.getLineContent(lineNumber).length + 1;
    }

    getText() {
        const segments = this.getTitleModel().value;
        return getTextFromSegments(segments);
    }

    getTitleModel() {
        return this.getPropertyModel('title');
    }

    getContentModel() {
        return this.getPropertyModel('content');
    }

    getPropertyModel<T extends keyof IRecord>(property: T): RecordModel<IRecord[T]> {
        return RecordModel.createChildModel<IRecord[T]>(this, this.uri, [property], this.recordProvider);
    }

    getChildrenModels() {
        return this.value.content.map((child: string) => {
            const uri = URI.from({scheme: this.uri.scheme, authority: this.uri.authority, path: '/' + child, query: `type=block`});
            return BlockModel.createChildBlockModel(
                this.getContentModel(), 
                uri,
                this.recordProvider
            );
        });
    }

    validateRange(range: IRange): EditorRange {
        const start = this.validatePosition(range.startLineNumber, range.startColumn);
        const end = this.validatePosition(range.endLineNumber, range.endColumn);

        const startLineNumber = start.lineNumber;
		const startColumn = start.column;
		const endLineNumber = end.lineNumber;
		const endColumn = end.column;

        return new EditorRange(startLineNumber, startColumn, endLineNumber, endColumn);
    }

    validatePosition(lineNumber: number, column: number): Position {
        const lineCount = this.getLineCount();
        
        if (lineNumber < 0) {
            // 0 means head/title, > 0 means content
			return new Position(0, 1);
		}

        if (lineNumber > lineCount) {
			return new Position(lineCount, this.getLineMaxColumn(lineCount));
		}

        if (column <= 1) {
			return new Position(lineNumber, 1);
		}

        const maxColumn = this.getLineMaxColumn(lineNumber);
		if (column >= maxColumn) {
			return new Position(lineNumber, maxColumn);
		}

        return new Position(lineNumber, column);
    }
}