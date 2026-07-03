// RZStore — Auth Module (auth.js)
import { Storage, Session, Toast, generateId } from './app.js';
import { API } from './api.js';

// ============================================================
// Auth Guards
// ============================================================
export function requireAuth() {
  if (!Session.get()) {
    window.location.href = 'login.html';
  }
}

export function requireAdmin() {
  const session = Session.get();
  if (!session || session.role !== 'admin') {
    window.location.href = 'index.html';
  }
}

// ============================================================
// Seed Default Users (dipanggil langsung, tidak bergantung fetch)
// ============================================================
function ensureDefaultUsers() {
  // Database seed is handled via database.sql directly.
}


function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isEmailTaken(email, users) {
  return false; // Handled by API now
}

function showError(fieldId, message) {
  const el = document.getElementById(fieldId);
  if (el) {
    // Untuk elemen yang memiliki span anak (seperti login-general-error)
    const span = el.querySelector('span');
    if (span) {
      span.textContent = message;
    } else {
      el.textContent = message;
    }
    el.classList.remove('hidden');
  }
}

function clearError(fieldId) {
  const el = document.getElementById(fieldId);
  if (el) {
    // Untuk elemen yang memiliki span anak (seperti login-general-error dengan icon)
    const span = el.querySelector('span');
    if (span) {
      span.textContent = '';
    } else {
      el.textContent = '';
    }
    el.classList.add('hidden');
  }
}

function clearAllErrors(ids) {
  ids.forEach(clearError);
}

// ============================================================
// Login Page Init
// ============================================================
export function initLoginPage() {
  // Pastikan akun default selalu ada sebelum form diinit
  ensureDefaultUsers();
  const loginTab    = document.getElementById('tab-login');
  const registerTab = document.getElementById('tab-register');
  const loginPanel  = document.getElementById('panel-login');
  const registerPanel = document.getElementById('panel-register');

  function showLogin() {
    loginPanel?.classList.remove('hidden');
    registerPanel?.classList.add('hidden');
    loginTab?.classList.add('border-indigo-600', 'text-indigo-600');
    loginTab?.classList.remove('border-transparent', 'text-gray-500');
    registerTab?.classList.remove('border-indigo-600', 'text-indigo-600');
    registerTab?.classList.add('border-transparent', 'text-gray-500');
  }

  function showRegister() {
    registerPanel?.classList.remove('hidden');
    loginPanel?.classList.add('hidden');
    registerTab?.classList.add('border-indigo-600', 'text-indigo-600');
    registerTab?.classList.remove('border-transparent', 'text-gray-500');
    loginTab?.classList.remove('border-indigo-600', 'text-indigo-600');
    loginTab?.classList.add('border-transparent', 'text-gray-500');
  }

  loginTab?.addEventListener('click', showLogin);
  registerTab?.addEventListener('click', showRegister);

  // Default: show login
  showLogin();

  // ---- Login Form ----
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors(['login-email-error', 'login-password-error', 'login-general-error']);

    const email    = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;

    let valid = true;
    if (!email) { showError('login-email-error', 'Email wajib diisi.'); valid = false; }
    if (!password) { showError('login-password-error', 'Password wajib diisi.'); valid = false; }
    if (!valid) return;

    try {
      const user = await API.loginUser({ email, password });
      Session.set(user);
      Toast.show(`Selamat datang, ${user.name}!`, 'success');
      setTimeout(() => { window.location.href = 'index.html'; }, 800);
    } catch (error) {
      showError('login-general-error', error.message || 'Email atau password salah. Periksa kembali email dan password kamu.');
    }
  });

  // ---- Register Form ----
  const registerForm = document.getElementById('register-form');
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors(['reg-name-error', 'reg-email-error', 'reg-password-error', 'reg-general-error']);

    const name     = document.getElementById('reg-name')?.value.trim();
    const email    = document.getElementById('reg-email')?.value.trim();
    const password = document.getElementById('reg-password')?.value;

    let valid = true;
    if (!name)    { showError('reg-name-error', 'Nama wajib diisi.'); valid = false; }
    if (!email)   { showError('reg-email-error', 'Email wajib diisi.'); valid = false; }
    else if (!validateEmail(email)) { showError('reg-email-error', 'Format email tidak valid.'); valid = false; }
    if (!password) { showError('reg-password-error', 'Password wajib diisi.'); valid = false; }
    else if (!validatePassword(password)) { showError('reg-password-error', 'Password minimal 6 karakter.'); valid = false; }
    if (!valid) return;

    try {
      await API.registerUser({ name, email, password });
      Toast.show('Registrasi berhasil! Silakan login.', 'success');
      registerForm.reset();
      showLogin();
    } catch (error) {
      showError('reg-email-error', error.message || 'Registrasi gagal.');
    }
  });
}
