const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const adminController = require('../controllers/adminController');
const itemController = require('../controllers/itemController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Konfigurasi multer untuk menggunakan memory storage untuk Google Cloud Storage
// Ini membuat file disimpan di memory buffer, bukan di disk
const storage = multer.memoryStorage();

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
router.post('/edit-item/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'claimerImage', maxCount: 1 }
]), itemController.updateItem);
router.get('/delete-item/:id', itemController.deleteItem);
router.post('/update-status/:id', upload.single('claimerImage'), itemController.updateItemStatus);

// Buat admin baru (hanya untuk setup awal)
router.get('/create-admin', (req, res) => {
  res.render('admin/create-admin', { title: 'Buat Admin Baru' });
});
router.post('/create-admin', adminController.createAdmin);

module.exports = router;