var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
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
  typeNumber:Number
});

// do not use arrow funciton because this will refer to userSchema model in normal function
userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000,64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
// pbkdf2 params is password, salt, iterations, hashBytes, digest
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000) // Unix time in seconds
  }, process.env.JWT_SECRET);
};

mongoose.model('User', userSchema);

