// ==========================================================================
// ElectroSphere - Master Application Controller
// Three.js 3D Engine • E-Commerce • SaaS Analytics • Stripe/PayPal • JWT
// ==========================================================================

const API_BASE = window.location.protocol.startsWith('http') ? '' : 'http://localhost:5000';

// Global Application State
let appState = {
  products: [],
  orders: [],
  users: [],
  cart: JSON.parse(localStorage.getItem('electro_cart')) || [],
  discountPercent: 0,
  activeCategory: 'All',
  currentUser: JSON.parse(localStorage.getItem('electro_user')) || {
    id: 1,
    name: "Alex Mercer",
    email: "admin@electrosphere.com",
    role: "Admin"
  },
  darkMode: localStorage.getItem('electro_theme') === 'dark',
  threeWireframe: false
};

// Embedded Fallback Products Data
const defaultProducts = [
  {
    id: 1,
    name: "Nexus Pro 16 Ultra 5G",
    category: "Smartphones",
    price: 1099.99,
    oldPrice: 1299.99,
    rating: 4.9,
    reviews: 420,
    stock: 35,
    badge: "Flagship 2026",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    description: "6.8\" Dynamic AMOLED 144Hz, Snapdragon 8 Gen 4, 16GB RAM, 512GB Storage, 200MP Triple Periscope Camera, Titanium Aerospace Frame.",
    specs: { display: "6.8\" 144Hz AMOLED", ram: "16GB LPDDR5X", storage: "512GB", battery: "5200 mAh 100W" }
  },
  {
    id: 2,
    name: "AeroBook Studio M3 Max",
    category: "Laptops",
    price: 1899.00,
    oldPrice: 2199.00,
    rating: 4.8,
    reviews: 290,
    stock: 18,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    description: "Next-gen M3 Max Silicon, 16-inch Liquid Retina XDR 120Hz display, 32GB Unified Memory, 1TB SSD, 22-hour battery life.",
    specs: { display: "16.2\" Liquid Retina", ram: "32GB Unified", storage: "1TB SSD", battery: "100Wh (22 Hours)" }
  },
  {
    id: 3,
    name: "Sony WH-1000XM6 ANC Studio",
    category: "Audio",
    price: 379.99,
    oldPrice: 449.99,
    rating: 4.9,
    reviews: 560,
    stock: 50,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    description: "Industry leading Dual-Processor Noise Cancellation, Hi-Res LDAC Wireless Audio, Multipoint connection, and 38 hours playback.",
    specs: { driver: "40mm Carbon Fiber", battery: "38h with ANC", connectivity: "BT 5.4 + LDAC", weight: "248g" }
  },
  {
    id: 4,
    name: "Titan Chrono Smartwatch Ultra",
    category: "Wearables",
    price: 429.50,
    oldPrice: 499.00,
    rating: 4.7,
    reviews: 185,
    stock: 25,
    badge: "New Arrival",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    description: "Sapphire Crystal Glass, Dual-Frequency GPS, ECG, Blood Oxygen Monitor, 100m Water Resistant, 14-day battery life.",
    specs: { case: "Titanium 49mm", waterResistance: "10 ATM (100m)", sensors: "ECG, SpO2, GPS", battery: "72h Normal" }
  },
  {
    id: 5,
    name: "CyberPad Pro 13 Liquid Vision",
    category: "Smartphones",
    price: 899.00,
    oldPrice: 999.00,
    rating: 4.8,
    reviews: 310,
    stock: 20,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
    description: "13-inch Ultra Retina OLED display with Tandem OLED technology, M4 chip, Apple Pencil Pro support, ultra-thin 5.1mm chassis.",
    specs: { display: "13\" Tandem OLED", processor: "M4 10-core", storage: "256GB / 512GB", weight: "444g" }
  },
  {
    id: 6,
    name: "RTX 5090 Liquid Gaming Station",
    category: "Laptops",
    price: 2899.99,
    oldPrice: 3299.99,
    rating: 4.9,
    reviews: 140,
    stock: 10,
    badge: "Ultimate",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
    description: "Core i9-14900HX, NVIDIA GeForce RTX 5090 16GB VRAM, 64GB DDR5 RAM, 2TB PCIe Gen5 SSD, 240Hz 4K Mini-LED display.",
    specs: { gpu: "RTX 5090 16GB", cpu: "i9-14900HX", ram: "64GB DDR5", cooling: "Liquid Metal" }
  },
  {
    id: 7,
    name: "AuraPods Spatial Pro Earbuds",
    category: "Audio",
    price: 199.00,
    oldPrice: 249.00,
    rating: 4.6,
    reviews: 680,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    description: "Personalized Spatial Audio with dynamic head tracking, Active Noise Cancellation 2.0, USB-C MagSafe case, IP54 rating.",
    specs: { battery: "6h + 30h case", anc: "2x Active ANC", connectivity: "BT 5.3", waterResistance: "IP54" }
  },
  {
    id: 8,
    name: "VisionCore AR Smart Glasses",
    category: "Wearables",
    price: 599.00,
    oldPrice: 699.00,
    rating: 4.7,
    reviews: 115,
    stock: 14,
    badge: "Next Gen",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80",
    description: "Micro-OLED dual 1080p spatial virtual screens, 120Hz refresh, directional sound speakers, seamless connection with laptops and phones.",
    specs: { display: "Dual Micro-OLED 120Hz", fov: "50 Deg FOV", weight: "76g ultra-light", compatibility: "iOS, Android, PC" }
  }
];

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initThreeJsScene();
  loadInitialData();
  updateCartBadge();
  setupEventListeners();
  updateUserRoleUI();
});

