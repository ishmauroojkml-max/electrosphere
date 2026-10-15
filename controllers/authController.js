// ==========================================================================
// Auth Controller (JWT Authentication & User Roles Management)
// ==========================================================================

const { readJson, writeJson } = require('../config/db');
const USERS_FILE = 'users.json';

// Helper for JWT Token
function createToken(user) {
  const secret = process.env.JWT_SECRET || 'secret';
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64');
  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000
  })).toString('base64');
  const signature = Buffer.from(`${secret}_${user.id}`).toString('base64');
  return `${header}.${payload}.${signature}`;
}

// POST /api/auth/login
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const users = readJson(USERS_FILE);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: "Invalid email or password credentials." });
  }

  const token = createToken(user);
  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      department: user.department
    }
  });
};

// POST /api/auth/register
exports.register = (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Please fill in all required fields." });
  }

  const users = readJson(USERS_FILE);
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (exists) {
    return res.status(409).json({ success: false, message: "An account with this email already exists." });
  }

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: role && ['Admin', 'Manager', 'Customer'].includes(role) ? role : 'Customer',
    avatar: `https://images.unsplash.com/photo-${1534528741775 + newUser?.id || 1}?auto=format&fit=crop&w=150&q=80`,
    department: role === 'Admin' ? 'Executive' : (role === 'Manager' ? 'Logistics' : 'Customer'),
    joined: new Date().toISOString().split('T')[0]
  };

  users.push(newUser);
  writeJson(USERS_FILE, users);

  const token = createToken(newUser);
  res.status(201).json({
    success: true,
    message: "Registration successful!",
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      department: newUser.department
    }
  });
};

// GET /api/auth/users
exports.getUsers = (req, res) => {
  const users = readJson(USERS_FILE);
  const sanitized = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    department: u.department,
    joined: u.joined
  }));
  res.json({ success: true, data: sanitized });
};

// PATCH /api/auth/users/:id/role
exports.updateUserRole = (req, res) => {
  const { role } = req.body;
  const userId = parseInt(req.params.id);
  if (!['Admin', 'Manager', 'Customer'].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role specified." });
  }

  const users = readJson(USERS_FILE);
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  user.role = role;
  writeJson(USERS_FILE, users);
  res.json({ success: true, message: `Role updated to ${role} for ${user.name}.`, user });
};

