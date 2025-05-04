const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  image: {
    type: String,
    default: 'default-item.png'
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['hilang', 'ditemukan'],
    default: 'hilang'
  },
  contactPerson: {
    type: String
  },
  contactPhone: {
    type: String
  },
  claimerName: {
    type: String
  },
  claimerPhone: {
    type: String
  },
  claimerImage: {
    type: String
  }
}, {
  timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;