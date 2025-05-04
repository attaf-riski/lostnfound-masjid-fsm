const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import model Admin
const Admin = require('../models/admin');

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Data admin default
const adminData = {
  username: 'admin',
  name: 'Admin Masjid',
  password: 'admin123',
  role: 'admin',
  isActive: true
};

// Fungsi untuk menambahkan admin
async function seedAdmin() {
  try {
    // Hapus data admin yang ada (opsional)
    await Admin.deleteMany({});

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Buat admin baru dengan password yang sudah di-hash
    const admin = new Admin({
      ...adminData,
    });

    // Simpan ke database
    await admin.save();
    
    console.log('Admin berhasil ditambahkan:');
    console.log('Username:', adminData.username);
    console.log('Password:', adminData.password);
    
    // Tutup koneksi database
    mongoose.connection.close();
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    process.exit(1);
  }
}

// Jalankan seeder
seedAdmin();