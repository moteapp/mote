import { Color } from 'vs/base/common/color';
import { localize } from 'vs/nls';
import { contrastBorder, registerColor } from 'vs/platform/theme/common/colorRegistry';


export const COMMAND_CENTER_BACKGROUND = registerColor(
	'commandCenter.background',
	{ dark: Color.white.transparent(0.05), hcDark: null, light: Color.black.transparent(0.05), hcLight: null },
	localize('commandCenter-background', "Background color of the command center"),
	false
);

// background (inactive and active)
export const WINDOW_ACTIVE_BORDER = registerColor('window.activeBorder', {
	dark: null,
	light: null,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('windowActiveBorder', "The color used for the border of the window when it is active. Only supported in the macOS and Linux desktop client when using the custom title bar."));

export const WINDOW_INACTIVE_BORDER = registerColor('window.inactiveBorder', {
	dark: null,
	light: null,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('windowInactiveBorder', "The color used for the border of the window when it is inactive. Only supported in the macOS and Linux desktop client when using the custom title bar."));
