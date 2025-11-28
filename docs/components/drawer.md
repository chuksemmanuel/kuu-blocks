# Drawer

A versatile slide-in drawer component with smooth GSAP animations. Perfect for cart drawers, navigation menus, search interfaces, and any content that needs to slide in from the edges of the screen.

## Preview

```liquid
{% render 'kuu-drawer',
	trigger: trigger_content,
	content: drawer_content,
	id: 'my-drawer',
	from: 'right'
%}
```

## Dependencies

- **Snippet:** `snippets/kuu-drawer.liquid`
- **JavaScript:** `assets/js/components/kuu-drawer.js`
- **External Library:** GSAP (for smooth animations)

## Installation

### 1. Add the Snippet

Create `snippets/kuu-drawer.liquid` and paste the drawer markup.

### 2. Add the JavaScript

Download `assets/js/components/kuu-drawer.js` and place it in `assets/js/components/`.

### 3. Include the Script

Add the drawer script to your `snippets/kuu-script.liquid`:

```liquid
<script src='{{ 'js/components/drawer.js' | asset_url }}' defer></script>
```

### 4. Ensure GSAP is Loaded

The drawer requires GSAP for animations. Make sure it's included in your `snippets/kuu-js-lib.liquid`:

```liquid
<script src='{{ 'js/lib/gsap@3.13.0.min.js' | asset_url }}' defer></script>
```

## Usage

### Basic Usage

```liquid
{% capture my_trigger %}
  {% render 'kuu-button', label: 'Open Drawer' %}
{% endcapture %}

{% capture my_content %}
  <div class="p-4">
    <h2>Drawer Content</h2>
    <p>Your content here</p>
  </div>
{% endcapture %}

{% render 'kuu-drawer',
	trigger: my_trigger,
	content: my_content,
	id: 'my-drawer',
	from: 'right'
%}
```

### Directions

The drawer can slide in from any edge:

```liquid
{% render 'kuu-drawer', from: 'left', ... %}
{% render 'kuu-drawer', from: 'right', ... %}
{% render 'kuu-drawer', from: 'top', ... %}
{% render 'kuu-drawer', from: 'bottom', ... %}
```

### Responsive Direction

Set different directions for mobile and desktop:

```liquid
{%
	render 'kuu-drawer',
	from: 'right',
	mobile_from: 'bottom',
	...
%}
```

### Headless Mode

Use headless mode when you want to control the trigger separately:

```liquid
{% render 'kuu-drawer',
	headless: true,
	content: drawer_content,
	id: 'my-drawer',
	from: 'right'
%}

<!-- Trigger from anywhere -->
<button onclick="window.dispatchEvent(new CustomEvent('drawer:open', { detail: { id: 'my-drawer' } }))">
	Open Drawer
</button>
```

### Programmatic Control

Open and close drawers programmatically using custom events:

```javascript
/**
 * Open a drawer
 */
window.dispatchEvent(
	new CustomEvent('drawer:open', {
		detail: { id: 'cartdrawer' },
	}),
);

// Close a drawer
window.dispatchEvent(
	new CustomEvent('drawer:close', {
		detail: { id: 'cartdrawer' },
	}),
);
```

### Real-World Example: Cart Drawer

```liquid
{% capture cart_trigger %}
  {% render 'kuu-button',
    variant: 'white',
    size: 'icon',
    icon: 'icons/shopping-cart.svg',
    class: 'rounded-full!',
    aria_label: 'Open Shopping cart'
  %}
{% endcapture %}

{% capture cart_content %}
  <div class="flex h-full w-full flex-col rounded-lg bg-white shadow-lg">
    <!-- Header -->
    <div class="flex items-center justify-between p-5">
      <span class="text-lg font-semibold">Cart</span>
      {% render 'kuu-button',
        icon: 'icons/cancel.svg',
        size: 'icon',
        props: 'data-drawer-close',
        aria_label: 'Close Cart Drawer'
      %}
    </div>
    
    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-5">
      <!-- Cart items here -->
    </div>
  </div>
{% endcapture %}

{% render 'kuu-drawer',
	trigger: cart_trigger,
	content: cart_content,
	id: 'cartdrawer',
	from: 'right'
%}
```

