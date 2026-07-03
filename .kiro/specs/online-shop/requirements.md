# Requirements Document

## Introduction

RZStore is a fully client-side online shop web application built with vanilla JavaScript (ES6+), Tailwind CSS, and LocalStorage as the persistence layer. The application replaces the current single-file SPA with a proper multi-file, multi-page structure that meets international e-commerce standards. It includes a public storefront (landing page, product catalog, cart, checkout, order history) and a separate admin panel (product CRUD, order management, user management). All data is stored in LocalStorage; initial product data is seeded from a static JSON file. The application must be deployable to GitHub Pages with no backend.

---

## Glossary

- **App**: The RZStore web application as a whole.
- **Storefront**: The customer-facing pages of the App.
- **Admin_Panel**: The administrator-facing pages of the App, accessible via `/admin.html`.
- **Auth_Module**: The component responsible for login, registration, and session management.
- **Product_Catalog**: The component that displays, searches, and filters products.
- **Product_Card**: A UI element that displays a product's image, name, category, price, rating, and action buttons.
- **Product_Detail_Page**: A dedicated view showing full product information.
- **Cart_Module**: The component that manages the shopping cart state and UI.
- **Checkout_Module**: The component that collects shipping information and creates orders.
- **Order_History_Module**: The component that displays past orders for the logged-in user.
- **Wishlist_Module**: The component that allows users to save products for later.
- **Admin_Product_Manager**: The admin sub-component for product CRUD operations.
- **Admin_Order_Manager**: The admin sub-component for viewing and managing all orders.
- **Admin_User_Manager**: The admin sub-component for viewing and managing registered users.
- **Toast_System**: The global notification component that displays transient messages.
- **Dark_Mode_Toggle**: The UI control that switches between light and dark themes.
- **Pagination_Component**: The UI component that splits large lists into pages.
- **LocalStorage**: The browser's `localStorage` API used as the application's data store.
- **Session**: The currently authenticated user object stored in LocalStorage.
- **Transaction_ID**: A unique string identifier generated for each completed order, prefixed with `TRX`.
- **Admin_User**: A user account with `role: "admin"` in LocalStorage.
- **Customer**: A user account with `role: "customer"` in LocalStorage.
- **Hero_Section**: The full-width banner section at the top of the landing page.
- **Category_Section**: The section on the landing page that displays product categories as clickable cards.
- **Featured_Products_Section**: The section on the landing page that highlights selected products.
- **Footer**: The site-wide footer containing links, social icons, and copyright information.
- **Navbar**: The site-wide top navigation bar.

---

## Requirements

### Requirement 1: Multi-File Project Structure

**User Story:** As a developer, I want the application split into multiple HTML, JS, and CSS files, so that the codebase is maintainable, scalable, and deployable to GitHub Pages.

#### Acceptance Criteria

1. THE App SHALL be structured with at minimum the following files: `index.html` (landing/home), `shop.html` (product catalog), `product.html` (product detail), `cart.html` (cart), `checkout.html` (checkout), `orders.html` (order history), `wishlist.html` (wishlist), `login.html` (authentication), `admin.html` (admin panel), `js/app.js` (shared utilities and state), `js/auth.js`, `js/products.js`, `js/cart.js`, `js/checkout.js`, `js/orders.js`, `js/wishlist.js`, `js/admin.js`, `data/products.json` (seed data), and `css/style.css` (custom styles beyond Tailwind).
2. THE App SHALL load Tailwind CSS via CDN on every HTML page.
3. THE App SHALL load Font Awesome via CDN on every HTML page for icons.
4. THE App SHALL share a common `Navbar` and `Footer` HTML structure across all Storefront pages.
5. WHEN a user navigates directly to any page URL, THE App SHALL render that page correctly without requiring a redirect through `index.html`.

---

### Requirement 2: Landing Page (Home)

**User Story:** As a visitor, I want a professional landing page with a hero section, category highlights, and featured products, so that I get a strong first impression of the store.

#### Acceptance Criteria

1. THE `index.html` page SHALL contain a full-width `Hero_Section` with a headline, subheadline, and a "Shop Now" call-to-action button that navigates to `shop.html`.
2. THE `index.html` page SHALL contain a `Category_Section` displaying at least 4 product categories as clickable cards; clicking a category card SHALL navigate to `shop.html` with that category pre-selected as a filter.
3. THE `index.html` page SHALL contain a `Featured_Products_Section` displaying up to 8 products marked as featured in `data/products.json`.
4. THE `index.html` page SHALL contain a `Footer` with store name, navigation links, social media icon links, and a copyright notice.
5. THE `Hero_Section` SHALL be fully responsive, displaying correctly on viewports from 320px to 1920px wide.
6. WHEN a visitor clicks the "Shop Now" button in the `Hero_Section`, THE App SHALL navigate to `shop.html`.

