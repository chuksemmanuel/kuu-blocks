/**
 * Alpine component for managing the Shopify cart drawer.
 * Handles optimistic quantity updates, debounced network syncs,
 * and per-item loading indicators.
 *
 * UX goals:
 * - Instant feedback on input or button clicks (no lag)
 * - Debounced requests to avoid flooding Shopify's API
 * - Spinner only on the currently updating item
 */

document.addEventListener('alpine:init', () => {
    const Alpine = window.Alpine
    console.log('Alpine for cartdrawer is initialized')

    Alpine.data('cartDrawer', () => ({
        /**
         * The key of the item currently being updated.
         * Used to show per-item spinners.
         * @type {string|null}
         */
        updatingKey: null,

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
         * Sanitize user input to allow only numeric values.
         * @param {Event} event - Input event from quantity field
         */
        filterNumeric(event) {
            const el = event.target
            if (!(el instanceof HTMLInputElement)) return
            el.value = el.value.replace(/\D/g, '')
        },

        /**
         * Handles manual typing in the quantity input.
         * Optimistically updates local state and triggers a debounced update.
         *
         * @param {Event} event - Input event
         * @param {string} key - Unique cart item key
         */
        onQuantityInput(event, key) {
            const el = event.target
            if (!(el instanceof HTMLInputElement)) return
            const value = el.value.trim()

            // Save optimistic quantity immediately
            this.pendingQuantities[key] = value
            this.debounceCartUpdate(key, value)
        },

        /**
         * Handles clicks on increment/decrement buttons.
         * Updates the input immediately and debounces the request.
         *
         * @param {string} key - Unique cart item key
         * @param {string} newQuantity - New quantity after click
         */
        onQuantityClick(key, newQuantity) {
            this.updateQuantityValue(key, newQuantity)

            this.pendingQuantities[key] = newQuantity
            this.debounceCartUpdate(key, newQuantity)
        },

        /**
         * Updates the quantity input value optimistically.
         * @param {*} key - Unique cart item key
         * @param {*} newQuantity - New quantity after click
         */
        updateQuantityValue(key, newQuantity) {
            const cartItem = document.querySelector(`[key="${key}"]`)

            /** @type {HTMLInputElement|null|undefined} */
            const input = cartItem?.querySelector('input[type="text"]')
            if (input) input.value = newQuantity
        },

        /**
         * Debounces cart updates to avoid sending too many requests.
         * Each item key has its own independent debounce timer.
         *
         * @param {string} key - Unique cart item key
         * @param {number|string} quantity - Target quantity
         */
        debounceCartUpdate(key, quantity) {
            clearTimeout(this.debounceTimers[key])

            this.debounceTimers[key] = setTimeout(() => {
                this.updateQuantity(key, quantity)
            }, 500) // Wait 0.5s after last input/click
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
            this.updatingKey = key

            try {
                // Update cart item quantity via Shopify AJAX API
                const cartRes = await fetch('/cart/change.js', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: key, quantity }),
                })

                const cart = await cartRes.json()
                console.log('Cart updated', cart)

                // Reflect the confirmed quantity from server
                const newQuantity = cart.items.find((item) => item.key === key)?.quantity
                if (newQuantity) {
                    this.updateQuantityValue(key, newQuantity)
                }

                // Fetch updated cart drawer section
                const res = await fetch('/?sections=cartdrawer')
                const data = await res.json()

                const cartContent = document.querySelector('#cartdrawer-content')
                const fragment = new DOMParser().parseFromString(data.cartdrawer, 'text/html')
                const newContent = fragment.querySelector('#cartdrawer-content')

                if (cartContent && newContent) {
                    Alpine.morph(cartContent, newContent)
                }
            } catch (err) {
                console.error('Cart update failed', err)
            } finally {
                this.updatingKey = null
            }
        },
    }))
})