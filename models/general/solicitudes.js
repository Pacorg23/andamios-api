const { DataTypes } = require('sequelize');
const db = require("../../database/db")

const Solicitudes = db.sequelize.define('Solicitudes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    escolaridad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //CV INFO
    filename:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    file: {
      type: DataTypes.TEXT('long'), // Puedes ajustar según tu necesidad, también puedes usar DataTypes.BLOB para almacenar el contenido directamente
      allowNull: false,
    },
    division: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{
    timestamps: true,
    createdAt:true,
    updatedAt:false
  });
  
  module.exports = Solicitudes;