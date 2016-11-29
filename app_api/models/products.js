var mongoose = require('mongoose');

var products = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity:Number,
  price:Number,
  specification: String,
  employmentPeriod:Number,
  warehouseNumber:Number
});


mongoose.model('Products', products);
