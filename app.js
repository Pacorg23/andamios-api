const express = require('express');
const app = express()
const cors = require('cors')
const db = require("./database/db")
const seed = require("./database/seed")
const conten = require('./routes/conten.routing');
require('dotenv').config()

//rutas
const general = require('./routes/general.routing');
const andamios = require('./routes/andamios.routing');
const admin = require('./routes/admin.routing');
const api = require('./routes/api.routing');

db.checkDatabaseConnection().then(() => {
    app.use(cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }))

    seed.seedAdminUser();
    seed.seedDefaultCategories();

    app.use('/general', general);
    app.use('/andamios', andamios);
    app.use('/admin', admin);
    app.use('/api', api); // -> CLIENT
    app.use('/conten', conten); //-> ADMIN

    app.use('/liveness', (req, res) => {
        res.status(200).json({
            message: "Esta viva la aplicacion\n"
        })
    });

    app.use('/', (req, res) => {
        res.status(200).json({
            message: "Bienvenido a la API de Andamios"
        })
    });

    /* INICIA EL SERVIDOR CON HTTP POR EL SOCKET*/
    app.listen(process.env.PORT_SYS, function () {
        console.log("Server On "+process.env.PORT_SYS);
    })
}).catch(error => {
    console.log("DB error- " + error)
})

