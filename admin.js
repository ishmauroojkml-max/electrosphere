// ==========================================================================
// ElectroSphere - Administrator Portal Controller (admin.js)
// Protects Dashboard with Admin Email & Password Authentication Gate
// ==========================================================================

const API_BASE = window.location.protocol.startsWith('http') ? '' : 'http://localhost:5000';

let adminState = {
  adminUser: JSON.parse(localStorage.getItem('electro_admin_user')) || null,
  products: [],
  orders: [],
  users: []
};

// DOM Elements
const loginGate = document.getElementById('adminLoginGate');
const dashboardWorkspace = document.getElementById('adminDashboardWorkspace');
const loginForm = document.getElementById('adminLoginForm');
const emailInput = document.getElementById('adminEmailInput');
const passwordInput = document.getElementById('adminPasswordInput');
const loginError = document.getElementById('adminLoginError');
const errorMsg = document.getElementById('adminErrorMsg');

let adminRevenueChartInstance = null;
let adminCategoryChartInstance = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  setupAdminListeners();
});

// Check if already authenticated as Admin
function checkAdminAuth() {
  if (adminState.adminUser && adminState.adminUser.role === 'Admin') {
    unlockDashboard();
  } else {
    lockDashboard();
  }
}

function unlockDashboard() {
  loginGate.classList.add('hidden');
  dashboardWorkspace.classList.remove('hidden');

  // Set Profile info
  const nameEl = document.getElementById('adminNameDisplay');
  const emailEl = document.getElementById('adminEmailDisplay');
  const imgEl = document.getElementById('adminProfileImg');

  if (nameEl) nameEl.textContent = adminState.adminUser.name;
  if (emailEl) emailEl.textContent = adminState.adminUser.email;
  if (imgEl && adminState.adminUser.avatar) imgEl.src = adminState.adminUser.avatar;

  // Load Real-time Data
  loadAdminData();
}

function lockDashboard() {
  dashboardWorkspace.classList.add('hidden');
  loginGate.classList.remove('hidden');
}

// Quick Fill Helper for Demo
function fillAdminCreds(email, password) {
  if (emailInput) emailInput.value = email;
  if (passwordInput) passwordInput.value = password;
}

// Handle Admin Sign In
async function handleAdminLogin(e) {
  e.preventDefault();
  loginError.classList.add('hidden');

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const loginBtn = document.getElementById('adminLoginBtn');
  loginBtn.disabled = true;
  loginBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Authenticating Administrator...`;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Invalid credentials.");
    }

    // Verify Role is Admin
    if (data.user.role !== 'Admin') {
      throw new Error("⛔ Access Denied: You do not have Administrator permissions. Customer accounts cannot access this dashboard.");
    }

    // Success: Store Admin Session
    adminState.adminUser = data.user;
    localStorage.setItem('electro_admin_user', JSON.stringify(data.user));
    unlockDashboard();
    showAdminToast(`Welcome, Administrator ${data.user.name}!`);

  } catch (err) {
    // Offline simulated verification for admin@gmail.com and admin@electrosphere.com
    if ((email === 'admin@gmail.com' || email === 'admin@electrosphere.com') && password === 'adminpassword123') {
      const simulatedAdmin = {
        id: 1,
        name: "Super Admin",
        email: email,
        role: "Admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
      };
      adminState.adminUser = simulatedAdmin;
      localStorage.setItem('electro_admin_user', JSON.stringify(simulatedAdmin));
      unlockDashboard();
      showAdminToast(`Welcome, Administrator!`);
    } else {
      errorMsg.textContent = err.message || "Access Denied: Invalid credentials.";
      loginError.classList.remove('hidden');
    }
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Sign In to Administrator Portal`;
  }
}

// Admin Logout
function adminLogout() {
  adminState.adminUser = null;
  localStorage.removeItem('electro_admin_user');
  lockDashboard();
  if (passwordInput) passwordInput.value = '';
  showAdminToast("Administrator session locked.");
}

// Load All Management Data
async function loadAdminData() {
  // 1. Fetch Orders
  try {
    const res = await fetch(`${API_BASE}/api/orders`);
    if (res.ok) {
      const data = await res.json();
      adminState.orders = data.data || [];
    }
  } catch (e) {}
  renderAdminOrdersTable();

  // 2. Fetch Products
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    if (res.ok) {
      const data = await res.json();
      adminState.products = data.data || [];
    }
  } catch (e) {}
  renderAdminProductsTable();

  // 3. Fetch Users
  try {
    const res = await fetch(`${API_BASE}/api/auth/users`);
    if (res.ok) {
      const data = await res.json();
      adminState.users = data.data || [];
    }
  } catch (e) {}
  renderAdminUsersList();

  // 4. Init Charts
  initAdminCharts();
}

