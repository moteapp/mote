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

/**
 * Mixin to hide scrollbars.
 *
 * @returns string of CSS
 */
export const hideScrollbars = () => `
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

/**
 * Mixin on any component with relative positioning to add additional hidden clickable/hoverable area
 *
 * @param pixels
 * @returns
 */
export const extraArea = (pixels: number): string => `
  &::before {
    position: absolute;
    content: "";
    top: -${pixels}px;
    right: -${pixels}px;
    left: -${pixels}px;
    bottom: -${pixels}px;
  }
`;