// ==========================================================================
// 1. THREE.JS 3D INTERACTIVE PHONE ENGINE
// ==========================================================================
let scene, camera, renderer, phoneGroup, phoneBodyMesh, screenMesh, cameraBumpMesh, particlesMesh;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function initThreeJsScene() {
  const container = document.getElementById('threejs-container');
  if (!container) return;

  const width = container.clientWidth || 500;
  const height = container.clientHeight || 500;

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 7.5);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x06b6d4, 2.5); // Cyan key light
  mainLight.position.set(5, 5, 4);
  scene.add(mainLight);

  const backLight = new THREE.DirectionalLight(0x6366f1, 2.0); // Indigo rim light
  backLight.position.set(-5, -3, -4);
  scene.add(backLight);

  const fillLight = new THREE.PointLight(0xffffff, 1.2, 50);
  fillLight.position.set(0, 2, 4);
  scene.add(fillLight);

  // Group for the 3D Smartphone
  phoneGroup = new THREE.Group();

  // 1. Smartphone Chassis (Aerospace Grade Titanium Body)
  const bodyGeo = new THREE.BoxGeometry(2.3, 4.8, 0.22);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.25
  });
  phoneBodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  phoneGroup.add(phoneBodyMesh);

  // 2. Front AMOLED Screen Display
  // Create a canvas texture for phone screen
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 512;
  screenCanvas.height = 1024;
  const ctx = screenCanvas.getContext('2d');
  
  // Draw sleek futuristic lockscreen graphic
  const grad = ctx.createLinearGradient(0, 0, 512, 1024);
  grad.addColorStop(0, '#090d16');
  grad.addColorStop(0.5, '#1e1b4b');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 1024);

  // Neon glowing sphere wallpaper
  const radial = ctx.createRadialGradient(256, 420, 20, 256, 420, 220);
  radial.addColorStop(0, 'rgba(6, 182, 212, 0.9)');
  radial.addColorStop(0.5, 'rgba(99, 102, 241, 0.5)');
  radial.addColorStop(1, 'transparent');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(256, 420, 220, 0, Math.PI * 2);
  ctx.fill();

  // Lockscreen Clock text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('10:42', 256, 200);

  ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Wednesday, October 14', 256, 245);

  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillStyle = '#06b6d4';
  ctx.fillText('• 5G SATELLITE ACTIVE • 98%', 256, 100);

  // Fingerprint icon
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '40px "Plus Jakarta Sans"';
  ctx.fillText('⚡', 256, 920);

  const screenTex = new THREE.CanvasTexture(screenCanvas);
  const screenGeo = new THREE.PlaneGeometry(2.18, 4.65);
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
  screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.z = 0.115;
  phoneGroup.add(screenMesh);

  // 3. Back Camera Island
  const bumpGeo = new THREE.BoxGeometry(0.9, 1.4, 0.08);
  const bumpMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.9,
    roughness: 0.2
  });
  cameraBumpMesh = new THREE.Mesh(bumpGeo, bumpMat);
  cameraBumpMesh.position.set(-0.55, 1.5, -0.13);
  phoneGroup.add(cameraBumpMesh);

  // Triple Camera Lenses
  const lensGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 32);
  const lensMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.95, roughness: 0.1 });
  
  const lens1 = new THREE.Mesh(lensGeo, lensMat);
  lens1.rotation.x = Math.PI / 2;
  lens1.position.set(-0.55, 1.8, -0.18);
  phoneGroup.add(lens1);

  const lens2 = new THREE.Mesh(lensGeo, lensMat);
  lens2.rotation.x = Math.PI / 2;
  lens2.position.set(-0.55, 1.35, -0.18);
  phoneGroup.add(lens2);

  const lens3 = new THREE.Mesh(lensGeo, lensMat);
  lens3.rotation.x = Math.PI / 2;
  lens3.position.set(-0.55, 0.9, -0.18);
  phoneGroup.add(lens3);

  // Initial Tilt
  phoneGroup.rotation.y = 0.45;
  phoneGroup.rotation.x = 0.15;
  scene.add(phoneGroup);

  // 4. Background Floating Tech Particles
  const particleGeo = new THREE.BufferGeometry();
  const count = 350;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.06,
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.6
  });
  particlesMesh = new THREE.Points(particleGeo, particleMat);
  scene.add(particlesMesh);

  // Drag Orbit Controls
  const dom = renderer.domElement;
  dom.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  dom.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    phoneGroup.rotation.y += deltaX * 0.008;
    phoneGroup.rotation.x += deltaY * 0.008;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Touch controls for mobile
  dom.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  dom.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    phoneGroup.rotation.y += deltaX * 0.01;
    phoneGroup.rotation.x += deltaY * 0.01;

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });

  window.addEventListener('touchend', () => { isDragging = false; });

  // Zoom on scroll
  dom.addEventListener('wheel', (e) => {
    camera.position.z = Math.min(Math.max(camera.position.z + e.deltaY * 0.005, 4.5), 11);
  }, { passive: true });

  // Resize handler
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // Animation Loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (!isDragging) {
      // Subtle float & rotation
      phoneGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
      phoneGroup.rotation.y += 0.003;
    }

    particlesMesh.rotation.y = elapsedTime * 0.03;
    renderer.render(scene, camera);
  }
  animate();
}

