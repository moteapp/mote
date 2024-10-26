import { match, P } from 'ts-pattern';
import { createAppSlice } from 'mote/app/store/createAppSlice';

const LayoutStateKeys = {
    SIDEBAR_HIDDEN: 'sideBar.hidden',
};

export const enum Parts {
    TITLEBAR_PART = 'workbench.parts.titlebar',
    BANNER_PART = 'workbench.parts.banner',
    ACTIVITYBAR_PART = 'workbench.parts.activitybar',
    SIDEBAR_PART = 'workbench.parts.sidebar',
    PANEL_PART = 'workbench.parts.panel',
    AUXILIARYBAR_PART = 'workbench.parts.auxiliarybar',
    EDITOR_PART = 'workbench.parts.editor',
    STATUSBAR_PART = 'workbench.parts.statusbar',
}

export type LayoutState = {
    sidebarSize: number;
    state: Record<string, any>;
};

export const layoutInitialState: LayoutState = {
    sidebarSize: 260,
    state: {},
};

export const layoutSlice = createAppSlice({
    name: 'layout',
    initialState: layoutInitialState,
    reducers: {
        toggleSidebar: (state: LayoutState) => {
            const sidebarVisble = isVisible(state, Parts.SIDEBAR_PART);
            setSideBarHidden(sidebarVisble, state);
        },
    },
    selectors: {
        selectSidebarSize: (state: LayoutState) => state.sidebarSize,
        selectPartIsVisible: isVisible,
    },
});

function isVisible(state: LayoutState, part: Parts) {
    return match(part)
        .with(Parts.SIDEBAR_PART, () => !state.state[LayoutStateKeys.SIDEBAR_HIDDEN])
        .run();
}

function setSideBarHidden(hidden: boolean, state: LayoutState) {
    state.state[LayoutStateKeys.SIDEBAR_HIDDEN] = hidden;
}

export const { selectSidebarSize, selectPartIsVisible } = layoutSlice.selectors;

export const { toggleSidebar } = layoutSlice.actions;

export const layoutReducer = layoutSlice.reducer;
