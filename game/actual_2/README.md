# IBM Bob — Full SDLC Demo

A single-page demo application that showcases IBM Bob as an AI-powered developer assistant across every stage of the software development lifecycle.

## Project Structure

```
.
├── index.html            # Shell — navigation, templates, script loader
├── asset/                # Static images (SVG, PNG)
├── css/
│   ├── main.css          # Global reset, design tokens, layout skeleton
│   ├── nav.css           # Top navigation bar + bottom progress bar
│   ├── home.css          # Home (landing) page styles
│   ├── pages.css         # Shared bcp-* component system (all SDLC stage pages)
│   └── chat.css          # Legacy chat widget styles
└── js/
    ├── router.js         # Lightweight SPA router (file:// + http:// compatible)
    ├── chat.js           # Chat widget — typewriter, bubbles, typing indicator
    ├── chat-helpers.js   # BcpChat helper — scripted chat for stage pages
    ├── app.js            # Entry point — registers pages, boots home, wires nav
    └── pages/
        ├── home.js       # Home page: preview card hover + kicker glitch cycler
        ├── plan.js       # Plan stage scripted demo (interactive choice cards)
        ├── code.js       # Code stage scripted demo
        ├── review.js     # Review stage scripted demo
        ├── deploy.js     # Deploy stage scripted demo
        └── monitor.js    # Monitor stage scripted demo
```

## Architecture

The app is a **zero-dependency SPA** designed to work directly from the filesystem (`file://`) without a build step or web server.

- **Templates** — each page is an HTML `<template>` element inside `index.html`. The Router clones and injects the template into `#page-view` on navigation.
- **Page scripts** — each `<template>` ends with `<script data-page-script src="js/pages/<name>.js">`. The Router re-executes these scripts on every navigation so the page logic initialises fresh.
- **Router** (`js/router.js`) — manages page transitions, nav/bottom-bar show/hide, progress indicators, and the Next button.
- **BcpChat** (`js/chat-helpers.js`) — shared scripted-chat engine used by Code, Review, Deploy, and Monitor pages.

> **Note:** `id` attributes like `bcp-body`, `bcp-messages`, `bcp-scripted-input` appear in multiple templates. This is intentional — only one template is active in the DOM at any time, so IDs are always unique at runtime.

## How to Run

**Option A — open directly (no server required)**

```
Open index.html in any modern browser.
```

**Option B — local web server (recommended for development)**

Using Python:
```bash
python -m http.server 8080
# then open http://localhost:8080
```

Using Node.js (npx):
```bash
npx serve .
# then open the printed URL
```

## How to Test

### Manual walkthrough checklist

1. **Home page** — open `index.html`. Confirm the kicker glitch animation plays in the headline. Hover each stage button and verify the preview card fades in/out. Click "Enter stage →" and confirm navigation.
2. **Navigation** — click each stage button in the top nav. Confirm the active state (blue number badge) updates correctly and the progress bar fills.
3. **Back to home** — click the IBM Bob logotype in the top nav. Confirm the nav slides up and the home page re-renders.
4. **Plan page** — click the pulsing hint button, type animation plays, send button activates. Click send and step through all 8 choice-driven exchanges. After the final step, verify the file appears in the Explorer panel and the MD panel opens on click.
5. **Code / Review / Deploy / Monitor pages** — click the send button to step through each scripted exchange. Verify the Restart button works.
6. **Bottom bar** — on any stage page, confirm the progress segments fill and the Next button navigates to the next stage. On Monitor (last stage) the Next button is hidden.
7. **Responsive layout** — resize the browser window to ≤ 800 px and verify the home page stacks vertically; at ≤ 480 px the explorer panel hides on stage pages.

### Browser DevTools checks

- No console errors on any page or navigation.
- No 404s in the Network tab (all assets load from relative paths).
- Lighthouse accessibility score — all buttons have accessible labels (`title` or visible text).
