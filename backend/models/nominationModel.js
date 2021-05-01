const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Nomination = mongoose.model('Nomination', schema);

module.exports = Nomination;
