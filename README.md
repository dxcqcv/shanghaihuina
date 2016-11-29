## built heroku
- $heroku login
- (first time) $cd heroku folder; $heroku create; $heroku ps:scale web=1; $heroku open
- (dev) $nodemon
- (test) $heroku local
- $git add .; $git commit -am "comment"; $git push heroku master;
- change .env 
- (mongo live) (login in http://docs.mongolab.com/, then get database URI) $heroku config:set MONGOLAB_URI=your_db_uri
- heroku open to open website after git push