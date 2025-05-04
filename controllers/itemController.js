const Item = require('../models/item');
const path = require('path');
const fs = require('fs');

// Menampilkan semua barang untuk publik
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.render('index', { 
      title: 'Barang Hilang & Ditemukan Masjid',
      items 
    });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan saat mengambil data');
  }
};

// Menampilkan halaman detail barang
exports.getItemDetail = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).send('Barang tidak ditemukan');
    }
    res.render('item-detail', { 
      title: item.name,
      item 
    });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan saat mengambil data');
  }
};

// == ADMIN CONTROLLERS ==
// Menampilkan semua barang untuk admin
exports.adminGetAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.render('admin/dashboard', { 
      title: 'Admin Dashboard',
      items 
    });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan saat mengambil data');
  }
};

// Menampilkan form tambah barang
exports.getAddItemForm = (req, res) => {
  res.render('admin/add-item', { title: 'Tambah Barang Baru' });
};

// Proses tambah barang
exports.addItem = async (req, res) => {
  try {
    let imageName = 'default-item.jpg';
    
    // Jika ada file yang diupload
    if (req.file) {
      imageName = req.file.filename;
    }
    
    const newItem = new Item({
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      category: req.body.category,
      date: req.body.date ? new Date(req.body.date) : new Date(),
      status: req.body.status,
      image: imageName,
      contactPerson: req.body.contactPerson,
      contactPhone: req.body.contactPhone,
      claimerName:"",
      claimerPhone: "",
      claimerImage: ""

    });
    
    await newItem.save();
    req.flash('success', 'Barang berhasil ditambahkan');
    res.redirect('/admin/dashboard');
  } catch (error) {
    req.flash('error', 'Terjadi kesalahan saat menambahkan barang');
    res.redirect('/admin/add-item');
  }
};

// Menampilkan form edit barang
exports.getEditItemForm = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      req.flash('error', 'Barang tidak ditemukan');
      return res.redirect('/admin/dashboard');
    }
    res.render('admin/edit-item', { 
      title: 'Edit Barang',
      item 
    });
  } catch (error) {
    req.flash('error', 'Terjadi kesalahan saat mengambil data');
    res.redirect('/admin/dashboard');
  }
};

// Proses update barang
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      req.flash('error', 'Barang tidak ditemukan');
      return res.redirect('/admin/dashboard');
    }

    let imageName = item.image;
    let claimerImageName = item.claimerImage;

    // Handle item image upload
    if (req.files && req.files.image && req.files.image[0]) {
      // Hapus gambar lama jika bukan default
      if (item.image && item.image !== 'default-item.jpg') {
        const imagePath = path.join(__dirname, '../public/uploads/', item.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      imageName = req.files.image[0].filename;
    }

    // Handle claimer image upload
    if (req.files && req.files.claimerImage && req.files.claimerImage[0]) {
      // Hapus gambar claimer lama jika ada
      if (item.claimerImage) {
        const claimerImagePath = path.join(__dirname, '../public/uploads/', item.claimerImage);
        if (fs.existsSync(claimerImagePath)) {
          fs.unlinkSync(claimerImagePath);
        }
      }
      claimerImageName = req.files.claimerImage[0].filename;
    }

    const updatedItem = {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      category: req.body.category,
      date: req.body.date ? new Date(req.body.date) : item.date,
      status: req.body.status,
      image: imageName,
      contactPerson: req.body.contactPerson,
      contactPhone: req.body.contactPhone,
      claimerName: req.body.claimerName || item.claimerName,
      claimerPhone: req.body.claimerPhone || item.claimerPhone,
      claimerImage: claimerImageName
    };

    await Item.findByIdAndUpdate(req.params.id, updatedItem);
    req.flash('success', 'Barang berhasil diperbarui');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error updating item:', error);
    req.flash('error', 'Terjadi kesalahan saat memperbarui barang');
    res.redirect(`/admin/edit-item/${req.params.id}`);
  }
};

// Proses hapus barang
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      req.flash('error', 'Barang tidak ditemukan');
      return res.redirect('/admin/dashboard');
    }
    if (item.status === 'hilang') {
      req.flash('error', 'Barang masih hilang, tidak dapat dihapus');
      return res.redirect('/admin/dashboard');
    } else {
    // Hapus gambar jika bukan default
    if (item.image!== 'default-item.png') {
      const imagePath = path.join(__dirname, '../public/uploads/', item.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Item.findByIdAndDelete(req.params.id);
    req.flash('sucpngs', 'Barang berhasil dihapus');
    res.redirect('/admin/dashboard');
  } 
}catch (error) {
    req.flash('error', 'Terjadi kesalahan saat menghapus barang');
    res.redirect('/admin/dashboard');
  }
}

// Update status barang (hilang/ditemukan)
exports.updateItemStatus = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      req.flash('error', 'Barang tidak ditemukan');
      return res.redirect('/admin/dashboard');
    }
    
    // Toggle status
    const newStatus = item.status === 'hilang' ? 'ditemukan' : 'hilang';
    
    const updateData = { status: newStatus };
    
    // Jika status berubah menjadi ditemukan, tambahkan info pengambil
    if (newStatus === 'ditemukan') {
      if (req.file) {
        updateData.claimerImage = req.file.filename;
      }
      updateData.claimerName = req.body.claimerName;
      updateData.claimerPhone = req.body.claimerPhone;
    } else {
      // Jika status kembali ke hilang, hapus info pengambil
      updateData.claimerName = null;
      updateData.claimerPhone = null;
      updateData.claimerImage = null;
    }

    console.log(newStatus)
    
    await Item.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success', `Status barang berhasil diubah menjadi ${newStatus}`);
    res.redirect('/admin/dashboard');
  } catch (error) {
    req.flash('error', 'Terjadi kesalahan saat memperbarui status');
    res.redirect('/admin/dashboard');
  }
};