// assets/js/features/cartdrawer/cart-drawer-items.js

document.addEventListener('alpine:init', () => {
    const Alpine = window.Alpine
    console.log('Alpine for cartdrawer is initialized')

    Alpine.data('cartDrawer', () => ({
        updating: false,
        updatingKey: null, // track which item is updating
        /**
         * Debounce timers for quantity inputs
         * @type {Object<string, number>}
         */
        debounceTimers: {},

        /**
         * Sanitize input (allow only numbers)
         * @param {Event} event
         * @param {string} key
         */
        filterNumeric(event, key) {
            const el = event.target
            if (!(el instanceof HTMLInputElement)) return
            el.value = el.value.replace(/\D/g, '')
        },

        /**
         * Handle manual input (debounced update)
         * @param {Event} event
         * @param {string} key
         */
        onQuantityInput(event, key) {
            const el = event.target
            if (!(el instanceof HTMLInputElement)) return
            const value = el.value.trim()

            // Cancel previous debounce
            clearTimeout(this.debounceTimers[key])

            // Debounce update (wait 500ms after user stops typing)
            this.debounceTimers[key] = setTimeout(() => {
                const quantity = value
                if (!Number.isFinite(Number(quantity))) return
                this.updateQuantity(key, quantity)
            }, 500)
        },

        /**
         * Update cart item quantity and morph the drawer
         * @param {string} key
         * @param {string } quantity
         * @returns {Promise<void>}
         */
        async updateQuantity(key, quantity) {
            if (this.updating) return


            // Optimistically update input value
            const cartItem = document.querySelector(`[key="${key}"]`)
            if (cartItem) {
                /** @type {HTMLInputElement | null} */
                const input = cartItem.querySelector('input[type="text"]')
                if (input) input.value = quantity
            }
            this.updating = true
            try {
                await fetch('/cart/change.js', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: key, quantity }),
                })

                // Re-render the cart drawer section
                const res = await fetch('/?sections=cartdrawer')
                const data = await res.json()

                const cartContent = document.querySelector('#cartdrawer-content')
                if (!cartContent) return

                const fragment = new DOMParser().parseFromString(data.cartdrawer, 'text/html')
                const newContent = fragment.querySelector('#cartdrawer-content')
                if (!newContent) return

                Alpine.morph(cartContent, newContent)
            } catch (err) {
                console.error('Cart update failed', err)
            } finally {
                this.updating = false
            }
        },
    }))
})