// Change 3D Phone Color
function change3DPhoneColor(hexColor, colorName) {
  if (phoneBodyMesh) {
    phoneBodyMesh.material.color.setHex(hexColor);
    const activeLabel = document.getElementById('activeColorName');
    if (activeLabel) activeLabel.textContent = colorName;

    const inqFinish = document.getElementById('inqFinish');
    if (inqFinish) inqFinish.value = colorName;

    // Highlight active dot
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.classList.remove('active');
      if (dot.getAttribute('title') === colorName) {
        dot.classList.add('active');
      }
    });

    showToast(`3D Chassis finish updated to ${colorName}`);
  }
}

// Toggle 3D Wireframe
function toggle3DWireframe() {
  appState.threeWireframe = !appState.threeWireframe;
  if (phoneBodyMesh) {
    phoneBodyMesh.material.wireframe = appState.threeWireframe;
  }
  const btnText = document.getElementById('wireframeBtnText');
  if (btnText) {
    btnText.textContent = appState.threeWireframe ? 'Solid' : 'Wireframe';
  }
  showToast(appState.threeWireframe ? "Wireframe mode ON" : "Solid render ON");
}

// ==========================================================================
// 2. DATA LOADING & SYNCHRONIZATION
// ==========================================================================
async function loadInitialData() {
  // 1. Fetch Products
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    if (res.ok) {
      const data = await res.json();
      appState.products = data.data && data.data.length > 0 ? data.data : defaultProducts;
    } else {
      appState.products = defaultProducts;
    }
  } catch (err) {
    appState.products = defaultProducts;
  }
  renderProducts();
  renderProductsTable();

  // 2. Fetch Orders
  try {
    const res = await fetch(`${API_BASE}/api/orders`);
    if (res.ok) {
      const data = await res.json();
      appState.orders = data.data || [];
    }
  } catch (err) {
    appState.orders = [];
  }
  renderOrdersTable();

  // 3. Fetch Users
  try {
    const res = await fetch(`${API_BASE}/api/auth/users`);
    if (res.ok) {
      const data = await res.json();
      appState.users = data.data || [];
    }
  } catch (err) {
    appState.users = [];
  }
  renderUsersList();

  // 4. Initialize SaaS Charts
  initSaaSCharts();
}

// ==========================================================================
// 3. E-COMMERCE STOREFRONT FUNCTIONS
// ==========================================================================
function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const searchQuery = document.getElementById('navbarSearchInput')?.value.toLowerCase().trim() || '';
  const sortType = document.getElementById('sortSelect')?.value || 'featured';

  let list = [...appState.products];

  // Category filter
  if (appState.activeCategory !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === appState.activeCategory.toLowerCase());
  }

  // Search filter
  if (searchQuery) {
    list = list.filter(p => 
      p.name.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery)
    );
  }

  // Sorting
  if (sortType === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortType === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sortType === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  const countDisplay = document.getElementById('productCountDisplay');
  if (countDisplay) countDisplay.textContent = list.length;

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-400">
        <i class="fa-solid fa-box-open text-4xl mb-3"></i>
        <h3 class="text-base font-bold text-slate-700 dark:text-slate-300">No hardware found</h3>
        <p class="text-xs">Try searching with a different keyword or category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(item => `
    <div class="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between hover:shadow-xl hover:shadow-brand-500/5 transition duration-300 relative">
      <div>
        <div class="relative h-52 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
          <span class="absolute top-3 left-3 bg-brand-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider z-10 shadow-sm">${item.badge || 'Stocked'}</span>
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy">
        </div>

        <div class="flex items-center justify-between text-[11px] font-bold text-brand-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
          <span>${item.category}</span>
          <span class="text-slate-400 flex items-center gap-1 font-semibold text-xs">
            <i class="fa-solid fa-star text-amber-400"></i> ${item.rating} (${item.reviews || 80})
          </span>
        </div>

        <h3 class="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-1 mb-1.5" title="${item.name}">${item.name}</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">${item.description}</p>
      </div>

      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span class="text-lg font-extrabold text-slate-900 dark:text-white font-mono">$${item.price.toFixed(2)}</span>
          ${item.oldPrice ? `<span class="text-xs text-slate-400 line-through ml-1.5 font-mono">$${item.oldPrice.toFixed(2)}</span>` : ''}
        </div>
        <button onclick="addToCart(${item.id})" class="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-brand-600 dark:hover:bg-cyan-400 dark:hover:text-slate-950 transition flex items-center gap-1.5 shadow-sm">
          <i class="fa-solid fa-cart-plus"></i> Add
        </button>
      </div>
    </div>
  `).join('');
}

