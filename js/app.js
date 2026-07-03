// RZStore — Shared Utilities (app.js)
// Imported by all page modules

// ============================================================
// Storage Helper
// ============================================================
export const Storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(`Storage.get error for key "${key}":`, e);
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        Toast.show('Storage penuh. Hapus beberapa data.', 'error');
      }
      console.error(`Storage.set error for key "${key}":`, e);
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

// ============================================================
// Session Helper
// ============================================================
export const Session = {
  get() {
    return Storage.get('rz_session');
  },
  set(user) {
    // Strip password before saving
    const { password, ...safeUser } = user;
    Storage.set('rz_session', safeUser);
  },
  clear() {
    Storage.remove('rz_session');
  },
  isAdmin() {
    return Session.get()?.role === 'admin';
  }
};

// ============================================================
// Toast Notification System
// ============================================================
export const Toast = {
  show(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(container);
    }

    const config = {
      success: { border: 'border-green-500',  icon: 'fa-check-circle',        iconColor: 'text-green-500'  },
      error:   { border: 'border-red-500',    icon: 'fa-times-circle',        iconColor: 'text-red-500'    },
      info:    { border: 'border-blue-500',   icon: 'fa-info-circle',         iconColor: 'text-blue-500'   },
      warning: { border: 'border-amber-500',  icon: 'fa-exclamation-triangle', iconColor: 'text-amber-500'  }
    };
    const { border, icon, iconColor } = config[type] || config.info;

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex items-start gap-3 min-w-[280px] max-w-[360px] border-l-4 ${border} toast-enter`;
    toast.innerHTML = `
      <i class="fas ${icon} ${iconColor} mt-0.5 text-lg flex-shrink-0"></i>
      <span class="text-sm text-gray-800 dark:text-slate-100 flex-1 leading-snug">${message}</span>
      <button class="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 ml-auto cursor-pointer text-lg leading-none flex-shrink-0" style="font-size:18px">&times;</button>
    `;

    const dismiss = () => {
      toast.classList.remove('toast-enter');
      toast.classList.add('toast-exit');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    toast.querySelector('button').addEventListener('click', dismiss);
    toast.addEventListener('click', dismiss);

    container.appendChild(toast);
    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('toast-enter'));

    setTimeout(dismiss, 3000);
  }
};

// ============================================================
// Dark Mode
// ============================================================

const DARK_STYLE_ID = 'rz-dark-override';

const DARK_CSS = `
  body { background-color: #0f172a !important; color: #e2e8f0 !important; }
  nav { background-color: rgba(15,23,42,0.97) !important; border-color: #334155 !important; }
  .bg-white { background-color: #1e293b !important; }
  .bg-gray-50 { background-color: #0f172a !important; }
  .bg-gray-100 { background-color: #1e293b !important; }
  .bg-gray-200 { background-color: #334155 !important; }
  .text-gray-900 { color: #f1f5f9 !important; }
  .text-gray-800 { color: #e2e8f0 !important; }
  .text-gray-700 { color: #cbd5e1 !important; }
  .text-gray-600 { color: #94a3b8 !important; }
  .text-gray-500 { color: #64748b !important; }
  .border-gray-100 { border-color: #1e293b !important; }
  .border-gray-200 { border-color: #334155 !important; }
  .border-gray-300 { border-color: #475569 !important; }
  input:not([type=radio]):not([type=checkbox]), textarea, select {
    background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #475569 !important;
  }
  input::placeholder, textarea::placeholder { color: #64748b !important; }
  footer { background-color: #020617 !important; }
  #admin-sidebar { background-color: #020617 !important; }
  #mobile-drawer { background-color: #1e293b !important; }
  thead tr { background-color: rgba(30,41,59,0.9) !important; }
  td, th { border-color: #334155 !important; color: #cbd5e1 !important; }
`;

function _injectDarkStyle() {
  if (document.getElementById(DARK_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = DARK_STYLE_ID;
  style.textContent = DARK_CSS;
  document.head.appendChild(style);
}

function _removeDarkStyle() {
  document.getElementById(DARK_STYLE_ID)?.remove();
}

export function initDarkMode() {
  const saved = localStorage.getItem('rz_theme');
  const isDark = saved === 'dark';
  _applyTheme(isDark);
}

function _applyTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    _injectDarkStyle();
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
    _removeDarkStyle();
  }
  _updateIcon(isDark);
}

function _updateIcon(isDark) {
  document.querySelectorAll('#dark-toggle').forEach(btn => {
    btn.innerHTML = isDark
      ? '<i class="fas fa-sun" style="color:#fbbf24;font-size:1.1rem"></i>'
      : '<i class="fas fa-moon" style="color:#64748b;font-size:1.1rem"></i>';
  });
}

export function toggleDarkMode() {
  const isDark = !document.documentElement.classList.contains('dark');
  _applyTheme(isDark);
  localStorage.setItem('rz_theme', isDark ? 'dark' : 'light');
}

export function wireDarkToggle() {
  document.querySelectorAll('#dark-toggle').forEach(btn => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', toggleDarkMode);
  });
  _updateIcon(document.documentElement.classList.contains('dark'));
}

// ============================================================
// Seed Data
// ============================================================

// Fallback produk jika fetch JSON gagal (misal buka via file://)
const FALLBACK_PRODUCTS = [
  { id:"prod_001", name:"Classic Oversized Hoodie", category:"Hoodie", price:349000, image:"assets/images/prod_001.png", stock:45, rating:4.8, description:"Hoodie oversized premium dengan bahan fleece tebal.", featured:true, tags:["casual","oversized"], createdAt:"2025-01-10T08:00:00.000Z" },
  { id:"prod_002", name:"Vintage Washed Hoodie", category:"Hoodie", price:299000, image:"assets/images/prod_002.png", stock:30, rating:4.6, description:"Hoodie vintage washed retro stylish.", featured:true, tags:["vintage","retro"], createdAt:"2025-01-15T08:00:00.000Z" },
  { id:"prod_003", name:"Zip-Up Tech Hoodie", category:"Hoodie", price:389000, image:"assets/images/prod_003.png", stock:20, rating:4.5, description:"Hoodie zip-up material teknis ringan.", featured:false, tags:["zip","sporty"], createdAt:"2025-01-20T08:00:00.000Z" },
  { id:"prod_004", name:"Graphic Print Hoodie", category:"Hoodie", price:329000, image:"assets/images/prod_004.png", stock:0, rating:4.3, description:"Hoodie print grafis eksklusif.", featured:false, tags:["graphic","streetwear"], createdAt:"2025-02-01T08:00:00.000Z" },
  { id:"prod_005", name:"Bomber Jacket Premium", category:"Jacket", price:549000, image:"assets/images/prod_005.png", stock:25, rating:4.9, description:"Bomber jacket premium nylon berkualitas.", featured:true, tags:["bomber","premium"], createdAt:"2025-01-05T08:00:00.000Z" },
  { id:"prod_006", name:"Denim Jacket Washed", category:"Jacket", price:479000, image:"assets/images/prod_006.png", stock:18, rating:4.7, description:"Jaket denim washed slim fit modern.", featured:true, tags:["denim","casual"], createdAt:"2025-01-12T08:00:00.000Z" },
  { id:"prod_007", name:"Windbreaker Jacket", category:"Jacket", price:429000, image:"assets/images/prod_007.png", stock:35, rating:4.4, description:"Windbreaker ringan tahan angin dan air.", featured:true, tags:["outdoor","travel"], createdAt:"2025-01-18T08:00:00.000Z" },
  { id:"prod_008", name:"Leather Biker Jacket", category:"Jacket", price:899000, image:"assets/images/prod_008.png", stock:10, rating:4.8, description:"Jaket kulit biker edgy maskulin.", featured:true, tags:["leather","moto"], createdAt:"2025-02-05T08:00:00.000Z" },
  { id:"prod_009", name:"Essential White Tee", category:"T-Shirt", price:149000, image:"assets/images/prod_009.png", stock:100, rating:4.5, description:"Kaos putih essential cotton combed.", featured:true, tags:["basic","everyday"], createdAt:"2025-01-08T08:00:00.000Z" },
  { id:"prod_010", name:"Graphic Tee Streetwear", category:"T-Shirt", price:189000, image:"assets/images/prod_010.png", stock:60, rating:4.6, description:"Kaos streetwear grafis bold.", featured:true, tags:["streetwear","urban"], createdAt:"2025-01-22T08:00:00.000Z" },
  { id:"prod_011", name:"Polo Shirt Classic", category:"T-Shirt", price:229000, image:"assets/images/prod_011.png", stock:40, rating:4.4, description:"Polo shirt klasik pique cotton.", featured:false, tags:["polo","semi-formal"], createdAt:"2025-02-10T08:00:00.000Z" },
  { id:"prod_012", name:"Tie-Dye Tee", category:"T-Shirt", price:169000, image:"assets/images/prod_012.png", stock:0, rating:4.2, description:"Kaos tie-dye motif unik eksklusif.", featured:false, tags:["tie-dye","artsy"], createdAt:"2025-02-15T08:00:00.000Z" },
  { id:"prod_013", name:"Slim Fit Chino Pants", category:"Pants", price:319000, image:"assets/images/prod_013.png", stock:50, rating:4.7, description:"Celana chino slim fit twill.", featured:true, tags:["chino","versatile"], createdAt:"2025-01-14T08:00:00.000Z" },
  { id:"prod_014", name:"Jogger Pants Premium", category:"Pants", price:279000, image:"assets/images/prod_014.png", stock:45, rating:4.6, description:"Jogger pants fleece elastic waistband.", featured:false, tags:["jogger","sporty"], createdAt:"2025-01-25T08:00:00.000Z" },
  { id:"prod_015", name:"Cargo Pants Tactical", category:"Pants", price:399000, image:"assets/images/prod_015.png", stock:28, rating:4.5, description:"Cargo pants kantong fungsional ripstop.", featured:false, tags:["cargo","outdoor"], createdAt:"2025-02-08T08:00:00.000Z" },
  { id:"prod_016", name:"Wide Leg Trousers", category:"Pants", price:359000, image:"assets/images/prod_016.png", stock:22, rating:4.3, description:"Celana wide leg linen blend trendy.", featured:false, tags:["wide-leg","summer"], createdAt:"2025-02-20T08:00:00.000Z" },
  { id:"prod_017", name:"Corduroy Jacket", category:"Jacket", price:519000, image:"assets/images/prod_017.png", stock:15, rating:4.6, description:"Jaket corduroy tekstur vintage modern.", featured:false, tags:["corduroy","winter"], createdAt:"2025-02-12T08:00:00.000Z" },
  { id:"prod_018", name:"Striped Long Sleeve Tee", category:"T-Shirt", price:199000, image:"assets/images/prod_018.png", stock:55, rating:4.4, description:"Kaos lengan panjang motif garis klasik.", featured:false, tags:["striped","casual"], createdAt:"2025-02-18T08:00:00.000Z" },
  { id:"prod_019", name:"Fleece Pullover Hoodie", category:"Hoodie", price:369000, image:"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop&q=80", stock:38, rating:4.7, description:"Pullover hoodie fleece premium minimalis.", featured:true, tags:["fleece","minimalist"], createdAt:"2025-03-01T08:00:00.000Z" },
  { id:"prod_020", name:"Slim Straight Jeans", category:"Pants", price:449000, image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop&q=80", stock:42, rating:4.8, description:"Jeans slim straight denim premium.", featured:true, tags:["jeans","everyday"], createdAt:"2025-03-05T08:00:00.000Z" },
  { id:"prod_021", name:"Puffer Jacket Winter", category:"Jacket", price:699000, image:"https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=600&h=600&fit=crop&q=80", stock:20, rating:4.9, description:"Puffer jacket insulasi premium hangat.", featured:true, tags:["puffer","winter"], createdAt:"2025-03-10T08:00:00.000Z" },
  { id:"prod_022", name:"Henley Shirt", category:"T-Shirt", price:219000, image:"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop&q=80", stock:65, rating:4.5, description:"Henley shirt cotton waffle kasual rapi.", featured:false, tags:["henley","casual"], createdAt:"2025-03-15T08:00:00.000Z" }
];

export async function seedDataIfNeeded() {
  // Always fetch latest products from API
  try {
    const { API } = await import('./api.js');
    const products = await API.getProducts();
    if (products && products.length > 0) {
      Storage.set('rz_products', products);
    } else {
      throw new Error('API returned empty or failed');
    }
  } catch (e) {
    console.warn('Fetch API failed, using fallback data:', e.message);
    const existing = Storage.get('rz_products');
    if (!existing || existing.length === 0) {
      Storage.set('rz_products', FALLBACK_PRODUCTS);
    }
  }

  // Seed default users
  const users = Storage.get('rz_users');
  if (!users || users.length === 0) {
    Storage.set('rz_users', [
      {
        id: 'user_admin',
        name: 'Admin RZStore',
        email: 'admin@rzstore.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user_demo',
        name: 'Demo User',
        email: 'demo@rzstore.com',
        password: '123456',
        role: 'customer',
        createdAt: new Date().toISOString()
      }
    ]);
  }
}

// ============================================================
// Cart Badge
// ============================================================
export function updateCartBadge() {
  const cart = Storage.get('rz_cart') || [];
  const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  document.querySelectorAll('#cart-badge, .cart-badge').forEach(el => {
    el.textContent = count;
    el.classList.toggle('hidden', count === 0);
  });
}

// ============================================================
// Navbar
// ============================================================
export function initNavbar() {
  initDarkMode();
  wireDarkToggle(); // wire tombol setelah DOM ready
  updateCartBadge();

  // Hamburger menu
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose  = document.getElementById('drawer-close');
  const drawerOverlay = document.getElementById('drawer-overlay');

  const openDrawer = () => {
    mobileDrawer?.classList.remove('translate-x-full');
    drawerOverlay?.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  };
  const closeDrawer = () => {
    mobileDrawer?.classList.add('translate-x-full');
    drawerOverlay?.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };

  hamburgerBtn?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  // Auth state
  const session = Session.get();
  const loginBtn   = document.getElementById('login-btn');
  const logoutBtn  = document.getElementById('logout-btn');
  const userNameEl = document.getElementById('user-name');
  const mobileLoginBtn  = document.getElementById('mobile-login-btn');
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
  const mobileUserName  = document.getElementById('mobile-user-name');

  // Admin link — show only for admin role
  const adminLinkDesktop = document.getElementById('admin-nav-link');
  const adminLinkMobile  = document.getElementById('mobile-admin-link');

  if (session) {
    loginBtn?.classList.add('hidden');
    logoutBtn?.classList.remove('hidden');
    if (userNameEl) { userNameEl.textContent = session.name; userNameEl.classList.remove('hidden'); }
    mobileLoginBtn?.classList.add('hidden');
    mobileLogoutBtn?.classList.remove('hidden');
    if (mobileUserName) { mobileUserName.textContent = session.name; mobileUserName.classList.remove('hidden'); }

    // Show admin link if admin
    if (session.role === 'admin') {
      adminLinkDesktop?.classList.remove('hidden');
      adminLinkMobile?.classList.remove('hidden');
    } else {
      adminLinkDesktop?.classList.add('hidden');
      adminLinkMobile?.classList.add('hidden');
    }
  } else {
    loginBtn?.classList.remove('hidden');
    logoutBtn?.classList.add('hidden');
    userNameEl?.classList.add('hidden');
    mobileLoginBtn?.classList.remove('hidden');
    mobileLogoutBtn?.classList.add('hidden');
    mobileUserName?.classList.add('hidden');
    adminLinkDesktop?.classList.add('hidden');
    adminLinkMobile?.classList.add('hidden');
  }

  // Logout
  const handleLogout = () => {
    Session.clear();
    window.location.href = 'index.html';
  };
  logoutBtn?.addEventListener('click', handleLogout);
  mobileLogoutBtn?.addEventListener('click', handleLogout);

  // Active nav link highlight
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('text-indigo-600', 'dark:text-indigo-400', 'font-semibold');
    }
  });
}

// ============================================================
// Utility Helpers
// ============================================================
export function formatPrice(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    '<i class="fas fa-star text-amber-400"></i>'.repeat(full) +
    (half ? '<i class="fas fa-star-half-alt text-amber-400"></i>' : '') +
    '<i class="far fa-star text-amber-400"></i>'.repeat(empty)
  );
}
