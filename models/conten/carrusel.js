const { DataTypes } = require('sequelize');
const db = require("../../database/db")

const CarruselConten = db.sequelize.define('ContenCarrusel',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    filename:{
        type: DataTypes.TEXT,
        allowNull:false
    },
    file: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    fileResponsive: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    needsAction: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    action: {
        type: DataTypes.TEXT,
        allowNull: true
    },
},{
    timestamps: true,
    createdAt:true,
    updatedAt:false
});

module.exports = CarruselConten;