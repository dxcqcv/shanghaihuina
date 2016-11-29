var mongoose = require('mongoose');

var reservation = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity:Number,
  price:Number,
});


mongoose.model('reservation', reservation);
