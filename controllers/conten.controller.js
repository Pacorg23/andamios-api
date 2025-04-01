const Archivos = require('../models/general/archivos_conten')
const Categorias = require('../models/general/categorias_conten')
const Imagenes = require('../models/general/imagenes_conten')
const Secciones = require('../models/general/secciones_conten')
const Subsecciones = require('../models/general/subsecciones_conten')

//Archivos
async function agregarArchivos(req, res) {

    const { title, Secciones_Conten_Id, Subsecciones_Conten_Id, Categorias_Conten_Id, data } = req.body
    try {
        await Archivos.create({
            title,
            Secciones_Conten_Id,
            Subsecciones_Conten_Id,
            Categorias_Conten_Id,
            data: data.toString('base64') ? "data:image/*;base64," + data.toString('base64') : ''
        }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((error) => {
            res.status(500).send('error: ' + error)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function eliminarArchivos(req, res) {
    const { id } = req.params

    try {
        await Archivos.findByPk(id).then((result) => {
            Archivos.destroy({ where: { id: result.id } }).then(() => {
                res.status(200).json({ message: "ok" })
            })
        }).catch(() => {
            res.status(500).json({ message: "No existe registro" })
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function modificarArchivos(req, res) {
    const { id, title, Secciones_Conten_Id, Subsecciones_Conten_Id, Categorias_Conten_Id, data } = req.body
    try {
        await Archivos.update({
            title,
            Secciones_Conten_Id,
            Subsecciones_Conten_Id,
            Categorias_Conten_Id,
            data: data.toString('base64') ? "data:image/*;base64," + data.toString('base64') : ''
        }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function obtenerArchivosCategoria(req, res) {
    const { categoriaId } = req.params
    try {
        await Archivos.findOne({ where: { Categorias_Conten_Id: categoriaId } }).then((rows) => {
            res.status(200).json(rows)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function obtenerArchivosSeccion(req, res) {
    const { seccionId } = req.params
    try {
        await Archivos.findOne({ where: { Secciones_Conten_Id: seccionId } }).then((rows) => {
            res.status(200).json(rows)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function obtenerArchivosSubsecciones(req, res) {
    const { subseccionesId } = req.params
    try {
        await Archivos.findOne({ where: { Subsecciones_Conten_Id: subseccionesId } }).then((rows) => {
            res.status(200).json(rows)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
//Categorias
async function initCategory(req, res) {
    try {
        const { title, tipo, url, description } = req.body
        const img = req.files[0].buffer
        console.log(req.body)
        console.log(req.files[0].buffer)
        await Categorias.create({
            title,
            tipo,
            url,
            description,
            img: img ? "data:image/*;base64," + img.toString('base64') : '',
            }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((error) => {
            res.status(500).send('error: ' + error)
            console.log(error)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function deleteCategories(req, res) {
    const { id } = req.params

    try {
        await Categorias.findByPk(id).then((result) => {
            Categorias.destroy({ where: { id: result.id } }).then(() => {
                res.status(200).json({ message: "ok" })
            })
        }).catch(() => {
            res.status(500).json({ message: "No existe registro" })
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function setCategory(req, res) {
    const { id, title, tipo, url, description, img } = req.body
    console.log(id, title, tipo, url, description, img)
    try {
        await Categorias.update({
            title,
            tipo,
            url,
            description,
            img: img ? "data:image/*;base64," + img.toString('base64') : ''
        }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function getCategoriesById(req, res) {
    const { id } = req.params

    try {
        await Categorias.findAll({ where: { id: id }}).then((result) => {
            res.status(200).json(result)            
        }).catch(() => {
            res.status(500).json({ message: "No existe registro" })
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function getCategories(req, res) {
    const { id } = req.params

    try {
        await Categorias.findAll().then((result) => {
            res.status(200).json(result)            
        }).catch(() => {
            res.status(500).json({ message: "No existe registro" })
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
//Imagenes
async function agregarImagenes(req, res) {

    const { title, Secciones_Conten_Id, Subsecciones_Conten_Id, Categorias_Conten_Id, data } = req.body
    try {
        await Imagenes.create({
            title,
            Secciones_Conten_Id,
            Subsecciones_Conten_Id,
            Categorias_Conten_Id,
            data: data.toString('base64') ? "data:image/*;base64," + data.toString('base64') : ''
        }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((error) => {
            res.status(500).send('error: ' + error)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function eliminarImagenes(req, res) {
    const { id } = req.params

    try {
        await Imagenes.findByPk(id).then((result) => {
            Imagenes.destroy({ where: { id: result.id } }).then(() => {
                res.status(200).json({ message: "ok" })
            })
        }).catch(() => {
            res.status(500).json({ message: "No existe registro" })
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function modificarImagenes(req, res) {
    const { id } = req.body

    try {
        await Imagenes.update({
            title,
            Secciones_Conten_Id,
            Subsecciones_Conten_Id,
            Categorias_Conten_Id,
            data: data.toString('base64') ? "data:image/*;base64," + data.toString('base64') : ''
        }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function obtenerImagenesCategoria(req, res) {
    const { categoriaId } = req.params
    try {
        await Imagenes.findOne({ where: { Categorias_Conten_Id: categoriaId } }).then((rows) => {
            res.status(200).json(rows)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function obtenerImagenesSeccion(req, res) {
    const { seccionId } = req.params
    try {
        await Imagenes.findOne({ where: { Secciones_Conten_Id: seccionId } }).then((rows) => {
            res.status(200).json(rows)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function obtenerImagenesSubsecciones(req, res) {
    const { subseccionesId } = req.params
    try {
        await Imagenes.findOne({ where: { Subsecciones_Conten_Id: subseccionesId } }).then((rows) => {
            res.status(200).json(rows)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
//Secciones
async function agregarSecciones(req, res) {
    const { title, url, Categorias_Id } = req.body

    try {
        await Secciones.create({
            title,
            url,
            Categorias_Id 
        }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((error) => {
            res.status(500).send('error: ' + error)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function eliminarSecciones(req, res) {
    const { id } = req.params

    try {
        await Secciones.findByPk(id).then((result) => {
            Secciones.destroy({ where: { id: result.id } }).then(() => {
                res.status(200).json({ message: "ok" })
            })
        }).catch(() => {
            res.status(500).json({ message: "No existe registro" })
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function modificarSecciones(req, res) {
    const { id, title, url, Categorias_Id } = req.body

    try {
        await Secciones.update({
            title,
            url,
            Categorias_Id 
        }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function obtenerSecciones(req, res) {
    try {
        await Secciones.findAll().then((rows) => {
            res.status(200).json(rows)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function getSectionsById(req, res) {
    const { id } = req.params

    try {
        await Secciones.findAll({ where: { Categorias_Id: id }}).then((result) => {
            res.status(200).json(result)            
        }).catch(() => {
            res.status(500).json({ message: "No existe registro" })
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
//Subsecciones
async function agregarSubsecciones(req, res) {
    const {title, descripcion, Secciones_Conten_Id} = req.body
    try {
        await Subsecciones.create({
            title,
            descripcion,
            Secciones_Conten_Id,
        }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((error) => {
            res.status(500).send('error: ' + error)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function eliminarSubsecciones(req, res) {
    const { id } = req.params

    try {
        await Subsecciones.findByPk(id).then((result) => {
            Subsecciones.destroy({ where: { id: result.id } }).then(() => {
                res.status(200).json({ message: "ok" })
            })
        }).catch(() => {
            res.status(500).json({ message: "No existe registro" })
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function modificarSubsecciones(req, res) {
    const {id, title, descripcion, Secciones_Conten_Id} = req.body

    try {
        await Subsecciones.update({
            title,
            descripcion,
            Secciones_Conten_Id
        }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function obtenerSubsecciones(req, res) {
    try {
        await Subsecciones.findAll().then((rows) => {
            res.status(200).json(rows)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function test(req, res) {
    try {
        res.status(200)
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

module.exports = {
    //Conten
    initCategory,
    agregarArchivos,
    agregarImagenes,
    agregarSecciones,
    agregarSubsecciones,
    eliminarArchivos,
    deleteCategories,
    eliminarImagenes,
    eliminarSecciones,
    eliminarSubsecciones,
    modificarArchivos,
    setCategory,
    modificarImagenes,
    modificarSecciones,
    modificarSubsecciones,
    obtenerArchivosCategoria,
    obtenerArchivosSeccion,
    obtenerArchivosSubsecciones,
    getCategoriesById,
    getCategories,
    obtenerImagenesCategoria,
    obtenerImagenesSeccion,
    obtenerImagenesSubsecciones,
    obtenerSecciones,
    getSectionsById,
    obtenerSubsecciones,
}
