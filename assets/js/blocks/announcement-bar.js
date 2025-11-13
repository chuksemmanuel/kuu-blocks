// features/announcement-bar/announcement-bar.js


/**
 * Alpine component for Announcement Bar
 * Usage in markup: x-data="announcementBar({ id: 'section-id' })"
 */



/**
 * @typedef {Object} AnnouncementBar
 * @property {import('swiper').Swiper} [swiper] - The Swiper instance
 * @property {Function} init - Initializes the component
 * @property {Function} destroy - Cleans up the component
 */

/**
 * Initializes an Alpine announcement bar component with Swiper slider.
 *  @param {HTMLElement} element - The root element of the announcement bar section
 * @returns {AnnouncementBar}
 */
function announcementBar(element) {

    return {
        swiper: undefined,

        /**
         * Initializes Swiper slider and sets up the announcement bar
         */
        init() {

            if (!element) return;

            const sliderEl = element.querySelector(`.swiper`);
            console.log('sliderEl', sliderEl);
            if (!sliderEl || !(sliderEl instanceof HTMLElement)) return;

            // Initialize Swiper if available
            if (typeof window.Swiper !== 'undefined') {
                /** @type {typeof import('swiper')} */


                this.swiper = new window.Swiper(sliderEl, {
                    direction: 'horizontal',
                    slidesPerView: 'auto',
                    freeMode: true,
                    loop: true,
                    autoplay: {
                        delay: 3000,
                    },
                    scrollbar: {
                        el: '.swiper-scrollbar',
                        hide: true,
                    },
                    mousewheel: true,
                    breakpoints: {
                        1200: {
                            enabled: false
                        },
                    },
                });
            }
        },

        /**
         * Destroys the Swiper instance if it exists
         */
        destroy() {
            if (this.swiper && this.swiper.destroy) {
                this.swiper.destroy(true, true);
            }
        },
    };
}
console.log('Alpine is', window.Alpine)


// Register with Alpine when loaded
if (window.Alpine) {
    console.log('Alpine is loaded');
    window.Alpine.data('announcementBar', announcementBar);
    window.Alpine.start()
} else {
    console.log('Alpine is not loaded, we are waiting');
    document.addEventListener('alpine:init', () => {
        console.log('Alpine is loaded now');
        window.Alpine.data('announcementBar', announcementBar);
    });
}