---

### Requirement 3: Authentication

**User Story:** As a visitor, I want to register and log in with my email and password, so that I can access protected features like cart, checkout, and order history.

#### Acceptance Criteria

1. THE `Auth_Module` SHALL provide a registration form with fields: Full Name, Email, and Password.
2. WHEN a registration form is submitted, THE `Auth_Module` SHALL validate that the Password field contains at least 6 characters; IF the password is shorter, THEN THE `Auth_Module` SHALL display an error message without saving the user.
3. WHEN a registration form is submitted, THE `Auth_Module` SHALL validate that the Email field is not already registered in LocalStorage; IF the email exists, THEN THE `Auth_Module` SHALL display an error message without saving the user.
4. WHEN a valid registration form is submitted, THE `Auth_Module` SHALL save the new user to LocalStorage with fields: `name`, `email`, `password`, `role: "customer"`, and `createdAt` timestamp.
5. THE `Auth_Module` SHALL provide a login form with fields: Email and Password.
6. WHEN a login form is submitted with matching credentials, THE `Auth_Module` SHALL write the authenticated user object (excluding password) to the `Session` in LocalStorage and redirect to `index.html`.
7. IF a login form is submitted with non-matching credentials, THEN THE `Auth_Module` SHALL display an error message and SHALL NOT create a session.
8. WHEN a logged-in user clicks "Logout", THE `Auth_Module` SHALL clear the `Session` from LocalStorage and redirect to `index.html`.
9. WHEN an unauthenticated user attempts to access `cart.html`, `checkout.html`, `orders.html`, or `wishlist.html`, THE `Auth_Module` SHALL redirect the user to `login.html`.
10. THE App SHALL seed one default `Admin_User` (`admin@rzstore.com` / `admin123`) and one default `Customer` (`demo@rzstore.com` / `123456`) into LocalStorage on first load if no users exist.

---

### Requirement 4: Product Data and Seeding

**User Story:** As a developer, I want product data loaded from a JSON file, so that the catalog is easy to update and the initial state is predictable.

#### Acceptance Criteria

1. THE App SHALL include a `data/products.json` file containing at least 20 products, each with fields: `id`, `name`, `category`, `price`, `image`, `stock`, `rating`, `description`, `featured` (boolean), and `tags` (array of strings).
2. WHEN the App loads for the first time and LocalStorage contains no product data, THE App SHALL seed LocalStorage with the contents of `data/products.json`.
3. WHEN LocalStorage already contains product data, THE App SHALL use the LocalStorage data and SHALL NOT overwrite it with the JSON file.
4. THE `data/products.json` file SHALL contain products spanning at least 4 distinct categories (e.g., Hoodie, Jacket, T-Shirt, Pants).

---

### Requirement 5: Product Catalog Page

**User Story:** As a customer, I want to browse all products with search and filter options, so that I can quickly find items I want to buy.

#### Acceptance Criteria

1. THE `shop.html` page SHALL display all products from LocalStorage in a responsive grid: 1 column on mobile (< 640px), 2 columns on tablet (640px–1023px), and 3–4 columns on desktop (≥ 1024px).
2. THE `Product_Card` SHALL display: product image, name, category badge, star rating, price, an "Add to Cart" button, and a "Wishlist" (heart) toggle button.
3. THE `Product_Catalog` SHALL provide a text search input that filters products by name and tags in real time as the user types.
4. THE `Product_Catalog` SHALL provide a category filter dropdown that filters products to a single selected category.
5. THE `Product_Catalog` SHALL provide a price range filter with minimum and maximum price inputs.
6. THE `Product_Catalog` SHALL provide a sort control with options: "Newest", "Price: Low to High", "Price: High to Low", and "Top Rated".
7. WHEN no products match the active filters, THE `Product_Catalog` SHALL display an empty-state message with a "Clear Filters" button.
8. THE `Pagination_Component` SHALL display products in pages of 12 items; WHEN the total number of filtered products exceeds 12, THE `Pagination_Component` SHALL render page navigation controls.
9. WHEN a `Product_Card` image or name is clicked, THE App SHALL navigate to `product.html?id={productId}`.
10. WHEN the "Add to Cart" button on a `Product_Card` is clicked by an unauthenticated user, THE `Auth_Module` SHALL redirect the user to `login.html`.
11. WHEN the "Add to Cart" button on a `Product_Card` is clicked by an authenticated user, THE `Cart_Module` SHALL add the product to the cart and THE `Toast_System` SHALL display a success notification.
12. WHEN the page loads with URL query parameters `?category=X` or `?search=Y`, THE `Product_Catalog` SHALL pre-apply those filters.

