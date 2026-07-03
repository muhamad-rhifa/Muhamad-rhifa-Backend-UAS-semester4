# Implementation Plan: RZStore Online Shop

## Overview

Build RZStore as a fully client-side multi-page application using vanilla JavaScript (ES6+), Tailwind CSS (CDN), and Font Awesome (CDN). All persistence is handled through `localStorage`. The existing `index.html` single-file SPA will be replaced with a proper multi-file MPA structure deployable to GitHub Pages.

Implementation proceeds in dependency order: shared foundation first, then page-by-page features, finishing with polish and documentation.

---

## Tasks

- [x] 1. Set up project structure and design system foundation
  - Replace the existing `index.html` with a new multi-page version (keep only the `<head>` boilerplate as reference)
  - Create all empty placeholder HTML files: `shop.html`, `product.html`, `cart.html`, `checkout.html`, `orders.html`, `wishlist.html`, `login.html`, `admin.html`
  - Create directory structure: `js/`, `css/`, `data/`
  - Create `css/style.css` with CSS custom properties for the full color palette (light and dark themes via `[data-theme="dark"]`), typography scale, toast animations (`@keyframes toast-in`, `@keyframes toast-out`, `.toast-enter`, `.toast-exit`), card hover transitions, skeleton loader styles, scrollbar styles, and any utility classes not covered by Tailwind
  - Add the FOUC-prevention inline `<script>` block to the `<head>` of every HTML page (reads `rz_theme` from localStorage and adds `dark` class to `<html>` before paint)
  - Add Tailwind CDN `<script>` config block (darkMode: 'class', primary color extension) and CDN links for Tailwind, Font Awesome to every HTML page
  - _Requirements: 1.1, 1.2, 1.3, 12.5, 17.3_

- [x] 2. Implement `js/app.js` — shared utilities, Storage, Toast, Session, dark mode, Navbar
  - [x] 2.1 Implement `Storage` helper (`get`, `set`, `remove`) and `Session` helper (`get`, `set`, `clear`, `isAdmin`)
    - Export `Storage` and `Session` as named exports
    - `Session.set()` must strip the `password` field before saving to `rz_session`
    - _Requirements: 1.1, 3.4, 3.6_

  - [x] 2.2 Implement `Toast` system (`Toast.show(message, type)`)
    - Create `#toast-container` div (fixed bottom-right, z-50, flex-col, gap-2, pointer-events-none) in the DOM if not present
    - Each toast: left-border color accent, Font Awesome icon, message text, close button
    - Apply `.toast-enter` CSS class on creation; use `requestAnimationFrame` to trigger
    - Auto-dismiss after 3 000 ms via `setTimeout`; on click dismiss immediately
    - Dismiss: add `.toast-exit` class, remove element on `animationend`
    - Support simultaneous toasts without overlap
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 2.3 Implement `initDarkMode()` and `toggleDarkMode()`
    - `initDarkMode()`: reads `rz_theme` from Storage, adds/removes `dark` class on `<html>`
    - `toggleDarkMode()`: toggles `dark` class on `<html>`, persists to Storage, updates toggle button icon
    - _Requirements: 12.2, 12.3, 12.4, 12.5_

  - [ ]* 2.4 Write property test for dark mode persistence round-trip
    - **Property 18: Dark Mode Persistence Round-Trip**
    - **Validates: Requirements 12.4, 12.5**

  - [x] 2.5 Implement `seedDataIfNeeded()` — fetch `data/products.json`, seed products and default users
    - Only seed `rz_products` if key is absent or array is empty (idempotent)
    - Seed default admin user (`admin@rzstore.com` / `admin123`, `role: "admin"`) and demo customer (`demo@rzstore.com` / `123456`, `role: "customer"`) only if `rz_users` is empty
    - Catch fetch errors: log and show `Toast.show('Failed to load product data', 'error')`
    - _Requirements: 3.10, 4.2, 4.3_

  - [ ]* 2.6 Write property test for seed idempotence
    - **Property 5: Seed Idempotence (No Overwrite)**
    - **Validates: Requirements 4.3**

  - [x] 2.7 Implement `initNavbar()` and `updateCartBadge()`
    - `initNavbar()`: reads Session, sets user name display or Login button, wires logout handler, calls `updateCartBadge()`, wires hamburger menu toggle for mobile drawer, wires dark mode toggle button
    - `updateCartBadge()`: reads `rz_cart` from Storage, updates `<span id="cart-badge">` count
    - Hamburger menu opens a slide-in drawer overlay on viewports < 768px
    - Logout: calls `Session.clear()`, redirects to `index.html`
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 3.8_

