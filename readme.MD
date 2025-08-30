# @nashsaint/emailbuilder-vue

A lightweight, zero-dependency **Email Builder** for Vue 3.  
Designed to work seamlessly with **Laravel + Inertia + Vite**, but flexible enough to use in any Vue app.

---

## ✨ Features
- ⚡ **Zero dependencies** – only Vue 3 as a peer.
- 🧩 **Drag & drop blocks** – headings, paragraphs, images, buttons, dividers, spacers, and 2-column layouts.
- 📝 **Inspector panel** – edit properties of each block.
- 📤 **Export to HTML** – generates ready-to-send email markup (div-based, table-based renderer planned).
- 🔧 **Forkable & extensible** – designed as a base for your own builder.

---

## 🚀 Installation

### Local development (recommended while customizing)
Clone next to your Laravel app:
```bash
git clone https://github.com/nashsaint/emailbuilder-vue.git
cd laravel-app
pnpm add @nashsaint/emailbuilder-vue@file:../emailbuilder-vue