## Props

| Prop            | Type      | Default      | Description                                                         |
| :-------------- | :-------- | :----------- | :------------------------------------------------------------------ |
| `trigger`       | `String`  | -            | Captured HTML for the trigger button (ignored if `headless: true`). |
| `content`       | `String`  | **Required** | Captured HTML for the drawer content.                               |
| `id`            | `String`  | **Required** | Unique identifier for the drawer (e.g., `'cartdrawer'`, `'menu'`).  |
| `from`          | `String`  | `'right'`    | Direction the drawer slides from: `left`, `right`, `top`, `bottom`. |
| `mobile_from`   | `String`  | `from`       | Different direction for mobile devices.                             |
| `headless`      | `Boolean` | `false`      | If true, the trigger is not rendered (control externally).          |
| `drawer_class`  | `String`  | `''`         | Additional classes for the drawer wrapper.                          |
| `panel_class`   | `String`  | `''`         | Additional classes for the drawer panel.                            |
| `trigger_class` | `String`  | `''`         | Additional classes for the trigger wrapper.                         |
| `overlay_class` | `String`  | `''`         | Additional classes for the overlay.                                 |
| `class`         | `String`  | `''`         | Additional classes for the panel (same as `panel_class`).           |

## Block Settings

When used as a block (`blocks/kuu-drawer.liquid`), the following settings are available in the Theme Editor:

- **Direction:** Choose drawer slide direction (left, right, top, bottom)
- **Mobile Direction:** Set a different direction for mobile devices
- **Drawer Heading:** Title displayed in the drawer header
- **Hide Header:** Option to hide the default header

## JavaScript API

### Events

The drawer listens to and dispatches custom events:

**Listen for:**

- `drawer:open` - Opens the drawer
- `drawer:close` - Closes the drawer

**Dispatches:**

- `drawer:opened` - Fired when drawer finishes opening
- `drawer:closed` - Fired when drawer finishes closing

### Example Event Listeners

```javascript
// Listen for drawer opened
window.addEventListener('drawer:opened', (e) => {
	console.log('Drawer opened:', e.detail.id);
});

// Listen for drawer closed
window.addEventListener('drawer:closed', (e) => {
	console.log('Drawer closed:', e.detail.id);
});
```

## Accessibility

The drawer component includes built-in accessibility features:

- **ARIA Attributes:** Proper `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby`
- **Focus Management:** Automatically focuses the first focusable element when opened
- **Keyboard Support:** Press `Escape` to close the drawer
- **Focus Trap:** Keeps focus within the drawer while open
- **Screen Reader Announcements:** Live region support for dynamic content updates

## Styling

### Custom Classes

Add custom classes to different parts of the drawer:

```liquid
{%
	render 'kuu-drawer',
	drawer_class: 'custom-wrapper',
	panel_class: 'custom-panel bg-gray-50',
	overlay_class: 'custom-overlay',
	trigger_class: 'custom-trigger',
	...
%}
```

### Close Button

Add `data-drawer-close` attribute to any element inside the drawer to make it close the drawer:

```liquid
<button data-drawer-close>Close</button>
```

## Tips

1. **Unique IDs:** Always use unique IDs for each drawer to avoid conflicts.
2. **Content Structure:** Wrap your drawer content in a container with proper styling (background, padding, rounded corners).
3. **Mobile Optimization:** Use `mobile_from` to optimize drawer direction for smaller screens (e.g., `bottom` works well on mobile).
4. **Performance:** The drawer uses GSAP for smooth 60fps animations even on lower-end devices.
5. **Theme Editor:** The drawer automatically reopens after section reloads in the Shopify theme editor.

## Related Components

- [Button](pages/docs-components-button) - Often used as drawer triggers
- [Cart Drawer](pages/docs-blocks-cartdrawer) - Pre-built cart drawer implementation
- [Search Drawer](pages/docs-blocks-searchdrawer) - Pre-built search drawer implementation