---

### Requirement 6: Product Detail Page

**User Story:** As a customer, I want to view full details of a product on its own page, so that I can make an informed purchase decision.

#### Acceptance Criteria

1. THE `product.html` page SHALL read the `id` query parameter from the URL and display the matching product from LocalStorage.
2. THE `product.html` page SHALL display: large product image, name, category, full description, price, stock availability, star rating, and an "Add to Cart" button.
3. THE `product.html` page SHALL display a "Add to Wishlist" / "Remove from Wishlist" toggle button that reflects the current wishlist state.
4. WHEN the `id` query parameter does not match any product, THE `product.html` page SHALL display a "Product not found" message with a link back to `shop.html`.
5. THE `product.html` page SHALL display a "Related Products" section showing up to 4 products from the same category.
6. WHEN the stock of a product is 0, THE `product.html` page SHALL display an "Out of Stock" badge and SHALL disable the "Add to Cart" button.

---

### Requirement 7: Shopping Cart

**User Story:** As a customer, I want to manage items in my cart and see the running total, so that I can review my order before checkout.

#### Acceptance Criteria

1. THE `cart.html` page SHALL display all items in the cart with: product image, name, unit price, quantity controls (increment/decrement), line subtotal, and a remove button.
2. THE `Cart_Module` SHALL display the cart item count as a badge on the Navbar cart icon across all pages.
3. WHEN the quantity increment button is clicked, THE `Cart_Module` SHALL increase the item quantity by 1 and update the subtotal and total in LocalStorage.
4. WHEN the quantity decrement button is clicked and the current quantity is greater than 1, THE `Cart_Module` SHALL decrease the item quantity by 1.
5. WHEN the quantity decrement button is clicked and the current quantity is 1, THE `Cart_Module` SHALL remove the item from the cart.
6. WHEN the remove button is clicked, THE `Cart_Module` SHALL remove the item from the cart and update LocalStorage.
7. THE `cart.html` page SHALL display the order subtotal, a shipping fee line (fixed or free), and the grand total.
8. WHEN the cart is empty, THE `cart.html` page SHALL display an empty-state illustration and a "Continue Shopping" button linking to `shop.html`.
9. THE `cart.html` page SHALL display a "Proceed to Checkout" button that navigates to `checkout.html`.
10. THE `Cart_Module` SHALL persist cart state in LocalStorage so that cart contents survive page reloads and browser restarts.

---

### Requirement 8: Checkout

**User Story:** As a customer, I want to fill in my shipping details and confirm my order, so that I can complete a purchase.

#### Acceptance Criteria

1. THE `checkout.html` page SHALL display an order summary listing all cart items, quantities, and prices alongside the checkout form.
2. THE `Checkout_Module` SHALL provide a form with fields: Full Name, Shipping Address, City, Postal Code, and Phone Number.
3. WHEN the checkout form is submitted with any empty required field, THE `Checkout_Module` SHALL display inline validation errors and SHALL NOT create an order.
4. WHEN the checkout form is submitted with all valid fields, THE `Checkout_Module` SHALL generate a unique `Transaction_ID` with the format `TRX` + timestamp + 4-digit random number.
5. WHEN an order is successfully created, THE `Checkout_Module` SHALL save the order to LocalStorage with fields: `transactionId`, `userEmail`, `date`, `customer` (name, address, city, postalCode, phone), `items`, `total`, and `status: "pending"`.
6. WHEN an order is successfully created, THE `Checkout_Module` SHALL clear the cart from LocalStorage.
7. WHEN an order is successfully created, THE `Toast_System` SHALL display a success notification containing the `Transaction_ID`.
8. WHEN an order is successfully created, THE App SHALL redirect the user to `orders.html`.

---

### Requirement 9: Order History

**User Story:** As a customer, I want to view my past orders and their details, so that I can track what I have purchased.

