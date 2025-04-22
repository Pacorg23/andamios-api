const { DataTypes } = require('sequelize');
const db = require("../../database/db")

const Sucursales = db.sequelize.define('Sucursales', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre:{
        type: DataTypes.TEXT('medium'),
        allowNull: false,
    },
    direccion:{
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    telefono:{
        type:DataTypes.TEXT('long'),
        allowNull: true,
    },
    maps:{
        type:DataTypes.TEXT('long'),
        allowNull: true,
    },
    division:{
        type:DataTypes.TEXT('long'),
        allowNull: true
    },
    descripcion:{
        type:DataTypes.TEXT('long'),
        allowNull: true,
    },
    imagen:{
        type:DataTypes.TEXT('long'),
        allowNull: true,
    }
},{
    timestamps:false
})

module.exports = Sucursales;