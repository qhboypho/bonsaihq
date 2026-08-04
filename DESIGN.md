---
name: "Bonsai Hoi Quan Design System"
version: "1.0.0"
description: "AI-native design system contract for Bonsai Hoi Quan - Vietnamese Artisan Bonsai Exhibition Platform"
author: "Bonsai Hoi Quan Team"
style:
  category: "Organic Biophilic + Cultural Heritage"
  keywords:
    - "nature"
    - "organic shapes"
    - "moss green"
    - "ceramic brown"
    - "antique gold"
    - "red seal stamp"
    - "vietnamese heritage"
    - "zen artisan"

tokens:
  color:
    light:
      bg_primary: "#FAF6F0"       # Ancient Paper / Silk Beige
      bg_secondary: "#F3ECE0"     # Light Silk
      bg_card: "#FCFAF6"          # Soft Ceramic White
      text_primary: "#192720"     # Deep Pine Green Text
      text_secondary: "#56645C"   # Muted Moss
      color_primary: "#1C3B2B"    # Ancient Pine Moss Green
      color_primary_light: "#2D5842"
      color_secondary: "#5C3D2E"  # Pot Clay / Tree Bark Brown
      color_secondary_light: "#7E5643"
      color_accent: "#C59B27"     # Antique Bronze / Pine Gold
      color_accent_light: "#D5B14B"
      color_danger: "#9A2A2B"     # Red Lacquer Seal Stamp
      border_color: "#D3C9B9"
      border_hover: "#B7A690"
      glass_bg: "rgba(243, 236, 224, 0.96)"
      glass_border: "rgba(211, 201, 185, 0.4)"
      shadow_color: "rgba(25, 39, 32, 0.06)"
      shadow_hover: "rgba(25, 39, 32, 0.12)"
      stamp_glow: "rgba(154, 42, 43, 0.15)"
    dark:
      bg_primary: "#0C120F"       # Deep Night Forest
      bg_secondary: "#121A16"     # Night Bamboo Shadow
      bg_card: "#16221C"          # Dark Ceramic Card
      text_primary: "#ECE6DB"     # Warm Linen Text
      text_secondary: "#9AA7A0"   # Mist Smoke Gray
      color_primary: "#4E8C6F"    # Moonlit Pine Leaf
      color_primary_light: "#67B08E"
      color_secondary: "#8E6C58"  # Weathered Bark Brown
      color_secondary_light: "#B49480"
      color_accent: "#D4AF37"     # Imperial Gold
      color_accent_light: "#E8C85A"
      color_danger: "#E25D5E"     # Bright Lacquer Red
      border_color: "#25332C"
      border_hover: "#3E5045"
      glass_bg: "rgba(18, 26, 22, 0.97)"
      glass_border: "rgba(37, 51, 44, 0.6)"
      shadow_color: "rgba(0, 0, 0, 0.3)"
      shadow_hover: "rgba(0, 0, 0, 0.55)"
      stamp_glow: "rgba(226, 93, 94, 0.22)"

  typography:
    heading:
      family: "'Lora', serif"
      weight: "700"
      mood: "Traditional, Literary, Elegant, Heritage"
    body:
      family: "'Outfit', sans-serif"
      weight: "400"
      line_height: "1.6"
      mood: "Modern, Clean, Accessible"
    seal:
      family: "'Lora', serif"
      weight: "900"

  spacing:
    xs: "4px"
    sm: "8px"
    md: "16px"
    lg: "24px"
    xl: "32px"
    xxl: "60px"

  radius:
    small: "4px"
    medium: "8px"
    card: "12px"
    banner: "16px"
    full: "50px"

  motion:
    fast: "150ms ease"
    standard: "300ms ease"
    slow: "500ms ease"
---

# Bonsai Hội Quán - Design System Specification (`DESIGN.md`)

This document defines the official visual design system, aesthetic direction, and component rules for **Bonsai Hội Quán**. All future UI components, pages, and feature additions must strictly adhere to the tokens and guidelines specified herein.

---

## 1. Aesthetic Rationale & Core Theme

The design system merges **Organic Biophilic Design** with **Vietnamese Cultural Heritage Aesthetic**:

1. **Biophilic Connection**: The color palette, shapes, and motion emulate living Bonsai trees—deep evergreen moss greens (`#1C3B2B`), rich pot clay brown (`#5C3D2E`), and soft natural paper/silk backgrounds (`#FAF6F0`).
2. **Vietnamese Cultural Accents**:
   - **Triện Son (Red Lacquer Seal Stamp)**: Symbolizes artisan authenticity. Rendered as a rotated double-bordered badge (`#9A2A2B`) with subtle ambient glow.
   - **Heritage Watermarks**: Background SVG patterns of *Mây cổ Lê-Nguyễn* (traditional cloud motifs) and subtle bamboo shadows.
   - **Thép / Đồng Cổ (Antique Gold/Bronze)**: Metallic gold accents (`#C59B27`) used for active tabs, borders, and highlight numbers.

