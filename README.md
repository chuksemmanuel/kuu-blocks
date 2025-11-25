<h1 align="center" style="position: relative;">
  Kuu Theme
</h1>

<p align="center">
  A minimal, performance-focused Shopify theme designed for performance, modularity, accessibility, search engines and best practices.
  <br>
  <em>Kuu (空) - Japanese for Sky.</em>
</p>

<p align="center">
  <a href="./LICENSE.md"><img src="https://img.shields.io/badge/License-Custom-blue.svg" alt="License"></a>
</p>

## Overview

### 1. Performance as a Feature

Kuu is built to be lightweight by default.

- **Critical CSS:** Inlined for instant rendering.
- **Alpine.js:** For lightweight, reactive interactions without the bloat of a full SPA framework.
- **Native Browser Features:** Leveraging modern browser capabilities instead of polyfills.

### 2. Built for Conversion (CRO)

Every component is designed with Conversion Rate Optimization in mind.

- **A/B Testing Ready:** Blocks and sections are granular and isolated, making it easy to duplicate a section, tweak the copy or layout, and run split tests using Shopify's native tools or third-party apps.
- **User-Centric UX:** We focus on reducing friction. The cart drawer, for example, handles optimistic UI updates—showing the user the result of their action immediately while syncing with the server in the background.
- **Exposed APIs:** We expose key component logic to the `window` object. For example, `window.kuu.cartDrawer` allows developers to programmatically open, close, or refresh the cart from anywhere in the app. Useful for A/B testing with JavaScript.
- **Modular Components:** Developers can take a single block (like our Tab component or Cart Drawer) and drop it into another project with minimal friction.

## Getting Started

### Prerequisites

- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)
- Node.js & pnpm

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/chuksemmanuel/kuu-blocks.git
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start development:**
   ```bash
   pnpm dev
   # and in a separate terminal
   shopify theme dev
   ```

## Theme Architecture

```bash
.
├── assets          # Static assets (JS, CSS, Images)
├── blocks          # Reusable UI components (Shopify 2.0)
├── config          # Theme settings
├── layout          # Master layout files
├── sections        # Page sections
├── snippets        # Liquid snippets & components
└── src             # Source files (Tailwind CSS)
```

## License & Usage

**Copyright (c) 2025 CHUKWUNWEIKE EMMANUEL**

This project is licensed under a custom "No Charge" license designed to be developer-friendly while protecting the creator's work on the Shopify platform.

### Summary

- **✅ You MAY:** Use this for personal projects, client work (freelance/agency), and internal tools.
- **❌ You MAY NOT:** Redistribute this theme (modified or not) on the Shopify App Store or Theme Store.

### Examples

- **Proper Usage:** You are hired by a client to build a custom Shopify store. You use Kuu as the base, customize it, and charge the client for your development time.
- **Proper Usage:** You build a store for your own business using Kuu.
- **NOT Proper Usage:** You create a slightly modified version of Kuu and list it on the Shopify Theme Store (even for free).
- **NOT Proper Usage:** You wrap this code in a Shopify App and charge merchants a monthly fee to use it.

For full details, please read the [LICENSE](./LICENSE) file.

### Commercial Inquiries

If you wish to use this code in a paid product (e.g., a SaaS app or paid theme), please contact me
**Email:** dev.chuksemmanuel@gmail.com
**LinkedIn:** https://linkedin.com/in/chuksemmanuel

---

[Documentation](https://kuu-blocks.myshopify.com/pages/docs)
