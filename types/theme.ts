export type Theme = {
	cartDrawer?: CartDrawer;
	announce?: (message: string) => void;
};

declare global {
	type CartDrawer = {
		open: () => void;
		close: () => void;
		refresh: (updateOptions?: CartDrawerUpdateOptions) => Promise<void>;
		beforeUpdate?: (cartDrawerEl: Element | null) => {};
		afterUpdate?: (cartDrawerEl: Element | null) => {};
		settings: CartDrawerSettings;
		updateSettings: (settings: any) => void;
		getSettings: () => CartDrawerSettings;
	};
	type CartDrawerUpdateOptions = {
		beforeUpdate?: (cartDrawerEl: Element | null) => {};
		afterUpdate?: (cartDrawerEl: Element | null) => {};
		skipAnnouncement?: boolean;
	};
	interface CartDrawerSettings {
		stickyHeader: boolean;
		stickyFooter: boolean;
		showComparePrice: boolean;
		finalPriceColor: string;
		showVariantTitle: boolean;
		showSavingsBadge: boolean;
		savingsBadgeColor: string;
	}
}
