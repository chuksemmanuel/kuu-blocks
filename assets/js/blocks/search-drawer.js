document.addEventListener('alpine:init', () => {
    const Alpine = window.Alpine
    console.log('alpine loaded for searchdrawer now')

    Alpine.data('searchDrawer', () => ({
        searchTerm: 'Caramel Macchiato',
        /** @type {HTMLElement | null} */
        $searchInput: null,
        init() {
            this.$searchInput = this.$refs.searchInput
        },
        clearSearchTerm() {
            this.searchTerm = ''
            this.$searchInput?.focus()
        }
    }))
})