---
name: CozmicTech
colors:
  primary: "#feb900"     # Vibrant Tech Amber / Gold
  secondary: "#1e293b"   # Slate Blue / Dark Cosmic Background
  accent: "#8b5cf6"      # Indigo/Violet Cosmic Glow
  neutral-dark: "#0f172a"# Cosmic Deep Void
  neutral-light: "#f8fafc"# Pristine Cosmic Stardust (Light mode surface)
  surface: "#1e293b"     # Card & Panel background
  text-primary: "#f8fafc"
  text-secondary: "#94a3b8"
  border: "#334155"      # Subtle divider border
typography:
  fontFamily: "Roboto, 'Work Sans', sans-serif"
  codeFont: "JetBrains Mono, monospace"
  baseSize: 16px
spacing:
  scale: [0, 4, 8, 12, 16, 24, 32, 48, 64]
shapes:
  borderRadius:
    sm: 4px
    md: 8px
    lg: 16px
    full: 9999px
---

# CozmicTech Visual Vibe & Design System

This design system establishes the visual guidelines for CozmicTech, optimized for a modern, high-tech, and immersive experience.

## Brand Style ("Cosmic Tech Vibe")
The brand aesthetics combine a deep, mysterious space-theme background with vibrant gold/amber and cosmic purple/violet highlights. It leverages high contrast, glassmorphism, and clean borders to present tech services in a premium light.

## Design Rules

### 1. Colors & Gradients
*   **Aesthetics:** Always combine the primary Gold (`#feb900`) and Accent Purple (`#8b5cf6`) to create glowing highlights and gradients.
*   **Gradients:** Use linear gradients for buttons, title text, and decorative borders:
    *   *Cosmic Gold:* `from-amber-400 to-yellow-500`
    *   *Purple Glow:* `from-violet-600 to-indigo-600`
*   **Borders:** Use thin, semi-transparent borders for cards (`border-white/10` or `border-slate-700/50`) combined with backdrops (`backdrop-blur-md`).

### 2. Typography
*   Use **Roboto** for body text and structure.
*   Use **Work Sans** with a bold weight (`font-bold`, `font-semibold`) for headers to establish clean hierarchy.
*   Use **JetBrains Mono** for numbers, statistics, and system telemetry cards.

### 3. Navigation & Header
*   Nav link hovers must fade from low-contrast slate to pure white and display a golden underline indicator that slides in smoothly.

### 4. Interactive Elements (Buttons & Inputs)
*   **Hover states:** Every button must use `transition-all duration-300 ease-out` and elevate slightly on hover (`hover:scale-[1.02] active:scale-[0.98]`).
*   **Loading states:** Form submits must transition to a disabled state showing a spinning ring loader.
