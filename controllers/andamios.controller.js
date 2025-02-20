const Carrusel = require('../models/andamios/carrusel')
const Anuncio = require('../models/andamios/anuncio')

//CARRUSEL
async function agregarCarrusel(req, res) {

    try {
        await Carrusel.create({
            filename: req.files[0].originalname,
            file: "data:image/*;base64," + req.files[0].buffer.toString('base64'),
            fileResponsive: "data:image/*;base64," + req.files[1].buffer.toString('base64')
        }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((error) => {
            res.status(500).send('error: ' + error)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function eliminarCarrusel(req, res) {
    const { id } = req.params

    try {
        await Carrusel.findByPk(id).then((result) => {
            Carrusel.destroy({ where: { id: result.id } }).then(() => {
                res.status(200).json({ message: "ok" })
            })
        }).catch(() => {
            res.status(500).json({ message: "No existe registro" })
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function modificarCarrusel(req, res) {
    const { id } = req.body

    try {
        await Carrusel.update({
            filename: req.files[0].originalname,
            file: "data:image/*;base64," + req.files[0].buffer.toString('base64'),
            fileResponsive: "data:image/*;base64," + req.files[1].buffer.toString('base64')
        }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function obtenerCarrusel(req, res) {
    try {
        await Carrusel.findAll().then((rows) => {
            res.status(200).json(rows)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

//ANUNCIO
async function crearAnuncio(req, res) {

    const { text, hasBtn, btnText, url } = req.body

    try {
        await Anuncio.create({ text: text, hasBtn: hasBtn, btnText: btnText, url: url }).then(() => {
            res.status(200).json({ message: "ok" })
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function obtenerAnuncio(req, res) {
    try {
        await Anuncio.findAll().then((result) => {
            res.status(200).send(result[0])
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function modificarAnuncio(req, res) {

    const { id, text, hasBtn, btnText, url } = req.body

    try {

        await Anuncio.update({ text: text, hasBtn: hasBtn, btnText: btnText, url: url }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((error) => {
            res.status(500).send('error: ' + error)
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function eliminarAnuncio(req, res) {
    const { id } = req.params

    try {
        await Anuncio.destroy({ where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}



module.exports = {
    //Carrusel
    agregarCarrusel,
    eliminarCarrusel,
    modificarCarrusel,
    obtenerCarrusel,
    //Anuncio
    crearAnuncio,
    obtenerAnuncio,
    modificarAnuncio,
    eliminarAnuncio
}
