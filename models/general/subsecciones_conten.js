const { DataTypes } = require('sequelize');
const db = require("../../database/db")
const SeccionesConten = require('./secciones_conten');

const SubseccionesConten = db.sequelize.define('Subsecciones_Conten', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: { //nombre categoria
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: { //area de la categoria
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    Secciones_Conten_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true
    }
}, {
    timestamps: false
})
SubseccionesConten.belongsTo(SeccionesConten, {
    foreignKey: 'Secciones_Conten_Id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
SeccionesConten.hasMany(SubseccionesConten, {
    foreignKey: 'Secciones_Conten_Id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


module.exports = SubseccionesConten
