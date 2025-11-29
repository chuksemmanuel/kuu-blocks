# Getting Started with Kuu

<!-- Thumbnail -->

![Thumbnail](https://cdn.shopify.com/s/files/1/0628/4348/6291/files/Kuu_Blocks_Image.png?v=1764416747)

**Kuu** is a modern, high-performance Shopify theme that adapts to how you build. Use it as a complete **production-ready theme**, or as a **library of modular components** to enhance your existing store.

## 1. For Non Technical Merchants

_Store owners who want a fast, beautiful store out of the box._

- **Download & Install:** Download the latest release zip and upload it to your Shopify Admin.
- **Customize:** Use the standard Shopify Theme Editor. All blocks (Cart Drawer, Tabs, etc.) are fully configurable via settings—no code required.
- **Kuu App (Coming Soon):** Future ability to install blocks directly to any theme.

## 2. For Technical Merchants

_You have an existing theme but want specific Kuu features (e.g., "just want the Cart Drawer")._

- **Browse & Copy/Download:** Find the component you need in our docs.
- **The "Drop-in" Workflow:**
  1.  Copy the **Liquid Snippet** (e.g., `snippets/cartdrawer.liquid`).
  2.  Copy the **JavaScript** (e.g., `assets/js/blocks/cartdrawer.js`).
  3.  Copy the **Dependencies** (e.g., `snippets/drawer.liquid`, `snippets/button.liquid`).
- **Upload:** Add these files to your current theme's code editor.
- **Result:** The block appears in your Theme Editor, ready to use.

## 3. For Developers (Full Control)

_You are building a custom storefront from scratch._

- **Clone the Repo:** Treat Kuu as your base theme.
- **Local Dev:** Use Shopify CLI + pnpm for a modern workflow with HMR (Hot Module Replacement).
- **Extend:** Leverage the `window.kuu` API and Alpine.js architecture to build complex interactions.

## Core Concepts

### Modular Architecture

Every piece (Button, Drawer, Tab) is designed to be self-contained. Logic is split between `snippets/` (markup) and `assets/js/` (logic), making it easy to move components between projects.

### Performance First

We use **Tailwind CSS** (compiled) and **Alpine.js(43kb)** for a lightweight footprint.

### Transparent Logic

We expose key component APIs to `window.kuu`, allowing you to control components programmatically (e.g., `window.kuu.cartDrawer.open()`).

## Installation (For Developers)

### 1. Clone the Repository

```bash
git clone https://github.com/chuksemmanuel/kuu-blocks.git my-new-store
cd my-new-store
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development to Compile Tailwind CSS

```bash
pnpm dev
```

### 4. In a differnt terminal Run Shopify CLI

```bash
shopify theme dev
```

Next: Learn how to include Kuu's css and js assets in your theme [here](installation.md).
