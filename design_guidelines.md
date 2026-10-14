# Design Guidelines: 동원약품 B2B 주문 시스템

## Design Approach
**System-Based Approach**: Material Design with professional B2B modifications
- Clean, data-focused interface optimized for pharmaceutical ordering workflows
- Emphasis on readability, efficiency, and professional aesthetics suitable for healthcare industry

## Core Design Principles
1. **Efficiency First**: Quick access to frequently used ordering and management functions
2. **Data Clarity**: Clear presentation of product information, pricing, and order history
3. **Professional Tone**: Healthcare-appropriate visual language with trust-building elements
4. **Responsive Workspace**: Adaptable layout that maximizes screen real estate

## Layout System

**Spacing Scale**: Consistent use of Tailwind units: 2, 4, 6, 8, 12, 16 for padding/margins
- Component spacing: p-4, p-6 for cards/sections
- Section gaps: space-y-6, space-y-8
- Table cell padding: px-4 py-3

**Grid Structure**:
- Collapsible sidebar: 256px expanded / 64px collapsed
- Main content area: flex-1 with max-width container (max-w-7xl)
- Product grid: 10 rows per page with fixed table height

## Typography Hierarchy

**Font Family**: 
- Primary: 'Noto Sans KR' (Google Fonts) for Korean text
- Secondary: Inter for numbers/data fields

**Text Scales**:
- Page titles: text-2xl font-bold (24px)
- Section headers: text-lg font-semibold (18px)
- Table headers: text-sm font-medium uppercase (14px)
- Body/Table content: text-sm (14px)
- Helper text: text-xs (12px)

## Navigation Structure

**Collapsible Sidebar**:
- Expanded state (256px): Full menu items with text labels, nested sub-menus visible on hover/click
- Collapsed state (64px): Icon-only mode with tooltips on hover
- Toggle button: Fixed position at sidebar top
- Active state: Subtle background highlight on current page
- Nested items: Indented with connecting lines when expanded

**Menu Organization**:
1. 주문하기 - Shopping cart icon
2. 주문관리 - Clipboard/document icon (6 sub-items)
3. 예치금/잔고결제 - Wallet/payment icon (3 sub-items)
4. 1:1게시판 - Message/support icon

## Component Library

**Data Tables**:
- Fixed header row with sorting indicators
- Zebra striping for row differentiation
- 10 rows visible (approximately 600px table height)
- Pagination controls at bottom
- Hover state on rows
- Action buttons (view, edit, delete) aligned right

**Product Cards/Rows**:
- Product image thumbnail (if applicable)
- Product name, code, manufacturer
- Price prominently displayed
- Stock availability indicator
- Quantity input with +/- controls
- "Add to cart" button

**Forms & Inputs**:
- Clear field labels positioned above inputs
- Input fields: h-10 with border, rounded corners
- Validation states (error/success) with icons
- Helper text below fields when needed

**Action Buttons**:
- Primary actions: Solid filled buttons (주문하기, 충전하기)
- Secondary actions: Outlined buttons
- Icon buttons: For table actions and controls
- Button heights: h-10 standard, h-8 for compact contexts

**Cards & Containers**:
- White background with subtle shadow (shadow-sm)
- Rounded corners (rounded-lg)
- Border treatment for separation (border border-gray-200)
- Consistent internal padding (p-6)

**Header Bar**:
- Fixed top position
- Logo left-aligned
- User info, notifications, logout right-aligned
- Search bar centered (if applicable)
- Height: h-16

**Dashboard Widgets**:
- Summary cards showing key metrics (total orders, balance, recent activity)
- Grid layout: 3-4 columns on desktop
- Icons representing each metric

## Data Visualization

**Order Status Indicators**:
- Badge/chip components with status-specific styling
- States: 대기중, 처리중, 배송중, 완료, 취소

**Financial Displays**:
- Large, clear number formatting (commas for thousands)
- Currency symbol (₩) consistently placed
- Positive/negative values color-coded

## Responsive Behavior

**Desktop (1024px+)**: Full layout with expanded sidebar default
**Tablet (768px-1023px)**: Collapsed sidebar default, overlay expansion
**Mobile (<768px)**: Hidden sidebar with hamburger menu, stacked content

## Professional Enhancements

- Subtle drop shadows for elevation (shadow-sm, shadow-md)
- Consistent border radius (rounded-lg for cards, rounded-md for inputs)
- Minimal use of animations - only for sidebar collapse/expand and dropdown menus
- Focus on information density without visual clutter

## Images
No hero images required. This is a utility-focused B2B application. Product thumbnail images within tables/lists where applicable (small, 40x40px or 60x60px).