
document.addEventListener('alpine:init', () => {
    const Alpine = window.Alpine

    Alpine.data('quickAddForm', () => ({
        adding: false,
        /** @type {string | undefined} */
        productId: undefined,
        /** @type {Product | null} */
        product: null,
        /** @type {Variant | null} */
        selectedVariant: null,
        /** @type {string[]} */
        variantImages: [],
        /** @type {Record<string, {value:string,position:number}>} */
        options: {},
        /** @type {{name:string,position:number;values:string[]}[]} */
        optionWithValues: [],
        /** @type {string | undefined} */
        featuredImageSrc: undefined,
        /** @type {   HTMLElement | null} */
        $image: null,
        preloaded: false,
        /** @type {Record<string, Record<string, string[]>>} */
        compatible: {},
        init() {
            this.productId = this.$el.dataset.productId
            const script = document.getElementById(`quick-add-data-${this.productId}`)
            if (!script) {
                return
            }
            const data = JSON.parse(script.textContent)


            const { product, variant_to_use, variant_images, options_with_values } = data
            this.product = product
            this.variantImages = variant_images
            this.optionWithValues = options_with_values
            this.selectedVariant = variant_to_use
            this.featuredImageSrc = this.getFeaturedImage()
            this.$image = this.$refs.image
            this.productId = this.$el.dataset.quickAddForm



            // Adjust drawer content height
            setTimeout(() => {
                let $innerContent = this.$refs.quickAddInner
                this.$el.style.setProperty('height', `${Math.min($innerContent.scrollHeight + 48, 460)}px`, 'important');
            }, 500)



            // Set Options
            if (this.product && this.selectedVariant) {

                for (let i = 0; i < this.product.options.length; i++) {
                    this.options[product.options[i]] = {
                        value: this.selectedVariant.options[i],
                        position: i
                    }
                }
            }



            // Watch for options changes
            this.$watch('options', () => {

                const sortedOptions = Object.values(this.options).sort((a, b) => a.position - b.position).map(optionValue => {
                    return optionValue.value
                })

                if (!this.product) return
                const newSelectedVariant = this.product.variants.find(variant => {
                    return variant.options.join(',') === sortedOptions.join(',')

                })

                this.selectedVariant = newSelectedVariant ?? this.selectedVariant
                let newFeaturedImage = this.getFeaturedImage(newSelectedVariant)

                if (this.featuredImageSrc != newFeaturedImage) {
                    this.featuredImageSrc = newFeaturedImage
                    if (this.$image && this.$image instanceof HTMLImageElement) {
                        if (this.featuredImageSrc)
                            this.$image.src = this.featuredImageSrc
                    }
                }

                this.updateDisabledOptions()
            })

            // Build compatibility lookup
            if (this.product) {

                const product = this.product
                product.options.forEach((optionName, idx) => {
                    this.compatible[optionName] = {}

                    // For every possible value of this option
                    this.optionWithValues[idx].values.forEach(v => {
                        const val = v
                        this.compatible[optionName][val] = []

                        // Find variants which contain this value at this position
                        product.variants.forEach(variant => {
                            if (variant.options[idx] === val) {
                                // Add corresponding values of ALL OTHER options
                                product.options.forEach((otherOptName, otherIdx) => {
                                    if (otherIdx !== idx) {
                                        const otherValue = variant.options[otherIdx]
                                        if (!this.compatible[optionName][val].includes(otherValue)) {
                                            this.compatible[optionName][val].push(otherValue)
                                        }
                                    }
                                })
                            }
                        })
                    })
                })



            }




            // Prelaod variant images on intial drawer open
            const preloadImages = (/** @type {Event} */ e) => {
                const event = /** @type {CustomEvent<{ id: string }>} */ (e)
                if (event.detail?.id === `quick-add-${this.productId}`) {
                    (this.variantImages).forEach(variantImage => {
                        const img = new Image()
                        img.src = variantImage
                    })

                    this.preloaded = true
                }
            }

            window.addEventListener('drawer:opened', preloadImages)

            // Remove event listener after variant images are preloaded
            this.$watch('preloaded', () => {
                if (this.preloaded == true) {

                    window.removeEventListener('drawer:opened', preloadImages)
                }
            })

            this.updateDisabledOptions()
        },
        async handleAddToCart() {

            if (!this.selectedVariant) return
            const quantity = this.selectedVariant?.quantity_rule?.min || 1;
            const id = this.selectedVariant.id

            try {
                this.adding = true
                await fetch('/cart/add.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        items: [
                            {
                                id: id,
                                quantity: quantity
                            }
                        ]
                    })
                })

                let cartDrawer = window.theme?.cartDrawer
                if (cartDrawer) {
                    await cartDrawer.refresh()

                    window.dispatchEvent(new CustomEvent('drawer:close', {
                        detail: {
                            id: `quick-add-${this.productId}`
                        }
                    }))

                    cartDrawer.open()
                }
            } catch (e) {
                console.log(e)
            } finally {

                this.adding = false
            }

        },
        /**
         * 
         * @param {Variant} [variant]
         */
        getFeaturedImage(variant) {
            const v = variant || this.selectedVariant
            return v?.featured_image?.src || this.product?.featured_image || this.product?.images[0]
        },
        updateDisabledOptions() {
            const product = this.product

            if (!product) return
            const selections = Object.fromEntries(
                Object.entries(this.options).map(([k, v]) => [k, v.value])
            )



            // For each option group (Color, Size, Material...)
            product.options.forEach((optionName, idx) => {
                const currentlySelected = selections[optionName]

                // Determine allowed values based on OTHER selections
                /** @type {string[]} */
                let allowed = []

                // For each value in this option
                Object.keys(this.compatible[optionName]).forEach(value => {
                    let isCompatible = true

                    // Check compatibility with all other options
                    product.options.forEach((otherName, otherIdx) => {
                        if (otherName === optionName) return

                        const selectedOther = selections[otherName]
                        if (!selectedOther) return

                        // Check if this value is compatible with the selected value of the other option
                        if (!this.compatible[otherName][selectedOther].includes(value)) {
                            isCompatible = false
                        }
                    })

                    if (isCompatible) allowed.push(value)
                })

                // Disable incompatible DOM inputs
                const inputs = this.$root.querySelectorAll(
                    `input[name="${optionName}"], select[name="${optionName}"] option`
                )

                inputs.forEach(input => {
                    if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
                        const val = input.value
                        const isAllowed = allowed.includes(val)
                        input.disabled = !isAllowed
                    }



                })
            })
        },
        /**
         * 
         * @param {string | number} amount 
         * @param {string} currency 
         * @param {string} locale 
         * @returns string
         */
        formatMoney(amount, currency, locale) {
            // Shopify gives prices in cents, so convert if number is large

            currency = currency ?? window?.Shopify?.currency?.active ?? 'USD'
            locale = locale ?? window?.Shopify?.locale ?? 'en-US'
            const value = typeof amount === "number"
                ? amount / 100
                : parseFloat(amount) / 100;

            return new Intl.NumberFormat(locale, {
                style: "currency",
                currency: currency,
            }).format(value);
        }


    }))


});
