# Search Drawer

A powerful, real-time search drawer with debounced input, tabbed results, and smooth animations. Searches across products, collections, and pages with instant visual feedback and highlighted search terms.

## Preview

The Search Drawer provides:

- Real-time search as you type (debounced)
- Tabbed results for Products, Collections, and Pages
- Search term highlighting
- Loading skeleton states
- Smooth transitions and animations
- Responsive design with configurable directions

## Dependencies

- **Block:** `blocks/kuu-searchdrawer.liquid`
- **Snippets:**
  - `snippets/kuu-searchdrawer.liquid` (main wrapper)
  - `snippets/kuu-searchdrawer-content.liquid` (search interface)
  - `snippets/kuu-searchdrawer-item.liquid` (result item)
  - `snippets/kuu-searchdrawer-content-skeleton.liquid` (loading state)
- **JavaScript:** `assets/js/blocks/kuu-searchdrawer.js`
- **Dependencies:** Drawer component, Button component

## Installation

### 1. Add the Block

Add `blocks/kuu-searchdrawer.liquid` to your theme.

### 2. Add Required Snippets

Download and add all search drawer snippets to `snippets/`.

### 3. Add the JavaScript

Place `assets/js/blocks/kuu-searchdrawer.js` in `assets/js/blocks/`.

### 4. Include the Script

Add to your `snippets/kuu-script.liquid`:

```liquid
<script src='{{ 'js/blocks/kuu-searchdrawer.js' | asset_url }}' defer></script>
```

### 5. Add to Theme Editor

In your header section, add the Search Drawer block.

## Features

### 1. **Real-Time Search**

- Searches as you type
- 500ms debounce to prevent excessive API calls
- Uses Shopify's Predictive Search API
- Instant results without page reload

### 2. **Tabbed Results**

- Separate tabs for Products, Collections, and Pages
- Automatic tab switching based on results
- Smooth tab transitions
- Only shows tabs with results

### 3. **Search Term Highlighting**

- Highlights matching terms in results
- Yellow background for easy visibility
- Works across all result types

### 4. **Loading States**

- Skeleton screen during search
- Smooth fade transitions
- Non-blocking UI
- Clear visual feedback

### 5. **Smart Empty States**

- "Start typing to search..." when empty
- "No results found" per tab
- Helpful messaging

### 6. **Responsive Design**

- Different drawer directions for mobile/desktop
- Device-specific visibility options
- Optimized for all screen sizes

### 7. **Auto-Focus**

- Automatically focuses search input when opened
- Keyboard-friendly navigation
- Clear button for quick reset

## Block Settings

Configure the search drawer through the Shopify Theme Editor:

### Display Options

| Setting              | Type   | Default       | Description                                            |
| :------------------- | :----- | :------------ | :----------------------------------------------------- |
| **Show Drawer on**   | Select | `All Devices` | Device visibility: All, Mobile Only, Desktop Only      |
| **Button Variant**   | Select | `Circled`     | Trigger button style: Circled or Ghost                 |
| **Drawer Direction** | Select | `Right`       | Direction drawer slides from: Top, Bottom, Left, Right |
| **Mobile Direction** | Select | `Top`         | Different direction for mobile devices                 |

## JavaScript API

### Component Methods

Access via Alpine.js:

```javascript
// Get search drawer component
const searchDrawer = Alpine.$data(
	document.querySelector('[x-data="searchDrawer()"]'),
);

// Clear search
searchDrawer.clearSearchTerm();

// Check if search is empty
const isEmpty = searchDrawer.isSearchEmpty();

// Set active tab
searchDrawer.setActiveTab('collections');

// Manually trigger search
await searchDrawer.fetchResults();
```

### Properties

- `searchTerm` - Current search query
- `activeTab` - Currently active tab ('products', 'collections', 'pages')
- `loading` - Whether search is in progress
- `$searchInput` - Reference to input element
- `$resultsContainer` - Reference to results container

## Search API

The search drawer uses Shopify's Predictive Search API:

```
/search/suggest?q={query}&section_id=search-drawer&resources[limit]=10&resources[limit_scope]=each
```

### Customizing Search Limits

Modify the endpoint in `kuu-searchdrawer.js`:

```javascript
const endpoint = `/search/suggest?q=${encodeURIComponent(this.searchTerm)}&section_id=search-drawer&resources[limit]=20&resources[limit_scope]=each`;
```

## Customization

### Custom Trigger Button

Modify `snippets/kuu-searchdrawer.liquid` to change the trigger:

