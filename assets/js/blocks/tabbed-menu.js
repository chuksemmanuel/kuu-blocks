/**
 * @typedef {HTMLElement} TabContent
 * @typedef {HTMLElement} TabButton
 */

document.addEventListener('alpine:init', () => {
    const Alpine = window.Alpine;

    Alpine.data('tabbedMenu', () => ({
        tabSelected: '{{ tab_list.first }}',
        /**
         * @param {TabContent} tabContent 
         */
        getContentID(tabContent) {
            return tabContent.id.replace('-content', '')
        },
        /**
         * @param {TabButton} tabButton 
         */
        tabButtonClicked(tabButton) {
            this.tabSelected = tabButton.id;
            this.tabRepositionMarker(tabButton);
        },
        /**
         * @param {TabButton} tabButton 
         */
        tabRepositionMarker(tabButton) {

            if (tabButton)
                this.$refs.tabMarker.style.width = tabButton.offsetWidth + 'px';
            this.$refs.tabMarker.style.height = tabButton.offsetHeight + 'px';
            this.$refs.tabMarker.style.left = tabButton.offsetLeft + 'px';
        },
        /**
         * @param {TabContent} tabContent 
         */
        tabContentActive(tabContent) {
            return this.tabSelected == this.getContentID(tabContent);
        },
        /**
         * @param {TabContent} tabContent 
         */
        tabButtonActive(tabContent) {
            const tabId = this.getContentID(tabContent);
            return this.tabSelected == tabId;
        }
    }))
})