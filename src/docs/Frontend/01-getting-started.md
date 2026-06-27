# Getting Started with Nebula

Everything you need to know to build your first dashboard.

## Installation

```bash
npm create nebula@latest my-dashboard
cd my-dashboard
npm install
```

## Quick Start

```typescript
import { Dashboard } from "@nebula/core";

const app = new Dashboard({
  theme: "glass",
  analytics: true,
  features: ["realtime"],
});

app.render("#root");
```

## Core Concepts

### Glassmorphism System

```css
.glass-base {
  background: rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1.5rem;
}
```

## API Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | string | "glass" | Visual theme |
| `analytics` | boolean | false | Enable analytics |
| `features` | string[] | [] | Feature flags |

## Events

```typescript
dashboard.on("ready", () => {
  console.log("Dashboard is ready!");
});
```
