const { DataTypes } = require('sequelize');
const db = require("../../database/db")
const SeccionesConten = require('./secciones_conten');
const SubseccionesConten = require('./subsecciones_conten');
const CategoriasConten = require('./categorias_conten');

const ArchivosConten = db.sequelize.define('Archivos_Conten', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Secciones_Conten_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Subsecciones_Conten_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Categorias_Conten_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    data: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },

}, {
    timestamps: false
})

//Esta estan chill
// CategoriasConten.hasMany(ArchivosConten, {
//     foreignKey: 'Categorias_Conten_Id',
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE'
// });
// ArchivosConten.belongsTo(CategoriasConten, {
//     foreignKey: 'Categorias_Conten_Id',
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE'
// });
// //Estas no
// ArchivosConten.belongsTo( SeccionesConten, {
//     foreignKey: 'Secciones_Conten_Id',
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE'
// });
// SeccionesConten.hasMany(ArchivosConten, {
//     foreignKey: 'Secciones_Conten_Id',
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE'
// });
// ArchivosConten.belongsTo( SubseccionesConten, {
//     foreignKey: 'Subsecciones_Conten_Id',
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE'
// });
// SubseccionesConten.hasMany(ArchivosConten, {
//     foreignKey: 'Subsecciones_Conten_Id',
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE'
// });
module.exports = ArchivosConten