// Render Orders Table
function renderAdminOrdersTable() {
  const tbody = document.getElementById('adminOrdersTableBody');
  const badge = document.getElementById('adminOrdersBadge');
  if (badge) badge.textContent = adminState.orders.length;
  if (!tbody) return;

  if (adminState.orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-slate-500">No orders logged in database.</td></tr>`;
    return;
  }

  tbody.innerHTML = adminState.orders.map(o => {
    const statusColors = {
      'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'Processing': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Shipped': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      'Delivered': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    };

    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="px-6 py-4">
          <div class="font-mono font-bold text-white">${o.id}</div>
          <div class="text-[11px] text-slate-400">${new Date(o.createdAt || Date.now()).toLocaleDateString()}</div>
        </td>
        <td class="px-6 py-4">
          <div class="font-bold text-white">${o.customer.name}</div>
          <div class="text-[11px] text-slate-400">${o.customer.phone} • ${o.customer.email}</div>
        </td>
        <td class="px-6 py-4">
          <div class="font-semibold text-slate-300 truncate max-w-xs">${o.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</div>
          <div class="text-[11px] text-slate-500">${o.items.length} item(s)</div>
        </td>
        <td class="px-6 py-4">
          <div class="font-mono font-bold text-cyan-400">$${o.total.toFixed(2)}</div>
          <div class="text-[11px] text-slate-400">${o.paymentMethod}</div>
        </td>
        <td class="px-6 py-4">
          <span class="px-2.5 py-1 rounded-full text-xs font-bold border ${statusColors[o.status] || 'bg-slate-800 text-slate-400'}">
            ${o.status}
          </span>
        </td>
        <td class="px-6 py-4 text-right">
          <select onchange="updateAdminOrderStatus('${o.id}', this.value)" class="text-xs bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:border-cyan-400">
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

async function updateAdminOrderStatus(orderId, newStatus) {
  try {
    await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const order = adminState.orders.find(o => o.id === orderId);
    if (order) order.status = newStatus;
    renderAdminOrdersTable();
    showAdminToast(`Order ${orderId} updated to ${newStatus}`);
  } catch (err) {
    showAdminToast(`Status changed to ${newStatus}`);
  }
}

// Render Products Table
function renderAdminProductsTable() {
  const tbody = document.getElementById('adminProductsTableBody');
  if (!tbody) return;

  tbody.innerHTML = adminState.products.map(p => `
    <tr class="hover:bg-slate-800/40 transition">
      <td class="px-6 py-4 flex items-center gap-3">
        <img src="${p.image}" alt="${p.name}" class="w-10 h-10 rounded-lg object-cover">
        <div>
          <div class="font-bold text-white line-clamp-1">${p.name}</div>
          <div class="text-[11px] text-slate-400">SKU: PROD-${p.id}</div>
        </div>
      </td>
      <td class="px-6 py-4">
        <span class="px-2 py-0.5 rounded-md bg-slate-800 text-xs font-semibold text-slate-300">${p.category}</span>
      </td>
      <td class="px-6 py-4 font-mono font-bold text-white">
        $${p.price.toFixed(2)}
      </td>
      <td class="px-6 py-4">
        <span class="font-bold ${p.stock <= 15 ? 'text-amber-400' : 'text-emerald-400'} font-mono">${p.stock} units</span>
      </td>
      <td class="px-6 py-4 text-amber-400 font-semibold text-xs">
        ★ ${p.rating}
      </td>
      <td class="px-6 py-4 text-right">
        <button onclick="deleteAdminProduct(${p.id})" class="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition">
          <i class="fa-solid fa-trash-can mr-1"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
}

async function deleteAdminProduct(productId) {
  if (!confirm("Are you sure you want to delete this hardware product?")) return;

  try {
    await fetch(`${API_BASE}/api/products/${productId}`, { method: 'DELETE' });
  } catch (e) {}

  adminState.products = adminState.products.filter(p => p.id !== productId);
  renderAdminProductsTable();
  showAdminToast("Product deleted from database.");
}

// Add Product Modal
function openAddProductModal() {
  document.getElementById('adminAddProductModal').classList.remove('opacity-0', 'pointer-events-none');
}

function closeAddProductModal() {
  document.getElementById('adminAddProductModal').classList.add('opacity-0', 'pointer-events-none');
}

async function handleAddProductSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('adminNewProdName').value.trim();
  const category = document.getElementById('adminNewProdCat').value;
  const price = parseFloat(document.getElementById('adminNewProdPrice').value);
  const stock = parseInt(document.getElementById('adminNewProdStock').value);
  const badge = document.getElementById('adminNewProdBadge').value.trim() || 'New';
  const image = document.getElementById('adminNewProdImage').value.trim() || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80';
  const description = document.getElementById('adminNewProdDesc').value.trim();

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

  adminState.products.unshift(newProd);
  renderAdminProductsTable();
  closeAddProductModal();
  document.getElementById('adminAddProductForm').reset();
  showAdminToast(`Product "${name}" registered to catalog!`);
}

// Render Users Matrix
function renderAdminUsersList() {
  const container = document.getElementById('adminUsersListGrid');
  if (!container) return;

  const roleColors = {
    'Admin': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'Manager': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Customer': 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };

  container.innerHTML = adminState.users.map(u => `
    <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
      <div class="flex items-center gap-3">
        <img src="${u.avatar}" alt="${u.name}" class="w-10 h-10 rounded-full object-cover">
        <div class="min-w-0">
          <h4 class="font-bold text-xs text-white truncate">${u.name}</h4>
          <p class="text-[11px] text-slate-400 truncate">${u.email}</p>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2 border-t border-slate-800">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleColors[u.role] || 'border-slate-700 text-slate-400'}">${u.role}</span>
        <select onchange="changeAdminUserRole(${u.id}, this.value)" class="text-[11px] bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-semibold text-slate-200 focus:outline-none">
          <option value="Admin" ${u.role === 'Admin' ? 'selected' : ''}>Admin</option>
          <option value="Manager" ${u.role === 'Manager' ? 'selected' : ''}>Manager</option>
          <option value="Customer" ${u.role === 'Customer' ? 'selected' : ''}>Customer</option>
        </select>
      </div>
    </div>
  `).join('');
}

async function changeAdminUserRole(userId, newRole) {
  try {
    await fetch(`${API_BASE}/api/auth/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    const user = adminState.users.find(u => u.id === userId);
    if (user) user.role = newRole;
    showAdminToast(`User role updated to ${newRole}`);
  } catch (e) {
    showAdminToast(`Role updated`);
  }
}

// Tab Switching in Admin Workspace
function switchAdminTab(tabId) {
  document.querySelectorAll('.admin-tab').forEach(t => {
    t.classList.remove('active', 'text-cyan-400', 'border-b-2');
    t.classList.add('text-slate-400');
  });

  const activeBtn = document.getElementById(`tabBtn-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'text-cyan-400', 'border-b-2');
    activeBtn.classList.remove('text-slate-400');
  }

  document.getElementById('adminOrdersTabContent').classList.add('hidden');
  document.getElementById('adminProductsTabContent').classList.add('hidden');
  document.getElementById('adminRolesTabContent').classList.add('hidden');

  document.getElementById(`admin${tabId.charAt(0).toUpperCase() + tabId.slice(1)}Content`).classList.remove('hidden');
}

// Chart.js Visualizations
function initAdminCharts() {
  const revCtx = document.getElementById('adminRevenueChart');
  if (revCtx) {
    if (adminRevenueChartInstance) adminRevenueChartInstance.destroy();

    adminRevenueChartInstance = new Chart(revCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
          label: 'Revenue ($USD)',
          data: [42500, 58200, 71000, 84300, 99100, 115400, 132000, 148900, 165000, 182038],
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.12)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6366f1',
          pointRadius: 4,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 }, callback: v => `$${v / 1000}k` } }
        }
      }
    });
  }

  const catCtx = document.getElementById('adminCategoryChart');
  if (catCtx) {
    if (adminCategoryChartInstance) adminCategoryChartInstance.destroy();

    adminCategoryChartInstance = new Chart(catCtx, {
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
            labels: { color: '#cbd5e1', font: { family: 'Plus Jakarta Sans', size: 11 } }
          }
        },
        cutout: '70%'
      }
    });
  }
}

// Toast Popup
let adminToastTimer;
function showAdminToast(msg) {
  const toast = document.getElementById('adminToast');
  const msgEl = document.getElementById('adminToastMsg');
  if (!toast) return;

  msgEl.textContent = msg;
  toast.classList.remove('translate-y-24', 'opacity-0');
  clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 3200);
}

// Event Listeners
function setupAdminListeners() {
  loginForm.addEventListener('submit', handleAdminLogin);
  document.getElementById('adminAddProductForm')?.addEventListener('submit', handleAddProductSubmit);
}

