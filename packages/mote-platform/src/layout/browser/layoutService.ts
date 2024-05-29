import { Event } from 'vs/base/common/event';
import { IDimension } from '@mote/base/browser/dom';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';

export const ILayoutService = createDecorator<ILayoutService>('layoutService');

export interface ILayoutOffsetInfo {

	/**
	 * Generic top offset
	 */
	readonly top: number;

	/**
	 * Quick pick specific top offset.
	 */
	readonly quickPickTop: number;
}

export interface ILayoutService {

	readonly _serviceBrand: undefined;

	/**
	 * An event that is emitted when the active container changes.
	 */
	readonly onDidChangeActiveContainer: Event<void>;

	/**
	 * An event that is emitted when the active container is layed out.
	 */
	readonly onDidLayoutActiveContainer: Event<IDimension>;

	/**
	 * Main container of the application.
	 */
	readonly mainContainer: HTMLElement;

	/**
	 * Active container of the application. When multiple windows are opened, will return
	 * the container of the active, focused window.
	 */
	readonly activeContainer: HTMLElement;

	/**
	 * All the containers of the application. There can be one container per window.
	 */
	readonly containers: Iterable<HTMLElement>;

	/**
	 * The dimensions of the main container.
	 */
	readonly mainContainerDimension: IDimension;

	/**
	 * The dimensions of the active container.
	 */
	readonly activeContainerDimension: IDimension;

	/**
	 * An offset to use for positioning elements inside the main container.
	 */
	readonly mainContainerOffset: ILayoutOffsetInfo;

	/**
	 * An offset to use for positioning elements inside the container.
	 */
	readonly activeContainerOffset: ILayoutOffsetInfo;

	/**
	 * Get the container for the given window.
	 */
	getContainer(window: Window): HTMLElement;

	/**
	 * Focus the primary component of the active container.
	 */
	focus(): void;
}
