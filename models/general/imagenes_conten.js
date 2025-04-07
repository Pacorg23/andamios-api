const { DataTypes } = require('sequelize');
const db = require("../../database/db")
const SeccionesConten = require('./secciones_conten');
const SubseccionesConten = require('./subsecciones_conten');
const CategoriasConten = require('./categorias_conten');

const ImagenesConten = db.sequelize.define('Imagenes_Conten', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Secciones_Conten_Id:{
        type: DataTypes.INTEGER,
        allowNull:true,
        foreignKey: true
    },
    Subsecciones_Conten_Id:{
        type: DataTypes.INTEGER,
        allowNull:true,
        foreignKey: true
    },
    Categorias_Conten_Id:{
        type: DataTypes.INTEGER,
        allowNull:true,
        foreignKey: true
    },
    data:{
        type: DataTypes.TEXT('long'),
        allowNull:false
    },
},{
    timestamps:false
})


ImagenesConten.belongsTo( SeccionesConten, {
    foreignKey: 'Secciones_Conten_Id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
ImagenesConten.belongsTo( SubseccionesConten, {
    foreignKey: 'Subsecciones_Conten_Id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
ImagenesConten.belongsTo( CategoriasConten, {
    foreignKey: 'Categorias_Conten_Id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
SeccionesConten.hasMany(ImagenesConten, {
    foreignKey: 'Secciones_Conten_Id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
SubseccionesConten.hasMany(ImagenesConten, {
    foreignKey: 'Subsecciones_Conten_Id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
CategoriasConten.hasMany(ImagenesConten, {
    foreignKey: 'Categorias_Conten_Id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
module.exports = ImagenesConten
