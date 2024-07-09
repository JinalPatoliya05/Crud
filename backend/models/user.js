const { DataTypes } = require("sequelize");
const sequelize = require("../config/init");

const User = sequelize.define("users", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },
    first_name: {
        type: DataTypes.STRING,
    },
    last_name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    mobile_number: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
    },
    gender: {
        type: DataTypes.STRING,
    },
    birthdate: {
        type: DataTypes.DATEONLY,        
    },
    age: {
        type: DataTypes.INTEGER,
    },
    image: {
        type: DataTypes.STRING,
    },
});

module.exports = User;
