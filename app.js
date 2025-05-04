const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

// Load environment variables
dotenv.config();

// Import routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');

// Connect to database
require('./config/db');

// Initialize app
const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session & Flash messages
app.use(session({
  secret: process.env.SESSION_SECRET || 'masjid-lost-found-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.admin = req.admin || null;
  res.locals.isLoggedIn = req.isLoggedIn || false;
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);

// 404 Page
app.use((req, res) => {
  res.status(404).render('404', { title: 'Halaman Tidak Ditemukan' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Terjadi Kesalahan',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});