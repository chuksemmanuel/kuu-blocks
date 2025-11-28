# Tab

An accessible, flexible tab component for organizing content into switchable panels. Perfect for product collections, feature showcases, or any content that benefits from categorization.

## Preview

```liquid
{% capture tab_triggers %}
  <button data-tab-trigger="tab1">Tab 1</button>
  <button data-tab-trigger="tab2">Tab 2</button>
{% endcapture %}

{% capture tab_contents %}
  <div data-tab-content="tab1">Content for Tab 1</div>
  <div data-tab-content="tab2">Content for Tab 2</div>
{% endcapture %}

{% render 'kuu-tab',
	triggers: tab_triggers,
	contents: tab_contents,
	id: 'my-tabs'
%}
```

## Dependencies

- **Snippet:** `snippets/kuu-tab.liquid`
- **JavaScript:** `assets/js/components/kuu-tab.js`
- **Helper:** `snippets/horizontal-scroll.liquid` (for scrollable tab buttons)

## Installation

### 1. Add the Snippet

Create `snippets/kuu-tab.liquid` and paste the tab markup.

### 2. Add the JavaScript

Download `assets/js/components/kuu-tab.js` and place it in `assets/js/components/`.

### 3. Include the Script

Add the tab script to your `snippets/kuu-script.liquid`:

```liquid
<script src='{{ 'js/components/tab.js' | asset_url }}' defer></script>
```

## Usage

### Basic Usage

```liquid
{% capture triggers %}
  <div role="tablist" class="flex gap-2">
    <button data-tab-trigger="about" class="rounded px-4 py-2">About</button>
    <button data-tab-trigger="features" class="rounded px-4 py-2">Features</button>
    <button data-tab-trigger="reviews" class="rounded px-4 py-2">Reviews</button>
  </div>
{% endcapture %}

{% capture contents %}
  <div data-tab-content="about" class="p-4">
    <h2>About</h2>
    <p>Product information here...</p>
  </div>
  
  <div data-tab-content="features" class="p-4">
    <h2>Features</h2>
    <ul>
      <li>Feature 1</li>
      <li>Feature 2</li>
    </ul>
  </div>
  
  <div data-tab-content="reviews" class="p-4">
    <h2>Reviews</h2>
    <p>Customer reviews here...</p>
  </div>
{% endcapture %}

{% render 'kuu-tab',
	triggers: triggers,
	contents: contents,
	id: 'product-tabs',
	trigger_class: 'mb-4',
	content_class: 'border rounded-lg'
%}
```

### With Horizontal Scroll

For many tabs, use the horizontal scroll helper:

```liquid
{% capture tab_buttons %}
  <button data-tab-trigger="new">New Arrivals</button>
  <button data-tab-trigger="sale">On Sale</button>
  <button data-tab-trigger="best">Best Sellers</button>
  <button data-tab-trigger="trending">Trending</button>
{% endcapture %}

{% capture triggers %}
  {% render 'horizontal-scroll',
    content: tab_buttons,
    id: 'product-tabs',
    class: 'h-10 gap-2'
  %}
{% endcapture %}

{% capture contents %}
  <div data-tab-content="new">New products...</div>
  <div data-tab-content="sale">Sale items...</div>
  <div data-tab-content="best">Best sellers...</div>
  <div data-tab-content="trending">Trending now...</div>
{% endcapture %}

{% render 'kuu-tab',
	triggers: triggers,
	contents: contents,
	id: 'product-tabs'
%}
```

### Using the Block

When using `blocks/kuu-tab.liquid`, you can add tab items through the Theme Editor:

1. Add a **Kuu Tab** block to your section
2. Add **Tab Item** blocks inside it
3. Each Tab Item has a title and can contain any blocks

The tab buttons are automatically generated from the Tab Item titles.

### Real-World Example: Product Collections

```liquid
{% assign tab_id = 'collections-tab' %}

{% capture tab_triggers %}
  {% render 'horizontal-scroll',
    content: '',
    id: tab_id,
    class: 'h-10 gap-2 select-none'
  %}
{% endcapture %}

{% capture tab_contents %}
  <div data-tab-content="New Arrivals" class="p-4">
    {% for product in collections['new-arrivals'].products limit: 8 %}
      {% render 'product-card', product: product %}
    {% endfor %}
  </div>
  
  <div data-tab-content="Best Sellers" class="p-4">
    {% for product in collections['best-sellers'].products limit: 8 %}
      {% render 'product-card', product: product %}
    {% endfor %}
  </div>
  
  <div data-tab-content="On Sale" class="p-4">
    {% for product in collections['sale'].products limit: 8 %}
      {% render 'product-card', product: product %}
    {% endfor %}
  </div>
{% endcapture %}

{% render 'kuu-tab',
	triggers: tab_triggers,
	contents: tab_contents,
	id: tab_id,
	class: 'flex flex-col h-full',
	trigger_class: 'shrink-0 pb-4',
	content_class: 'flex-1 overflow-y-auto'
%}

<script>
	// Populate tab buttons dynamically
	function populateTabButtons() {
		const container = document.querySelector(
			'[data-horizontal-scroll="{{ tab_id }}"]',
		);
		const tabEl = document.querySelector('[data-tab-id="{{ tab_id }}"]');
		const contents = tabEl.querySelectorAll('[data-tab-content]');

		container.innerHTML = '';

		contents.forEach((content) => {
			const title = content.dataset.tabContent;
			container.insertAdjacentHTML(
				'beforeend',
				`
        <button
          data-tab-trigger="${title}"
          role="tab"
          aria-label="${title}"
          :aria-selected="tabButtonActive($el)"
          :class="tabButtonActive($el) ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-500'"
          class="h-10 px-4 rounded-lg font-medium whitespace-nowrap transition"
        >
          ${title}
        </button>
      `,
			);
		});
	}

	populateTabButtons();
</script>
```