// Cart Management
function addToCart(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  const existing = appState.cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    appState.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();
  showToast(`Added "${product.name}" to cart.`);
}

function updateCartQty(productId, delta) {
  const item = appState.cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    appState.cart = appState.cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function removeCartItem(productId) {
  appState.cart = appState.cart.filter(i => i.id !== productId);
  saveCart();
  updateCartBadge();
  renderCartDrawer();
  showToast("Item removed from cart.");
}

function saveCart() {
  localStorage.setItem('electro_cart', JSON.stringify(appState.cart));
}

function updateCartBadge() {
  const count = appState.cart.reduce((sum, i) => sum + i.qty, 0);
  const badge = document.getElementById('cartBadgeCount');
  const drawerCount = document.getElementById('cartDrawerCount');
  if (badge) badge.textContent = count;
  if (drawerCount) drawerCount.textContent = count;
}

function renderCartDrawer() {
  const container = document.getElementById('cartItemsContainer');
  const subtotalEl = document.getElementById('cartSubtotalVal');
  const discountRow = document.getElementById('cartDiscountRow');
  const discountEl = document.getElementById('cartDiscountVal');
  const totalEl = document.getElementById('cartTotalVal');

  if (!container) return;

  const subtotal = appState.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const discount = subtotal * appState.discountPercent;
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 25;
  const total = Math.max(0, subtotal - discount + shipping);

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  if (discountRow) {
    if (appState.discountPercent > 0) {
      discountRow.classList.remove('hidden');
      discountEl.textContent = `-$${discount.toFixed(2)}`;
    } else {
      discountRow.classList.add('hidden');
    }
  }

  if (appState.cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-20 text-slate-400">
        <i class="fa-solid fa-bag-shopping text-4xl mb-3 text-slate-300 dark:text-slate-700"></i>
        <h4 class="font-bold text-slate-700 dark:text-slate-300">Your cart is empty</h4>
        <p class="text-xs mt-1">Explore our 3D hardware catalog & add your favorites.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = appState.cart.map(item => `
    <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
      <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded-xl object-cover">
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-xs text-slate-900 dark:text-white truncate">${item.name}</h4>
        <span class="text-xs font-mono font-semibold text-brand-600 dark:text-cyan-400">$${item.price.toFixed(2)}</span>
        <div class="flex items-center gap-2 mt-1">
          <button onclick="updateCartQty(${item.id}, -1)" class="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 text-xs font-bold">-</button>
          <span class="text-xs font-bold font-mono px-1">${item.qty}</span>
          <button onclick="updateCartQty(${item.id}, 1)" class="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 text-xs font-bold">+</button>
        </div>
      </div>
      <button onclick="removeCartItem(${item.id})" class="text-slate-400 hover:text-red-500 text-sm p-2">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');
}

function openCartDrawer() {
  renderCartDrawer();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.remove('opacity-0', 'pointer-events-none');
}

function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.add('opacity-0', 'pointer-events-none');
}

function applyPromoCode() {
  const code = document.getElementById('promoInput')?.value.trim().toUpperCase();
  if (code === 'TECH2026') {
    appState.discountPercent = 0.15;
    renderCartDrawer();
    showToast("🎉 15% Discount applied successfully!");
  } else {
    showToast("Invalid promo code. Use: TECH2026", "error");
  }
}

// Checkout Modal
function openCheckoutModal() {
  if (appState.cart.length === 0) {
    showToast("Your cart is empty! Add products first.", "error");
    return;
  }
  closeCartDrawer();

  const subtotal = appState.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const discount = subtotal * appState.discountPercent;
  const shipping = subtotal >= 500 ? 0 : 25;
  const total = Math.max(0, subtotal - discount + shipping);

  document.getElementById('checkoutFinalAmount').textContent = `$${total.toFixed(2)}`;
  document.getElementById('checkoutModal').classList.remove('opacity-0', 'pointer-events-none');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').classList.add('opacity-0', 'pointer-events-none');
}

function togglePaymentGatewayFields(method) {
  const stripeBox = document.getElementById('stripeFieldsBox');
  const paypalBox = document.getElementById('paypalFieldsBox');
  if (!stripeBox || !paypalBox) return;

  if (method === 'Stripe') {
    stripeBox.classList.remove('hidden');
    paypalBox.classList.add('hidden');
  } else if (method === 'PayPal') {
    stripeBox.classList.add('hidden');
    paypalBox.classList.remove('hidden');
  } else {
    stripeBox.classList.add('hidden');
    paypalBox.classList.add('hidden');
  }
}

// Submit Order (Stripe/PayPal Sandbox Checkout)
async function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const email = document.getElementById('custEmail').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const gateway = document.querySelector('input[name="paymentGateway"]:checked').value;

  const orderPayload = {
    customer: { name, phone, email, address },
    items: appState.cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
    paymentMethod: gateway === 'Stripe' ? 'Stripe Card (Simulated)' : (gateway === 'PayPal' ? 'PayPal Sandbox' : 'Cash on Delivery'),
    promoCode: appState.discountPercent > 0 ? 'TECH2026' : null
  };

  const submitBtn = document.getElementById('submitOrderBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Authorizing ${gateway} Transaction...`;

  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    let order;
    if (res.ok) {
      const data = await res.json();
      order = data.order;
    } else {
      throw new Error("Local fallback mode");
    }
    showOrderSuccess(order);
  } catch (err) {
    // Fallback simulated order
    const mockOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customer: orderPayload.customer,
      items: orderPayload.items,
      total: appState.cart.reduce((s, i) => s + (i.price * i.qty), 0),
      paymentMethod: orderPayload.paymentMethod,
      status: "Processing",
      trackingNumber: `TRK-EXP-${Date.now().toString().slice(-6)}`
    };
    showOrderSuccess(mockOrder);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Authorize & Confirm Order`;
  }
}

function showOrderSuccess(order) {
  closeCheckoutModal();

  const detailsEl = document.getElementById('orderSuccessDetails');
  if (detailsEl) {
    detailsEl.innerHTML = `
      <div class="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
        <span class="text-slate-400">Tracking Number:</span>
        <strong class="font-mono text-cyan-500">${order.trackingNumber || 'TRK-98214'}</strong>
      </div>
      <div class="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
        <span class="text-slate-400">Order ID:</span>
        <span class="font-mono font-bold">${order.id}</span>
      </div>
      <div class="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
        <span class="text-slate-400">Customer:</span>
        <span>${order.customer.name}</span>
      </div>
      <div class="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
        <span class="text-slate-400">Payment Gateway:</span>
        <span class="text-emerald-500 font-bold">${order.paymentMethod}</span>
      </div>
      <div class="flex justify-between pt-1">
        <span class="text-slate-400">Total Authorized:</span>
        <strong class="font-mono text-base text-slate-900 dark:text-white">$${order.total.toFixed(2)}</strong>
      </div>
    `;
  }

  // Clear cart
  appState.cart = [];
  appState.discountPercent = 0;
  saveCart();
  updateCartBadge();

  // Reload orders in SaaS
  loadInitialData();

  document.getElementById('orderSuccessModal').classList.remove('opacity-0', 'pointer-events-none');
}

function closeOrderSuccessModal() {
  document.getElementById('orderSuccessModal').classList.add('opacity-0', 'pointer-events-none');
}

// ==========================================================================
// 4. SAAS DASHBOARD & DATA ANALYTICS
// ==========================================================================
let revenueChartInstance = null;
let categoryChartInstance = null;

function initSaaSCharts() {
  // 1. Revenue Trend Line Chart
  const revCtx = document.getElementById('revenueChartCanvas');
  if (revCtx) {
    if (revenueChartInstance) revenueChartInstance.destroy();

    const isDark = appState.darkMode;
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    revenueChartInstance = new Chart(revCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
          label: 'Revenue ($USD)',
          data: [42500, 58200, 71000, 84300, 99100, 115400, 132000, 148900, 165000, 182038],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#06b6d4',
          pointRadius: 4,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'JetBrains Mono', size: 11 }, callback: v => `$${v / 1000}k` } }
        }
      }
    });
  }

  // 2. Category Doughnut Chart
  const catCtx = document.getElementById('categoryChartCanvas');
  if (catCtx) {
    if (categoryChartInstance) categoryChartInstance.destroy();

    categoryChartInstance = new Chart(catCtx, {
      type: 'doughnut',
      data: {
        labels: ['Smartphones', 'Laptops', 'Audio', 'Wearables'],
        datasets: [{
          data: [45, 30, 15, 10],
          backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: appState.darkMode ? '#cbd5e1' : '#475569', font: { family: 'Plus Jakarta Sans', size: 11 } }
          }
        },
        cutout: '70%'
      }
    });
  }
}

// Render Orders Fulfillment Table
function renderOrdersTable() {
  const tbody = document.getElementById('ordersTableBody');
  const badge = document.getElementById('dashOrdersBadge');
  if (badge) badge.textContent = appState.orders.length;

  if (!tbody) return;

  if (appState.orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-slate-400">No orders logged yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = appState.orders.map(o => {
    const statusColors = {
      'Pending': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'Processing': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'Shipped': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      'Delivered': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    };

    return `
      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
        <td class="px-6 py-4">
          <div class="font-mono font-bold text-slate-900 dark:text-white">${o.id}</div>
          <div class="text-[11px] text-slate-400">${new Date(o.createdAt || Date.now()).toLocaleDateString()}</div>
        </td>
        <td class="px-6 py-4">
          <div class="font-bold text-slate-900 dark:text-white">${o.customer.name}</div>
          <div class="text-[11px] text-slate-400">${o.customer.phone}</div>
        </td>
        <td class="px-6 py-4">
          <div class="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-xs">${o.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</div>
          <div class="text-[11px] text-slate-400">${o.items.length} unique SKU(s)</div>
        </td>
        <td class="px-6 py-4">
          <div class="font-mono font-bold text-brand-600 dark:text-cyan-400">$${o.total.toFixed(2)}</div>
          <div class="text-[11px] text-slate-400">${o.paymentMethod}</div>
        </td>
        <td class="px-6 py-4">
          <span class="px-2.5 py-1 rounded-full text-xs font-bold border ${statusColors[o.status] || 'bg-slate-500/10 text-slate-400'}">
            ${o.status}
          </span>
        </td>
        <td class="px-6 py-4 text-right">
          <select onchange="updateOrderStatus('${o.id}', this.value)" class="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-semibold focus:outline-none">
            <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
            <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

// Update Order Status API
async function updateOrderStatus(orderId, newStatus) {
  try {
    await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const order = appState.orders.find(o => o.id === orderId);
    if (order) order.status = newStatus;
    renderOrdersTable();
    showToast(`Order ${orderId} updated to ${newStatus}`);
  } catch (err) {
    showToast("Status updated (Offline mode)");
  }
}

// Render Products Inventory CRUD Table
function renderProductsTable() {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.products.map(p => `
    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
      <td class="px-6 py-4 flex items-center gap-3">
        <img src="${p.image}" alt="${p.name}" class="w-10 h-10 rounded-lg object-cover">
        <div>
          <div class="font-bold text-slate-900 dark:text-white line-clamp-1">${p.name}</div>
          <div class="text-[11px] text-slate-400">SKU: PROD-${p.id}</div>
        </div>
      </td>
      <td class="px-6 py-4">
        <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold">${p.category}</span>
      </td>
      <td class="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
        $${p.price.toFixed(2)}
      </td>
      <td class="px-6 py-4">
        <span class="font-bold ${p.stock <= 15 ? 'text-amber-500' : 'text-emerald-500'} font-mono">${p.stock} units</span>
      </td>
      <td class="px-6 py-4 text-amber-400 font-semibold text-xs">
        ★ ${p.rating}
      </td>
      <td class="px-6 py-4 text-right">
        <button onclick="deleteProduct(${p.id})" class="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition">
          <i class="fa-solid fa-trash-can mr-1"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
}

// Delete Product
async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this hardware product?")) return;

  try {
    await fetch(`${API_BASE}/api/products/${productId}`, { method: 'DELETE' });
  } catch (e) {}

  appState.products = appState.products.filter(p => p.id !== productId);
  renderProducts();
  renderProductsTable();
  showToast("Product deleted from database.");
}

// Add Product Modal
function openAddProductModal() {
  document.getElementById('addProductModal').classList.remove('opacity-0', 'pointer-events-none');
}

function closeAddProductModal() {
  document.getElementById('addProductModal').classList.add('opacity-0', 'pointer-events-none');
}

async function handleAddProductSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('newProdName').value.trim();
  const category = document.getElementById('newProdCat').value;
  const price = parseFloat(document.getElementById('newProdPrice').value);
  const stock = parseInt(document.getElementById('newProdStock').value);
  const badge = document.getElementById('newProdBadge').value.trim() || 'New';
  const image = document.getElementById('newProdImage').value.trim() || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80';
  const description = document.getElementById('newProdDesc').value.trim();

  const newProd = {
    id: Date.now(),
    name,
    category,
    price,
    stock,
    badge,
    image,
    description,
    rating: 5.0,
    reviews: 1
  };

  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd)
    });
    if (res.ok) {
      const data = await res.json();
      newProd.id = data.data.id;
    }
  } catch (err) {}

  appState.products.unshift(newProd);
  renderProducts();
  renderProductsTable();
  closeAddProductModal();
  document.getElementById('addProductForm').reset();
  showToast(`Product "${name}" added to database!`);
}

// Render Users Matrix
function renderUsersList() {
  const container = document.getElementById('usersListGrid');
  if (!container) return;

  const roleColors = {
    'Admin': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    'Manager': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Customer': 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  };

  container.innerHTML = appState.users.map(u => `
    <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
      <div class="flex items-center gap-3">
        <img src="${u.avatar}" alt="${u.name}" class="w-10 h-10 rounded-full object-cover">
        <div class="min-w-0">
          <h4 class="font-bold text-xs text-slate-900 dark:text-white truncate">${u.name}</h4>
          <p class="text-[11px] text-slate-400 truncate">${u.email}</p>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleColors[u.role]}">${u.role}</span>
        <select onchange="changeUserRole(${u.id}, this.value)" class="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-semibold focus:outline-none">
          <option value="Admin" ${u.role === 'Admin' ? 'selected' : ''}>Admin</option>
          <option value="Manager" ${u.role === 'Manager' ? 'selected' : ''}>Manager</option>
          <option value="Customer" ${u.role === 'Customer' ? 'selected' : ''}>Customer</option>
        </select>
      </div>
    </div>
  `).join('');
}

async function changeUserRole(userId, newRole) {
  try {
    await fetch(`${API_BASE}/api/auth/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    const user = appState.users.find(u => u.id === userId);
    if (user) user.role = newRole;
    showToast(`Role updated to ${newRole}`);
  } catch (e) {
    showToast(`Role updated (Local mode)`);
  }
}

// SaaS Tabs Switcher
function switchDashboardTab(tabId) {
  document.querySelectorAll('.dashboard-tab').forEach(t => {
    t.classList.remove('active', 'text-brand-600', 'dark:text-cyan-400', 'border-b-2');
    t.classList.add('text-slate-400');
  });

  const activeBtn = document.getElementById(`tabBtn-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'text-brand-600', 'dark:text-cyan-400', 'border-b-2');
    activeBtn.classList.remove('text-slate-400');
  }

  document.getElementById('ordersTabContent').classList.add('hidden');
  document.getElementById('productsTabContent').classList.add('hidden');
  document.getElementById('rolesTabContent').classList.add('hidden');

  document.getElementById(`${tabId}Content`).classList.remove('hidden');

  const addBtn = document.getElementById('addNewProductBtn');
  if (addBtn) {
    if (tabId === 'productsTab' && (appState.currentUser.role === 'Admin' || appState.currentUser.role === 'Manager')) {
      addBtn.classList.remove('hidden');
    } else {
      addBtn.classList.add('hidden');
    }
  }
}

// Role Switcher Simulator
function switchUserRole(role) {
  appState.currentUser.role = role;
  localStorage.setItem('electro_user', JSON.stringify(appState.currentUser));

  document.querySelectorAll('.role-switch-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-brand-600', 'text-white');
    btn.classList.add('text-slate-600', 'dark:text-slate-300');
  });

  const activeBtn = document.getElementById(`roleBtn-${role}`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'bg-brand-600', 'text-white');
    activeBtn.classList.remove('text-slate-600', 'dark:text-slate-300');
  }

  updateUserRoleUI();
  showToast(`Workspace view switched to ${role} Role`);
}

function updateUserRoleUI() {
  const roleText = document.getElementById('currentRoleText');
  if (roleText) roleText.textContent = appState.currentUser.role;

  const authLabel = document.getElementById('authButtonLabel');
  if (authLabel) authLabel.textContent = `${appState.currentUser.name} (${appState.currentUser.role})`;

  const addBtn = document.getElementById('addNewProductBtn');
  if (addBtn) {
    if (appState.currentUser.role === 'Admin' || appState.currentUser.role === 'Manager') {
      addBtn.classList.remove('hidden');
    } else {
      addBtn.classList.add('hidden');
    }
  }
}

// ==========================================================================
// 5. REST API TESTER (THUNDER CLIENT / POSTMAN SIMULATOR)
// ==========================================================================
async function executeApiTest() {
  const select = document.getElementById('apiEndpointSelect');
  const endpoint = select.value;
  const consoleOut = document.getElementById('apiConsoleOutput');
  const statusBadge = document.getElementById('apiStatusBadge');
  const latencyBadge = document.getElementById('apiLatencyBadge');

  consoleOut.textContent = `Sending request to: ${endpoint}...\n`;

  const startTime = performance.now();

  try {
    let res;
    if (endpoint === '/api/payment/stripe-charge' || endpoint === '/api/checkout/stripe-charge') {
      res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1099.99,
          cardNumber: "4242 4242 4242 4242",
          cardExpiry: "12/28",
          cardCvc: "888",
          currency: "USD"
        })
      });
    } else if (endpoint === '/api/payment/paypal-capture') {
      res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: "PAYPAL-TEST-9921",
          amount: 1099.99
        })
      });
    } else {
      res = await fetch(`${API_BASE}${endpoint}`);
    }

    const elapsed = Math.round(performance.now() - startTime);
    const data = await res.json();

    statusBadge.textContent = `${res.status} ${res.statusText || 'OK'}`;
    statusBadge.className = res.ok ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold';
    latencyBadge.textContent = `${elapsed} ms`;

    consoleOut.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    const elapsed = Math.round(performance.now() - startTime);
    statusBadge.textContent = `200 OK (Offline Simulated)`;
    latencyBadge.textContent = `${elapsed} ms`;
    consoleOut.textContent = JSON.stringify({
      status: "success",
      endpoint,
      simulatedResponse: true,
      message: "Data retrieved from local in-memory store.",
      timestamp: new Date().toISOString()
    }, null, 2);
  }
}

// ==========================================================================
// 6. AUTHENTICATION & VIP 3D INQUIRIES
// ==========================================================================
let isSignUpMode = false;

function openAuthModal() {
  document.getElementById('authModal').classList.remove('opacity-0', 'pointer-events-none');
}

function closeAuthModal() {
  document.getElementById('authModal').classList.add('opacity-0', 'pointer-events-none');
}

function toggleAuthMode() {
  isSignUpMode = !isSignUpMode;
  document.getElementById('authNameField').classList.toggle('hidden', !isSignUpMode);
  document.getElementById('authModalTitle').textContent = isSignUpMode ? 'Create an Account' : 'Sign In to Workspace';
  document.getElementById('authSubmitBtn').textContent = isSignUpMode ? 'Sign Up' : 'Sign In';
  document.getElementById('authTogglePrompt').textContent = isSignUpMode ? 'Already have an account?' : "Don't have an account?";
  document.getElementById('authToggleBtn').textContent = isSignUpMode ? 'Sign In' : 'Sign Up';
}

function fillDemoAuth(email, password) {
  document.getElementById('authEmailInput').value = email;
  document.getElementById('authPasswordInput').value = password;
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('authEmailInput').value.trim();
  const password = document.getElementById('authPasswordInput').value.trim();

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      appState.currentUser = data.user;
      localStorage.setItem('electro_user', JSON.stringify(data.user));
      updateUserRoleUI();
      closeAuthModal();
      showToast(`Welcome, ${data.user.name}! Role: ${data.user.role}`);
      return;
    }
  } catch (err) {}

  // Fallback demo user recognition
  let role = 'Customer';
  if (email.includes('admin')) role = 'Admin';
  if (email.includes('manager')) role = 'Manager';

  appState.currentUser = {
    id: Date.now(),
    name: email.split('@')[0],
    email,
    role
  };
  localStorage.setItem('electro_user', JSON.stringify(appState.currentUser));
  updateUserRoleUI();
  closeAuthModal();
  showToast(`Signed in as ${appState.currentUser.name} (${role})`);
}

// 3D VIP Inquiry
function openInquiryModal(device) {
  const finish = document.getElementById('activeColorName')?.textContent || 'Titanium Black';
  document.getElementById('inqFinish').value = `${device} (${finish})`;
  document.getElementById('inquiryModal').classList.remove('opacity-0', 'pointer-events-none');
}

function closeInquiryModal() {
  document.getElementById('inquiryModal').classList.add('opacity-0', 'pointer-events-none');
}

async function handleInquirySubmit(e) {
  e.preventDefault();
  const name = document.getElementById('inqName').value.trim();
  const email = document.getElementById('inqEmail').value.trim();
  const finish = document.getElementById('inqFinish').value;
  const message = document.getElementById('inqMessage').value.trim();

  try {
    await fetch(`${API_BASE}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, deviceInterest: finish, message })
    });
  } catch (e) {}

  closeInquiryModal();
  document.getElementById('inquiryForm').reset();
  showToast("🎉 3D VIP Pre-Order registered! Our concierge will contact you.");
}

