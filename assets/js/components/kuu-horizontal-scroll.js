document.addEventListener('alpine:init', () => {
	const Alpine = window.Alpine;
	const Swiper = window.Swiper;

	Alpine.data('kuuHorizontalScroll', () => ({
		gap: 10,
		scrollBarVisible: false,
		progress: '10%',
		/**
		 * @type {Object<string, number>}
		 */
		debounceTimeout: {},
		init() {
			this.gap = Number(this.$el.dataset.gap ?? 10);

			this.$nextTick(() => {
				const swiper = new Swiper(this.$el, {
					direction: 'horizontal',
					slidesPerView: 'auto',
					spaceBetween: this.gap,
					freeMode: true,
					// scrollbar: {
					// 	el: '.swiper-scrollbar',
					// },
					mousewheel: true,
					on: {
						progress: (swiper, progress) => {
							const minWidthPercent = 10;
							const maxWidthPercent = 100;
							const dynamicWidth =
								minWidthPercent +
								progress * (maxWidthPercent - minWidthPercent);

							this.progress = `${dynamicWidth}%`;
						},
					},
				});
			});

			this.setScrollBarVisible();
			window.addEventListener('resize', () => {
				this.setScrollBarVisible();
			});
		},
		setScrollBarVisible() {
			clearTimeout(this.debounceTimeout['setScrollBarVisible']);
			this.debounceTimeout['setScrollBarVisible'] = setTimeout(() => {
				this.scrollBarVisible = this.$el.scrollWidth > this.$el.clientWidth;
			}, 100);
		},
	}));
});
