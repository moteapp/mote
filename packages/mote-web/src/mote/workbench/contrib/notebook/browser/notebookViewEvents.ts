import { FontInfo } from 'vs/editor/common/config/fontInfo';

export interface NotebookLayoutInfo {
	width: number;
	height: number;
	scrollHeight: number;
	fontInfo: FontInfo;
	stickyHeight: number;
}

export interface CellViewModelStateChangeEvent {
	
}