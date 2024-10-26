class Keyboard {
    private _isComposition = false;

    get isComposition() {
        return this._isComposition;
    }

    setComposition(isComposition: boolean) {
        this._isComposition = isComposition;
    }

}

export const keyboard = new Keyboard();