
document.addEventListener('alpine:init', () => {
    const Alpine = window.Alpine;
    console.log('Alpine for cartdrawer is initialized');
    Alpine.data('cartDrawer', () => ({
        updating: false,

        /**
         * 
         * @param {Event} event 
         * @param {string} key 
         */
        filterNumeric(event, key) {
            const el = event.target;
            if (!(el instanceof HTMLInputElement)) return;
            el.value = el.value.replace(/\D/g, '')
        },

        /**
         * 
         * @param {string} key 
         * @param {string | number} quantity 
         * @returns 
         */
        updateQuantity(key, quantity) {
            if (this.updating) return
            this.updating = true

            fetch('/cart/change.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: key, quantity })
            })
                .then(() => {
                    // Re-render the cart drawer section
                    return fetch('/?sections=cartdrawer')
                })
                .then(res => res.json())
                .then(data => {
                    // Morph cart drawer section
                    let cartContent = document.querySelector('#cartdrawer-content')
                    if (!cartContent) return;

                    const fragment = new DOMParser().parseFromString(data.cartdrawer, 'text/html');

                    const FragmentCartContent = fragment.querySelector('#cartdrawer-content');
                    if (!FragmentCartContent) return;

                    console.log();

                    Alpine.morph(
                        cartContent,
                        FragmentCartContent
                    )
                })
                .catch(err => console.error('Cart update failed', err))
                .finally(() => {
                    this.updating = false
                })
        },
    }))
})