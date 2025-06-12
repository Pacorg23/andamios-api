const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB, process.env.USERNAME_DB, process.env.PASSWORD, {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: process.env.DIALECT, /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
    timezone: process.env.TIMEZONE /* 'America/Mexico_City' */
});

/**
 * @description Verifica la conexión a la base de datos y sincroniza los modelos
 * @returns {Promise<void>}
 */
async function checkDatabaseConnection() {
    try {
        await sequelize.authenticate();

        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }

    try {
        await sequelize.sync();

        console.log('Sincronización de la base de datos realizada correctamente.');
    } catch (error) {
        console.log(error)
        console.error('Error al sincronizar la base de datos:', error.parent.sqlMessage);
        process.exit(1);
    }
}

module.exports = {
    sequelize,
    checkDatabaseConnection
}