## Props

| Prop             | Type     | Default      | Description                                     |
| :--------------- | :------- | :----------- | :---------------------------------------------- |
| `triggers`       | `String` | **Required** | Captured HTML for the tab trigger buttons.      |
| `contents`       | `String` | **Required** | Captured HTML for the tab content panels.       |
| `id`             | `String` | `'tab'`      | Unique identifier for the tab component.        |
| `default_active` | `String` | First tab    | ID of the tab that should be active by default. |
| `class`          | `String` | `''`         | Additional classes for the tab wrapper.         |
| `trigger_class`  | `String` | `''`         | Additional classes for the triggers container.  |
| `content_class`  | `String` | `''`         | Additional classes for the contents container.  |

## Data Attributes

### For Triggers

Each tab trigger button must have:

```html
<button data-tab-trigger="unique-id">Tab Label</button>
```

### For Content

Each tab content panel must have:

```html
<div data-tab-content="unique-id">Content here</div>
```

> **IMPORTANT**: The `data-tab-trigger` value must match the corresponding `data-tab-content` value.

## Block Settings

When used as a block (`blocks/kuu-tab.liquid`), the following settings are available:

- **Padding:** Top, Bottom, Left, Right padding controls
- **Mobile Padding:** Separate padding controls for mobile devices
- **Tab Items:** Add multiple Tab Item blocks, each with:

* **Tab Title:** The label shown on the tab button
* **Content Blocks:** Any theme or app blocks can be added inside

## JavaScript API

### Methods

The tab component exposes these methods via Alpine.js:

```javascript
// Set active tab programmatically
Alpine.$data(tabElement).setActiveTab('tab-id');

// Check if a button is active
Alpine.$data(tabElement).tabButtonActive(buttonElement);

// Check if content is active
Alpine.$data(tabElement).tabContentActive(contentElement);
```

### Properties

- `activeTab` - Currently active tab ID
- `blockId` - Block ID (for nested tabs)
- `tabId` - Tab component ID

## Accessibility

The tab component includes built-in accessibility features:

- **ARIA Attributes:** Proper `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`
- **Keyboard Support:** Navigate tabs with arrow keys (when using proper ARIA attributes)
- **Focus Management:** Active tab is focusable (`tabindex="0"`), inactive tabs are not (`tabindex="-1"`)
- **Screen Reader Support:** Announces active tab state

## Styling

### Active State Styling

Use Alpine.js `:class` binding to style active tabs:

```html
<button
	data-tab-trigger="tab1"
	:class="tabButtonActive($el) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'"
>
	Tab 1
</button>
```

### Custom Styling

Add custom classes to different parts:

```liquid
{%
	render 'kuu-tab',
	class: 'custom-tab-wrapper',
	trigger_class: 'custom-triggers flex gap-2',
	content_class: 'custom-content p-4 border rounded',
	...
%}
```

## Dynamic Tab Buttons

For blocks that generate tabs dynamically (like `products-tab.liquid`), use a script to populate buttons:

```javascript
function populateTabButtons() {
  const container = document.querySelector('[data-horizontal-scroll="tab-id"]');
  const contents = document.querySelectorAll('[data-tab-content]');

  container.innerHTML = '';

  contents.forEach((content) => {
    const title = content.dataset.tabContent;
    container.insertAdjacentHTML('beforeend', `
      <button
        data-tab-trigger="${title}"
        role="tab"
        :aria-selected="tabButtonActive($el)"
        class="px-4 py-2 rounded-lg"
      >
        ${title}
      </button>
    `);
  });
}

populateTabButtons();

// Re-populate in Theme Editor
{% if request.design_mode %}
  window.addEventListener('shopify:section:load', populateTabButtons);
{% endif %}
```

## Tips

1. **Unique IDs:** Always use unique IDs for the tab component to avoid conflicts with nested tabs.
2. **Matching Attributes:** Ensure `data-tab-trigger` and `data-tab-content` values match exactly.
3. **Default Active:** Set `default_active` to control which tab shows first.
4. **Horizontal Scroll:** Use the `horizontal-scroll` helper for many tabs to prevent overflow.
5. **Theme Editor:** The component automatically handles section reloads in the Shopify theme editor.
6. **Nested Tabs:** The component supports nested tabs using `blockId` to prevent conflicts.

## Related Components

- [Horizontal Scroll](/docs/components/horizontal-scroll) - Used for scrollable tab buttons
- [Product Card](/docs/components/product-card) - Often used in tab content
- [Collection Card](/docs/components/collection-card) - Can be used in tab panels
