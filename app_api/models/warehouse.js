var mongoose = require('mongoose');

var warehouse = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  storageCapacity:Number
});


mongoose.model('Warehouse', warehouse);
