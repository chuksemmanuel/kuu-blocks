import type Alpine from 'alpinejs';
import type { Alpine } from 'alpinejs';
import type { gsap } from 'gsap';
import type SwiperClass from 'swiper';

declare global {
	interface Window {
		App: {
			init: () => void;
		};
		// Libraries
		Alpine: Alpine;
		Swiper: typeof SwiperClass;
		gsap: gsap;
	}
}

export {};