- [ ] 3. Checkpoint — Verify `app.js` exports work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Create `data/products.json` seed data
  - Write a JSON array of at least 20 products, each with all required fields: `id` (e.g. `"prod_001"`), `name`, `category`, `price` (USD float), `image` (placehold.co or picsum URL), `stock`, `rating` (0.0–5.0), `description`, `featured` (boolean), `tags` (string array), `createdAt` (ISO 8601)
  - Cover at least 4 distinct categories: Hoodie, Jacket, T-Shirt, Pants
  - Mark at least 8 products as `featured: true`
  - Vary stock levels (include at least 2 products with `stock: 0`)
  - _Requirements: 4.1, 4.4_

- [x] 5. Implement `js/auth.js` — registration, login, logout, auth guards
  - [x] 5.1 Implement `requireAuth()` and `requireAdmin()`
    - `requireAuth()`: synchronous check of `Session.get()`; if null, redirect to `login.html`
    - `requireAdmin()`: synchronous check of `Session.isAdmin()`; if false, redirect to `index.html`
    - _Requirements: 3.9, 14.1_

  - [x] 5.2 Implement `initLoginPage()` and `initRegisterPage()` (tab-toggle on `login.html`)
    - Single `login.html` hosts both forms; tab buttons toggle visibility between Login and Register panels
    - Login form: Email + Password; on submit find matching user in `rz_users`, create session (password excluded), redirect to `index.html`; on failure show inline error
    - Register form: Full Name + Email + Password; validate password ≥ 6 chars; validate email uniqueness (case-insensitive); on success save user with `id`, `name`, `email`, `password`, `role: "customer"`, `createdAt`; show Toast and switch to login tab
    - Display inline error messages below invalid fields (not Toast) for form validation failures
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 5.3 Write property test for password length validation
    - **Property 1: Password Length Validation**
    - **Validates: Requirements 3.2**

  - [ ]* 5.4 Write property test for duplicate email prevention
    - **Property 2: Duplicate Email Prevention**
    - **Validates: Requirements 3.3**

  - [ ]* 5.5 Write property test for registration user shape
    - **Property 3: Registration Produces Correct User Shape**
    - **Validates: Requirements 3.4, 3.6**

  - [ ]* 5.6 Write property test for login credential matching
    - **Property 4: Login Credential Matching**
    - **Validates: Requirements 3.6, 3.7**

  - [x] 5.7 Build `login.html` page
    - Centered card layout (no Navbar/Footer)
    - Tab toggle: [Login] / [Register]
    - Login form and Register form with inline error message areas
    - Load `js/app.js` then `js/auth.js` as ES modules; call `initLoginPage()` on `DOMContentLoaded`
    - _Requirements: 3.1, 3.5_

