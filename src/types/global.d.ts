// src/types/global.d.ts
import type { Alpine } from 'alpinejs';
import type { gsap } from 'gsap';

declare global {
	interface Window {
		Alpine: Alpine;
		gsap: typeof gsap;
		Utils: {
			horizontalScroll: (el: HTMLElement) => void;
		};
	}
}

export {};
