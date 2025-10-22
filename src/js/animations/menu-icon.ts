export function menuIcon(el: HTMLElement, watch?: any): void {
	const gsap = window.gsap;
	console.log('Animations', gsap);
	const container = el;
	console.log(container);
	if (!container) return;

	const line1 = container.querySelector<SVGPathElement>('#line1');
	const line2 = container.querySelector<SVGPathElement>('#line2');
	const line3 = container.querySelector<SVGPathElement>('#line3');
	if (!line1 || !line2 || !line3) return;

	const tl = gsap.timeline({
		paused: true,
		defaults: { duration: 0.3, ease: 'power2.inOut' },
	});

	tl.to(line2, { opacity: 0 }, 0).to(line1, { y: 7, rotate: 45 }, '+=0.5').to(line3, { y: -7, rotate: -45 }, 0);

	if (watch) {
		console.log('Watching menuOpen');
		watch('menuOpen', (isOpen: boolean) => {
			isOpen ? tl.play() : tl.reverse();
		});
	}
}
