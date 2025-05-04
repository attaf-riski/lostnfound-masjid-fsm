const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

// Middleware untuk memverifikasi token admin
exports.isAuthenticated = async (req, res, next) => {
  try {
    // Ambil token dari cookie
    const token = req.cookies.token;
    
    if (!token) {
      req.flash('error', 'Anda harus login terlebih dahulu');
      return res.redirect('/admin/login');
    }
    
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Cari admin berdasarkan ID dari token
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      req.flash('error', 'Admin tidak ditemukan');
      return res.redirect('/admin/login');
    }
    
    // Simpan data admin di request
    req.admin = admin;
    next();
  } catch (error) {
    req.flash('error', 'Sesi tidak valid, silakan login kembali');
    res.clearCookie('token');
    res.redirect('/admin/login');
  }
};

// Middleware untuk memeriksa apakah pengguna sudah login
exports.isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.isLoggedIn = true;
      req.adminId = decoded.id;
    } else {
      req.isLoggedIn = false;
    }
    next();
  } catch (error) {
    req.isLoggedIn = false;
    next();
  }
};