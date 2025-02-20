const { DataTypes } = require('sequelize');
const db = require("../../database/db")

const Activity = db.sequelize.define('Activity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},{
    timestamps:false
})

module.exports = Activity