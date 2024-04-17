export const WindowMinimumSize = {
	WIDTH: 400,
	WIDTH_WITH_VERTICAL_PANEL: 600,
	HEIGHT: 270
};

export interface IPoint {
	readonly x: number;
	readonly y: number;
}

export interface IRectangle extends IPoint {
	readonly width: number;
	readonly height: number;
}