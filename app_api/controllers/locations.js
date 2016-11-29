var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

// get distance
var theEarth = (()=>{
  var earthRadius = 6371; // km, miles is 3959
  var getDistanceFromRads = (rads) => {
    return parseFloat(rads * earthRadius);
  };
  var getRadsFromDistance = (distance) => {
    return parseFloat(distance / earthRadius);
  };
  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  };
})();

// get res status and json
var sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content)
};

module.exports.locationsListByDistance = (req,res) => {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance);
  var point = {
    type: 'Point',
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(2000),
    num: 10
  };
  if((!lng && lng !== 0) || (!lat && lat !== 0)) { // fixed 02false bug
    sendJsonResponse(res,404,{
      'message': 'lng and lat query parameters are required'
    });
    return;
  }
  Loc.geoNear(point, geoOptions, ( err,results,stats) => {
    var locations = [];
    if(err) {
      sendJsonResponse(res,404,err);
    } else {
      locations = buildLocationList(req,res,results,stats);
      sendJsonResponse(res,200,locations);
    }
  });
};

function buildLocationList(req,res,results,stats) {
  var locations = [];
  results.forEach((doc) => {
    locations.push({
      distance: theEarth.getDistanceFromRads(doc.dis),
      name: doc.obj.name,
      address: doc.obj.address,
      rating: doc.obj.rating,
      facilityList: doc.obj.facilityList,
      _id: doc.obj._id
    });
  });
  return locations;
}

// create location
module.exports.locationsCreate = function(req, res) {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilityList: req.body.facilityList.split(','),
    coords: [parseFloat(req.body.lng),parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1
    },{
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2
    }]
  }, (err, location) => {
    if(err) {
      sendJsonResponse(res,400,err);
    } else {
      sendJsonResponse(res,201,location);
    }
  });
};

// show a location
module.exports.locationsReadOne = (req,res) => {
  if(req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec((err,location)=>{
        if(!location) {
          sendJsonResponse(res,404,{
            "message": "locationid not found"
          });
          return;
        } else if(err) {
          sendJsonResponse(res,404,err); 
          return;
        } 
        sendJsonResponse(res,200,location)
      });
  } else {
    sendJsonResponse(res,404,{
      "message": "No locationid in request"
    });
  }
};



/** PUT /api/locations/:locationid */
module.exports.locationsUpdateOne = (req, res) => {
  if(!req.params.locationid) {
    sendJsonResponse(res,404, {
      'message': 'Not found, locationid is required'
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec(
      (err, location) => {
        if(!location) {
          sendJsonResponse(res,404,{
            'message': 'locationid not found'
          });
          return;
        } else if(err) {
          sendJsonResponse(res,400,err);
          return;
        }
        location.name = req.body.name;
        location.address = req.body.address;
        location.failityList = req.body.facilityList.split(',');
        location.coords = [parseFloat(req.body.lng),parseFloat(req.body.lat)];
        location.openingTimes = [{
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1
        },{
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2
        }];
        location.save((err,location) => {
          if(err) {
            sendJsonResponse(res,404, err);
          } else {
            sendJsonResponse(res,200,location);
          }
        })
      }
    )
};

/** DELETE /api/locations/:locationid */
module.exports.locationsDeleteOne = (req,res) => {
  var locationid = req.params.locationid;
  if(locationid) {
    Loc
      .findByIdAndRemove(locationid)
      .exec(
        (err,location) => {
          if(err) {
            console.log(err);
            sendJsonResponse(res,404,err);
            return;
          }
          sendJsonResponse(res,204,null);
        }
      );
  } else {
    sendJsonResponse(res,404,{
      'message': 'No locationid'
    });
  }
};