const Sequelize=require("sequelize");
const sequelize=require('../config/connectdb').sequelize;

module.exports=
{
    userModel:require('./userModel')(Sequelize,sequelize,Sequelize.DataTypes),
    bookingModel:require('./bookingModel')(Sequelize,sequelize,Sequelize.DataTypes)
}