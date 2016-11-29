var mongoose = require('mongoose');

var shopping = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity:Number,
  price:Number,
});


mongoose.model('Shopping', shopping);
