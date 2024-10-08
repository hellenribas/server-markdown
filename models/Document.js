const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const documentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  version: { type: Number, default: 1 },
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
