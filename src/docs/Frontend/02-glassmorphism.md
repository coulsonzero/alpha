# Glassmorphism Deep Dive

## Layered Blur

```css
.card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(32px);
  box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.6);
}
```

## Dynamic Lighting

Combine multiple layers of blur with radial gradients for a cinematic glass effect.
