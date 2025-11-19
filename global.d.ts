import type Alpine from 'alpinejs';
import type { Alpine } from 'alpinejs';
import type { gsap } from 'gsap';
import type SwiperClass from 'swiper';
import type { morph } from '@alpinejs/morph';
import type { focus } from '@alpinejs/focus';
import type { Theme } from './types/theme';

declare global {
	interface Window {
		App: {
			init: () => void;
		};

		// Sleek
		Sleek?: {
			utils?: {
				getContrastRatio: typeof getContrastRatio;
				getContrastColor: typeof getContrastColor;
			};
		};
		getContrastRatio: typeof getContrastRatio;
		// Libraries
		Alpine: typeof Alpine;
		Swiper: typeof SwiperClass;
		gsap: typeof gsap;
		theme: Theme;
		Shopify: ShopifyGlobal;
	}
}

export {};
