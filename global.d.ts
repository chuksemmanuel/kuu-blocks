import type { focus } from '@alpinejs/focus';
import type { morph } from '@alpinejs/morph';
import type Alpine from 'alpinejs';
import type { gsap } from 'gsap';
import type MarkdownIt from 'markdown-it';
import type Prism from 'prismjs';
import type SwiperClass from 'swiper';

import type { Kuu } from './types/kuu';

declare global {
	interface Window {
		App: {
			init: () => void;
		};
		getContrastRatio: typeof getContrastRatio;
		// Libraries
		Alpine: typeof Alpine;
		Swiper: typeof SwiperClass;
		gsap: typeof gsap;
		markdownit: typeof MarkdownIt;
		kuu?: Kuu;
		Shopify: ShopifyGlobal;
		Prism: typeof Prism;
	}
}

export {};
