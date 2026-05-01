# SashVerse Design System

## Mission

Create a dark-mode, 3D immersive, token-driven UI system for SashVerse that enables consistent, scalable, and high-performance product experiences across AI-driven interfaces.

---

## Brand

| Property | Value |
|---|---|
| **Product/brand** | SashVerse |
| **Owner** | Sashikiran |
| **Audience** | Product teams, developers, designers |
| **Product surface** | AI-driven web applications and immersive portfolio systems |

---

## Style Foundations

| Property | Value |
|---|---|
| **Visual style** | Futuristic, immersive, system-driven |
| **Font** | `font.family.primary` = Inter |
| **Font stack** | `font.family.stack` = Inter, system-ui, sans-serif |
| **Base size** | 14px |
| **Line height** | 22px |

---

## Color Tokens

### Surface

| Token | Value |
|---|---|
| `color.surface.base` | `#05070F` |
| `color.surface.elevated` | `#0B1220` |
| `color.surface.glass` | `rgba(255, 255, 255, 0.05)` |
| `color.surface.glass.strong` | `rgba(255, 255, 255, 0.08)` |

### Text

| Token | Value |
|---|---|
| `color.text.primary` | `#E5E7EB` |
| `color.text.secondary` | `#9CA3AF` |
| `color.text.muted` | `#6B7280` |

### Primary

| Token | Value |
|---|---|
| `color.primary` | `#E10600` |
| `color.primary.hover` | `#FF2A1A` |
| `color.primary.glow` | `rgba(225, 6, 0, 0.4)` |

### Border

| Token | Value |
|---|---|
| `color.border.subtle` | `rgba(255, 255, 255, 0.08)` |

---

## Glass Tokens

| Token | Value |
|---|---|
| `blur` | 16px |
| `border` | `rgba(255, 255, 255, 0.1)` |

---

## Motion Tokens

| Token | Value |
|---|---|
| `fast` | 200ms |
| `normal` | 300ms |
| `slow` | 500ms |

---

## Accessibility

- **WCAG 2.2 AA** required
- **Focus-visible** must be clearly visible
- **Glass** must not reduce readability

---

## Rules

1. Must use semantic tokens
2. Must include all interaction states
3. Must maintain depth hierarchy
4. Must ensure readability on dark surfaces
