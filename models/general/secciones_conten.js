const { DataTypes } = require('sequelize');
const db = require("../../database/db")
const CategoriasConten = require('./categorias_conten');

const SeccionesConten = db.sequelize.define('Secciones_Conten', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Categorias_Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: CategoriasConten,
            key: 'id'
        }
    },
    img: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    file: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
}, {
    timestamps: false
})

SeccionesConten.belongsTo(CategoriasConten, {
    foreignKey: 'Categorias_Id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
CategoriasConten.hasMany(SeccionesConten, {
    foreignKey: 'Categorias_Id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


module.exports = SeccionesConten
