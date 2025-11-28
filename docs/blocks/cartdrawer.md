# Cart Drawer

A fully-featured, production-ready cart drawer with optimistic updates, debounced network requests, and comprehensive customization options. Perfect for modern e-commerce experiences with smooth animations and real-time cart management.

## Preview

The Cart Drawer automatically appears when users add products to their cart, displaying:

- Product images and titles
- Variant information
- Quantity controls with +/- buttons
- Real-time price updates
- Compare-at prices and savings badges
- Sticky header and footer options
- Checkout button with optional lock icon

## Dependencies

- **Block:** `blocks/kuu-cartdrawer.liquid`
- **Snippets:**
  - `snippets/kuu-cartdrawer.liquid` (main wrapper)
  - `snippets/cartdrawer-items.liquid` (cart items list)
  - `snippets/cartdrawer-footer.liquid` (footer with total and CTAs)
- **JavaScript:** `assets/js/blocks/kuu-cartdrawer.js`
- **Dependencies:** Drawer component, Button component

## Installation

### 1. Add the Block

Add `blocks/kuu-cartdrawer.liquid` to your theme.

### 2. Add Required Snippets

Download and add:

- `snippets/kuu-cartdrawer.liquid`
- `snippets/cartdrawer-items.liquid`
- `snippets/cartdrawer-footer.liquid`

### 3. Add the JavaScript

Place `assets/js/blocks/kuu-cartdrawer.js` in `assets/js/blocks/`.

### 4. Include the Script

Add to your `snippets/kuu-script.liquid`:

```liquid
<script src='{{ 'js/blocks/kuu-cartdrawer.js' | asset_url }}' defer></script>
```

### 5. Add to Theme Editor

In your theme's `sections/header-group.json` or header section, add the Cart Drawer block.

## Features

### 1. **Optimistic UI Updates**

- Instant visual feedback when changing quantities
- Smooth transitions without page reloads
- Automatic reversion on errors

### 2. **Debounced Network Requests**

- Prevents excessive API calls during rapid clicks
- 500ms debounce per item
- Independent timers for each cart item

### 3. **Per-Item Loading States**

- Individual spinners for updating items
- Non-blocking UI (other items remain interactive)
- Clear visual feedback

### 4. **Smart Error Handling**

- Stock limit warnings
- Network error messages
- Automatic quantity reversion on failure
- Screen reader announcements

### 5. **Sticky Header & Footer**

- Optional sticky positioning
- Keeps cart total and checkout button visible
- Configurable via Theme Editor

### 6. **Price Display Options**

- Show/hide compare-at prices
- Custom color for sale prices
- Savings badges with custom colors
- Automatic contrast color calculation

### 7. **Accessibility**

- ARIA live regions for updates
- Screen reader announcements
- Keyboard navigation support
- Focus management after updates

## Block Settings

Configure the cart drawer through the Shopify Theme Editor:

### Layout

| Setting                  | Type     | Default | Description                               |
| :----------------------- | :------- | :------ | :---------------------------------------- |
| **Enable sticky header** | Checkbox | `true`  | Keeps cart header visible while scrolling |
| **Enable sticky footer** | Checkbox | `true`  | Keeps total and checkout button visible   |

### Cart Items

| Setting                   | Type     | Default   | Description                                 |
| :------------------------ | :------- | :-------- | :------------------------------------------ |
| **Show variant title**    | Checkbox | `true`    | Display variant options (Size, Color, etc.) |
| **Show compare-at price** | Checkbox | `false`   | Show original price when on sale            |
| **Final price color**     | Color    | `#fb2c36` | Color for discounted prices                 |
| **Show savings badge**    | Checkbox | `false`   | Display "Saved $X" badge                    |
| **Savings badge color**   | Color    | `#fb2c36` | Background color for savings badge          |

### Cart Drawer Footer

| Setting                     | Type     | Default                 | Description                          |
| :-------------------------- | :------- | :---------------------- | :----------------------------------- |
| **Show lock icon**          | Checkbox | `true`                  | Display lock icon on checkout button |
| **Checkout button label**   | Text     | `"Proceed to Checkout"` | Custom checkout button text          |
| **Show secondary button**   | Checkbox | `true`                  | Display "Continue Shopping" button   |
| **Secondary button label**  | Text     | `"Continue Shopping"`   | Custom secondary button text         |
| **Secondary button action** | Select   | `close-drawer`          | Action: close drawer or open link    |
| **Secondary button link**   | URL      | `/`                     | Link when action is "open-link"      |

## JavaScript API

### Window Object

The cart drawer exposes a global API via `window.kuu.cartDrawer`:

```javascript
// Open the cart drawer
window.kuu.cartDrawer.open();

// Close the cart drawer
window.kuu.cartDrawer.close();

// Refresh cart content
await window.kuu.cartDrawer.refresh();

// Get current settings
const settings = window.kuu.cartDrawer.getSettings();

// Update settings
window.kuu.cartDrawer.updateSettings({
	showComparePrice: true,
	finalPriceColor: '#ff0000',
});
```

