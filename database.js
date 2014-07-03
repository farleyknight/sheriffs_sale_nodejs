
var Sequelize = require('sequelize');
var sequelize = new Sequelize('sheriffs_sale', 'root', null);

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


module.exports = {
  Property:  Property,
  sequelize: sequelize,
  Sequelize: Sequelize
};
