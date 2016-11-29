var mongoose = require('mongoose');

/** review data */
var reviewSchema = new mongoose.Schema({
  author: {type:String, required:true},
  rating: {type:Number, required:true, min:0, max:5},
  reviewText: {type:String, required: true},
  createdOn: {type:Date, 'default':Date.now}
}); 

/** detail data */
var openingTimeSchema = new mongoose.Schema({
  days: {type: String, required: true},
  opening: String,
  closing: String,
  closed: {type:Boolean, required: true}
});

/** home list data */
var locationSchema = new mongoose.Schema({
  name: {type:String, required: true},
  address: String,
  rating:{type:Number, "default":0,min:0,max:5} ,
  facilityList: [String],
  coords: {type: [Number], index: '2dsphere', "2dsphereIndexVersion": 2,required:true},
  openingTimeList: [openingTimeSchema],
  reviewList: [reviewSchema]
})

/** build model */
mongoose.model('Location',locationSchema);