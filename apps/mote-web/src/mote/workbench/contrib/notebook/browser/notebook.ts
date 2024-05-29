export interface ICell {
    
}

export interface IPage {

}

export interface ISpaceService {
	readonly _serviceBrand: undefined;

    readonly name: string;
    readonly id: string;

    getPages(): IPage[];
}