
/**
 * @typedef {'left' | 'right' | 'top' | 'bottom'} DrawerDirection
 * @typedef {Object} DrawerComponent
 * @typedef {{name:string}} DrawerEventDetail
 */



/**

 * @property {boolean} open - Whether the drawer is open
 * @property {DrawerDirection} direction - Direction the drawer slides from
 * @property {GSAPTimeline | null} tl - GSAP timeline instance for animations
 * @property {HTMLElement | null} $overlay - Drawer overlay element
 * @property {HTMLElement | null} $panel - Drawer panel element
 * @property {HTMLElement | null} lastFocusedElement - The last focused element before drawer opened
 * @property {string} name - Identifier of the drawer to target (e.g., 'cartDrawer', 'menuDrawer')
 * @property {(e: KeyboardEvent) => void} _escHandler - Escape key handler
 * @property {() => void} init - Initialize drawer, refs, and event listeners
 * @property {() => void} openDrawer - Opens the drawer with animation
 * @property {() => void} closeDrawer - Closes the drawer with animation
 * @property {() => void} destroy - Cleans up event listeners
 */

/**
 * Drawer Alpine.js component
 * Provides slide-in drawer behavior for cart, menu, etc.
 *
 * @param  [direction='right']
 * @returns {DrawerComponent}
 */
document.addEventListener('alpine:init', () => {
    const Alpine = window.Alpine
    const gsap = window.gsap

    Alpine.data('drawer', ( /** @type {DrawerDirection} */ direction = 'right') => {
        return {
            /** @type {boolean} */
            open: false,
            /** @type {DrawerDirection} */
            direction,
            /** @type {GSAPTimeline | null} */
            tl: null,
            /** @type {HTMLElement | null} */
            $overlay: null,
            /** @type {HTMLElement | null} */
            $panel: null,
            /** @type {HTMLElement | null} */
            lastFocusedElement: null,
            /** @type {string} */
            name: '',
            /** @type {(e: KeyboardEvent) => void} */
            _escHandler(e) {
                if (e.key === 'Escape' && this.open) this.closeDrawer()
            },

            init() {
                this.$overlay = this.$refs.overlay
                this.$panel = this.$refs.panel
                this.name = this.$el.dataset.drawerName || 'defaultDrawer'
                // Ensure the panel has base CSS for positioning 
                if (this.direction === 'left' || this.direction === 'right') {

                    Object.assign(this.$panel.style, {
                        top: '0',
                        height: '100vh',
                        width: '100%',
                        maxWidth: 'min(648px,100%)',
                        left: this.direction === 'left' ? '0' : 'auto',
                        right: this.direction === 'right' ? '0' : 'auto',
                        bottom: 'auto',
                    })
                } else {
                    // top / bottom
                    Object.assign(this.$panel.style, {
                        left: '0',
                        width: '100vw',
                        height: 'auto',
                        minHeight: '30svh',
                        top: this.direction === 'top' ? '0' : 'auto',
                        bottom: this.direction === 'bottom' ? '0' : 'auto',
                    })
                }

                // Put overlay & panel off-screen / hidden initially
                gsap.set(this.$overlay, { opacity: 0, pointerEvents: 'none' })

                // Set panel initial offscreen transform + hidden
                if (this.direction === 'left') {
                    gsap.set(this.$panel, { x: '-100%', y: 0, opacity: 0, visibility: 'hidden' })
                } else if (this.direction === 'right') {
                    gsap.set(this.$panel, { x: '100%', y: 0, opacity: 0, visibility: 'hidden' })
                } else if (this.direction === 'top') {
                    gsap.set(this.$panel, { y: '-100%', x: 0, opacity: 0, visibility: 'hidden' })
                } else if (this.direction === 'bottom') {
                    gsap.set(this.$panel, { y: '100%', x: 0, opacity: 0, visibility: 'hidden' })
                }

                // hook up data-drawer-close inside the panel
                this.$panel.addEventListener('click', e => {
                    if (e.target instanceof Element && e.target?.closest('[data-drawer-close]')) {
                        this.closeDrawer()
                    }
                })


                document.addEventListener('keydown', this._escHandler.bind(this))

                // 🔥 Listen to global open/close events
                window.addEventListener('drawer:open', (e) => {

                    const event = /** @type {CustomEvent<DrawerEventDetail>} */ (e)
                    if (event.detail?.name === this.name) this.openDrawer()
                })

                window.addEventListener('drawer:close', (e) => {
                    const event = /** @type {CustomEvent<DrawerEventDetail>} */ (e)
                    if (event.detail?.name === this.name) this.closeDrawer()
                })

            },

            openDrawer() {
                if (this.open) return
                this.open = true
                this.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
                document.body.classList.add('drawer-open')

                const overlay = this.$overlay
                const panel = this.$panel

                if (!overlay || !panel) return

                // make panel visible before animating so screen readers/focus can settle
                panel.style.visibility = 'visible'
                // allow overlay pointer events during open
                gsap.set(overlay, { pointerEvents: 'auto' })

                // Build timeline for overlay + panel
                const tl = gsap.timeline({
                    defaults: { ease: 'power3.out' }
                })

                tl.to(overlay, { opacity: 1, duration: 0.28 }, 0)

                if (this.direction === 'left' || this.direction === 'right') {
                    // animate x to 0
                    tl.to(panel, { x: '0%', opacity: 1, duration: 0.42 }, 0)
                } else {
                    // animate y to 0
                    tl.to(panel, { y: '0%', opacity: 1, duration: 0.42 }, 0)
                }

                // Focus management: move focus into the panel after animation frame
                tl.call(() => {
                    // try to focus the first focusable element inside panel, else panel itself
                    const focusable = panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
                    if (focusable && focusable instanceof HTMLElement) focusable.focus()
                    else panel.setAttribute('tabindex', '-1'), panel.focus()
                }, undefined, '>-0.02')

                this.tl = tl
            },

            closeDrawer() {
                if (!this.open) return
                const overlay = this.$overlay
                const panel = this.$panel

                if (!overlay || !panel) return

                // allow pointer events until animation finishes (we will disable after)
                gsap.set(overlay, { pointerEvents: 'none' })

                const tl = gsap.timeline({
                    defaults: { ease: 'power3.in' },
                    onComplete: () => {
                        // hide after animation
                        panel.style.visibility = 'hidden'
                        this.open = false
                        document.body.classList.remove('drawer-open')

                        // restore focus
                        if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
                            this.lastFocusedElement.focus()
                        }
                    }
                })



                if (this.direction === 'left') {
                    tl.to(panel, { x: '-100%', duration: 0.32 }, 0)
                } else if (this.direction === 'right') {
                    tl.to(panel, { x: '100%', duration: 0.32 }, 0)
                } else if (this.direction === 'top') {
                    tl.to(panel, { y: '-100%', duration: 0.32 }, 0)
                } else if (this.direction === 'bottom') {
                    tl.to(panel, { y: '100%', duration: 0.32 }, 0)
                }

                tl.to(overlay, { opacity: 0, duration: 0.32 }, 0.2)
            },

            // call to clean up listeners if needed
            destroy() {
                document.removeEventListener('keydown', this._escHandler)
            }
        }
    })

})
