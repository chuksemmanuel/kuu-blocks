export type Theme = {
	cartDrawer?: CartDrawer;
	announce?: (message: string) => void;
};

declare global {
	type CartDrawer = {
		open: () => void;
		close: () => void;
		refresh: (updateOptions?: CartDrawerUpdateOptions) => Promise<void>;
		settings: CartDrawerSettings;
		updateSettings: (settings: any) => void;
		getSettings: () => CartDrawerSettings;
	};

	type CartDrawerUpdateOptions = {
		beforeRefresh?: (cartDrawerEl: Element | null, cart: Cart | null) => {};
		afterRefresh?: (cartDrawerEl: Element | null, cart: Cart | null) => {};
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
