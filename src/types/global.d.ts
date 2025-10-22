// src/types/global.d.ts
import type { Alpine as AlpineType } from 'alpinejs';
import type { gsap } from 'gsap';

declare global {
	interface Window {
		Alpine: AlpineType;
		gsap: typeof gsap;
		Animations: {
			menuIcon: (el: HTMLElement, watch?: any) => void;
		};
	}
}

export {};
