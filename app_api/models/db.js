var mongoose = require('mongoose');
var dbURI = 'mongodb://127.0.0.1/Loc8r';
if(process.env.NODE_ENV ==='production') {
  dbURI = process.env.MONGOLAB_URI;
}
mongoose.connect(dbURI);

mongoose.connection.on('connected', ()=>{
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', (err)=>{
  console.log('Mongoose connected err: ' + err);
});
mongoose.connection.on('disconnected', ()=>{
  console.log('Mongoose disconnected ' );
});

/** Listening for SIGINT on Windows */
var readLine = require('readline');
if(process.platform === 'win32') {
  var r1 = readLine.createInterface ({
    input: process.stdin,
    output: process.stdout
  });
  r1.on('SIGINT', () => {
    process.emit('SIGINT');
  });
}

var gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through ' + msg );
    callback();
  });
};

/** for nodemon */
process.once('SIGUSR2', ()=>{
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
/** for Node.js*/
process.once('SIGINT', ()=>{
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});
/** for heroku */
process.once('SIGTERM', ()=>{
  gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
});

/** Bring in your schemas & models */
require('./locations');
require('./users');

/*
require('./employee');
require('./products');
*/
