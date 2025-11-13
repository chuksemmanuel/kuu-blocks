/**
 * @typedef {'products' | 'collections' | 'pages'} tagType
 * @property {string} searchTerm - Current text entered in the search input
 * @property {string} defaultTab - Default result search tab
 * @property {boolean} loading - Whether a search request is currently in progress
 * @property {HTMLElement | null} $searchInput - Reference to the search input element
 * @property {HTMLElement | null} $resultsContainer - Reference to the container for search results
 * @property {() => void} init - Initialize the component (sets refs, listeners)
 * @property {() => void} clearSearchTerm - Clears the input and resets UI
 * @property {() => Promise<void>} fetchResults - Fetches results from Shopify suggest API and morphs DOM
 */


document.addEventListener('alpine:init', () => {
    const Alpine = window.Alpine

    /**
     * Alpine.js Search Drawer Component
     * Provides search functionality with morph-based live results.
     *
     * @returns {SearchDrawerComponent}
     */
    Alpine.data('searchDrawer', () => ({
        /** @type {string} */
        searchTerm: '',
        /** @type {string | null} */
        activeTab: null,
        /** @type {boolean} */
        loading: false,

        /** @type {HTMLElement | null} */
        $searchInput: null,

        /** @type {HTMLElement | null} */
        $resultsContainer: null,
        /** @type {HTMLElement | null} */
        $searchResults: null,
        /**
          * Debounce timers for each key (prevents duplicate requests).
          * @type {Record<string, number>}
          */
        debounceTimers: {},
        /**
         * Checks if the search input is empty.
         * @returns {boolean}
         */
        isSearchEmpty() {
            return this.searchTerm.trim() === ''
        },
        /**
         * 
         * @param {tagType} tab
         */
        setActiveTab(tab) {
            this.activeTab = tab
        },
        /** Initialize the component */
        init() {
            this.$searchInput = this.$refs.searchInput
            this.$resultsContainer = this.$refs.resultsContainer
            this.$searchResults = this.$refs.searchResults


            window.addEventListener('drawer:open', e => {
                const event = /** @type {CustomEvent<{ id: string }>} */ (e)
                if (event.detail.id.startsWith('searchdrawer')) {
                    this.$nextTick(() => this.$searchInput?.focus())
                }
            })
        },

        /** Clear the search input and reset the results container */
        clearSearchTerm() {
            this.searchTerm = ''
            this.$searchInput?.focus()
        },
        /**
         * Handles user input with manual debounce.
         * Prevents a new fetch while loading.
         */
        handleInput() {

            console.log('active_tab ==>', this.activeTab)

            // if (this.loading) return // Don’t interrupt active fetch
            this.loading = true
            const key = 'searchDrawer'
            const delay = 500 // ms

            // Clear any existing debounce
            if (this.debounceTimers[key]) {

                clearTimeout(this.debounceTimers[key])
            }

            // Set a new timer
            this.debounceTimers[key] = window.setTimeout(() => {
                console.log('making debounced call now')
                this.fetchResults()
            }, delay)
        },

        /** Fetch search results and morph them into the results container */
        async fetchResults() {

            this.loading = true

            const endpoint = `/search/suggest?q=${encodeURIComponent(this.searchTerm)}&section_id=search-drawer&resources[limit]=10&resources[limit_scope]=each`

            try {
                const response = await fetch(endpoint)
                if (!response.ok) throw new Error('Failed to fetch search results')

                const html = await response.text()

                const fragment = new DOMParser().parseFromString(html, 'text/html')

                const newResults = fragment.querySelector('#searchdrawer-results')
                console.log('okie', newResults)
                if (newResults && this.$searchResults) {

                    Alpine.morph(
                        this.$searchResults,
                        newResults
                    )

                    // if no products tab
                    if (!newResults.querySelector(`[data-search-tab='products']`)) {
                        // Set first tab to active

                        this.activeTab = this.$searchResults.querySelector("[data-search-tab]")?.getAttribute('data-search-tab') ?? 'products'
                    } else {
                        this.activeTab = 'products'
                    }
                } else {

                }
            } catch (err) {
                console.error('Error fetching search suggestions:', err)
            } finally {
                this.loading = false
            }
        },
    }))
})