var mongoose = require('mongoose');

var returning = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  buyingTime:String,
  quantity:Number,
  price:Number,
});


mongoose.model('Returning', returning);