#### Acceptance Criteria

1. THE `orders.html` page SHALL display all orders associated with the logged-in user's email, sorted by date descending.
2. THE `Order_History_Module` SHALL display for each order: `Transaction_ID`, order date, item count, total amount, and order status badge.
3. WHEN a user clicks on an order row, THE `Order_History_Module` SHALL expand or navigate to a detail view showing all items, quantities, prices, shipping address, and the full `Transaction_ID`.
4. WHEN the user has no orders, THE `orders.html` page SHALL display an empty-state message with a "Start Shopping" button linking to `shop.html`.

---

### Requirement 10: Wishlist

**User Story:** As a customer, I want to save products to a wishlist, so that I can revisit items I am interested in without adding them to my cart immediately.

#### Acceptance Criteria

1. THE `wishlist.html` page SHALL display all products saved to the logged-in user's wishlist.
2. WHEN a user clicks the heart icon on a `Product_Card` or `product.html`, THE `Wishlist_Module` SHALL add the product to the user's wishlist in LocalStorage and toggle the heart icon to filled.
3. WHEN a user clicks the filled heart icon on a `Product_Card` or `product.html`, THE `Wishlist_Module` SHALL remove the product from the wishlist in LocalStorage and toggle the heart icon to outline.
4. THE `Wishlist_Module` SHALL persist wishlist state per user email in LocalStorage.
5. WHEN a user clicks "Add to Cart" on a wishlist item, THE `Cart_Module` SHALL add the product to the cart.
6. WHEN the wishlist is empty, THE `wishlist.html` page SHALL display an empty-state message with a "Browse Products" button linking to `shop.html`.

---

### Requirement 11: Navbar

**User Story:** As a user, I want a consistent navigation bar on every page, so that I can move between sections of the store easily.

#### Acceptance Criteria

1. THE `Navbar` SHALL display the store logo/name on the left, navigation links in the center (Home, Shop, Wishlist, Orders), and user controls on the right (cart icon with badge, dark mode toggle, user avatar/name or Login button).
2. WHEN the user is authenticated, THE `Navbar` SHALL display the user's name and a "Logout" button in place of the "Login" button.
3. WHEN the user is not authenticated, THE `Navbar` SHALL display a "Login" button.
4. THE `Navbar` SHALL be responsive: on mobile (< 768px), navigation links SHALL collapse into a hamburger menu that opens a slide-in drawer.
5. THE `Navbar` SHALL be sticky (fixed to the top of the viewport) on all pages.
6. THE `Navbar` cart icon badge SHALL reflect the current cart item count and SHALL update without a full page reload when items are added or removed.

---

### Requirement 12: Dark Mode

**User Story:** As a user, I want to toggle between light and dark themes, so that I can use the store comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE `Dark_Mode_Toggle` SHALL be accessible from the `Navbar` on every page.
2. WHEN the `Dark_Mode_Toggle` is activated, THE App SHALL apply a dark color scheme to all page elements.
3. WHEN the `Dark_Mode_Toggle` is deactivated, THE App SHALL apply a light color scheme to all page elements.
4. THE App SHALL persist the user's theme preference in LocalStorage under the key `rz_theme`.
5. WHEN any page loads, THE App SHALL read `rz_theme` from LocalStorage and apply the saved theme before rendering visible content, preventing a flash of unstyled content.

---

### Requirement 13: Toast Notification System

**User Story:** As a user, I want brief, non-blocking notifications for actions like adding to cart or errors, so that I receive feedback without losing my place on the page.

#### Acceptance Criteria

1. THE `Toast_System` SHALL display notifications in the bottom-right corner of the viewport, stacked vertically.
2. THE `Toast_System` SHALL support at least three notification types: `success` (green), `error` (red), and `info` (blue), each with a distinct icon.
3. WHEN a notification is displayed, THE `Toast_System` SHALL automatically dismiss it after 3 seconds.
4. THE `Toast_System` SHALL support displaying multiple simultaneous notifications without overlap.
5. WHEN a user clicks a notification, THE `Toast_System` SHALL dismiss it immediately.

---

### Requirement 14: Admin Panel — Product Management

**User Story:** As an admin, I want to create, read, update, and delete products from a dedicated admin panel, so that I can keep the catalog up to date.

#### Acceptance Criteria

