document.addEventListener('alpine:init', () => {
	const Alpine = window.Alpine;
	Alpine.data('quickadd', (/** @type {HTMLElement} */ root) => ({
		adding: false,
		id: root.dataset.id,
		quantity: root.dataset.quantity,
		async handleAddToCart() {
			this.adding = true;

			try {
				await fetch('/cart/add.js', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						items: [
							{
								id: this.id,
								quantity: this.quantity,
							},
						],
					}),
				});

				let cartDrawer = window.kuu?.cartDrawer;
				if (cartDrawer) {
					await cartDrawer.refresh();
					cartDrawer.open();
				}
			} catch (e) {
				console.log(e);
			} finally {
				this.adding = false;
			}
		},
	}));
});
