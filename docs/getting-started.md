# Getting Started with Kuu

Welcome to **Kuu**, a minimal, performance-focused Shopify theme designed for anyone who want to build custom storefronts without fighting a bloated codebase.

## Philosophy

Kuu is not a traditional "theme" you install and forget. It is a **development kit**.

- **You own the code:** Components are meant to be copied, pasted, and modified.
- **No Black Boxes:** Logic is exposed via `window.kuu` and standard Alpine.js components.
- **Performance First:** We use native browser features, Tailwind CSS, and Alpine.js to keep things lightweight.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)
- [pnpm](https://pnpm.io/) (Recommended) or npm/yarn

## Installation

### 1. Clone the Repository

Start by cloning the Kuu repository to your local machine.

```bash
git clone git@github.com:chuksemmanuel/kuu-theme.git my-new-store
cd my-new-store
```

### 2. Install Dependencies

We use `pnpm` to manage development dependencies like Tailwind CSS.

```bash
pnpm install
```

### 3. Start Development

Run the development server. This will start both the Tailwind compiler and the Shopify CLI.

```bash
pnpm dev
```

_This command runs `shopify theme dev` and watches for Tailwind changes simultaneously._

## Project Structure

Kuu follows the standard Shopify 2.0 structure with a few modern additions:

```bash
.
├── assets/
│   ├── css/            # Compiled CSS (do not edit directly)
│   ├── js/
│   │   ├── blocks/     # Logic for specific blocks (e.g., cartdrawer.js)
│   │   ├── components/ # Reusable component logic (e.g., tabs.js)
│   │   └── kuu.js      # Core theme entry point
├── layout/             # Theme layout files (theme.liquid)
├── sections/           # JSON and Liquid sections
├── snippets/           # Reusable Liquid components (buttons, drawers)
└── src/
    └── tailwind.css    # Source CSS file (EDIT THIS)
```

## Core Technologies

### Tailwind CSS

Styling is handled via Tailwind.

- Edit `src/tailwind.css` for global styles.
- Use utility classes directly in your Liquid files.
- The build process compiles everything into `assets/css/app.css`.

### Alpine.js

Kuu uses [Alpine.js](https://alpinejs.dev/) for interactivity. It provides the reactivity of a framework like Vue/React but with a much smaller footprint.

**Common Pattern:**
Most interactive components (like the Cart Drawer) consist of two parts:

1.  **Liquid Snippet:** Defines the markup and `x-data` state.
    - _Example:_ `snippets/cartdrawer.liquid`
2.  **JavaScript File:** Defines the logic and registers the Alpine component.
    - _Example:_ `assets/js/blocks/cartdrawer.js`

### The `window.kuu` Object

We expose key component APIs to the global `window.kuu` object. This allows you to control components programmatically from anywhere in your code.

**Example: Opening the Cart Drawer**

```javascript
// Open the cart drawer from the console or another script
window.kuu.cartDrawer.open();
```

## Next Steps

- Explore the [Components](/docs/components) to see what's available.
- Read the [Philosophy](/docs/philosophy) to understand our design decisions.
- Check out `layout/theme.liquid` to see how the app is bootstrapped.
