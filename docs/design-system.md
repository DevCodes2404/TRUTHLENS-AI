# TRUTHLENS AI — Design System

## Midnight Aurora Visual Identity

The design system is engineered around a **semi-dark** aesthetic that avoids harsh pure-black darkness while avoiding sterile plain-white dashboards.

### 1. Palette Tokens

| Token | Hex Value | Role / Usage |
|---|---|---|
| `--color-app-bg` | `#EEF1F6` | Soft cool gray/pale blue-gray canvas |
| `--color-sidebar-bg` | `#1A2035` | Muted midnight navy sidebar |
| `--color-sidebar-hover` | `#232D47` | Sidebar interactive item hover state |
| `--color-sidebar-active` | `#2A3655` | Active route navigation background |
| `--color-surface` | `#F4F6FB` | Light slate surfaces and tables |
| `--color-card` | `#FFFFFF` | Primary content cards |
| `--color-card-border` | `#DDE3EF` | Subtle blue-gray borders |
| `--color-accent-blue` | `#2563EB` | Electric blue primary accent |
| `--color-accent-violet` | `#7C3AED` | Secondary violet/lavender accent |
| `--color-accent-cyan` | `#0891B2` | Restrained cyan highlight accent |
| `--color-success` | `#059669` | Authentic verified badge and states |
| `--color-danger` | `#DC2626` | AI-generated / threat alerts |
| `--color-warning` | `#D97706` | Manipulated / flagged items |

### 2. Typography
- **Primary Font:** Inter, system-ui, -apple-system, sans-serif
- **Code / Monospace:** JetBrains Mono, Fira Code, monospace
- **Scale:**
  - Heading 1: 1.25rem (20px), bold
  - Card Title: 0.875rem (14px), semi-bold
  - Body: 0.875rem (14px), regular
  - Caption / Micro: 0.75rem – 0.65rem, uppercase tracking-wide

### 3. Component Library
- **Sidebar:** Collapsible (240px to 64px) with animated spring transitions, active pill indicators, tooltips in collapsed state, and bottom system status.
- **TopNav:** Sticky with blur backdrop, breadcrumbs, `⌘K` global search trigger modal, notifications dropdown, and user profile drawer.
- **Upload Dropzone:** Drag-over scaling feedback, multi-format validation (JPG, PNG, WEBP), file size safeguards, and preview cards.
- **Badges:** Pill-shaped status indicators with semantic background tints.
- **Modals & Dialogs:** Framer Motion animated modal panels with background blur and escape key accessibility.
- **Toast Engine:** Non-blocking stacked alerts supporting auto-dismiss and manual clearance.

