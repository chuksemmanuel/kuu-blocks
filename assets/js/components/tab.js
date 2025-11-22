document.addEventListener('alpine:init', () => {
	const Alpine = window.Alpine;

	Alpine.data('tab', () => ({
		/** @type {string} */
		activeTab: '',

		init() {
			// Initialize active tab from data attribute or default
			// @ts-ignore
			this.activeTab = this.$el.dataset.defaultActive;

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

				// Bind click event if not already bound (Alpine handles this usually, but for raw elements)
				// We can use x-on:click in the markup or bind here.
				// Since we want flexibility, let's assume the user might not add @click.
				// However, adding event listeners repeatedly is bad.
				// Better approach: Event delegation on the root or assume user adds @click="setActiveTab('...')"
				// BUT, to make it "just work" like the drawer, we should probably handle the click.
				// Let's use Alpine's x-on behavior by adding it dynamically or using event delegation in init.
			});

			// Update Contents
			const contents = this.$el.querySelectorAll('[data-tab-content]');
			contents.forEach((content) => {
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
			const trigger = target.closest('[data-tab-trigger]');
			if (trigger instanceof HTMLElement) {
				this.setActiveTab(trigger.dataset.tabTrigger || '');
			}
		},
	}));
});