- [ ] 6. Checkpoint — Verify auth flow end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement `js/products.js` — catalog, search, filter, sort, pagination, product detail
  - [x] 7.1 Implement `getAllProducts()`, `getProductById(id)`, `getProductsByCategory(cat)`, `getFeaturedProducts(limit)`
    - All read from `rz_products` in Storage
    - _Requirements: 4.2, 5.1, 6.1_

  - [x] 7.2 Implement `renderProductCard(product, options)` — returns a DOM element
    - Display: product image (consistent aspect ratio, descriptive `alt`), name, category badge, star rating, price, "Add to Cart" button, heart (wishlist) toggle button
    - Options: `{ showWishlist: boolean, wishlisted: boolean }`
    - Clicking image or name navigates to `product.html?id={productId}`
    - "Add to Cart": if unauthenticated redirect to `login.html`; if authenticated call `addToCart()` and show Toast success
    - Heart toggle: calls `toggleWishlist()` and updates icon state
    - _Requirements: 5.2, 5.9, 5.10, 5.11, 10.2, 10.3_

  - [x] 7.3 Implement search, category, price-range filter functions and sort function
    - Search: case-insensitive match on `name` or any element of `tags`
    - Category: exact match on `category` field
    - Price range: `min ≤ price ≤ max`
    - Sort options: Newest (`createdAt` desc), Price Low→High, Price High→Low, Top Rated (`rating` desc)
    - _Requirements: 5.3, 5.4, 5.5, 5.6_

  - [ ]* 7.4 Write property test for search filter correctness
    - **Property 6: Search Filter Correctness**
    - **Validates: Requirements 5.3**

  - [ ]* 7.5 Write property test for category filter correctness
    - **Property 7: Category Filter Correctness**
    - **Validates: Requirements 5.4**

  - [ ]* 7.6 Write property test for price range filter correctness
    - **Property 8: Price Range Filter Correctness**
    - **Validates: Requirements 5.5**

  - [x] 7.7 Implement `renderPagination(container, state, onPageChange)` and pagination state management
    - Renders [Prev] [1] [2] … [N] [Next]; disables Prev on page 1, Next on last page; highlights current page
    - `itemsPerPage = 12`; slice formula: `filteredProducts.slice((page-1)*12, page*12)`
    - On filter/sort change: reset `currentPage = 1`
    - _Requirements: 5.7, 5.8, 18.1, 18.2, 18.3, 18.4, 18.5_

  - [ ]* 7.8 Write property test for pagination slice correctness
    - **Property 9: Pagination Slice Correctness**
    - **Validates: Requirements 5.8, 18.1, 18.4**

  - [ ]* 7.9 Write property test for pagination boundary button states
    - **Property 10: Pagination Boundary Button States**
    - **Validates: Requirements 18.2, 18.3**

  - [x] 7.10 Implement `initShopPage()` — wires filters, sort, search, pagination, pre-applies URL query params
    - Read `?category=X` and `?search=Y` from URL on load and pre-apply
    - Real-time search filtering as user types
    - Empty state: message + "Clear Filters" button when no results
    - Loading skeleton shown while reading from Storage on initial load
    - _Requirements: 5.1, 5.3, 5.4, 5.5, 5.6, 5.7, 5.12, 17.4_

  - [x] 7.11 Implement `initProductDetailPage()` — reads `?id=`, renders full detail view
    - Breadcrumb: Home > Shop > {category} > {name}
    - Large image, name, category badge, star rating, price, stock badge, description, quantity selector, "Add to Cart" button (disabled if stock = 0), wishlist toggle
    - "Product not found" message with back link if `id` is invalid
    - Related products: up to 4 cards from same category (excluding current product)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 7.12 Implement `initFeaturedSection()` — for use on `index.html`
    - Calls `getFeaturedProducts(8)`, renders up to 8 product cards in a responsive grid
    - _Requirements: 2.3_

