/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { reset } from '@mote/base/browser/dom';
import type { IUpdatableHover } from '@mote/base/browser/ui/hover/hover';
import { getBaseLayerHoverDelegate } from '@mote/base/browser/ui/hover/hoverDelegate2';
import { getDefaultHoverDelegate } from '@mote/base/browser/ui/hover/hoverDelegateFactory';
import { renderLabelWithIcons } from '@mote/base/browser/ui/iconLabel/iconLabels';
import { IDisposable } from '@mote/base/common/lifecycle';

export class SimpleIconLabel implements IDisposable {

	private hover?: IUpdatableHover;

	constructor(
		private readonly _container: HTMLElement
	) { }

	set text(text: string) {
		reset(this._container, ...renderLabelWithIcons(text ?? ''));
	}

	set title(title: string) {
		if (!this.hover && title) {
			this.hover = getBaseLayerHoverDelegate().setupUpdatableHover(getDefaultHoverDelegate('mouse'), this._container, title);
		} else if (this.hover) {
			this.hover.update(title);
		}
	}

	dispose(): void {
		this.hover?.dispose();
	}
}