```liquid
{% capture search_trigger_custom %}
  {% render 'kuu-button',
    variant: 'primary',
    size: 'default',
    label: 'Search',
    icon: 'icons/search.svg',
    class: 'custom-search-btn'
  %}
{% endcapture %}
```

### Custom Result Item

Edit `snippets/kuu-searchdrawer-item.liquid` to customize how results appear:

```liquid
<a href='{{ item.url }}' class='custom-result-item'>
	<!-- Custom layout -->
	<div class='result-image'>
		<img
			src='{{ item.featured_image | image_url: width: 100 }}'
			alt='{{ item.title }}'
		>
	</div>
	<div class='result-details'>
		<h3>{{ item.title | highlight: terms }}</h3>
		{% if type == 'product' %}
			<span class='price'>{{ item.price | money }}</span>
			<span class='vendor'>{{ item.vendor }}</span>
		{% endif %}
	</div>
</a>
```

### Custom Styling

Override default styles:

```css
/* Highlight color */
[data-search-item] .highlight {
	background: #your-color;
	color: #text-color;
}

/* Tab buttons */
[data-search-tab] {
	/* Custom tab styles */
}

/* Result items */
[data-search-item] {
	/* Custom item styles */
}
```

### Debounce Timing

Adjust the debounce delay in `kuu-searchdrawer.js`:

```javascript
handleInput() {
  const delay = 300; // Change from 500ms to 300ms
  // ...
}
```

## Advanced Usage

### Adding Custom Filters

Extend the search to include filters:

```javascript
async fetchResults() {
  const filters = '&resources[type]=product&resources[options][unavailable_products]=hide';
  const endpoint = `/search/suggest?q=${encodeURIComponent(this.searchTerm)}&section_id=search-drawer${filters}`;
  // ...
}
```

### Analytics Tracking

Track search queries:

```javascript
handleInput() {
  // Track search
  if (window.gtag) {
    gtag('event', 'search', {
      search_term: this.searchTerm
    });
  }

  // Continue with debounce...
}
```

### Custom Empty State

Modify `snippets/kuu-searchdrawer-content.liquid`:

```liquid
<div x-show='!loading && isSearchEmpty()' class='empty-state'>
	<img src='search-icon.svg' alt='Search'>
	<h3>What are you looking for?</h3>
	<p>Try searching for products, collections, or pages</p>
</div>
```

### Popular Searches

Add popular searches when drawer opens:

```liquid
<div x-show='isSearchEmpty()' class='popular-searches'>
	<h4>Popular Searches</h4>
	<div class='search-tags'>
		<button @click="searchTerm = 'shirts'; handleInput()">Shirts</button>
		<button @click="searchTerm = 'shoes'; handleInput()">Shoes</button>
		<button @click="searchTerm = 'accessories'; handleInput()">
			Accessories
		</button>
	</div>
</div>
```

## Tips

1. **Debounce Timing:** 500ms is optimal for most use cases
2. **Result Limits:** 10 items per category balances performance and UX
3. **Mobile Direction:** Use "Top" for better mobile experience
4. **Button Variant:** "Circled" is more prominent, "Ghost" is more subtle
5. **Auto-Focus:** Drawer automatically focuses input for immediate typing
6. **Clear Button:** Always visible for quick reset
7. **Skeleton Loading:** Provides visual feedback during search

## Accessibility

The search drawer includes comprehensive accessibility features:

- **ARIA Roles:** Proper `tablist`, `tab`, `tabpanel` roles
- **ARIA Labels:** Descriptive labels for all interactive elements
- **ARIA Selected:** Tab state communicated to screen readers
- **Screen Reader Text:** Hidden descriptions for context
- **Keyboard Navigation:** Full keyboard support
- **Focus Management:** Auto-focus on open, preserved during updates
- **Live Regions:** Search results announced to assistive technologies

## Performance

### Optimizations

1. **Debounced Input:** Prevents excessive API calls
2. **Alpine Morph:** Only updates changed DOM elements
3. **Lazy Loading:** Results load on-demand
4. **Efficient Transitions:** CSS-based animations
5. **Skeleton States:** Perceived performance improvement

### Best Practices

- Keep result limits reasonable (10-20 per category)
- Use appropriate debounce timing (300-500ms)
- Optimize images in search results
- Cache search results when possible

## Related Components

- [Drawer](/docs/components/drawer) - Base drawer component
- [Button](/docs/components/button) - Used for trigger and controls
- [Tab](/docs/components/tab) - Tab functionality for results