- [x] 8. Build `shop.html` and `product.html` pages
  - [x] 8.1 Build `shop.html`
    - Navbar (sticky, responsive with hamburger), main layout with filter sidebar (collapsible drawer on mobile) and product grid section, Footer
    - Filter sidebar: category radio buttons, price range min/max inputs, "Clear Filters" button
    - Top bar: search input, sort dropdown
    - Product grid area, empty state area, pagination area
    - Load `js/app.js` then `js/products.js` as ES modules; call `seedDataIfNeeded()`, `initDarkMode()`, `initNavbar()`, `initShopPage()` on `DOMContentLoaded`
    - _Requirements: 1.4, 5.1, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [x] 8.2 Build `product.html`
    - Navbar, main content area (breadcrumb, product detail two-column layout, related products section), Footer
    - Load `js/app.js` then `js/products.js` as ES modules; call `seedDataIfNeeded()`, `initDarkMode()`, `initNavbar()`, `initProductDetailPage()` on `DOMContentLoaded`
    - _Requirements: 1.4, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 9. Implement `js/cart.js` — cart CRUD, badge, cart page
  - [x] 9.1 Implement `getCart()`, `addToCart(productId, qty)`, `removeFromCart(productId)`, `updateQty(productId, delta)`, `clearCart()`, `getCartTotal()`, `getCartCount()`
    - All mutations follow read-modify-write pattern through `Storage`
    - `updateQty` with delta = -1 when qty = 1 removes the item entirely
    - `addToCart`: if item exists increment quantity; else push new `CartItem` (denormalized name, price, image)
    - After every mutation call `updateCartBadge()`
    - Filter out cart items whose `productId` no longer exists in `rz_products` on `getCart()`
    - _Requirements: 7.3, 7.4, 7.5, 7.6, 7.10, 11.6_

  - [ ]* 9.2 Write property test for cart quantity delta
    - **Property 11: Cart Quantity Delta**
    - **Validates: Requirements 7.3, 7.4, 7.5**

  - [ ]* 9.3 Write property test for cart total calculation
    - **Property 12: Cart Total Calculation**
    - **Validates: Requirements 7.7**

  - [x] 9.4 Implement `initCartPage()`
    - Call `requireAuth()` first
    - Render cart table: image, name, unit price, qty controls (increment/decrement), line subtotal, remove button
    - Order summary: subtotal, shipping fee line, grand total
    - Empty state: illustration + "Continue Shopping" → `shop.html`
    - "Proceed to Checkout" button → `checkout.html`
    - _Requirements: 7.1, 7.2, 7.7, 7.8, 7.9_

- [x] 10. Build `cart.html` page
  - Navbar, main cart content area, Footer
  - Load `js/app.js` then `js/cart.js` as ES modules; call `seedDataIfNeeded()`, `initDarkMode()`, `initNavbar()`, `initCartPage()` on `DOMContentLoaded`
  - _Requirements: 1.4, 7.1, 7.7, 7.8, 7.9_

- [ ] 11. Checkpoint — Verify cart flow end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Implement `js/checkout.js` — form, order creation, transaction ID
  - [x] 12.1 Implement `generateTransactionId()`
    - Format: `'TRX' + Date.now() + String(Math.floor(Math.random() * 9000) + 1000)`
    - Result matches `/^TRX\d{13,}\d{4}$/`
    - _Requirements: 8.4_

  - [ ]* 12.2 Write property test for transaction ID format
    - **Property 13: Transaction ID Format**
    - **Validates: Requirements 8.4**

  - [x] 12.3 Implement `createOrder(formData)` and `initCheckoutPage()`
    - Call `requireAuth()` first; redirect to `cart.html` with Toast warning if cart is empty
    - Form fields: Full Name, Shipping Address, City, Postal Code, Phone Number
    - Inline validation errors on empty required fields; do not create order on failure
    - On success: generate `transactionId`, build `Order` object (all required fields including `subtotal`, `shipping`, `total`, `status: "pending"`), push to `rz_orders`, call `clearCart()`, show Toast with `transactionId`, redirect to `orders.html`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

  - [ ]* 12.4 Write property test for order completeness
    - **Property 14: Order Completeness**
    - **Validates: Requirements 8.5, 8.6**

- [x] 13. Build `checkout.html` page
  - Navbar, two-column main layout (checkout form left, order summary right), Footer
  - Load `js/app.js` then `js/checkout.js` as ES modules; call `seedDataIfNeeded()`, `initDarkMode()`, `initNavbar()`, `initCheckoutPage()` on `DOMContentLoaded`
  - _Requirements: 1.4, 8.1, 8.2_

- [x] 14. Implement `js/orders.js` — order history
  - [x] 14.1 Implement `getUserOrders(email)` and `initOrdersPage()`
    - `getUserOrders(email)`: filters `rz_orders` by `order.userEmail === email`, sorted by `date` descending
    - Call `requireAuth()` first
    - Render orders table: Transaction ID, date, item count, total, status badge, "View" button
    - Expandable detail row (toggle on row click or "View" button): items table, quantities, prices, shipping address, full Transaction ID
    - Empty state: message + "Start Shopping" → `shop.html`
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 14.2 Write property test for order user isolation
    - **Property 15: Order User Isolation**
    - **Validates: Requirements 9.1**

