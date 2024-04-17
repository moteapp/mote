export interface ICompositeBar {

	/**
	 * Unpins a composite from the composite bar.
	 */
	unpin(compositeId: string): void;

    /**
	 * Pin a composite inside the composite bar.
	 */
	pin(compositeId: string): void;

	/**
	 * Find out if a composite is pinned in the composite bar.
	 */
	isPinned(compositeId: string): boolean;
}