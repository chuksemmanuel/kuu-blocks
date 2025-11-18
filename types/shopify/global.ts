declare global {
	type ShopifyGlobal = {
		shop: string;
		locale: string;
		currency: {
			active: string;
			rate: string; // Shopify returns string for money rates
		};
		country: string;
		theme: {
			name: string;
			id: number;
			schema_name: string;
			schema_version: string;
			theme_store_id: number | null;
			role: string;
			handle: string | null;
			style: {
				id: number | null;
				handle: string | null;
			};
		};
		cdnHost: string;
		routes: {
			root: string;
			[key: string]: string; // Shopify might include more route paths
		};
		previewMode: boolean;
		ce_forms: {
			q: any[]; // unknown contents, Shopify uses this for forms queue
		};
		captcha: Record<string, any>;
		PaymentButton: {
			isStorefrontPortableWallets: boolean;
		};
		analytics: {
			replayQueue: any[]; // items vary based on analytics events
			initialized: boolean;
		};
		SignInWithShop: Record<string, any>;
		modules: boolean;
		isHotReloadInstalled: boolean;
		featureAssets: {
			'shop-js': Record<string, any>;
		};
	};
}
export {};
