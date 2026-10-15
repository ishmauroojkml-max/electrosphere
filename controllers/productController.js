// ==========================================================================
// Product Controller (Hardware Catalog CRUD & Filtering)
// ==========================================================================

const { readJson, writeJson } = require('../config/db');
const PRODUCTS_FILE = 'products.json';

// GET /api/products
exports.getProducts = (req, res) => {
  try {
    let products = readJson(PRODUCTS_FILE);
    const { category, search, minPrice, maxPrice, sort } = req.query;

    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching products", error: err.message });
  }
};

// GET /api/products/:id
exports.getProductById = (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, data: product });
};

// POST /api/products (Admin/Manager)
exports.createProduct = (req, res) => {
  const { name, category, price, oldPrice, stock, description, image, badge, specs } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ success: false, message: "Name, category, and price are required." });
  }

  const products = readJson(PRODUCTS_FILE);
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    category,
    price: parseFloat(price),
    oldPrice: oldPrice ? parseFloat(oldPrice) : parseFloat(price) * 1.2,
    rating: 5.0,
    reviews: 1,
    stock: stock ? parseInt(stock) : 25,
    badge: badge || "New Arrival",
    image: image || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
    description: description || "Premium high performance hardware.",
    specs: specs || { display: "AMOLED 120Hz", ram: "16GB", storage: "512GB" }
  };

  products.unshift(newProduct);
  writeJson(PRODUCTS_FILE, products);
  res.status(201).json({ success: true, message: "Product created successfully!", data: newProduct });
};

// PUT /api/products/:id
exports.updateProduct = (req, res) => {
  const productId = parseInt(req.params.id);
  const products = readJson(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === productId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  products[index] = { ...products[index], ...req.body, id: productId };
  writeJson(PRODUCTS_FILE, products);
  res.json({ success: true, message: "Product updated successfully!", data: products[index] });
};

// DELETE /api/products/:id
exports.deleteProduct = (req, res) => {
  const productId = parseInt(req.params.id);
  const products = readJson(PRODUCTS_FILE);
  const filtered = products.filter(p => p.id !== productId);

  if (filtered.length === products.length) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  writeJson(PRODUCTS_FILE, filtered);
  res.json({ success: true, message: "Product deleted successfully." });
};

