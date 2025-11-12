import type Alpine from 'alpinejs';
import type { Alpine } from 'alpinejs';
import type { gsap } from 'gsap';
import type SwiperClass from 'swiper';
import type { morph } from '@alpinejs/morph';

declare global {
	interface Window {
		App: {
			init: () => void;
		};
		// Libraries
		Alpine: typeof Alpine;
		Swiper: typeof SwiperClass;
		gsap: typeof gsap;
	}
}

export {};
