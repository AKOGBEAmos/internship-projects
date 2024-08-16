'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ValidToken extends Model {
    
    static associate(models) {
      this.belongsTo(models.Session, {foreignKey:'session_id',  as:'__token'});
    }
  }
  ValidToken.init({
    token: DataTypes.STRING(2048),
    exp_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ValidToken',
  });
  return ValidToken;
};