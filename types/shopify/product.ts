declare global {
	interface Product {
		id: number;
		title: string;
		handle: string;
		description: string;
		published_at: string;
		created_at: string;
		vendor: string;
		type: string;
		tags: string[];
		price: number;
		price_min: number;
		price_max: number;
		available: boolean;
		price_varies: boolean;
		compare_at_price: number;
		compare_at_price_min: number;
		compare_at_price_max: number;
		compare_at_price_varies: boolean;
		content: string;

		variants: Variant[];

		images: string[];
		featured_image: string;

		options: string[];

		media: Media[];

		requires_selling_plan: boolean;
		selling_plan_groups: any[]; // Shopify rarely documents this
	}

	interface Variant {
		id: number;
		title: string;
		option1: string | null;
		option2: string | null;
		option3: string | null;
		sku: string | null;
		requires_shipping: boolean;
		taxable: boolean;

		featured_image: FeaturedImage | null;

		available: boolean;
		name: string;
		public_title: string | null;
		options: string[];

		price: number;
		weight: number;
		compare_at_price: number;

		inventory_management: string | null;
		barcode: string | null;

		featured_media: FeaturedMedia | null;

		requires_selling_plan: boolean;
		selling_plan_allocations: any[];

		quantity_rule: QuantityRule;
	}

	interface FeaturedImage {
		id: number;
		product_id: number;
		position: number;
		created_at: string;
		updated_at: string;
		alt: string | null;
		width: number;
		height: number;
		src: string;
		variant_ids: number[];
	}

	interface FeaturedMedia {
		alt: string | null;
		id: number;
		position: number;
		preview_image: PreviewImage;
	}

	interface PreviewImage {
		aspect_ratio: number;
		height: number;
		width: number;
		src: string;
	}

	interface Media {
		alt: string | null;
		id: number;
		position: number;
		preview_image: PreviewImage;
		aspect_ratio: number;
		height: number;
		media_type: string; // "image", "video", etc.
		src: string;
		width: number;
	}

	interface QuantityRule {
		min: number;
		max: number | null;
		increment: number;
	}
}

export {};
