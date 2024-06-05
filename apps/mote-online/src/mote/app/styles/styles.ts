export const depths = {
    header: 800,
    sidebar: 900,
    editorToolbar: 925,
    mobileSidebar: 930,
    hoverPreview: 950,
    // Note: editor lightbox is z-index 999
    modalOverlay: 2000,
    modal: 3000,
    menu: 4000,
    toasts: 5000,
    popover: 9000,
    titleBarDivider: 10000,
    loadingIndicatorBar: 20000,
    commandBar: 30000,
};

const isTouchDevice = () => {
    return window.matchMedia?.("(hover: none) and (pointer: coarse)")?.matches;
}

/**
 * Returns "hover" on a non-touch device and "active" on a touch device. To
 * avoid "sticky" hover on mobile. Use `&:${hover} {...}` instead of
 * using `&:hover {...}`.
 */
export const hover = isTouchDevice() ? "active" : "hover";
