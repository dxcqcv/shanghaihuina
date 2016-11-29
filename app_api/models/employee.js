var mongoose = require('mongoose');

var employee = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String,
  sex:String,
  birthday:String,
  phone: Number,
  address:String,
  departmentNumber:Number,
  employmentPeriod:Number,
  warehouseNumber:Number
});


mongoose.model('Employee', employee);
