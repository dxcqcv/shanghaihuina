var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.register = (req, res) => {

  if(!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      'message': "All fields required"
    });
    return;
  }
  
  var user = new User();
  
  user.name = req.body.name;
  user.sex = req.body.sex;
  user.birthday = req.body.birthday;
  user.phone = req.body.phone;
  user.address = req.body.address;
  user.email = req.body.email;

  user.setPassword(req.body.password);
  console.log(user);
  user.save((err) => {
    var token;
    if(err) {
      sendJSONresponse(res, 404, err);
    } else {
      token = user.generateJwt();
      sendJSONresponse(res, 200, {
        'token': token
      });
    }
  })
}

/** login */
module.exports.login = (req, res) => {
  if(!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      'message':'All fields required'
    });
    return;
  }
  
  passport.authenticate('local', (err, user, info) => {
    var token;

    if(err) {
      sendJSONresponse(res, 404, err);
      return;
    }
    
    if(user) {
      token = user.generateJwt();
      sendJSONresponse(res, 200, {
        'token': token
        
      });
    } else {
      sendJSONresponse(res, 401, info); // info msg about why authentication failed
    }
  })(req, res);
};
