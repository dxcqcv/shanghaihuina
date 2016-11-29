var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
var sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content)
};
var User = mongoose.model('User');
var getAuthor = function(req, res, callback) {
  if(req.payload && req.payload.email) {
    User
      .findOne({ email: req.payload.email })
      .exec(function(err, user) {
        if(!user) {
          sendJsonResponse(res, 404, {
            "message": "User not found"
          });
          return;
        } else if(err) {
          console.log(err);
          sendJsonResponse(res, 404, err);
          return;
        }
        callback(req, res, user.name);
      });
  } else {
    sendJsonResponse(res, 404, {
      "message": "User not found"
    });
    return;
  }
};

// get a review from location, url like .../api/locations/lid/review/rid
module.exports.reviewsReadOne = function(req, res) {
  if(req.params && req.params.locationid && req.params.reviewid) {
    Loc
      .findById(req.params.locationid)
      .select('name reviewList')
      .exec(
        (err, location) => {
          var response, review;
          if(!location) {
            sendJsonResponse(res,404,{
              'message':'locationid not be found'
            });
            return;
          } else if(err) {
            sendJsonResponse(res,400,err) 
            return;
          }
          if(location.reviewList && location.reviewList.length > 0) {
            review = location.reviewList.id(req.params.reviewid);
            if(!review) {
              sendJsonResponse(res,404, {
                'message':'reviewid not be found'
              });
            } else {
              response = {
                location: {
                  name: location.name,
                  id: req.params.locationid
                },
                review: review
              };
              sendJsonResponse(res,200,response);
            }
          } else {
            sendJsonResponse(res,404, {
              'message':'No reviews found'
            });
          }
        }
      );
  } else {
    sendJsonResponse(res,404, {
      'message':'Not found, locationid and reviewid are both required'
    });
  }
};

// select specify location
var updateAverageRating = (locationid) => {
  Loc
    .findById(locationid)
    .select('rating reviewList')
    .exec(
      (err, location) => {
        if(!err) {
          doSetAverageRating(location);
        }
      }
    );
};

// handle rating
var doSetAverageRating = (location) => {
  var i, reviewCount, ratingAverage, ratingTotal;
  if(location.reviewList && location.reviewList.length > 0) {
    reviewCount = location.reviewList.length;
    ratingTotal = 0;
    for(i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + location.reviewList[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save((err) => {
      if(err) {
        console.log(err);
      } else {
        console.log('Average rating updated to ', ratingAverage);
      }
    });
  }
};

// update a subdocument in MongoDB
module.exports.reviewsUpdateOne = (req,res) => {
  if(!req.params.locationid || !req.params.reviewid) {
    sendJsonResponse(res,404,{
      'message': 'Not found, locationid and reviewid are both required'
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviewList')
    .exec(
      (err, location) => {
        var thisReview;
        if(!location) {
          sendJsonResponse(res,404,{
            'message': 'locationid not found'
          });
          return;
        } else if(err) {
          sendJsonResponse(res,400, err);
          return;
        }
        if(location.reviewList && location.reviewList.length > 0) {
          thisReview = location.reviewList.id(req.params.reviewid);
          if(!thisReview) {
            sendJsonResponse(res, 404, {
              'message': 'reviewid not found'
            });
          } else {
            thisReview.author = req.body.author;
            thisReview.rating = req.body.rating;
            thisReview.reviewText = req.body.reviewText;
            location.save((err, location) => {
              if(err) {
                sendJsonResponse(res,404, err);
              } else {
                updateAverageRating(location._id);
                sendJsonResponse(res,200,thisReview);
              }
            });
          }
        } else {
          sendJsonResponse(res,404, {
            'message': 'No review to update'
          });
        }
      }
    );
};

// app.delete('/api/locations/:locationid/reviews/:reviewid')
module.exports.reviewsDeleteOne = (req,res) => {
  if(!req.params.locationid || !req.params.reviewid) {
    sendJsonResponse(res,404, {
      'message': 'Not found, locationid and reviewid are both required'
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviewList')
    .exec((err,location) => {
      if(!location) {
        sendJsonResponse(res,404, {
          'message': 'locationid not found'
        });
        return;
      } else if(err) {
        sendJsonResponse(res,404,err);
        return;
      }
      if(location.reviewList && location.reviewList.length > 0) {
        if(!location.reviewList.id(req.params.reviewid)) {
          sendJsonResponse(res,404, {
            'message': 'reviewid not found'
          });
        } else {
          location.reviewList.id(req.params.reviewid).remove();
          location.save((err) => {
            if(err) {
              sendJsonResponse(res,404,err);
            } else {
              updateAverageRating(location._id);
              sendJsonResponse(res, 204, null);
            }
          });
        }
      } else {
        sendJsonResponse(res,404,{
          'message': 'No review to delete'
        });
      }
    });
};
var doAddReview = (req,res,location, author) => {

  if(!location) {
    sendJsonResponse(res, 404, {
      'message': 'locationid not found'
    });
  } else {
    location.reviewList.push({
      author: author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    location.save((err,location) => {
      var thisReview;
      if(err) {
        console.log(err);
        sendJsonResponse(res,400, err);
      } else {
        updateAverageRating(location._id);
        thisReview = location.reviewList[location.reviewList.length - 1];
        console.log(thisReview);
        sendJsonResponse(res, 201, thisReview);
      }
    }); 
  }
};
// creating a review
module.exports.reviewsCreate = (req,res) => {
  getAuthor(req, res, function(req, res, userName) {
    var locationid = req.params.locationid;
    if(req.params.locationid) {
      Loc
        .findById(req.params.locationid)
        .select('reviewList')
        .exec((err,location) => {
          if(err) {
            sendJsonResponse(res,400,err);
          } else {
        
            doAddReview(req,res,location,userName);
          }
        })
    } else {
      sendJsonResponse(res,404,{
        'message': 'Not found, locationid required'
      });
    }
  });
};

