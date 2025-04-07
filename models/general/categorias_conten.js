const { DataTypes } = require('sequelize');
const db = require("../../database/db")

const CategoriasConten = db.sequelize.define('Categorias_Conten', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title:{ //nombre categoria
        type: DataTypes.TEXT,
        allowNull: false,
    },
    tipo:{  //tipo categoria A, B, C o D
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_active:{ //nombre para url, sin formato y en minusculas
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    has_sections:{ //nombre para url, sin formato y en minusculas
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    url:{ //nombre para url, sin formato y en minusculas
        type: DataTypes.TEXT,
        allowNull: true,
    },
    is_default:{ //nombre para url, sin formato y en minusculas
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    description:{ //area de la categoria
        type: DataTypes.TEXT,
        allowNull: false,
    },
    img:{
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    pdf:{
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
},{
    timestamps:true
})


module.exports = CategoriasConten
