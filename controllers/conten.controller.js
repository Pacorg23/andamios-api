const Archivos = require('../models/general/archivos_conten')
const Categorias = require('../models/general/categorias_conten')
const Imagenes = require('../models/general/imagenes_conten')
const Secciones = require('../models/general/secciones_conten')
const Subsecciones = require('../models/general/subsecciones_conten')
const Sucursales = require('../models/general/sucursales')
const _ = require('lodash')
const Carrusel = require('../models/conten/carrusel')
const { options } = require('../routes/conten.routing')
const ImagenesConten = require('../models/general/imagenes_conten')

//Archivos
async function initFile(req, res) {

    const { title, Secciones_Conten_Id, Subsecciones_Conten_Id, Categorias_Conten_Id } = req.body

    const data = req.files[0]?.buffer || ""
    try {
        await Archivos.create({
            title,
            Secciones_Conten_Id,
            Subsecciones_Conten_Id,
            Categorias_Conten_Id,
            data: data.toString('base64') ? "data:file/*;base64," + data.toString('base64') : ''
        }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((error) => {
            res.status(500).send('error: ' + error)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function deleteFile(req, res) {
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
        console.log(req.body)
        const { title, tipo, url, description, has_sections, is_active } = req.body
        const img = req.files[0]?.buffer || ""

        var resultError = await Categorias.findOne({ where: { url: url } })
        if (resultError) {
            throw 409; // error de registro duplicado
        }
        await Categorias.create({
            title,
            tipo,
            url,
            description,
            img: img ? "data:image/*;base64," + img.toString('base64') : '',
            has_sections,
            is_active
        }, { returning: true }).then((result) => {
            res.status(200).json(result)
        }).catch((error) => {
            res.status(500).send('error: ' + error)
            console.log(error)
        })
    } catch (error) {
        if (error == 409) {

            res.status(409).send('error:  error de registro duplicado')
        } else {

            res.status(500).send('error: ' + error)
        }
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
    const { id, title, tipo, url, has_sections, is_active, description } = req.body
    const img = req.files[0]?.buffer || ""
    try {
        await Categorias.update({
            title,
            tipo,
            url,
            description,
            img: img ? "data:image/*;base64," + img.toString('base64') : '',
            has_sections,
            is_active
        }, { where: { id: id }, returning: true }).then((result) => {
            console.log(result[1])
            res.status(200).json(result)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function getCategoriesById(req, res) {
    const { id } = req.params
    try {
        const categoria = await Categorias.findOne({ where: { id: id } });

        const imagenesCategoria = await ImagenesConten.findAll({ where: { Categorias_Conten_Id: id } })

        const response = [categoria]
            .map(categoria => ({
                id: categoria.id,
                title: categoria.title,
                tipo: categoria.tipo,
                is_active: categoria.is_active,
                is_default: categoria.is_default,
                has_sections: categoria.has_sections,
                url: categoria.url,
                img: categoria.img,
                description: categoria.description,
                imgs: imagenesCategoria ? imagenesCategoria
                    .map(imagen => ({
                        id: imagen.id,
                        data: imagen.data ? imagen.data : ''
                    })) : ''
            }))
        return res.status(200).json(response[0])
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function getCategories(req, res) {
    const { id } = req.params

    try {
        await Categorias.findAll({
            where: { is_active: 1 },
            attributes: ["id", "title", "url", "tipo", "is_active", "has_sections", "is_default"],

        }).then((result) => {
            res.status(200).json(result)
        }).catch(() => {
            res.status(500).json({ message: "No existe registro" })
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
//Imagenes
async function initImage(req, res) {

    const { title, Secciones_Conten_Id, Subsecciones_Conten_Id, Categorias_Conten_Id } = req.body

    const data = req.files[0]?.buffer || ""
    console.log("title, Secciones_Conten_Id, Subsecciones_Conten_Id, Categorias_Conten_Id")
    console.log(title, Secciones_Conten_Id, Subsecciones_Conten_Id, Categorias_Conten_Id)
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
async function deleteImage(req, res) {
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
async function getImagesByCategoryId(req, res) {
    const { id } = req.params
    try {
        await Imagenes.findAll({ where: { Categorias_Conten_Id: id } }).then((rows) => {
            res.status(200).json(rows)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function restartImagesCategory(req, res) {
    const { id } = req.params
    try {
        await Imagenes.destroy({ where: { Categorias_Conten_Id: id } }).then((rows) => {
            res.status(200).json(rows)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function restartImagesSection(req, res) {
    const { id } = req.params
    try {
        await Imagenes.destroy({ where: { Secciones_Conten_Id: id } }).then((rows) => {
            res.status(200).json(rows)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function restartImagesSubsection(req, res) {
    const { id } = req.params
    try {
        await Imagenes.destroy({ where: { Subsecciones_Conten_Id: id } }).then((rows) => {
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
async function initSection(req, res) {
    const { title, url, description, Categorias_Id } = req.body
    const img = req.files[0]?.buffer || ""
    const file = req.files[1]?.buffer || ""
    try {
        var resultError = await Secciones.findOne({ where: { url: url } })
        if (resultError) {
            throw 409; // error de registro duplicado
        }
        await Secciones.create({
            title,
            url,
            description,
            Categorias_Id,
            img: img ? "data:image/*;base64," + img.toString('base64') : '',
            file: file ? file.toString('base64') : '',
        }).then((result) => {
            console.log(result.id)
            res.status(200).json({ id: result.id, message: "ok" })
        }).catch((error) => {
            res.status(500).send('error: ' + error)
        })
    } catch (error) {
        console.log(error)
        if (error == 409) {

            res.status(409).send('error:  error de registro duplicado')
        } else {

            res.status(500).send('error: ' + error)
        }
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
async function setSection(req, res) {
    const { id, title, url, description } = req.body
    const img = req.files[0]?.buffer || ""
    const file = req.files[1]?.buffer || ""

    try {
        await Secciones.update({
            title,
            url,
            description,
            img: img ? "data:image/*;base64," + img.toString('base64') : '',
            file: file ? file.toString('base64') : '',
        }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function getSectionById(req, res) {
    const { id } = req.params
    console.log("test")
    try {
        const secciones = await Secciones.findOne({
            where: { id: id }
        });
        const file = await Archivos.findOne({
            where: { Secciones_Conten_Id: id }
        }) || [];
        const imgs = await Imagenes.findAll({
            where: { Secciones_Conten_Id: id }
        }) || [];

        res.status(200).json([{
            ...
            secciones.toJSON(),
            file: file.data,
            imgs
        }]);
        console.log(secciones)
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function getSectionsByFatherId(req, res) {

    try {
        const { id } = req.params
        await Secciones.findAll({ where: { Categorias_Id: id }, attributes: ["id", "title", "url", "description", "Categorias_Id"] }).then((result) => {
            res.status(200).json(result)
        }).catch(() => {
            res.status(500).json({ message: "No existe registro" })
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function getSectionInfo(req, res) {
    const { id } = req.params
    console.log(id)
    try {
        const secciones = await Secciones.findOne({
            where: { id: id },
            attributes: ["id", "title", "url", "Categorias_Id"]
        });
        res.status(200).send(secciones)
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
//Subsecciones
async function initSubsection(req, res) {
    const { title, url, description, Secciones_Conten_Id } = req.body
    const img = req.files[0]?.buffer || ""
    const file = req.files[1]?.buffer || ""
    console.log(title, description, Secciones_Conten_Id)

    var resultError = await Subsecciones.findOne({ where: { url: url } })
    if (resultError) {
        throw 409; // error de registro duplicado
    }
    try {
        await Subsecciones.create({
            title,
            url,
            description,
            Secciones_Conten_Id,
            img: img ? "data:image/*;base64," + img.toString('base64') : '',
            file: file ? file.toString('base64') : '',
        }, { returning: true }).then((result) => {
            res.status(200).json(result)
        }).catch((error) => {
            console.log(error)
            res.status(500).send('error: ' + error)
        })
    } catch (error) {
        if (error == 409) {

            res.status(409).send('error:  error de registro duplicado')
        } else {

            res.status(500).send('error: ' + error)
        }
    }
}
async function deleteSubsection(req, res) {
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
async function setSubsection(req, res) {
    const { id, title, description } = req.body
    // console.log(id, title, descripcion)
    const img = req.files[0]?.buffer || ""
    const file = req.files[1]?.buffer || ""

    try {
        await Subsecciones.update({
            title,
            description,
            file,
            img: img ? "data:image/*;base64," + img.toString('base64') : '',
            file: file ? file.toString('base64') : '',

        }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function getSubsectionsByFatherId(req, res) {
    try {
        const { id } = req.params
        await Subsecciones.findAll({ where: { Secciones_Conten_Id: id }, attributes: ["id", "title", "url"] }).then((result) => {
            res.status(200).json(result)
        }).catch(() => {
            res.status(500).json({ message: "No existe registro" })
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function getSubsectionsById(req, res) {
    const { id } = req.params
    try {
        const subseccion = await Subsecciones.findOne({
            where: { id: id }
        });
        const file = await Archivos.findOne({
            where: { Subsecciones_Conten_Id: id }
        }) || [];
        const imgs = await Imagenes.findAll({
            where: { Subsecciones_Conten_Id: id }
        }) || [];

        res.status(200).json([{
            ...
            subseccion.toJSON(),
            file: file.data,
            imgs
        }]);
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

async function obtenerSucursales(req, res) {
    try {
        await Sucursales.findAll().then((rows) => {
            res.status(200).json(rows)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function agregarSucursales(req, res) {
    try {
        const { nombre, direccion, descripcion } = req.body;
        const imagen = _.head(req.files);

        await Sucursales.create({
            nombre,
            direccion,
            descripcion,
            imagen: imagen ? "data:image/*;base64," + imagen.buffer.toString('base64') : ''
        }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((error) => {
            res.status(500).send('error: ' + error)
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function eliminarSucursales(req, res) {
    const { id } = req.params;

    try {
        await Sucursales.findByPk(id).then((result) => {
            Sucursales.destroy({ where: { id: result.id } }).then(() => {
                res.status(200).json({ message: "ok" })
            })
        }).catch(() => {
            res.status(500).json({ message: "No existe registro" })
        })
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function modificarSucursales(req, res) {
    const { id, nombre, direccion, descripcion } = req.body;
    const imagen = _.head(req.files);

    try {

        if (!_.isNil(imagen)) {
            await Sucursales.update({
                nombre,
                direccion,
                descripcion,
                imagen: imagen ? "data:image/*;base64," + imagen.buffer.toString('base64') : ''
            }, { where: { id: id } }).then(() => {
                res.status(200).json({ message: "ok" })
            })
        } else {
            await Sucursales.update({
                nombre,
                direccion,
                descripcion
            }, { where: { id: id } }).then(() => {
                res.status(200).json({ message: "ok" })
            })
        }
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

async function agregarCarrusel(req, res) {
    try {
        console.log(req.body)
        console.log(req.files)
        const { needsAction, action } = req.body;
        const images = req.files;

        await Carrusel.create({
            filename: images[0].originalname,
            file: images[0] ? "data:image/*;base64," + images[0].buffer.toString('base64') : '',
            fileResponsive: images[1] ? "data:image/*;base64," + images[1].buffer.toString('base64') : '',
            needsAction: needsAction ?? false,
            action: action ?? ""
        }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((error) => {
            res.status(500).send('error: ' + error)
        });
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function editarCarrusel(req, res) {
    const { id, needsAction, action } = req.body;
    const images = req.files;

    try {
        if (!_.isEmpty(images)) {
            await Carrusel.update({
                filename: images[0].originalname,
                file: images[0] ? "data:image/*;base64," + images[0].buffer.toString('base64') : '',
                fileResponsive: images[1] ? "data:image/*;base64," + images[1].buffer.toString('base64') : '',
                needsAction,
                action
            }, { where: { id: id } }).then(() => {
                res.status(200).json({ message: "ok" })
            })
        } else {
            await Carrusel.update({
                needsAction,
                action
            }, { where: { id: id } }).then(() => {
                res.status(200).json({ message: "ok" })
            })
        }
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

module.exports = {
    //Conten
    initCategory,
    initFile,
    initImage,
    initSection,
    initSubsection,
    deleteFile,
    deleteCategories,
    deleteImage,
    restartImagesCategory,
    restartImagesSection,
    restartImagesSubsection,
    eliminarSecciones,
    deleteSubsection,
    modificarArchivos,
    setCategory,
    modificarImagenes,
    setSection,
    setSubsection,
    obtenerArchivosCategoria,
    obtenerArchivosSeccion,
    obtenerArchivosSubsecciones,
    getCategoriesById,
    getCategories,
    getImagesByCategoryId,
    obtenerImagenesSeccion,
    obtenerImagenesSubsecciones,
    getSectionById,
    getSectionsByFatherId,
    getSubsectionsById,
    getSubsectionsByFatherId,
    agregarSucursales,
    obtenerSucursales,
    eliminarSucursales,
    modificarSucursales,
    obtenerCarrusel,
    agregarCarrusel,
    eliminarCarrusel,
    editarCarrusel,
    getSectionInfo,
}
