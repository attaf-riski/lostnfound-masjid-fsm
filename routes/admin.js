const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const adminController = require('../controllers/adminController');
const itemController = require('../controllers/itemController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filter file untuk multer
const fileFilter = (req, file, cb) => {
  // Hanya izinkan gambar
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diizinkan'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Rute login
router.get('/login', adminController.getLoginForm);
router.post('/login', adminController.login);

// Middleware untuk rute yang memerlukan autentikasi
router.use(isAuthenticated);

// Dashboard admin
router.get('/dashboard', itemController.adminGetAllItems);

// Logout
router.get('/logout', adminController.logout);

// Manajemen barang
router.get('/add-item', itemController.getAddItemForm);
router.post('/add-item', upload.single('image'), itemController.addItem);
router.get('/edit-item/:id', itemController.getEditItemForm);
router.post('/edit-item/:id', upload.single('image'), itemController.updateItem);
router.get('/delete-item/:id', itemController.deleteItem);
router.get('/update-status/:id', itemController.updateItemStatus);

// Buat admin baru (hanya untuk setup awal)
router.get('/create-admin', (req, res) => {
  res.render('admin/create-admin', { title: 'Buat Admin Baru' });
});
router.post('/create-admin', adminController.createAdmin);

module.exports = router;