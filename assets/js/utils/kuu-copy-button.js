document.addEventListener('alpine:init', () => {
	const Alpine = window.Alpine;
	Alpine.data('copyButton', () => ({
		copied: false,
		init() {
			const selector = this.$el.dataset.contentSelector;
			if (!selector) {
				console.error('No content selector found');
				return;
			}
		},
		copy() {
			const contentElement = document.querySelector(
				this.$el.dataset.contentSelector ?? '',
			);
			if (!contentElement) {
				console.error('No content element found');
				return;
			}
			if (this.copied) {
				return;
			}
			const text = contentElement.textContent;
			navigator.clipboard.writeText(text);

			this.copied = true;

			setTimeout(() => {
				this.copied = false;
			}, 3000);
		},
	}));
});
