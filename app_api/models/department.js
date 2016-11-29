var mongoose = require('mongoose');

var department = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contacts:String,
  count:Number,
  phone:Number,
});


mongoose.model('Department', department);
