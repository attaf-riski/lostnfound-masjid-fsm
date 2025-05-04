const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

// Menampilkan halaman login
exports.getLoginForm = (req, res) => {
  res.render('admin/login', { title: 'Login Admin' });
};

// Proses login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Cari admin berdasarkan username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      req.flash('error', 'Username atau password salah');
      return res.redirect('/admin/login');
    }
    
    // Verifikasi password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Username atau password salah');
      return res.redirect('/admin/login');
    }
    
    // Buat token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Simpan token di cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 hari
    });
    
    req.flash('success', 'Login berhasil');
    res.redirect('/admin/dashboard');
  } catch (error) {
    req.flash('error', 'Terjadi kesalahan saat login');
    res.redirect('/admin/login');
  }
};

// Proses logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  req.flash('success', 'Logout berhasil');
  res.redirect('/admin/login');
};

// Membuat admin baru (hanya untuk setup awal)
exports.createAdmin = async (req, res) => {
  try {
    // Periksa apakah sudah ada admin
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0 && !req.admin.role === 'superadmin') {
      req.flash('error', 'Tidak dapat membuat admin baru');
      return res.redirect('/admin/dashboard');
    }
    
    const { username, password, name } = req.body;
    console.log(req.body); 
    // Periksa apakah username sudah ada
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      req.flash('error', 'Username sudah digunakan');
      return res.redirect('/admin/create-admin');
    }
    
    const newAdmin = new Admin({
      username,
      password,
      name,
      role: 'admin'
    });
    
    await newAdmin.save();
    req.flash('success', 'Admin berhasil dibuat');
    res.redirect('/admin/dashboard');
  } catch (error) {
    req.flash('error', 'Terjadi kesalahan saat membuat admin');
    res.redirect('/admin/create-admin');
  }
};