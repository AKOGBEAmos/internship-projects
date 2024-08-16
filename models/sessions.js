'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    
    static associate(models) {
      this.belongsTo(models.users, {foreignKey:'user_id', as:'validsession'});
      this.hasMany(models.ValidToken, {foreignKey:'session_id', as:'validtoken'})
    }
  }
  Session.init({
    access_token: {
      type: DataTypes.STRING(1024), 
      allowNull: false
    },
    refresh_token: DataTypes.STRING,
    exp_token_date: DataTypes.DATE,
    ip_addr: DataTypes.STRING,
    user_agent: DataTypes.STRING,
    last_connexion_hour: DataTypes.DATE,
    session_timeout: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};