// ==========================================================================
// 7. THEME & EVENT LISTENERS
// ==========================================================================
function initTheme() {
  if (appState.darkMode) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    const icon = document.getElementById('themeIcon');
    const text = document.getElementById('themeText');
    if (icon) icon.className = 'fa-solid fa-sun';
    if (text) text.textContent = 'Light Mode';
  }
}

function toggleTheme() {
  appState.darkMode = !appState.darkMode;
  localStorage.setItem('electro_theme', appState.darkMode ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', appState.darkMode);
  document.body.classList.toggle('dark', appState.darkMode);

  const icon = document.getElementById('themeIcon');
  const text = document.getElementById('themeText');
  if (icon) icon.className = appState.darkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  if (text) text.textContent = appState.darkMode ? 'Light Mode' : 'Dark Mode';

  initSaaSCharts(); // redraw with new colors
}

// Toast Popup
let toastTimer;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMsg');
  const icon = document.getElementById('toastIcon');
  if (!toast) return;

  msgEl.textContent = message;
  if (type === 'error') {
    icon.className = 'fa-solid fa-circle-exclamation text-red-400 text-base';
  } else {
    icon.className = 'fa-solid fa-circle-check text-emerald-400 text-base';
  }

  toast.classList.remove('translate-y-24', 'opacity-0');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 3200);
}

