import { Disposable, DisposableStore } from 'vs/base/common/lifecycle';
import { TextModel } from 'vs/editor/common/model/textModel';
import * as model from 'vs/editor/common/model';
import { PieceTreeTextBufferBuilder } from 'vs/editor/common/model/pieceTreeTextBuffer/pieceTreeTextBufferBuilder';
import { Event, Emitter } from 'vs/base/common/event';
import { URI } from 'vs/base/common/uri';

export class NotebookCellTextModel extends Disposable {

    private readonly _onDidChangeContent = this._register(new Emitter<'content' | 'language' | 'mime'>());
	readonly onDidChangeContent: Event<'content' | 'language' | 'mime'> = this._onDidChangeContent.event;


    constructor(
        readonly uri: URI,
        private readonly _source: string,
    ) {
        super();
    }

    //#region Text Model

    private _textBufferHash: string | null = null;
	private _hash: number | null = null;

    private _textBuffer!: model.IReadonlyTextBuffer;
    get textBuffer() {
		if (this._textBuffer) {
			return this._textBuffer;
		}

		const builder = new PieceTreeTextBufferBuilder();
		builder.acceptChunk(this._source);
		const bufferFactory = builder.finish(true);
		const { textBuffer, disposable } = bufferFactory.create(model.DefaultEndOfLine.LF);
		this._textBuffer = textBuffer;
		this._register(disposable);

		this._register(this._textBuffer.onDidChangeContent(() => {
			this._hash = null;
			if (!this._textModel) {
				this._onDidChangeContent.fire('content');
			}
			//this.autoDetectLanguage();
		}));

		return this._textBuffer;
	}

    private readonly _textModelDisposables = this._register(new DisposableStore());
	private _textModel: TextModel | undefined = undefined;
	get textModel(): TextModel | undefined {
		return this._textModel;
	}

	set textModel(m: TextModel | undefined) {
		if (this._textModel === m) {
			return;
		}

		this._textModelDisposables.clear();
		this._textModel = m;
	}

    //#endregion
}