1. THE `admin.html` page SHALL be accessible only to users with `role: "admin"`; WHEN a non-admin user navigates to `admin.html`, THE App SHALL redirect them to `index.html`.
2. THE `Admin_Panel` SHALL display a sidebar navigation with sections: Dashboard, Products, Orders, and Users.
3. THE `Admin_Product_Manager` SHALL display all products in a table with columns: image thumbnail, name, category, price, stock, and action buttons (Edit, Delete).
4. WHEN the "Add Product" button is clicked, THE `Admin_Product_Manager` SHALL display a modal form with fields: Name, Category, Price, Stock, Image URL, Description, Featured (checkbox), and Tags.
5. WHEN the "Add Product" form is submitted with all required fields, THE `Admin_Product_Manager` SHALL save the new product to LocalStorage with a generated unique `id` and display it in the product table.
6. WHEN the "Edit" button is clicked for a product, THE `Admin_Product_Manager` SHALL display the same modal form pre-populated with the product's current data.
7. WHEN the "Edit" form is submitted, THE `Admin_Product_Manager` SHALL update the product in LocalStorage and refresh the product table.
8. WHEN the "Delete" button is clicked for a product, THE `Admin_Product_Manager` SHALL display a confirmation dialog; WHEN confirmed, THE `Admin_Product_Manager` SHALL remove the product from LocalStorage and refresh the product table.
9. IF the "Add Product" or "Edit" form is submitted with any required field empty, THEN THE `Admin_Product_Manager` SHALL display validation errors and SHALL NOT save the product.

---

### Requirement 15: Admin Panel — Order Management

**User Story:** As an admin, I want to view all customer orders and update their status, so that I can manage fulfillment.

#### Acceptance Criteria

1. THE `Admin_Order_Manager` SHALL display all orders from LocalStorage in a table with columns: Transaction ID, customer name, date, total, status, and a "View Detail" button.
2. WHEN the "View Detail" button is clicked, THE `Admin_Order_Manager` SHALL display a modal with the full order details including all items, quantities, prices, and shipping address.
3. THE `Admin_Order_Manager` SHALL provide a status dropdown per order with options: `pending`, `processing`, `shipped`, `delivered`, `cancelled`.
4. WHEN an admin changes an order's status, THE `Admin_Order_Manager` SHALL update the order's `status` field in LocalStorage immediately.

---

### Requirement 16: Admin Panel — User Management

**User Story:** As an admin, I want to view all registered users, so that I can monitor account activity.

#### Acceptance Criteria

1. THE `Admin_User_Manager` SHALL display all users from LocalStorage in a table with columns: name, email, role, and registration date.
2. THE `Admin_User_Manager` SHALL NOT display user passwords in the table or any admin UI.
3. THE `Admin_Panel` dashboard SHALL display summary statistics: total products, total orders, total users, and total revenue (sum of all order totals).

---

### Requirement 17: Responsive Design and UI Standards

**User Story:** As a user on any device, I want the store to look and function correctly, so that I have a consistent shopping experience on mobile, tablet, and desktop.

#### Acceptance Criteria

1. THE App SHALL be fully responsive across viewport widths from 320px to 1920px.
2. THE `Product_Card` SHALL have a consistent aspect ratio for product images (e.g., 1:1 or 4:3) and SHALL NOT stretch or distort images.
3. THE App SHALL use a consistent design system: a defined color palette, typography scale, spacing scale, and border-radius values applied uniformly across all pages.
4. THE App SHALL display a loading skeleton or spinner WHEN product data is being read from LocalStorage on initial page load.
5. THE `Footer` SHALL contain: store name and tagline, navigation link groups (Shop, Account, Info), social media icon links, and a copyright line.
6. ALL interactive elements (buttons, links, inputs) SHALL have visible focus states for keyboard accessibility.
7. ALL product images SHALL include descriptive `alt` attributes.

---

### Requirement 18: Pagination

**User Story:** As a customer browsing a large catalog, I want products split into pages, so that the page does not become slow or overwhelming.

#### Acceptance Criteria

1. THE `Pagination_Component` SHALL display page number buttons, a "Previous" button, and a "Next" button.
2. WHEN the current page is the first page, THE `Pagination_Component` SHALL disable the "Previous" button.
3. WHEN the current page is the last page, THE `Pagination_Component` SHALL disable the "Next" button.
4. WHEN a page number button is clicked, THE `Product_Catalog` SHALL display the corresponding page of products without a full page reload.
5. WHEN active filters or sort order change, THE `Pagination_Component` SHALL reset to page 1.
