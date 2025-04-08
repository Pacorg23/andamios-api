const { DataTypes } = require('sequelize');
const db = require("../../database/db")

const Categorias = db.sequelize.define('Categorias', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre:{ //nombre categoria
        type: DataTypes.TEXT,
        allowNull: false,
    },
    tipo:{  //tipo categoria A,B, C o D
        type: DataTypes.TEXT,
        allowNull: false,
    },
    url:{ //nombre para url, sin formato y en minusculas
        type: DataTypes.TEXT,
        allowNull: true,
    },
    area:{ //area de la categoria
        type: DataTypes.TEXT,
        allowNull: false,
    },
    mostrar_inicio:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    banner:{
        type: DataTypes.TEXT('long'),
        allowNull: true,
    }
},{
    timestamps:false
})


module.exports = Categorias
