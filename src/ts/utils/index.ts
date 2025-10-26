export function horizontalScroll($el: HTMLElement) {
	return {
		isDragging: false,
		startX: 0,
		scrollLeft: 0,
		init() {
			$el.style.scrollBehavior = 'auto'; // Disable smooth scrolling for better drag fe$el
		},
		startDragging(e: MouseEvent) {
			this.isDragging = true;
			this.startX = e.pageX - $el.offsetLeft;
			this.scrollLeft = $el.scrollLeft;
		},
		stopDragging() {
			this.isDragging = false;
		},
		drag(e: MouseEvent) {
			if (!this.isDragging) return;
			e.preventDefault();
			const x = e.pageX - $el.offsetLeft;
			const walk = (x - this.startX) * 1.5; // Adjust multiplier for desired scroll speed
			$el.scrollLeft = this.scrollLeft - walk;
		},
	};
}
