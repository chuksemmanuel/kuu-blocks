# Horizontal Scroll

A draggable horizontal scroll container for creating smooth, touch-friendly scrolling experiences. Perfect for tab buttons, product carousels, image galleries, or any content that needs horizontal navigation.

## Preview

```liquid
{% capture scroll_content %}
  <div class="flex gap-4">
    <div class="h-32 w-48 shrink-0 rounded bg-gray-200">Item 1</div>
    <div class="h-32 w-48 shrink-0 rounded bg-gray-200">Item 2</div>
    <div class="h-32 w-48 shrink-0 rounded bg-gray-200">Item 3</div>
  </div>
{% endcapture %}

{% render 'horizontal-scroll', content: scroll_content, id: 'my-scroll' %}
```

## Dependencies

- **Snippet:** `snippets/horizontal-scroll.liquid`

## Installation

Simply create `snippets/horizontal-scroll.liquid` and paste the snippet code. No additional JavaScript files needed.

## Usage

### Basic Usage

```liquid
{% capture items %}
  <button class="shrink-0 rounded bg-gray-100 px-4 py-2">Button 1</button>
  <button class="shrink-0 rounded bg-gray-100 px-4 py-2">Button 2</button>
  <button class="shrink-0 rounded bg-gray-100 px-4 py-2">Button 3</button>
  <button class="shrink-0 rounded bg-gray-100 px-4 py-2">Button 4</button>
{% endcapture %}

{% render 'horizontal-scroll', content: items, id: 'buttons', class: 'gap-2' %}
```

### With Tab Buttons

```liquid
{% capture tab_buttons %}
  <button data-tab-trigger="new">New Arrivals</button>
  <button data-tab-trigger="sale">On Sale</button>
  <button data-tab-trigger="best">Best Sellers</button>
{% endcapture %}

{% render 'horizontal-scroll',
	content: tab_buttons,
	id: 'product-tabs',
	class: 'h-10 gap-2',
	props: 'role="tablist" aria-label="Product categories"'
%}
```

### Product Cards

```liquid
{% capture products %}
  {% for product in collection.products limit: 8 %}
    <div class="w-64 shrink-0">
      {% render 'product-card', product: product %}
    </div>
  {% endfor %}
{% endcapture %}

{% render 'horizontal-scroll',
	content: products,
	id: 'featured-products',
	class: 'gap-4 pb-4'
%}
```

## Props

| Prop      | Type     | Default      | Description                                         |
| :-------- | :------- | :----------- | :-------------------------------------------------- |
| `content` | `String` | **Required** | Captured HTML for the scrollable content.           |
| `id`      | `String` | `'scroll-x'` | Unique identifier for the scroll container.         |
| `class`   | `String` | `''`         | Additional Tailwind classes for styling.            |
| `props`   | `String` | `''`         | Additional HTML attributes (e.g., ARIA attributes). |

## Features

### 1. **Mouse Drag Scrolling**

- Click and drag to scroll horizontally
- Cursor changes to indicate draggable state
- Smooth drag experience with adjustable speed

### 2. **Touch Scrolling**

- Native touch scrolling on mobile devices
- Momentum scrolling support

### 3. **Hidden Scrollbar**

- Clean appearance with no visible scrollbar
- Uses `.no-scrollbar` class for cross-browser support

### 4. **Cursor Feedback**

- `cursor-grab` when idle
- `cursor-grabbing` when dragging

## Styling

### Default Behavior

The container includes:

- `overflow-x-auto` - Horizontal scrolling
- `overflow-y-hidden` - No vertical scroll
- `no-scrollbar` - Hides the scrollbar
- `flex` - Flexbox layout
- `gap-4` - Default gap between items (can be overridden)

### Custom Styling

Add custom classes via the `class` prop:

```liquid
{% render 'horizontal-scroll',
	content: items,
	class: 'gap-6 px-4 py-2 bg-gray-50'
%}
```

### Important: Shrink-0

Always add `shrink-0` to direct children to prevent them from shrinking:

```liquid
{% capture items %}
  <div class="w-64 shrink-0">Item 1</div>
  <div class="w-64 shrink-0">Item 2</div>
{% endcapture %}
```

## Accessibility

Add ARIA attributes via the `props` parameter:

```liquid
{% render 'horizontal-scroll',
	content: items,
	props: 'role="region" aria-label="Featured products" tabindex="0"'
%}
```

## Tips

1. **Fixed Width Items:** Give children a fixed width and `shrink-0` to prevent layout issues.
2. **Gap Spacing:** Use Tailwind gap utilities in the `class` prop (e.g., `gap-2`, `gap-4`, `gap-6`).
3. **Padding:** Add horizontal padding to show partial items at edges: `class: 'px-4'`.
4. **Height:** Set a fixed height if needed: `class: 'h-10'` or `class: 'h-64'`.
5. **Scroll Speed:** The drag speed multiplier is set to `1.5` in the snippet (adjust if needed).

## CSS Required

Ensure your theme has the `.no-scrollbar` utility:

```css
.no-scrollbar::-webkit-scrollbar {
	display: none;
}
.no-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
```

## Related Components

- [Tab](/docs/components/tab) - Uses horizontal scroll for tab buttons
- [Product Card](/docs/components/product-card) - Often displayed in horizontal scroll