- [x] 15. Build `orders.html` page
  - Navbar, main orders content area, Footer
  - Load `js/app.js` then `js/orders.js` as ES modules; call `seedDataIfNeeded()`, `initDarkMode()`, `initNavbar()`, `initOrdersPage()` on `DOMContentLoaded`
  - _Requirements: 1.4, 9.1, 9.2, 9.3, 9.4_

- [x] 16. Implement `js/wishlist.js` — wishlist toggle and page
  - [x] 16.1 Implement `getWishlist(email)`, `toggleWishlist(email, productId)`, `isWishlisted(email, productId)`
    - All operate on `rz_wishlist` (`WishlistMap` keyed by email)
    - `toggleWishlist`: add if absent, remove if present; persist to Storage
    - Per-user isolation: mutations to one email's list must not affect any other email's list
    - _Requirements: 10.2, 10.3, 10.4_

  - [ ]* 16.2 Write property test for wishlist toggle round-trip
    - **Property 16: Wishlist Toggle Round-Trip**
    - **Validates: Requirements 10.2, 10.3**

  - [ ]* 16.3 Write property test for wishlist user isolation
    - **Property 17: Wishlist User Isolation**
    - **Validates: Requirements 10.4**

  - [x] 16.4 Implement `initWishlistPage()`
    - Call `requireAuth()` first
    - Render wishlist grid of product cards with "Remove from Wishlist" and "Add to Cart" buttons
    - "Add to Cart" calls `addToCart()` from `cart.js`
    - Empty state: message + "Browse Products" → `shop.html`
    - _Requirements: 10.1, 10.5, 10.6_

- [x] 17. Build `wishlist.html` page
  - Navbar, main wishlist grid area, Footer
  - Load `js/app.js`, `js/cart.js`, `js/wishlist.js` as ES modules; call `seedDataIfNeeded()`, `initDarkMode()`, `initNavbar()`, `initWishlistPage()` on `DOMContentLoaded`
  - _Requirements: 1.4, 10.1, 10.5, 10.6_

- [ ] 18. Checkpoint — Verify wishlist and orders flows
  - Ensure all tests pass, ask the user if questions arise.

- [x] 19. Implement `js/admin.js` — dashboard, product CRUD, order management, user table
  - [x] 19.1 Implement `renderDashboard()` — dashboard stats and recent orders mini-table
    - Compute from Storage: total products, total orders, total users, total revenue (sum of all `order.total`)
    - Display 4 stat cards and a mini-table of the 5 most recent orders
    - _Requirements: 16.3_

  - [x] 19.2 Implement `renderProductsTable()`, `openProductModal(productId)`, and `saveProduct()`
    - Products table: thumbnail, name, category, price, stock, Edit button, Delete button
    - "Add Product" button opens modal with empty form; "Edit" opens modal pre-populated
    - Modal form fields: Name, Category, Price, Stock, Image URL, Description, Featured (checkbox), Tags
    - `saveProduct()`: validate all required fields (inline errors on failure); on add generate unique `id` not already in `rz_products`; on edit replace existing entry; refresh table after save
    - Delete: show `confirm()` dialog; on confirm remove from `rz_products` and refresh table
    - _Requirements: 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9_

  - [ ]* 19.3 Write property test for admin product ID uniqueness
    - **Property 19: Admin Product ID Uniqueness**
    - **Validates: Requirements 14.5**

  - [x] 19.4 Implement `renderOrdersTable()` — orders table with inline status dropdown and detail modal
    - Table columns: Transaction ID, customer name, date, total, status dropdown, "View Detail" button
    - Status dropdown options: `pending`, `processing`, `shipped`, `delivered`, `cancelled`; on `change` update `rz_orders` and show Toast success
    - "View Detail" opens modal with full order: all items, quantities, prices, shipping address
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [x] 19.5 Implement `renderUsersTable()` — users table (no passwords displayed)
    - Table columns: name, email, role, registration date
    - Must NOT display password field
    - _Requirements: 16.1, 16.2_

  - [x] 19.6 Implement `initAdminPage()` — sidebar navigation, section switching
    - Call `requireAdmin()` first
    - Sidebar nav items: Dashboard, Products, Orders, Users; clicking each calls `showSection(name)`
    - On mobile (< 768px) sidebar collapses to a top tab bar
    - Default section on load: Dashboard
    - _Requirements: 14.1, 14.2_