// Master Event Listeners Setup
function setupEventListeners() {
  // Theme toggle
  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

  // Cart Drawer triggers
  document.getElementById('openCartBtn')?.addEventListener('click', openCartDrawer);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCartDrawer);

  // Navbar Search
  document.getElementById('navbarSearchInput')?.addEventListener('input', () => {
    renderProducts();
  });

  // Sort select
  document.getElementById('sortSelect')?.addEventListener('change', () => {
    renderProducts();
  });

  // Category filters
  document.getElementById('categoryFilterContainer')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-pill');
    if (!btn) return;

    document.querySelectorAll('.cat-pill').forEach(b => {
      b.classList.remove('active', 'bg-brand-600', 'text-white', 'shadow-md');
      b.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
    });

    btn.classList.add('active', 'bg-brand-600', 'text-white', 'shadow-md');
    btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');

    appState.activeCategory = btn.dataset.cat;
    renderProducts();
  });

  // Checkout Form
  document.getElementById('checkoutForm')?.addEventListener('submit', handleCheckoutSubmit);

  // Add Product Form
  document.getElementById('addProductForm')?.addEventListener('submit', handleAddProductSubmit);

  // Auth Modal trigger
  document.getElementById('authModalBtn')?.addEventListener('click', openAuthModal);
  document.getElementById('authForm')?.addEventListener('submit', handleAuthSubmit);

  // 3D Inquiry Form
  document.getElementById('inquiryForm')?.addEventListener('submit', handleInquirySubmit);

  // Mobile menu toggle
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('mobileNavMenu')?.classList.toggle('hidden');
  });
}

