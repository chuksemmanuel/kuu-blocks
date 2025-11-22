document.addEventListener('alpine:init', () => {
	const Alpine = window.Alpine;

	Alpine.data('announcement', () => ({
		announcement: '',
		debounceTimer: {},
		init() {
			/** @ts-ignore */
			window.kuu = window.kuu || {};
			window.kuu.announce = this.announce.bind(this);
		},
		/**
		 * Announce a message for screen readers
		 * @param {string} message
		 */
		announce(message) {
			let annoucementEl = document.querySelector('#announcement');
			if (!annoucementEl) {
				return;
			}
			annoucementEl.textContent = '';
			this.announcement = ''; // reset
			setTimeout(() => {
				this.announcement = message;
				annoucementEl.textContent = message;
			}, 500);
		},
	}));
});
