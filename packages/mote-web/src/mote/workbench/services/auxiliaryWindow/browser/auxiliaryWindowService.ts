import { IRectangle } from 'mote/platform/window/common/window';

export enum AuxiliaryWindowMode {
	Maximized,
	Normal,
	Fullscreen
}

export interface IAuxiliaryWindowOpenOptions {
	readonly bounds?: Partial<IRectangle>;
	readonly mode?: AuxiliaryWindowMode;
	readonly zoomLevel?: number;
}