const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { urlRegex } = require('../utils/constants');


// схема card
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: function (newLink) {
        return urlRegex.test(newLink);
      },
    },
  },
  owner: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: [ObjectId],
    default: [],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('card', cardSchema);