export const BASE_URL = 'http://localhost:3000/api'; // Change this to Railway URL when deployed

export const API = {
  async getProducts() {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async getProduct(id) {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      return await res.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async createProduct(productData) {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return await res.json();
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return await res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return await res.json();
  },

  async checkout(orderData) {
    const res = await fetch(`${BASE_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Checkout failed');
    return await res.json();
  },

  async registerUser(userData) {
    const res = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Register failed');
    return data;
  },

  async loginUser(credentials) {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getUsers() {
    try {
      const res = await fetch(`${BASE_URL}/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};
