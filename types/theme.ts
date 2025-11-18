export type Theme = {
	cartDrawer?: CartDrawer;
	announce?: (message: string) => void;
};

declare global {
	type CartDrawer = {
		open: () => void;
		close: () => void;
		refresh: (updateOptions?: UpdateOptions) => Promise<void>;
		beforeUpdate?: (cartDrawerEl: Element | null) => {};
		afterUpdate?: (cartDrawerEl: Element | null) => {};
	};
	type UpdateOptions = {
		beforeUpdate?: (cartDrawerEl: Element | null) => {};
		afterUpdate?: (cartDrawerEl: Element | null) => {};
		skipAnnouncement?: boolean;
	};
}
