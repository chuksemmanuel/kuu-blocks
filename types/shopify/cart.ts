// ----------------------------
// Shopify AJAX Cart Interfaces
// ----------------------------

export interface CartItem {
	id: string;
	key: string;
	title: string;
	handle: string;
	quantity: number;
	original_price: number;
	final_price: number;
	line_price: number;
	original_line_price: number;
	final_line_price: number;
	sku: string;
	vendor: string;
	variant_title: string;
	product_title: string;
	product_description?: string;
	product_type?: string;
	image?: {
		src: string;
		alt?: string;
		width?: number;
		height?: number;
	};
	properties?: Record<string, string>;
	requires_shipping: boolean;
	taxable: boolean;
	gift_card: boolean;
}

export interface Cart {
	token: string;
	note?: string | null;
	attributes?: Record<string, string>;
	original_total_price: number;
	total_price: number;
	total_discount: number;
	total_weight: number;
	item_count: number;
	currency: string;
	items: ShopifyCartItem[];
	requires_shipping: boolean;
	cart_level_discount_applications?: any[];
}

// ----------------------------
// Shopify AJAX Payload
// ----------------------------

export interface CartUpdatePayload {
	id: string;
	quantity: number;
}