### Events

Listen to cart drawer events:

```javascript
// Cart drawer initialized
window.addEventListener('cartdrawer:init', (e) => {
	console.log('Cart initialized', e.detail);
});

// Cart drawer updating
window.addEventListener('cartdrawer:updating', (e) => {
	console.log('Cart updating', e.detail.cartDrawer);
});
```

### Refresh with Callbacks

```javascript
await window.kuu.cartDrawer.refresh({
	beforeRefresh: (newCartDrawer, cart) => {
		console.log('Before refresh', cart);
	},
	afterRefresh: (cartDrawer, cart) => {
		console.log('After refresh', cart);
	},
});
```

## Extensibility

### Adding Custom Elements

The cart drawer has three main areas where you can add custom content:

#### 1. Header Area

Add elements before or after the cart header in `snippets/kuu-cartdrawer.liquid`:

```liquid
<!-- After header -->
<div data-drawer-header class='shrink-0'>
	<!-- Existing header -->

	<!-- Custom element -->
	<div class='bg-blue-50 px-5 py-2'>
		<p class='text-sm'>Free shipping on orders over $50!</p>
	</div>
</div>
```

#### 2. Scrollable Area

Add content between items and footer in `snippets/kuu-cartdrawer.liquid`:

```liquid
<div class='flex-1 overflow-y-auto'>
	{% render 'cartdrawer-items', ... %}

	<!-- Custom upsell section -->
	<div class='px-5 py-4'>
		<h3 class='mb-2 font-semibold'>You might also like</h3>
		<!-- Product recommendations -->
	</div>

	<!-- Footer if not sticky -->
</div>
```

#### 3. Footer Area

Modify `snippets/cartdrawer-footer.liquid` to add elements:

```liquid
<div id='cartdrawer-footer'>
	<!-- Custom promo code input -->
	<div class='px-4 py-2'>
		<input
			type='text'
			placeholder='Promo code'
			class='w-full rounded border px-3 py-2'
		>
	</div>

	<!-- Existing total and buttons -->
</div>
```

### A/B Testing

Use the JavaScript API for A/B testing:

```javascript
// Test different checkout button labels
const variant = Math.random() > 0.5 ? 'A' : 'B';

if (variant === 'A') {
	// Change button label dynamically
	document.querySelector('#cartdrawer-footer button').textContent =
		'Complete Purchase';
} else {
	// Use default label
}

// Track which variant converts better
```

### Custom Styling

Override default styles with custom classes:

```liquid
{%
	render 'kuu-cartdrawer',
	panel_class: 'custom-cart-panel',
	...
%}
```

```css
.custom-cart-panel {
	background: linear-gradient(to bottom, #ffffff, #f9fafb);
}
```

## Advanced Usage

### Programmatic Cart Updates

```javascript
// Add item to cart and open drawer
fetch('/cart/add.js', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ id: variantId, quantity: 1 }),
}).then(() => {
	window.kuu.cartDrawer.refresh();
	window.kuu.cartDrawer.open();
});
```

### Custom Quantity Validation

Modify `kuu-cartdrawer.js` to add custom validation:

```javascript
async updateQuantity(key, quantity) {
  // Custom validation
  if (quantity > 10) {
    this.setCartMessage({
      message: 'Maximum 10 items per product',
      type: 'warning',
      key
    });
    return;
  }

  // Continue with update...
}
```

### Dynamic Settings

Change settings based on cart value:

```javascript
window.addEventListener('cartdrawer:updating', (e) => {
	const cart = window.kuu.cartDrawer.cart;

	if (cart.total_price > 5000) {
		// $50+
		window.kuu.cartDrawer.updateSettings({
			showSavingsBadge: true,
			savingsBadgeColor: '#10b981', // Green for free shipping
		});
	}
});
```

## Tips

1. **Sticky Footer:** Enable sticky footer for better UX on mobile devices
2. **Compare Prices:** Show compare-at prices to highlight savings
3. **Custom Colors:** Match sale price colors to your brand
4. **Secondary CTA:** Use "Continue Shopping" to reduce cart abandonment
5. **Loading States:** The drawer handles all loading states automatically
6. **Focus Management:** Focus is preserved during updates for better accessibility
7. **Error Recovery:** Failed updates automatically revert to previous quantity

## Accessibility

The cart drawer includes comprehensive accessibility features:

- **ARIA Live Regions:** Announces cart updates to screen readers
- **Focus Management:** Maintains focus position during updates
- **Keyboard Navigation:** Full keyboard support for all controls
- **Screen Reader Labels:** Descriptive labels for all interactive elements
- **Error Announcements:** Errors are announced to assistive technologies
- **Loading States:** Communicated to screen readers

## Related Components

- [Drawer](/docs/components/drawer) - Base drawer component
- [Button](/docs/components/button) - Used for CTAs and controls
- [Product Card](/docs/components/product-card) - For upsell sections
