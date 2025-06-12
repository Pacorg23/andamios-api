const { Sequelize, DataTypes } = require('sequelize');
const db = require("../database/db")

const Archivos = db.sequelize.define('Archivos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    origen: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Archivos