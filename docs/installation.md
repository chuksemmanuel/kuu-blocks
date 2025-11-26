# Installation Guide

This guide provides step-by-step instructions for adding the required CSS and JavaScript assets to a Shopify theme when using Kuu components.

## 1. CSS Management

Kuu uses **Tailwind CSS** primarily for styling and its own **`kuu.css`** for additional custom styles. You should download these files and include them in your asset directory under `assets/css/`.

### Setup

1. **Create a stylesheet snippet** – `snippets/kuu-stylesheet.liquid`.
2. **Include the core styles** – Kuu's core CSS `kuu.css` and the compiled Tailwind CSS.
3. **Render the snippet** in `layout/theme.liquid` before the closing `</head>` tag:

```liquid
{% render 'kuu-stylesheet' %}
```

**Example `snippets/kuu-stylesheet.liquid`**

```liquid
{% # Kuu css %}
{{ 'css/kuu.css' | asset_url | stylesheet_tag: preload: true }}
{% # Tailwind css %}
{{ 'css/tailwind.css' | asset_url | stylesheet_tag: preload: true }}
```

> **NOTE**: Also render `snippets/css-variables.liquid` (most likely included in your theme) to expose dynamic CSS variables.

## 2. Script Management

Some Kuu components rely on JavaScript for their functionality. Create a snippet called `snippets/kuu-script.liquid` to manage component and block scripts.

### Setup

1. **Create the script snippet** – `snippets/kuu-script.liquid`.
2. **Include the global Kuu utilities** – This is required for all Kuu components.
3. **Add component-specific scripts** – For each component or block you use, add its corresponding script.
4. **Render the snippet** in `layout/theme.liquid` before the closing `</head>` tag:

```liquid
{% render 'kuu-script' %}
```

**Example `snippets/kuu-script.liquid`** (minimal setup)

```liquid
{%- comment -%}
	Module preload critical scripts
{%- endcomment -%}
<link rel='modulepreload' href='{{ 'js/kuu.js' | asset_url }}'>

{% # Global Utilities %}
<script src='{{ 'js/kuu.js' | asset_url }}' defer></script>
```

**Example `snippets/kuu-script.liquid`** (with components and blocks)

```liquid
{%- comment -%}
	Module preload critical scripts
{%- endcomment -%}
<link rel='modulepreload' href='{{ 'js/kuu.js' | asset_url }}'>

{% # Global Utilities %}
<script src='{{ 'js/kuu.js' | asset_url }}' defer></script>

{% # Components %}
<script src='{{ 'js/components/tab.js' | asset_url }}' defer></script>
<script src='{{ 'js/components/drawer.js' | asset_url }}' defer></script>

{% # Blocks %}
<script src='{{ 'js/blocks/searchdrawer.js' | asset_url }}' defer></script>
```

> **NOTE**: Remember to upload the scripts to the appropriate directory:
>
> - `assets/js/components/` for components
> - `assets/js/blocks/` for blocks

## 3. External Libraries

Kuu primarily uses **Alpine.js** for most of its JavaScript functionality. Some Kuu components rely on external libraries for enhanced features. Below is a list of libraries Kuu uses:

### Core Libraries

- **Alpine.js** – Lightweight reactive framework (43kb) for interactive UI components
  - **Alpine Plugins** – `collapse`, `morph`, and `focus` for enhanced functionality
- **GSAP** – Animation library for smooth transitions
- **Swiper.js** – Touch slider for carousels and galleries

### Optional Libraries

- **Lucide** – Icon library for rendering SVG icons

### Setup

Create a snippet called `snippets/kuu-js-lib.liquid` to manage external libraries. This snippet should be rendered at the **very bottom** of `layout/theme.liquid`, just before the closing `</body>` tag.

```liquid
{% render 'kuu-js-lib' %}
```

**Example `snippets/kuu-js-lib.liquid`**

```liquid
{% comment %} External Libraries {% endcomment %}

{% comment %} Core Libraries {% endcomment %}
{% # Gsap.js %}
<script src='{{ 'js/lib/gsap@3.13.0.min.js' | asset_url }}' defer></script>
{% # Swiper.js %}
<script src='{{ 'js/lib/swiperjs@12.0.3.min.js' | asset_url }}' defer></script>

{% comment %} Alpine {% endcomment %}
{% # Alpine Plugins %}
<script
	src='{{ 'js/lib/alpinejs-collapse@3.min.js' | asset_url }}'
	defer
></script>
<script src='{{ 'js/lib/alpinejs-morph@3.min.js' | asset_url }}' defer></script>
<script src='{{ 'js/lib/alpinejs-focus@3.min.js' | asset_url }}' defer></script>
{% # Alpine Core %}
<script src='{{ 'js/lib/alpinejs@3.15.1.min.js' | asset_url }}' defer></script>

{% comment %} Optional Libraries {% endcomment %}
{% # Lucide icons %}
<script src='{{ 'js/lib/lucide.js' | asset_url }}' defer></script>
<script>
	document.addEventListener('DOMContentLoaded', () => {
	  // Initialise icons on page load
	  if (window.lucide) lucide.createIcons();
	  // Re-initialise in Theme Editor when sections reload
	  {% if request.design_mode %}
	    window.addEventListener('shopify:section:load', () => {
	      if (window.lucide) lucide.createIcons();
	    });
	  {% endif %}
	});
</script>
```

### Script Loading Order

The order in which scripts are loaded matters:

1. **Core Libraries** – loaded first (GSAP, Swiper)
2. **Alpine.js Plugins** – must appear before the Alpine core script
3. **Alpine Core** – loaded after all plugins
4. **Optional Libraries** – loaded after core libraries (Lucide)

> **IMPORTANT**: Keep the `kuu-js-lib` snippet as the last include in the body to avoid conflicts. All Alpine plugins must be loaded before the Alpine core script.

## 4. Putting It All Together

Here's the complete setup in your `layout/theme.liquid`:

```liquid
<!doctype html>
<html>
	<head>
		<!-- Other head content -->

		{% render 'css-variables' %}
		{% render 'kuu-stylesheet' %}
		{% render 'kuu-script' %}

		{{ content_for_header }}
	</head>
	<body>
		<!-- Your theme content -->

		{% render 'kuu-js-lib' %}
	</body>
</html>
```

### Summary

1. Add the **CSS** snippet (`kuu-stylesheet.liquid`) in the `<head>`
2. Add the **Script** snippet (`kuu-script.liquid`) in the `<head>`
3. Add the **External Libraries** snippet (`kuu-js-lib.liquid`) before the closing `</body>` tag
4. Deploy the theme or run `shopify theme dev` to see the changes locally

With this structure, you have a clean, modular approach to managing Kuu's assets while keeping your theme organized and maintainable.
