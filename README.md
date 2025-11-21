<h1 align="center" style="position: relative;">
  Kuu Theme
</h1>

<p align="center">
  A minimal, performance-focused Shopify theme designed for modularity, accessibility, and best practices.
  <br>
  <em>Kuu (空) - Japanese for Sky/Essence.</em>
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-Custom-blue.svg" alt="License"></a>
</p>

## Overview

Kuu is a "skeleton" theme built to be the perfect foundation for custom Shopify storefronts. It prioritizes:

- **Performance:** Lean code, critical CSS, and optimized assets.
- **Accessibility:** Built with semantic HTML and ARIA standards.
- **Modularity:** Fully leverages Shopify 2.0 Sections and Blocks.
- **Developer Experience:** Modern tooling with Tailwind CSS and Alpine.js.

## Getting Started

### Prerequisites

- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)
- Node.js & pnpm

### Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:chuksemmanuel/kuu-theme.git
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

If you wish to use this code in a paid product (e.g., a SaaS app or paid theme), please contact:
**Email:** dev.chuksemmanuel@gmail.com

---

[Documentation](/pages/documentation)
