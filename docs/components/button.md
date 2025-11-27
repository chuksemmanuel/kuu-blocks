# Button

A versatile, accessible button component that supports multiple variants, sizes, icons, and responsive styles. It can be rendered as a `<button>` or an `<a>` tag depending on the props.

## Preview

```liquid
{% render 'kuu-button', label: 'Click Me', variant: 'primary' %}
```

## Dependencies

- **Snippet:** `snippets/button.liquid`
- **Icons (Optional):** Lucide icons (via `lucide_icon` prop) or inline SVGs.

## Installation

### 1. Create the Snippet

Create a new file `snippets/button.liquid` and paste the source code.

> [!TIP]
> You can also find the source code in the `snippets/` directory of the Kuu blocks repository.

### 2. (Optional) Create the Block

If you want to offer merchant customization or use this button as a drag-and-drop block in the Theme Editor, create `blocks/kuu-button.liquid` and paste the schema code.

## Usage

### Basic Usage

```liquid
{% render 'kuu-button', label: 'Shop Now', href: '/collections/all' %}
```

### Variants

```liquid
{% render 'kuu-button', label: 'Primary', variant: 'primary' %}
{% render 'kuu-button', label: 'Secondary', variant: 'secondary' %}
{% render 'kuu-button', label: 'Outline', variant: 'outline' %}
{% render 'kuu-button', label: 'Ghost', variant: 'ghost' %}
{% render 'kuu-button', label: 'Destructive', variant: 'destructive' %}
```

### Sizes

```liquid
{% render 'kuu-button', label: 'Small', variant: 'primary', size: 'sm' %}
{% render 'kuu-button', label: 'Medium', variant: 'primary', size: 'md' %}
{% render 'kuu-button', label: 'Large', variant: 'primary', size: 'lg' %}
```

### With Icons

There are two ways to add icons to buttons:

#### 1. SVG Asset (Recommended for Performance)

Upload your SVG file to the `assets/icons/` directory (e.g., `assets/icons/shopping-cart.svg`) and pass the path to the `icon` prop. This is the most performant method as it uses inline SVGs.

```liquid
{% render 'kuu-button',
	variant: 'white',
	size: 'icon-lg',
	icon: 'icons/shopping-cart.svg',
	class: 'shadow-sm rounded-full!',
	aria_label: 'View Cart'
%}
```

#### 2. Lucide Icons (Easiest)

If you have the Lucide library installed (see [Installation](/docs/getting-started#3-external-libraries-eg-lucide-icons)), you can simply pass the icon name.

```liquid
<!-- Using Lucide Icon -->
{% render 'kuu-button', label: 'Add to Cart', lucide_icon: 'shopping-cart' %}

<!-- Icon Position -->
{% render 'kuu-button',
	label: 'Next',
	lucide_icon: 'arrow-right',
	icon_position: 'right'
%}
```

### Custom Styling

Override default styles with utility classes or specific props.

```liquid
{% render 'kuu-button',
	label: 'Custom Button',
	class: 'rounded-full! shadow-lg',
	color: '#ff0000',
	width: '100%'
%}
```

## Props

| Prop            | Type      | Default     | Description                                                                               |
| :-------------- | :-------- | :---------- | :---------------------------------------------------------------------------------------- |
| `label`         | `String`  | -           | The text content of the button.                                                           |
| `href`          | `String`  | -           | If provided, renders as an `<a>` tag.                                                     |
| `variant`       | `String`  | `'default'` | Visual style: `primary`, `secondary`, `outline`, `ghost`, `destructive`, `link`, `white`. |
| `size`          | `String`  | `'default'` | Size preset: `sm`, `default`, `lg`, `icon`, `icon-sm`, `icon-lg`, `full`.                 |
| `lucide_icon`   | `String`  | -           | Name of the Lucide icon to render (e.g., `arrow-right`).                                  |
| `icon_position` | `String`  | `'left'`    | Position of the icon relative to text: `left`, `right`, `top`, `bottom`.                  |
| `loading`       | `Boolean` | `false`     | If true, shows a loading spinner instead of the icon.                                     |
| `disabled`      | `Boolean` | `false`     | Disables the button.                                                                      |
| `class`         | `String`  | -           | Additional CSS classes to append.                                                         |
| `props`         | `String`  | -           | Arbitrary HTML attributes (e.g., `data-action="add"`).                                    |
| `onclick`       | `String`  | -           | JavaScript onclick handler.                                                               |

## Block Settings

When used as a block, the following settings are available in the Theme Editor:

- **Label & Link:** Text and destination URL.
- **Style:** Variant, Size, Color (custom).
- **Icon:** Lucide icon name and position.
- **Layout:** Width, Height, Padding, Radius (with responsive options).
- **Visibility:** Show on All, Mobile only, or Desktop only.
