document.addEventListener('alpine:init', () => {
	const Alpine = window.Alpine;

	Alpine.data('tab', () => ({
		/** @type {string} */
		activeTab: '',
		/** @type {string | null} */
		blockId: null,

		init() {
			// Initialize active tab from data attribute or default
			// @ts-ignore
			this.activeTab = this.$el.dataset.defaultActive;

			if (this.$el.dataset.tabBlockId) {
				this.blockId = this.$el.dataset.tabBlockId;
			}

			console.log(this.$el.dataset.defaultActive);
			// If no default active is set, try to find the first trigger
			if (!this.activeTab) {
				console.log(this.activeTab);
				const firstTrigger = this.$el.querySelector('[data-tab-trigger]');
				if (firstTrigger instanceof HTMLElement) {
					this.activeTab = firstTrigger.dataset.tabTrigger || '';
				}
			}

			this.updateAttributes();

			// Watch for changes to activeTab to update attributes
			this.$watch('activeTab', () => {
				this.updateAttributes();
			});

			// Add click event listener for delegation
			this.$el.addEventListener('click', this.triggerHandler.bind(this));
		},

		destroy() {
			this.$el.removeEventListener('click', this.triggerHandler.bind(this));
		},

		/**
		 * @param {string} tabId
		 */
		setActiveTab(tabId) {
			this.activeTab = tabId;
		},
		/**
		 *
		 * @param {HTMLElement} button
		 * @returns
		 */
		tabButtonActive(button) {
			return button.dataset.tabTrigger === this.activeTab;
		},
		/**
		 *
		 * @param {HTMLElement} content
		 * @returns
		 */
		tabContentActive(content) {
			return content.dataset.tabContent === this.activeTab;
		},
		updateAttributes() {
			// Update Triggers
			const triggers = this.$el.querySelectorAll('[data-tab-trigger]');
			triggers.forEach((trigger) => {
				if (
					this.blockId &&
					trigger
						.closest('[data-tab-block-id]')
						?.getAttribute('data-tab-block-id') != this.blockId
				) {
					return;
				}
				if (!(trigger instanceof HTMLElement)) return;
				const id = trigger.dataset.tabTrigger;
				const isActive = id === this.activeTab;

				trigger.setAttribute('aria-selected', isActive ? 'true' : 'false');
				trigger.setAttribute('tabindex', isActive ? '0' : '-1');

				// Optional: Add active class if needed for styling hooks that don't use aria-selected
				if (isActive) {
					trigger.classList.add('active');
				} else {
					trigger.classList.remove('active');
				}
			});

			// Update Contents
			const contents = this.$el.querySelectorAll('[data-tab-content]');
			contents.forEach((content) => {
				// Handle cases where there is nested block tab
				if (
					this.blockId &&
					content
						.closest('[data-tab-block-id]')
						?.getAttribute('data-tab-block-id') != this.blockId
				) {
					return;
				}
				if (!(content instanceof HTMLElement)) return;
				const id = content.dataset.tabContent;
				const isActive = id === this.activeTab;

				if (isActive) {
					content.style.display = 'block';
					content.removeAttribute('hidden');
				} else {
					content.style.display = 'none';
					content.setAttribute('hidden', '');
				}
			});
		},

		// Event delegation for triggers
		/**
		 * @param {Event} e
		 */
		triggerHandler(e) {
			const target = /** @type {HTMLElement} */ (e.target);

			if (
				this.blockId &&
				target
					.closest('[data-tab-block-id]')
					?.getAttribute('data-tab-block-id') != this.blockId
			) {
				return;
			}
			const trigger = target.closest('[data-tab-trigger]');
			if (trigger instanceof HTMLElement) {
				this.setActiveTab(trigger.dataset.tabTrigger || '');
			}
		},
	}));
});
