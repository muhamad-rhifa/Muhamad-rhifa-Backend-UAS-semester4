CREATE DATABASE IF NOT EXISTS online_store;
USE online_store;

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    stock INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    description TEXT,
    featured BOOLEAN DEFAULT FALSE,
    tags JSON,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    cart_items JSON NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO users (id, name, email, password, role) VALUES 
('user_admin', 'Admin RZStore', 'admin@rzstore.com', 'admin123', 'admin'),
('user_demo', 'Demo User', 'demo@rzstore.com', '123456', 'customer');

-- Seed Data (Initial Products)
INSERT INTO products (id, name, category, price, image, stock, rating, description, featured, tags, createdAt) VALUES
('prod_001', 'Classic Oversized Hoodie', 'Hoodie', 349000, 'assets/images/prod_001.png', 45, 4.8, 'Hoodie oversized premium dengan bahan fleece tebal yang nyaman. Cocok untuk aktivitas sehari-hari maupun santai di rumah.', true, '["casual", "oversized", "fleece", "unisex", "winter"]', '2025-01-10 08:00:00'),
('prod_002', 'Vintage Washed Hoodie', 'Hoodie', 299000, 'assets/images/prod_002.png', 30, 4.6, 'Hoodie dengan efek washed vintage yang memberikan tampilan retro stylish. Bahan cotton blend yang lembut dan breathable.', true, '["vintage", "washed", "retro", "cotton", "casual"]', '2025-01-15 08:00:00'),
('prod_003', 'Zip-Up Tech Hoodie', 'Hoodie', 389000, 'assets/images/prod_003.png', 20, 4.5, 'Hoodie zip-up dengan material teknis yang ringan namun hangat. Dilengkapi kantong depan dan hood yang bisa disesuaikan.', false, '["zip", "technical", "lightweight", "sporty"]', '2025-01-20 08:00:00'),
('prod_004', 'Graphic Print Hoodie', 'Hoodie', 329000, 'assets/images/prod_004.png', 0, 4.3, 'Hoodie dengan print grafis eksklusif di bagian depan dan belakang. Ekspresi diri yang bold dan stylish.', false, '["graphic", "print", "bold", "streetwear"]', '2025-02-01 08:00:00'),
('prod_005', 'Bomber Jacket Premium', 'Jacket', 549000, 'assets/images/prod_005.png', 25, 4.9, 'Bomber jacket premium dengan bahan nylon berkualitas tinggi. Desain klasik dengan detail modern.', true, '["bomber", "nylon", "premium", "classic", "outerwear"]', '2025-01-05 08:00:00'),
('prod_006', 'Denim Jacket Washed', 'Jacket', 479000, 'assets/images/prod_006.png', 18, 4.7, 'Jaket denim dengan efek washed yang memberikan karakter unik. Potongan slim fit yang modern dan versatile.', true, '["denim", "washed", "slim-fit", "versatile", "casual"]', '2025-01-12 08:00:00'),
('prod_007', 'Windbreaker Jacket', 'Jacket', 429000, 'assets/images/prod_007.png', 35, 4.4, 'Windbreaker ringan yang tahan angin dan air. Ideal untuk aktivitas outdoor dan perjalanan.', true, '["windbreaker", "outdoor", "waterproof", "packable", "travel"]', '2025-01-18 08:00:00'),
('prod_008', 'Leather Biker Jacket', 'Jacket', 899000, 'assets/images/prod_008.png', 10, 4.8, 'Jaket kulit biker dengan desain edgy dan maskulin. Bahan kulit sintetis premium yang tahan lama.', true, '["leather", "biker", "edgy", "premium", "moto"]', '2025-02-05 08:00:00'),
('prod_009', 'Essential White Tee', 'T-Shirt', 149000, 'assets/images/prod_009.png', 100, 4.5, 'Kaos putih essential dengan bahan cotton combed 30s yang lembut dan nyaman. Potongan regular fit.', true, '["essential", "white", "cotton", "basic", "everyday"]', '2025-01-08 08:00:00'),
('prod_010', 'Graphic Tee Streetwear', 'T-Shirt', 189000, 'assets/images/prod_010.png', 60, 4.6, 'Kaos streetwear dengan desain grafis yang bold dan eye-catching. Bahan cotton premium.', true, '["streetwear", "graphic", "bold", "cotton", "urban"]', '2025-01-22 08:00:00'),
('prod_011', 'Polo Shirt Classic', 'T-Shirt', 229000, 'assets/images/prod_011.png', 40, 4.4, 'Polo shirt klasik dengan bahan pique cotton yang breathable. Cocok untuk casual maupun semi-formal.', false, '["polo", "classic", "pique", "semi-formal", "breathable"]', '2025-02-10 08:00:00'),
('prod_012', 'Tie-Dye Tee', 'T-Shirt', 169000, 'assets/images/prod_012.png', 0, 4.2, 'Kaos tie-dye dengan motif unik yang tidak ada duanya. Setiap kaos memiliki pola yang berbeda.', false, '["tie-dye", "unique", "colorful", "artsy", "summer"]', '2025-02-15 08:00:00'),
('prod_013', 'Slim Fit Chino Pants', 'Pants', 319000, 'assets/images/prod_013.png', 50, 4.7, 'Celana chino slim fit dengan bahan twill yang nyaman dan tahan lama.', true, '["chino", "slim-fit", "twill", "versatile", "semi-formal"]', '2025-01-14 08:00:00'),
('prod_014', 'Jogger Pants Premium', 'Pants', 279000, 'assets/images/prod_014.png', 45, 4.6, 'Jogger pants premium dengan bahan fleece yang hangat dan nyaman. Dilengkapi elastic waistband.', false, '["jogger", "fleece", "comfortable", "sporty", "elastic"]', '2025-01-25 08:00:00'),
('prod_015', 'Cargo Pants Tactical', 'Pants', 399000, 'assets/images/prod_015.png', 28, 4.5, 'Cargo pants dengan banyak kantong fungsional. Bahan ripstop yang kuat dan tahan lama.', false, '["cargo", "tactical", "outdoor", "functional", "ripstop"]', '2025-02-08 08:00:00'),
('prod_016', 'Wide Leg Trousers', 'Pants', 359000, 'assets/images/prod_016.png', 22, 4.3, 'Celana wide leg dengan potongan modern yang trendi. Bahan linen blend yang ringan dan breathable.', false, '["wide-leg", "linen", "trendy", "summer", "modern"]', '2025-02-20 08:00:00'),
('prod_017', 'Corduroy Jacket', 'Jacket', 519000, 'assets/images/prod_017.png', 15, 4.6, 'Jaket corduroy dengan tekstur unik yang memberikan tampilan vintage modern. Bahan tebal yang hangat.', false, '["corduroy", "vintage", "warm", "textured", "winter"]', '2025-02-12 08:00:00'),
('prod_018', 'Striped Long Sleeve Tee', 'T-Shirt', 199000, 'assets/images/prod_018.png', 55, 4.4, 'Kaos lengan panjang dengan motif garis-garis klasik. Bahan cotton yang nyaman.', false, '["striped", "long-sleeve", "classic", "cotton", "casual"]', '2025-02-18 08:00:00'),
('prod_019', 'Fleece Pullover Hoodie', 'Hoodie', 369000, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop&q=80', 38, 4.7, 'Pullover hoodie dengan bahan fleece premium yang sangat lembut. Desain minimalis yang cocok untuk berbagai gaya.', true, '["fleece", "pullover", "minimalist", "soft", "premium"]', '2025-03-01 08:00:00'),
('prod_020', 'Slim Straight Jeans', 'Pants', 449000, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop&q=80', 42, 4.8, 'Jeans slim straight dengan bahan denim premium yang nyaman dan tahan lama.', true, '["jeans", "denim", "slim-straight", "premium", "everyday"]', '2025-03-05 08:00:00'),
('prod_021', 'Puffer Jacket Winter', 'Jacket', 699000, 'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=600&h=600&fit=crop&q=80', 20, 4.9, 'Puffer jacket dengan insulasi premium yang sangat hangat. Desain modern yang stylish.', true, '["puffer", "winter", "warm", "insulated", "premium"]', '2025-03-10 08:00:00'),
('prod_022', 'Henley Shirt', 'T-Shirt', 219000, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop&q=80', 65, 4.5, 'Henley shirt dengan detail kancing di bagian leher. Bahan cotton waffle yang unik dan nyaman.', false, '["henley", "waffle", "casual", "button", "cotton"]', '2025-03-15 08:00:00')
ON DUPLICATE KEY UPDATE id=id;
