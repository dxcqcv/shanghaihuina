var mongoose = require('mongoose');

var output = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity:Number,
  deadline:String
});


mongoose.model('Output',output );
