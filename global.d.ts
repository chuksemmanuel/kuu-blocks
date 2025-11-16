import type Alpine from 'alpinejs';
import type { Alpine } from 'alpinejs';
import type { gsap } from 'gsap';
import type SwiperClass from 'swiper';
import type { morph } from '@alpinejs/morph';
import type { Cart, CartItem, CartUpdatePayload } from './types/shopify/cart';
import type { Theme } from './types/theme';

declare global {
	interface Window {
		App: {
			init: () => void;
		};
		// Libraries
		Alpine: typeof Alpine;
		Swiper: typeof SwiperClass;
		gsap: typeof gsap;
		theme: Theme;
	}

	type ShopifyCart = Cart;
	type ShopifyCartItem = CartItem;
	type ShopifyCartUpdatePayload = CartUpdatePayload;
}

export {};