- [x] 20. Build `admin.html` page
  - Admin layout: fixed-width sidebar (`w-64`) + main content area (no standard Footer)
  - Sidebar: store logo, nav items with `data-nav` attributes, Logout button
  - Main content: four section containers (`#section-dashboard`, `#section-products`, `#section-orders`, `#section-users`) toggled by `showSection()`
  - Product modal: `<dialog>` or hidden `<div>` overlay with form
  - Order detail modal
  - Load `js/app.js`, `js/products.js`, `js/admin.js` as ES modules; call `initDarkMode()`, `initAdminPage()` on `DOMContentLoaded`
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 15.1, 15.2, 16.1_

- [x] 21. Build `index.html` — landing page (replaces existing SPA)
  - [x] 21.1 Build the full `index.html` structure
    - Navbar (sticky, responsive hamburger), Hero Section, Category Section, Featured Products Section, Footer
    - Hero: full-width gradient background, H1 + subheadline, "Shop Now" CTA → `shop.html`, decorative image (hidden on mobile)
    - Category Section: 4-column grid (2 on mobile); each card has icon + category name + product count; click → `shop.html?category=X`
    - Featured Products Section: heading + "View All" → `shop.html`; responsive grid of up to 8 product cards rendered by `initFeaturedSection()`
    - Footer: store name + tagline, navigation link groups (Shop, Account, Info), social media icon links, copyright line
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 17.5_

  - [x] 21.2 Wire `index.html` scripts
    - Load `js/app.js`, `js/cart.js`, `js/wishlist.js`, `js/products.js` as ES modules
    - On `DOMContentLoaded`: call `seedDataIfNeeded()`, `initDarkMode()`, `initNavbar()`, `initFeaturedSection()`
    - _Requirements: 1.1, 4.2_

- [ ] 22. Checkpoint — Verify landing page and full navigation flow
  - Ensure all tests pass, ask the user if questions arise.

- [x] 23. Responsive design polish and accessibility
  - Audit all pages for responsive layout at 320px, 768px, 1024px, 1920px breakpoints
  - Verify product image aspect ratios are consistent (use `aspect-square` or `aspect-[4/3]` + `object-cover`) and `alt` attributes are descriptive on all `<img>` tags
  - Add visible focus states to all interactive elements (buttons, links, inputs) — use Tailwind `focus:ring-2 focus:ring-primary focus:outline-none` or equivalent
  - Verify loading skeleton/spinner is shown on initial product data load for `shop.html`, `index.html`, and `product.html`
  - Verify hamburger menu drawer works correctly on all pages with a Navbar
  - Verify dark mode classes (`dark:bg-*`, `dark:text-*`, `dark:border-*`) are applied consistently across all pages and components
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.6, 17.7_

- [x] 24. Write `README.md` for GitHub Pages deployment
  - Document: project overview, file structure, how to run locally (open `index.html` in browser or use a static server), how to deploy to GitHub Pages (push to `main`, enable Pages from root), default login credentials (admin and demo), and LocalStorage key reference
  - _Requirements: 1.5_

- [ ] 25. Final checkpoint — Full application review
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints at tasks 3, 6, 11, 18, 22, and 25 ensure incremental validation
- Property tests use **fast-check** (loaded via CDN or npm in the test environment); minimum 100 iterations per property; each test tagged `// Feature: online-shop, Property N: <property text>`
- Unit tests complement property tests for specific examples and edge cases
- All pages must include the FOUC-prevention inline script in `<head>` before any CSS link
- No build step required — the app must work by opening `index.html` directly in a browser
