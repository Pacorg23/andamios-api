const { DataTypes } = require('sequelize');
const db = require("../../database/db")

const Contactos = db.sequelize.define('Contactos', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    empresa:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fijo:{
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    celular:{
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    correo:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    estadoIN:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    estadoOUT:{
        type: DataTypes.TEXT,
        allowNull: true,
    },
    duda:{
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    area:{
        type: DataTypes.TEXT,
        allowNull: false,
    }
},{
    timestamps:true,
    createdAt:true,
    updatedAt:false
})

module.exports = Contactos;