/**
 * Alpine component for managing the Shopify cart drawer.
 * Handles optimistic quantity updates, debounced network syncs,
 * and per-item loading indicators.
 */

/**
 * @typedef {'cartdrawer:updating' | 'cartdrawer:init'} CartdrawerEvents
 * @typedef {{message: string, type: 'warning'|'success'|'error', key?: string|null,}} CartMessage
 */

document.addEventListener('alpine:init', () => {
	const Alpine = window.Alpine;

	Alpine.data('cartDrawer', () => ({
		/** @type {string} */
		sectionId: '',
		/**
		 * The key of the item currently being updated.
		 * Used to show per-item spinners.
		 * @type {string|null}
		 */
		updatingKey: null,

		/**
		 * The cart update message.
		 * @type {CartMessage | null}
		 */
		cartMessage: null,
		/**
		 * Debounce timers for each item (by key).
		 * Prevents rapid clicks from sending multiple network requests.
		 * @type {Record<string, number>}
		 */
		debounceTimers: {},

		/**
		 * Locally tracked quantities before syncing with the server.
		 * This ensures optimistic UI updates while the user interacts.
		 * @type {Record<string, number|string>}
		 */
		pendingQuantities: {},
		/**
		 * Locally tracked quantities before syncing with the server.
		 * This allows us to revert to the previous quantity if the update fails.
		 * @type {Record<string, number|string>}
		 */
		itemsQuantity: {},
		/** @type {Cart | null} */
		cart: null,
		/**
		 * @type {CartDrawerSettings}
		 */
		settings: {
			stickyHeader: true,
			stickyFooter: true,
			showComparePrice: false,
			finalPriceColor: '#fb2c36',
			showVariantTitle: true,
			showSavingsBadge: false,
			savingsBadgeColor: '#fb2c36',
		},
		async init() {
			this.sectionId = this.$el.dataset.sectionId || '';

			const script = document.getElementById(`cartdrawer-settings`);
			if (!script) {
				return;
			}

			this.settings = JSON.parse(script.textContent);

			try {
				// Populate items quantity
				const cartRes = await fetch('/cart.js');
				/** @type {Cart} */
				const cart = await cartRes.json();

				this.cart = cart;

				if (!cartRes.ok) {
					const cartErr = await cartRes.json();
					throw new Error(`${cartErr?.message || 'Failed to fetch cart'}`);
				}
				cart.items.forEach((item) => {
					this.itemsQuantity[item.key] = item.quantity;
				});

				// Add window object
				this.addWindowObject();

				this.dispatchEvent('cartdrawer:init', {});
			} catch (error) {
				this.dispatchEvent('cartdrawer:init', { error });
			}
		},
		/**
		 * Sanitize user input to allow only numeric values.
		 * @param {Event} event - Input event from quantity field
		 */
		filterNumeric(event) {
			const el = event.target;
			if (!(el instanceof HTMLInputElement)) return;
			el.value = el.value.replace(/\D/g, '');
		},
		/**
		 * Clear the cart update message.
		 */
		clearCartMessage() {
			let restoreSelector = this.getActiveElementSelector();
			this.cartMessage = null;

			// Restore focus
			if (restoreSelector) {
				const el = document.querySelector(restoreSelector);

				if (el instanceof HTMLInputElement || el instanceof HTMLButtonElement) {
					el.focus();
				}
			}
		},
		/**
		 * Add a message to the cart drawer.
		 * @param {CartMessage} cartMessage
		 */
		setCartMessage(cartMessage, skipAnnouncement = false) {
			const { message, type, key } = cartMessage;
			this.cartMessage = { message, type, key };

			// Annouce message to screen readers
			if (!skipAnnouncement) {
				this.announce(cartMessage.message);
			}
		},

		/**
		 * Handles manual typing in the quantity input.
		 * Optimistically updates local state and triggers a debounced update.
		 *
		 * @param {Event} event - Input event
		 * @param {string} key - Unique cart item key
		 */
		onQuantityInput(event, key) {
			const el = event.target;
			if (!(el instanceof HTMLInputElement)) return;
			const value = el.value.trim();

			if (value.length === 0) {
				this.updateQuantityValue(key, this.itemsQuantity[key] || 1);
				return;
			}

			// Save optimistic quantity immediately
			this.pendingQuantities[key] = value;
			this.debounceCartUpdate(key, value);
		},

		/**
		 * Handles clicks on increment/decrement buttons.
		 * Updates the input immediately and debounces the request.
		 *
		 * @param {string} key - Unique cart item key
		 * @param {string} newQuantity - New quantity after click
		 */
		onQuantityClick(key, newQuantity) {
			this.updateQuantityValue(key, newQuantity);

			this.pendingQuantities[key] = newQuantity;
			this.debounceCartUpdate(key, newQuantity);
		},

		/**
		 * Updates the quantity input value optimistically.
		 * @param {string} key - Unique cart item key
		 * @param {string | number} newQuantity - New quantity after click
		 */
		updateQuantityValue(key, newQuantity) {
			const cartItem = document.querySelector(`[key="${key}"]`);

			/** @type {HTMLInputElement|null|undefined} */
			const input = cartItem?.querySelector('input[type="text"]');

			if (input) {
				input.value = newQuantity.toString();
			}
		},

		/**
		 * Debounces cart updates to avoid sending too many requests.
		 * Each item key has its own independent debounce timer.
		 *
		 * @param {string} key - Unique cart item key
		 * @param {number|string} quantity - Target quantity
		 */
		debounceCartUpdate(key, quantity) {
			clearTimeout(this.debounceTimers[key]);

			this.debounceTimers[key] = setTimeout(() => {
				this.updateQuantity(key, quantity);
			}, 500); // Wait 0.5s after last input/click
		},

		/**
		 * Sends the network request to update the Shopify cart.
		 * This method morphs the `#cartdrawer-content` with updated markup.
		 *
		 * @param {string} key - Unique cart item key
		 * @param {number|string} quantity - Target quantity
		 * @returns {Promise<void>}
		 */
		async updateQuantity(key, quantity) {
			this.updatingKey = key;
			this.clearCartMessage();

			try {
				// Update cart item quantity via Shopify AJAX API
				const cartRes = await fetch('/cart/change.js', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: key, quantity }),
				});

				if (!cartRes.ok) {
					const cartErr = await cartRes.json();
					throw new Error(`${cartErr?.message || 'Failed to update cart'}`);
				}

				/** @type {Cart} */
				const cart = await cartRes.json();

				this.cart = cart;

				// Update ItemsQuantity
				cart.items.forEach((item) => {
					this.itemsQuantity[item.key] = item.quantity;
				});

				// Reflect the confirmed quantity from server
				const newQuantity =
					cart?.items?.find((item) => item.key === key)?.quantity ?? null;
				if (newQuantity && newQuantity !== quantity) {
					this.setCartMessage({
						message: `Only ${newQuantity} item${newQuantity > 1 ? 's' : ''} left in stock`,
						type: 'warning',
						key,
					});
					this.updateQuantityValue(key, newQuantity);
				} else {
					this.announce('Cart Quantity updated');
				}

				// Refresh the cart drawer content
				await this.updateCartDrawer();
			} catch (err) {
				await this.updateCartDrawer();

				if (typeof err === 'string') {
					this.setCartMessage({ message: err, type: 'error', key });
				} else if (err instanceof Error) {
					this.setCartMessage({ message: err.message, type: 'error', key });
				} else {
					this.setCartMessage({
						message: 'Unable to update cart. Please try again.',
						type: 'error',
						key,
					});
				}

				// Revert optimistic update on error
				this.updateQuantityValue(key, this.itemsQuantity[key] || 1);
			} finally {
				this.updatingKey = null;
			}
		},
		/**
		 * @param {CartDrawerUpdateOptions } [options]
		 */
		async updateCartDrawer(options) {
			const beforeRefresh = options?.beforeRefresh;
			const afterRefresh = options?.afterRefresh;

			try {
				//CAPTURE CURRENT FOCUS USING data-line ATTRIBUTE
				const active = document.activeElement;
				let restoreSelector = this.getActiveElementSelector();

				// Fetch updated cart drawer section
				const res = await fetch(`/?sections=${this.sectionId}`);
				const data = await res.json();
				const cartContent = document.querySelector('#cartdrawer-content');
				const cartBubbles = document.querySelectorAll(
					'[data-cartdrawer-bubble]',
				);

				const fragment = new DOMParser().parseFromString(
					data[this.sectionId],
					'text/html',
				);
				const newCartDrawer = fragment.querySelector('#cartdrawer');
				const newContent = fragment.querySelector('#cartdrawer-content');
				const newBubble = fragment.querySelector('[data-cartdrawer-bubble]');

				this.dispatchEvent('cartdrawer:updating', {
					cartDrawer: newCartDrawer,
				});

				if (beforeRefresh) {
					beforeRefresh(newCartDrawer, this.cart);
				}

				if (cartContent && newContent) {
					console.log('morphing cartdrawer-content');
					document.querySelectorAll('#cartdrawer-content').forEach((el) => {
						Alpine.morph(el, newContent);
					});

					// RESTORE FOCUS
					if (restoreSelector) {
						const target = document.querySelector(restoreSelector);
						if (
							target &&
							(target instanceof HTMLInputElement ||
								target instanceof HTMLButtonElement)
						) {
							target.focus();
						}
					}
				}

				if (afterRefresh) {
					afterRefresh(document.querySelector('#cartdrawer'), this.cart);
				}

				if (cartBubbles.length > 0 && newBubble) {
					cartBubbles.forEach((cartBubble) => {
						cartBubble.textContent = newBubble.textContent;
					});
				}
			} catch (error) {
				this.setCartMessage({
					message: 'Unable to update cart. Please try again.',
					type: 'error',
				});
			}
		},
		/**
		 *
		 * @param {Partial<CartDrawerSettings>} newSettings
		 */
		updateSettings(newSettings) {
			const updatedSettings = {
				...this.settings,
				...newSettings,
			};
			this.settings = updatedSettings;
		},
		/**
		 * dispatch cartdrawer events
		 * @param {CartdrawerEvents} event
		 * @param {Object} detail
		 */
		dispatchEvent(event, detail) {
			window.dispatchEvent(
				new CustomEvent(event, {
					detail,
				}),
			);
		},
		addWindowObject() {
			/**
			 * @type {CartDrawer}
			 */
			// @ts-ignore
			const cartdrawer = window.kuu?.cartDrawer || {};

			const open = () => {
				window.dispatchEvent(
					new CustomEvent('drawer:open', { detail: { id: 'cartdrawer' } }),
				);
			};

			const close = () => {
				window.dispatchEvent(
					new CustomEvent('drawer:close', { detail: { id: 'cartdrawer' } }),
				);
			};

			const refresh = this.updateCartDrawer.bind(this);

			const settings = this.settings;

			const updateSettings = this.updateSettings.bind(this);

			const getSettings = this._getSettings.bind(this);

			this.setWindowObject({
				open,
				close,
				refresh,
				settings,
				updateSettings,
				getSettings,
			});
		},
		getActiveElementSelector() {
			// --- CAPTURE CURRENT FOCUS USING data-line ATTRIBUTE ---
			const active = document.activeElement;
			let restoreSelector = null;

			if (active) {
				const lineEl = active.closest('[data-line]');
				if (lineEl) {
					const line = lineEl.getAttribute('data-line');
					if (line) {
						if (active.matches('input')) {
							restoreSelector = `[data-line="${line}"] input`;
						} else if (active.matches('button[data-qty-increase]')) {
							restoreSelector = `[data-line="${line}"] button[data-qty-increase]`;
						} else if (active.matches('button[data-qty-decrease]')) {
							restoreSelector = `[data-line="${line}"] button[data-qty-decrease]`;
						} else if (active.matches('button[data-qty-remove]')) {
							// optional: add data attribute to remove button for consistency
							restoreSelector = `[data-line="${line}"] button[data-qty-remove]`;
						} else {
							// fallback - focus on entire line container
							restoreSelector = `[data-line="${line}"]`;
						}
					}
				}
			}

			return restoreSelector;
		},
		/**
		 * Announce a message for screen readers
		 * @param {string} message
		 */
		announce(message) {
			const cartDrawerRegion = document.querySelector(
				'#cartdrawer-live-region',
			);
			if (cartDrawerRegion) {
				cartDrawerRegion.textContent = '';

				setTimeout(() => {
					cartDrawerRegion.textContent = message;
				}, 100);
			}
		},
		setWindowObject(/** @type {Partial<CartDrawer>} */ options) {
			const kuu = window.kuu || {};
			/** @type {CartDrawer} */
			let cartDrawer = kuu.cartDrawer || {};
			cartDrawer = {
				...cartDrawer,
				...options,
			};
			kuu.cartDrawer = cartDrawer;
			window.kuu = kuu;
		},
		/**
		 * Returns the contrast color (Black/White) based on the given HEX color.
		 * @param {string} hex
		 */
		_getContrastColor(hex) {
			return window.kuu?.utils?.getContrastColor(hex) || '#000000';
		},
		_getSettings() {
			return this.settings;
		},
	}));
});