---

## 2. Color System & Theme Rules

### Light Mode ("Thanh Cảnh")
- Primary background mimics raw silk / aged paper (`#FAF6F0`).
- Text uses deep pine green (`#192720`) to eliminate stark black-white contrast while maintaining high legibility (WCAG AA compliant).
- Primary actions use deep moss green (`#1C3B2B`) with antique gold borders (`#C59B27`).

### Dark Mode ("U Tịch")
- Background switches to deep night forest (`#0C120F`) with dark bamboo shadow cards (`#16221C`).
- Accent colors brighten to moonlit green (`#4E8C6F`) and imperial gold (`#D4AF37`).
- Text uses warm linen (`#ECE6DB`).

---

## 3. Typography Hierarchy

| Level | Element / Selector | Font Family | Size | Weight | Color |
|---|---|---|---|---|---|
| **Logo & Title** | `.logo-text h1`, `.hero-text-content h2` | `Lora` (Serif) | 1.35rem - 2.8rem | 700 / 800 | Primary Accent |
| **Section Headings** | `.section-title`, `.artisan-title-row h2` | `Lora` (Serif) | 1.8rem - 2.0rem | 700 | Primary Green |
| **Card Titles** | `.tree-card-title`, `.artisan-card-info h3` | `Lora` (Serif) | 1.15rem - 1.25rem | 700 | Primary Text |
| **Body & Details** | `body`, `p`, `.spec-val` | `Outfit` (Sans) | 0.95rem - 1.05rem | 400 - 600 | Primary Text |
| **Labels & Badges** | `.spec-tag`, `.artisan-card-rank` | `Outfit` (Sans) | 0.72rem - 0.78rem | 700 | Accent Gold |
| **Red Seal Text** | `.viet-stamp-seal`, `.artisan-trien-son` | `Lora` (Serif) | 0.70rem - 0.72rem | 900 | Red Lacquer |

---

## 4. Key Component Guidelines

### A. Red Lacquer Seal Stamp (`.viet-stamp-seal`)
- Must feature a double-layered red border (`#9A2A2B`), 4px border-radius, rotated at `-5deg` to `10deg`.
- Accompanied by a soft red glow shadow (`rgba(154, 42, 43, 0.15)`).
- Contains localized text: `Hội Quán` (VI), `Bonsai Club` (EN), or `盆栽会館` (JP).

### B. Glassmorphic Fixed Header (`.main-header`)
- Fixed position at the top (`z-index: 1000`).
- Background: `rgba(243, 236, 224, 0.96)` (Light) / `rgba(18, 26, 22, 0.97)` (Dark) with `backdrop-filter: blur(15px)`.
- Prevents text bleed-through when scrolling.

### C. Tree Cards (`.tree-card`)
- Aspect ratio for tree preview image: 16:10.
- Status badges positioned at top-left:
  - **Đang giao lưu (For Trade)**: Red lacquer (`#9A2A2B`).
  - **Trưng bày (Exhibition)**: Deep moss green (`#1C3B2B`).
  - **Đang tạo tác (Styling)**: Clay brown (`#5C3D2E`).
- Hover effect: `translateY(-6px)` with subtle gold border glow transition (300ms).

### D. Evolution Timeline (`.evolution-timeline`)
- Vertical axis line with node points indicating milestone years.
- Each milestone card displays the historical styling log in the selected language.

---

## 5. Anti-Patterns & Pre-Delivery Checklist

- ❌ **Do NOT use raw emojis as icons**: Always use SVG or FontAwesome icons (`fa-seedling`, `fa-tree`, `fa-phone`).
- ❌ **Do NOT use stark pure black (`#000000`) or white (`#FFFFFF`) for text/background**: Always use curated tokens (`#FAF6F0`, `#192720`, `#0C120F`).
- ❌ **Do NOT break multi-language support**: Every new string must be added to `lib/translations.js` (VI, EN, JP).
- ❌ **Do NOT use hardcoded static pixel heights for container text**: Allow flex/grid bounds to wrap naturally on mobile viewport (375px+).
- ✅ **DO maintain WCAG AA contrast ratio**: Minimum 4.5:1 for body text.
- ✅ **DO ensure smooth transitions**: 150ms-300ms for hover states.
