const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

// Middleware untuk semua rute
router.use(isLoggedIn);

// Halaman utama - Daftar semua barang
router.get('/', itemController.getAllItems);

// Halaman detail barang
router.get('/item/:id', itemController.getItemDetail);

module.exports = router;