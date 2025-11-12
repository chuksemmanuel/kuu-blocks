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

    Alpine.data('cartDrawer', () => ({
        /**
         * The key of the item currently being updated.
         * Used to show per-item spinners.
         * @type {string|null}
         */
        updatingKey: null,

        /**
         * The cart update message.
         * @type {{message: string|null, key: string|null, type: 'warning'|'success'|'error'} | null}
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
        async init() {
            // Populate items quantity

            try {
                const cartRes = await fetch('/cart.js')
                /** @type {ShopifyCart} */
                const cart = await cartRes.json()
                if (!cartRes.ok) {

                    const cartErr = await cartRes.json()
                    throw new Error(`${cartErr?.message || 'Failed to fetch cart'}`)
                }
                cart.items.forEach((item) => {
                    this.itemsQuantity[item.key] = item.quantity
                })

                console.log('items quantity', this.itemsQuantity)
            } catch (error) {
                console.log(error)
            }

        },
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
         * Clear the cart update message.
         */
        clearCartMessage() {
            this.cartMessage = null
        },
        /**
         * Add a message to the cart drawer.
         * @param {string} message - Message to display
         * @param {'warning'|'success'|'error'} type - Message type
         * @param {string | null} key - Unique cart item key
         */
        setCartMessage(message, type = "error", key = null) {
            this.cartMessage = { message, type, key }
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


            if (value.length === 0) {
                this.updateQuantityValue(key, this.itemsQuantity[key] || 1)
                return
            }

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
            this.clearCartMessage()

            try {
                // Update cart item quantity via Shopify AJAX API
                const cartRes = await fetch('/cart/change.js', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: key, quantity }),
                })

                if (!cartRes.ok) {
                    // Revert optimistic update on error
                    this.updateQuantityValue(key, this.itemsQuantity[key] || 1)
                    const cartErr = await cartRes.json()
                    throw new Error(`${cartErr?.message || 'Failed to update cart'}`)
                }

                /** @type {ShopifyCart} */
                const cart = await cartRes.json()

                // Update ItemsQuantity
                cart.items.forEach((item) => {
                    this.itemsQuantity[item.key] = item.quantity
                })

                // Reflect the confirmed quantity from server
                const newQuantity = cart?.items?.find((item) => item.key === key)?.quantity ?? null
                if (newQuantity && newQuantity !== quantity) {
                    this.setCartMessage(`Only ${newQuantity} item${newQuantity > 1 ? 's' : ''} left in stock`, 'warning', key)
                    this.updateQuantityValue(key, newQuantity)
                }

                // Refresh the cart drawer content
                await this.updateCartDrawer()
            } catch (err) {
                console.log('Cart update failed', err)
                if (typeof err === 'string') {

                    this.setCartMessage(err, 'error', key)

                } else if (err instanceof Error) {
                    this.setCartMessage(err.message, 'error', key)
                } else {
                    this.setCartMessage('Unable to update cart. Please try again.', 'error', key)

                }


                // Revert optimistic update on error
                this.updateQuantityValue(key, this.itemsQuantity[key] || 1)


            } finally {
                this.updatingKey = null
            }
        },
        async updateCartDrawer() {
            try {
                // Fetch updated cart drawer section
                const res = await fetch('/?sections=cartdrawer')
                const data = await res.json()
                const cartContent = document.querySelector('#cartdrawer-content')
                const cartBubble = document.querySelector('#cart-bubble')

                const fragment = new DOMParser().parseFromString(data.cartdrawer, 'text/html')
                const newContent = fragment.querySelector('#cartdrawer-content')
                const newBubble = fragment.querySelector('#cart-bubble')

                if (cartContent && newContent) {
                    Alpine.morph(cartContent, newContent)
                }
                if (cartBubble && newBubble) {
                    Alpine.morph(cartBubble, newBubble)
                }
            } catch (error) {
                this.setCartMessage('Unable to update cart. Please try again.', 'error')

                console.log('Failed to update cart drawer', error)
            }

        }
    }))
})