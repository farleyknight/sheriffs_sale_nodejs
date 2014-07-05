
// Access to database
var Sequelize = require('sequelize');
var sequelize = new Sequelize('sheriffs_sale', 'root', null);

// Main database table: Properties
var Property  = sequelize.define('Property', {
  id:                Sequelize.INTEGER,
  case_participants: Sequelize.STRING,
  attorney:          Sequelize.STRING,
  address:           Sequelize.STRING,
  price:             Sequelize.STRING,
  price_in_dollars:  Sequelize.INTEGER,
  latitude:          Sequelize.DECIMAL(10, 6),
  longitude:         Sequelize.DECIMAL(10, 6),
  created_at:        Sequelize.DATE,
  updated_at:        Sequelize.DATE
}, {
  tableName: 'properties'
});

// Express is Sinatra for Node
var express = require('express');
var app     = express();

// simple logger
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});


var haversineSQL = function(distance, latitude, longitude, lat_attr, lng_attr) {
  var earth = 3958.755864232; // Radius of earth in miles

  var sql = "(" + earth + " * 2 * ASIN(SQRT(" +
    "POWER(SIN((" + latitude + " - " + lat_attr + ") * PI() / 180 / 2), 2) + " +
    "COS(" + latitude + " * PI() / 180) * COS(" + lat_attr + " * PI() / 180) * " +
    "POWER(SIN((" + longitude + " - " + lng_attr + ") * PI() / 180 / 2), 2)" +
    ")))";

  return sql;
};

var distanceWhere = function(distance, latitude, longitude, lat_attr, lng_attr) {
  var earth = 3956; // Radius of earth in miles

  return haversineSQL(latitude, longitude, lat_attr, lng_attr)
    + " BETWEEN 0 and " + distance;
};

var distanceAttr = function(latitude, longitude) {
  var earth = 3958.755864232; // Radius of earth in miles

  var sql = haversineSQL(latitude, longitude, 'properties.latitude', '');
    "(" + earth + " * 2 * ASIN(SQRT(" +
    "POWER(SIN((" + latitude +" - properties.latitude) * PI() / 180 / 2), 2) + " +
    "COS(" + latitude + " * PI() / 180) * COS(properties.latitude * PI() / 180) * " +
    "POWER(SIN((" + longitude + " - properties.longitude) * PI() / 180 / 2), 2)" +
    "))) as distance";

  return Sequelize.literal(sql);
};

// Respond to /properties.json
app.get('/properties.json', function(req, res) {
  console.log(req.query);

  var max_price = req.query.max_price      ||  5;
  var min_price = req.query.min_price      ||  0;
  var lat       = parseFloat(req.query.lat || 39.97);
  var lng       = parseFloat(req.query.lng || -75.15);
  var count     = req.query.count          || 10;

  var query = Property.findAll({
    attributes: ['*', distanceAttr(lat, lng)],

    where: Sequelize.and(
      ['price_in_dollars < ?', max_price * 1000],
      ['price_in_dollars > ?', min_price * 1000],
      haversineSQL(20, lat, lng, 'latitude', 'longitude')
    ),

    order: 'distance asc',

    limit: count
  });
  query.success(function(properties) {
    res.send(properties);
  });
});

// http://stackoverflow.com/a/21823343
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.listen(5000);
