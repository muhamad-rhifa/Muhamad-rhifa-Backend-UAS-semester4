require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../')));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to generate unique IDs
const generateId = (prefix) => {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
};

// --- Products API ---

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, image, stock, rating, description, featured, tags } = req.body;
    const id = generateId('prod');
    
    // Convert tags to JSON string if it's an array
    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : tags;
    const isFeatured = featured ? 1 : 0;

    const query = `
      INSERT INTO products (id, name, category, price, image, stock, rating, description, featured, tags) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [id, name, category, price, image || '', stock || 0, rating || 0, description || '', isFeatured, tagsJson || '[]'];
    
    await pool.query(query, values);
    res.status(201).json({ message: 'Product created successfully', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, category, price, image, stock, rating, description, featured, tags } = req.body;
    const { id } = req.params;

    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : tags;
    const isFeatured = featured ? 1 : 0;

    const query = `
      UPDATE products 
      SET name=?, category=?, price=?, image=?, stock=?, rating=?, description=?, featured=?, tags=? 
      WHERE id=?
    `;
    const values = [name, category, price, image, stock, rating, description, isFeatured, tagsJson, id];
    
    const [result] = await pool.query(query, values);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// --- Checkout API ---

// Process checkout
app.post('/api/checkout', async (req, res) => {
  try {
    const { customer_name, phone_number, address, cart_items, total_amount } = req.body;
    
    // Save to orders table
    const cartItemsJson = Array.isArray(cart_items) ? JSON.stringify(cart_items) : cart_items;
    
    const query = `
      INSERT INTO orders (customer_name, phone_number, address, total_amount, cart_items)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [customer_name, phone_number, address, total_amount, cartItemsJson]);
    
    // Generate WhatsApp Link
    const waNumber = process.env.WA_PHONE || '6281234567890';
    
    let itemsText = '';
    if (Array.isArray(cart_items)) {
        cart_items.forEach(item => {
            itemsText += `- ${item.name} (${item.quantity}x) : Rp ${Number(item.price * item.quantity).toLocaleString('id-ID')}\n`;
        });
    }

    const message = `Halo, saya ingin memesan:\n\n` +
                    `*Data Pemesan:*\n` +
                    `Nama: ${customer_name}\n` +
                    `No HP: ${phone_number}\n` +
                    `Alamat: ${address}\n\n` +
                    `*Pesanan:*\n${itemsText}\n` +
                    `*Total Bayar: Rp ${Number(total_amount).toLocaleString('id-ID')}*\n\n` +
                    `Mohon info ketersediaan dan nomor rekening untuk pembayaran. Terima kasih.`;
                    
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${waNumber}?text=${encodedMessage}`;

    res.status(201).json({ 
        message: 'Order created successfully', 
        orderId: result.insertId,
        whatsapp_url: waLink
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing checkout', error: error.message });
  }
});

// --- Users API ---

// Register User
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const id = generateId('user');
    const query = `INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, 'customer')`;
    await pool.query(query, [id, name, email, password]);
    
    res.status(201).json({ message: 'Registrasi berhasil', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login User
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT id, name, email, role, createdAt FROM users WHERE email = ? AND password = ?', [email, password]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Get all users (For Admin)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, createdAt FROM users ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
