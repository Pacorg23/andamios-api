const Categorias = require("../models/general/categorias")
const Secciones = require("../models/general/secciones")
const Subsecciones = require("../models/general/subsecciones")
const Imagenes_Seccion = require("../models/general/imagenes_seccion")
const Archivos_Seccion = require("../models/general/archivos_seccion")
const Imagenes_Subseccion = require("../models/general/imagenes_subseccion")
const Archivos_Subseccion = require("../models/general/archivos_subseccion")
const Contactos = require("../models/general/contactos")
const Solicitudes = require("../models/general/solicitudes")
const Sucursales = require("../models/general/sucursales")
const Imagenes_Sucursales = require("../models/general/imagenes_sucursales")
const Comunicados = require("../models/proveedores")
const Archivos = require("../models/archivos")
//"data:image/*;base64," +

const ImageValidator = require("../common/validator")

//CATEGORIAS
async function crearCategoria(req, res) {
    try {
        const { nombre, tipo, url, area, mostrar_inicio } = req.body
        const file = req.files[0]

        if (file) {
            await Categorias.create({
                nombre: nombre, tipo: tipo, url: url, area: area,
                mostrar_inicio: mostrar_inicio,
                banner: "data:image/*;base64," + file.buffer.toString("base64")
            }).then(() => {
                res.status(200).json({ message: "Categoria creada" })
            }).catch((error) => {
                res.status(500).json({ message: "Error al crear categoria: " + error })
            })
        } else {
            await Categorias.create({
                nombre: nombre, tipo: tipo, url: url, area: area,
                mostrar_inicio: mostrar_inicio
            }).then(() => {
                res.status(200).json({ message: "Categoria creada" })
            }).catch((error) => {
                res.status(500).json({ message: "Error al crear categoria: " + error })
            })
        }

    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }
}

async function obtenerCategoria(req, res) {
    try {
        const { id } = req.params

        await Categorias.findOne({ where: { id: id } }).then((categoria) => {
            res.status(200).json(categoria)
        }).catch((error) => {
            res.status(500).json({ message: "Error al obtener categoria: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }

}

async function modificarCategoria(req, res) {
    try {
        const { id, nombre, tipo, url, area, mostrar_inicio } = req.body
        const file = req.files[0]

        if (file) {
            await Categorias.update({
                nombre: nombre, tipo: tipo, url: url, area: area,
                mostrar_inicio: mostrar_inicio,
                banner: "data:image/*;base64," + file.buffer.toString("base64")
            }, { where: { id: id } }).then(() => {
                res.status(200).json({ message: "Categoria modificada" })
            }).catch((error) => {
                res.status(500).json({ message: "Error al modificar categoria: " + error })
            })
        } else {
            await Categorias.update({
                nombre: nombre, tipo: tipo, url: url, area: area,
                mostrar_inicio: mostrar_inicio, banner: null
            }, { where: { id: id } }).then(() => {
                res.status(200).json({ message: "Categoria modificada" })
            }).catch((error) => {
                res.status(500).json({ message: "Error al modificar categoria: " + error })
            })
        }

    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }
}

async function eliminarCategoria(req, res) {
    try {
        const { id } = req.params

        await Categorias.destroy({ where: { id: id } }).then(() => {
            res.status(200).json({ message: "Categoria eliminada" })
        }).catch((error) => {
            res.status(500).json({ message: "Error al eliminar categoria: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }
}

/*
Secciones
Se tienen 3 solicitudes, por parte del cliente 
Se crea la seccion luego se agrega imagenes a la tabla imagenes
Finalmente si hay pdf se agrega a la tabla pdf
*/

/**
 * @description Crea una seccion dependiendo el tipo de categoria
 * @param {Object} req (nombre, url, descripcion, mostrar_inicio, imagen_inicio, btn_pdf, btn_contacto, categoria, tipo, isTitle)
 * @param {Object} res
 */
async function crearSeccion(req, res) { //requiere id de categoria, tipo de la categoria, regresa el id de la seccion
    try {
        //Aqui se debe hacer la diferencia entra agregar un tipo A, B , C o D

        //A Elementos -> id, nombre, url, descripcion, mostrar_inicio, imagen_inicio, btn_pdf, btn_contacto
        //B Galerias -> id, nombre, url, descripcion, imagen_inicio
        //C Listas -> id, nombre, url, descripcion, btn_contacto
        //D Blog -> id, nombre, url, descripcion,img_inicio btn_contacto
        //D tiene otro servicio para cargar un pdf

        const { nombre, url, descripcion, mostrar_inicio, btn_pdf, btn_contacto, categoria, tipo, isTitle } = req.body
        const imagen_inicio = req.files[0]

        let seccion;

        switch (tipo) {
            case "A":
                seccion = await Secciones.create({
                    nombre: nombre, url: url,
                    descripcion: descripcion,
                    mostrar_inicio: mostrar_inicio,
                    imagen_inicio: "data:image/*;base64," + imagen_inicio.buffer.toString('base64'),
                    btn_pdf: btn_pdf, btn_contacto: btn_contacto,
                    categoria: categoria,
                    isTitle: isTitle
                })
                break;
            case "B":
                seccion = await Secciones.create({
                    nombre: nombre, url: url,
                    descripcion: descripcion,
                    imagen_inicio: "data:image/*;base64," + imagen_inicio.buffer.toString('base64'),
                    categoria: categoria,
                    isTitle: isTitle
                })
                break;
            case "C":
                seccion = await Secciones.create({
                    nombre: nombre, url: url,
                    descripcion: descripcion,
                    btn_contacto: btn_contacto,
                    categoria: categoria,
                    isTitle: isTitle
                })
                break;
            case "D":
                seccion = await Secciones.create({
                    nombre: nombre, url: url,
                    descripcion: descripcion, btn_pdf: btn_pdf,
                    imagen_inicio: "data:image/*;base64," + imagen_inicio.buffer.toString('base64'),
                    categoria: categoria,
                    isTitle: isTitle
                })
                break;
            default:
                res.status(500).json({ message: "Tipo de seccion no encontrado" })
                return;
        }

        res.status(200).json({ id_seccion: seccion.id })

    } catch (error) {
        res.status(500).json({ message: "Error de endpoint: " + error })
    }
}
/**
 * @description Obtiene una seccion por id
 * @param {Object} req (id)
 * @param {Object} res
 */
async function obtenerSeccion(req, res) { //obtiene seccion por id
    //combina los archivos y obtiene las imagenes

    try {

        const { id } = req.params

        let data;
        let pdf;
        let imagenes = null;

        const seccion = await Secciones.findOne(
            { where: { id: id } }
        )

        if (seccion) {
            imagenes = await Imagenes_Seccion.findAll(
                { where: { id_seccion: seccion.id } }
            )

            if (seccion.btn_pdf) {
                pdf = await Archivos_Seccion.findOne(
                    { where: { id_elemento: seccion.id } }
                )
            } else {
            }
        }

        data = {
            id: seccion.id,
            nombre: seccion.nombre,
            url: seccion.url,
            descripcion: seccion.descripcion,
            mostrar_inicio: seccion.mostrar_inicio,
            btn_pdf: seccion.btn_pdf,
            btn_contacto: seccion.btn_contacto,
            categoria: seccion.categoria,
            pdf: pdf,
            imagen_inicio: seccion.imagen_inicio,
            imagenes: imagenes,
            isTitle: seccion.isTitle
        }

        res.status(200).send(data)

    } catch (err) {
        res.status(500).json({ message: "Error: " + err })
    }
}

/**
 * @description Modifica una seccion con id
 * @param {Object} req (id, nombre, url, descripcion, mostrar_inicio, imagen_inicio, btn_pdf, btn_contacto, isTitle)
 * @param {Object} res
 */
async function modificarSeccion(req, res) {
    try {
        const { id, nombre, url, descripcion, mostrar_inicio, btn_pdf, btn_contacto, isTitle } = req.body

        const file = req.files[0]

        if (file) {
            await Secciones.update({
                nombre: nombre,
                url: url, descripcion: descripcion,
                mostrar_inicio: mostrar_inicio,
                imagen_inicio: "data:image/*;base64," + file.buffer.toString('base64'),
                btn_pdf: btn_pdf,
                btn_contacto: btn_contacto,
                isTitle: isTitle
            }, { where: { id: id } }).then(() => {
                res.status(200).json({ message: "Seccion modificada" })
            }).catch((error) => {
                res.status(500).json({ message: "Error al modificar seccion: " + error })
            })
        } else {
            await Secciones.update({
                nombre: nombre,
                url: url, descripcion: descripcion,
                mostrar_inicio: mostrar_inicio,
                btn_pdf: btn_pdf,
                btn_contacto: btn_contacto,
                isTitle: isTitle
            }, { where: { id: id } }).then(() => {
                res.status(200).json({ message: "Seccion modificada" })
            }).catch((error) => {
                res.status(500).json({ message: "Error al modificar seccion: " + error })
            })
        }

    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }

}

/**
 * @description Elimina una seccion por id
 * @param {Object} req (id)
 * @param {Object} res
 */
async function eliminarSeccion(req, res) {
    try {
        const { id } = req.params

        await Secciones.destroy({ where: { id: id } }).then(() => {
            res.status(200).json({ message: "Seccion eliminada" })
        }).catch((error) => {
            res.status(500).json({ message: "Error al eliminar seccion: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }
}

//Subsecciones
//get all sections where categoria = id and categoria = A
async function crearSubseccion(req, res) { //requiere id de seccion, solo categorias tipo A tienen subsecciones
    try {

        const { nombre, url, descripcion, btn_pdf, btn_contacto, seccion } = req.body

        await Subsecciones.create({ nombre: nombre, url: url, descripcion: descripcion, btn_pdf: btn_pdf, btn_contacto: btn_contacto, seccion: seccion }).then((subseccion) => {
            res.status(200).json({ id_subseccion: subseccion.id })
        })

    } catch (error) {
        res.status(500).json({ message: "Error de endpoint: " + error })
    }
}

async function obtenerSubseccion(req, res) { //obtiene subseccion por id
    try {
        const { id } = req.params

        let data;
        let pdf;
        let imagenes = null


        const subseccion = await Subsecciones.findOne(
            { where: { id: id } }
        )

        if (subseccion) {
            imagenes = await Imagenes_Subseccion.findAll(
                { where: { id_subseccion: subseccion.id } }
            )

            if (subseccion.btn_pdf) {
                pdf = await Archivos_Subseccion.findOne(
                    { where: { id_elemento: subseccion.id } }
                )
            } else {
            }
        }

        data = {
            id: subseccion.id,
            nombre: subseccion.nombre,
            url: subseccion.url,
            descripcion: subseccion.descripcion,
            btn_pdf: subseccion.btn_pdf,
            btn_contacto: subseccion.btn_contacto,
            pdf: pdf,
            imagenes: imagenes
        }

        res.status(200).send(data)

    } catch (err) {
        res.status(500).json({ message: "Error: " + err })
    }

}

async function modificarSubseccion(req, res) {
    try {
        const { id, nombre, url, descripcion, btn_pdf, btn_contacto } = req.body

        await Subsecciones.update({ nombre: nombre, url: url, descripcion: descripcion, btn_pdf: btn_pdf, btn_contacto: btn_contacto }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "Subseccion modificada" })
        }).catch((error) => {
            res.status(500).json({ message: "Error al modificar subseccion: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }
}

async function eliminarSubseccion(req, res) {
    try {
        const { id } = req.params

        await Subsecciones.destroy({ where: { id: id } }).then(() => {
            res.status(200).json({ message: "Subseccion eliminada" })
        }).catch((error) => {
            res.status(500).json({ message: "Error al eliminar subseccion: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }
}

//IMAGENES SECC
async function agregarImagenASeccion(req, res) {// requiere el id de la seccion
    try {
        const { id_seccion } = req.body
        const files = req.files
        let errors = []
        let error_control = false

        await files.forEach(async (file, index) => {
            if (ImageValidator.verificarImagen(file)) {
                await Imagenes_Seccion.create({ nombre: file.fieldname, file: "data:image/*;base64," + file.buffer.toString('base64'), id_seccion: id_seccion }).then(() => {
                    //res.status(200).json({ message: "Imagen agregada" })
                    errors.push({ message: "Imagen " + index + " agregada" })
                }).catch((error) => {
                    error_control = true
                    //res.status(500).json({ message: "Error al agregar imagen" })
                    errors.push({ message: "Error al agregar imagen " + index })
                })
            } else {
                errors.push({ message: "Error al agregar imagen " + index + " - Formato no valido" })
            }
        })

        if (error_control) {
            res.status(200).json({ message: errors })
        } else {
            res.status(200).json({ message: "Imagenes agregadas con exito" })
        }

    } catch (error) {
        res.status(500).json({ message: "Error de endpoint - No se agrego ninguna imagen" })
    }
}

async function obtenerImagenesSeccion(req, res) {
    try {
        const { id_seccion } = req.params

        await Imagenes_Seccion.findAll({ where: { id_seccion: id_seccion } }).then((imagenes) => {
            res.status(200).send(imagenes)
        }).catch((error) => {
            res.status(500).json({ message: "Error al obtener imagenes: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }

}

async function modificarImagenSecccion(req, res) {
    try {
        const { id } = req.body
        const file = req.files[0]

        await Imagenes_Seccion.update({ nombre: file.fieldname, file: "data:image/*;base64," + file.buffer.toString('base64') }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "Imagen modificada" })
        }).catch((error) => {
            res.status(500).json({ message: "Error al modificar imagen: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }
}

async function eliminarImagenSeccion(req, res) {
    try {
        const { id } = req.params

        await Imagenes_Seccion.destroy({ where: { id: id } }).then(() => {
            res.status(200).json({ message: "Imagen eliminada" })
        }).catch((error) => {
            res.status(500).json({ message: "Error al eliminar imagen: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }
}

//Archivos SEc
async function agregarArchivoASeccion(req, res) {// requiere el id de la seccion
    try {
        const { id_seccion } = req.body
        const file = req.files[0]

        if (ImageValidator.verificarArchivo(file)) {
            await Archivos_Seccion.create({ nombre: file.fieldname, file: file.buffer.toString('base64'), id_elemento: id_seccion }).then(() => {
                res.status(200).json({ message: "Archivo agregado" })
            }).catch((error) => {
                res.status(500).json({ message: "Error al agregar archivo: " + error })
            })
        } else {
            res.status(500).json({ message: "Error al agregar archivo - Formato no valido" })
        }

    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }
}

async function obtenerArchivoSeccion(req, res) {
    try {
        const { id_seccion } = req.params

        await Archivos_Seccion.findOne({ where: { id_elemento: id_seccion } }).then((archivo) => {
            res.status(200).send(archivo)
        }).catch((error) => {
            res.status(500).json({ message: "Error al obtener archivo: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }

}

async function modificarArchivoSeccion(req, res) {
    try {
        const { id } = req.body
        const file = req.files[0]

        await Archivos_Seccion.update({ nombre: file.fieldname, file: file.buffer.toString('base64') }, { where: { id_elemento: id } }).then(() => {
            res.status(200).json({ message: "Archivo modificado" })
        }).catch((error) => {
            res.status(500).json({ message: "Error al modificar archivo: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }

}

async function eliminarArchivoSeccion(req, res) {
    try {
        const { id } = req.params

        await Archivos_Seccion.destroy({ where: { id_elemento: id } }).then(() => {
            res.status(200).json({ message: "Archivo eliminado" })
        }).catch((error) => {
            res.status(500).json({ message: "Error al eliminar archivo: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }

}

//IMAGENES SUBSECCION
async function agregarImagenASubseccion(req, res) { //requiere el id de la subseccion
    try {
        const { id_subseccion } = req.body
        const files = req.files
        let errors = []
        let error_control = false

        await files.forEach(async (file, index) => {
            if (ImageValidator.verificarImagen(file)) {
                await Imagenes_Subseccion.create({ nombre: file.fieldname, file: "data:image/*;base64," + file.buffer.toString('base64'), id_subseccion: id_subseccion }).then(() => {
                    //res.status(200).json({ message: "Imagen agregada" })
                    errors.push({ message: "Imagen " + index + " agregada" })
                }).catch((error) => {
                    error_control = true
                    //res.status(500).json({ message: "Error al agregar imagen" })
                    errors.push({ message: "Error al agregar imagen " + index })
                })
            } else {
                errors.push({ message: "Error al agregar imagen " + index + " - Formato no valido" })
            }
        })

        if (error_control) {
            res.status(200).json({ message: errors })
        } else {
            res.status(200).json({ message: "Imagenes agregadas con exito" })
        }

    } catch (error) {
        res.status(500).json({ message: "Error de endpoint - No se agrego ninguna imagen" })
    }

}

async function obtenerImagenesSubseccion(req, res) {
    try {
        const { id_subseccion } = req.params

        await Imagenes_Subseccion.findAll({ where: { id_subseccion: id_subseccion } }).then((imagenes) => {
            res.status(200).send(imagenes)
        }).catch((error) => {
            res.status(500).json({ message: "Error al obtener imagenes: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }

}

async function modificarImagenSubseccion(req, res) {
    try {
        const { id } = req.body
        const file = req.files[0]

        await Imagenes_Subseccion.update({ nombre: file.fieldname, file: "data:image/*;base64," + file.buffer.toString('base64') }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "Imagen modificada" })
        }).catch((error) => {
            res.status(500).json({ message: "Error al modificar imagen: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }
}

async function eliminarImagenSubseccion(req, res) {
    try {
        const { id } = req.params

        await Imagenes_Subseccion.destroy({ where: { id: id } }).then(() => {
            res.status(200).json({ message: "Imagen eliminada" })
        }).catch((error) => {
            res.status(500).json({ message: "Error al eliminar imagen: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }
}

//ARCHIVOS SUBSECCION
async function agregarArchivoASubseccion(req, res) { //requiere el id de la subseccion
    try {
        const { id_subseccion } = req.body
        const file = req.files[0]

        if (ImageValidator.verificarArchivo(file)) {
            await Archivos_Subseccion.create({ nombre: file.fieldname, file: file.buffer.toString('base64'), id_elemento: id_subseccion }).then(() => {
                res.status(200).json({ message: "Archivo agregado" })
            }).catch((error) => {
                res.status(500).json({ message: "Error al agregar archivo: " + error })
            })
        } else {
            res.status(500).json({ message: "Error al agregar archivo - Formato no valido" })
        }

    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }
}

async function obtenerArchivoSubseccion(req, res) {
    try {
        const { id_subseccion } = req.params

        await Archivos_Subseccion.findOne({ where: { id_elemento: id_subseccion } }).then((archivo) => {
            res.status(200).send(archivo)
        }).catch((error) => {
            res.status(500).json({ message: "Error al obtener archivo: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }


}

async function modificarArchivoSubseccion(req, res) {
    try {
        const { id } = req.body
        const file = req.files[0]

        await Archivos_Subseccion.update({ nombre: file.fieldname, file: file.buffer.toString('base64') }, { where: { id_elemento: id } }).then(() => {
            res.status(200).json({ message: "Archivo modificado" })
        }).catch((error) => {
            res.status(500).json({ message: "Error al modificar archivo: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }


}

async function eliminarArchivoSubseccion(req, res) {
    try {
        const { id } = req.params

        await Archivos_Subseccion.destroy({ where: { id_elemento: id } }).then(() => {
            res.status(200).json({ message: "Archivo eliminado" })
        }).catch((error) => {
            res.status(500).json({ message: "Error al eliminar archivo: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }

}

async function obtenerCategorias(req, res) {
    try {
        await Categorias.findAll().then((categorias) => {
            res.status(200).send(categorias)
        }).catch((error) => {
            res.status(500).json({ message: "Error al obtener categorias: " + error })
        })
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint" })
    }
}

//GENERALES
//NAVBAR
async function navbar(req, res) {
    try {

        const { area } = req.params

        const categorias = await Categorias.findAll({
            attributes: ['id', 'nombre', 'tipo'],
            where: { area: area },
        });
        const navbar = [];

        for (const categoria of categorias) {
            const seccionesYSubsecciones = await obtenerSeccionesYSubsecciones(categoria.id);

            navbar.push({
                idCategoria: categoria.id,
                nombreCategoria: categoria.nombre,
                tipoCategoria: categoria.tipo,
                secciones: seccionesYSubsecciones,
            });
        }

        res.status(200).send(navbar);
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint: " + error });
    }
}

async function obtenerSeccionesYSubsecciones(idCategoria) {
    const secciones = await Secciones.findAll({
        where: { categoria: idCategoria },
        attributes: ['id', 'nombre'],
    });

    const seccionesConSubsecciones = [];

    for (const seccion of secciones) {
        const subsecciones = await Subsecciones.findAll({
            where: { seccion: seccion.id },
            attributes: ['id', 'nombre'],
        });

        seccionesConSubsecciones.push({
            idSeccion: seccion.id,
            nombreSeccion: seccion.nombre,
            subsecciones: subsecciones,
        });
    }

    return seccionesConSubsecciones;
}

//CONTACTO  
async function obtenerSolicitudesContacto(req, res) {
    try {
        const { area } = req.params
        await Contactos.findAll({ where: { area: area } }).then((rows) => {
            const solicitudes = rows.map(soli => ({
                id: soli.id,
                nombre: soli.nombre,
                empresa: soli.empresa,
                opcion: soli.opcion,
                createdAt: soli.createdAt
            }));
            res.status(200).send(solicitudes)
        })
    } catch (err) {
        res.status(500).json({ message: "error :" + err })
    }
}

async function obtenerSolicitudContacto(req, res) {
    try {
        const { id } = req.params

        await Contactos.findOne({ where: { id: id } }).then((rows) => {
            res.status(200).send(rows)
        })
    } catch (err) {
        res.status(500).json({ message: "error" })
    }
}

async function eliminarSolicitudContacto(req, res) {
    try {
        const { id } = req.params

        await Contactos.destroy({ where: { id: id } }).then(() => {
            res.status(200).json({ message: "Solicitud eliminada" })
        }).catch((error) => {
            res.status(500).json({ message: "Error al eliminar solicitud: " + error })
        })
    } catch (err) {
        res.status(500).json({ message: "Error" })
    }

}

//SOLICITUDES
//TODO buscar por division
async function obtenerSolicitudes(req, res) { //obtener solicitudes de trabajo
    try {

        const { division } = req.params

        await Solicitudes.findAll().then(result => {
            res.status(200).send(result)

        }).catch((error) => {
            console.log(error)
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function eliminarSolicitud(req, res) {

    const { id } = req.params

    try {
        await Solicitudes.destroy({ where: { id: id } }).then(() => {
            res.status(200).json({ message: "correcto" })
        })

    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

//Sucursales
async function crearSucursal(req, res) {
    try {

        const { nombre, direccion, maps, telefono, division } = req.body

        await Sucursales.create({ nombre: nombre, direccion: direccion, maps: maps, telefono: telefono, division: division }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((err) => {
            res.status(500).send({ message: "error: " + err })
        })


    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function obtenerSucursales(req, res) {
    try {
        const { division } = req.params

        await Sucursales.findAll({ where: { division: division } }).then((rows) => {
            res.status(200).send(rows)
        }).catch((err) => {
            res.status(500).json({ message: err })
        })
    } catch (err) {
        res.status(500).json({ message: "error" })
    }
}

async function eliminarSucursal(req, res) {
    try {
        const id = req.params.id

        await Sucursales.destroy({ where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        })

    } catch (err) {
        res.status(500).json({ message: "error" })
    }
}

async function modificarSucursal(req, res) {

    try {
        const { id, nombre, direccion, maps, telefono } = req.body

        await Sucursales.update({ nombre: nombre, direccion: direccion, maps: maps, telefonos: telefono }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((err) => {
            res.status(500).json({ message: "error: " + err })
        })

    } catch (err) {
        res.status(500).json({ message: "error: " + err })
    }
}

//IMAGENES SUCURSALES
async function obtenerImagenSucursal(req, res) {
    try {
        const { id, main, division } = req.body

        if (main === true) {
            await Imagenes_Sucursales.findAll({ where: { main: true, division: division } }).then((rows) => {
                res.status(200).send(rows)
            }).catch((err) => {
                res.status(500).json({ message: err })
            })
        } else {
            await Imagenes_Sucursales.findAll({ where: { id_sucursal: id, division: division } }).then((rows) => {
                res.status(200).send(rows)
            }).catch((err) => {
                res.status(500).json({ message: err })
            })
        }


    } catch (err) {
        res.status(500).json({ message: "error" })
    }

}

async function agregarImagenSucursal(req, res) {
    try {
        const { id_sucursal, main, division } = req.body
        const file = req.files[0]

        await Imagenes_Sucursales.create({ nombre: file.fieldname, file: "data:image/*;base64," + file.buffer.toString('base64'), id_sucursal: id_sucursal, main: Boolean(main), division: division }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((err) => {
            res.status(500).json({ message: "error: " + err })
        })

    } catch (err) {
        res.status(500).json({ message: "error" })
    }

}

async function modificarImagenSucursal(req, res) {
    try {
        const { id, main } = req.body
        const file = req.files[0]

        await Imagenes_Sucursales.update({ nombre: file.fieldname, file: "data:image/*;base64," + file.buffer.toString('base64'), main: Boolean(main) }, { where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((err) => {
            res.status(500).json({ message: "error: " + err })
        })

    } catch (err) {
        res.status(500).json({ message: "error" })
    }
}

//Comunicados
async function obtenerComunicados(req, res) {
    try {
        await Comunicados.findAll().then((rows) => {
            res.status(200).send(rows)
        }).catch((err) => {
            res.status(500).json({ message: err })
        })
    } catch (err) {
        res.status(500).json({ message: "error" })
    }
}

async function crearComunicado(req, res) {
    try {
        const { titulo, comunicado, link } = req.body

        await Comunicados.create({ titulo: titulo, comunicado: comunicado, link: link }).then(() => {
            res.status(200).json({ message: "ok" })
        }).catch((err) => {
            res.status(500).json({ message: "error: " + err })
        })

    } catch (err) {
        res.status(500).json({ message: "error" })
    }

}

async function eliminarComunicado(req, res) {
    try {
        const id = req.params.id

        await Comunicados.destroy({ where: { id: id } }).then(() => {
            res.status(200).json({ message: "ok" })
        })

    } catch (err) {
        res.status(500).json({ message: "error" })
    }
}

async function subirArchivo(req, res) {
    const { origen } = req.body
    const file = req.files[0];

    try {
        const exist = await Archivos.findOne({ where: { origen: origen } })
        if (exist) {
            await Archivos.update({ nombre: file.originalname, file: file.buffer.toString('base64') }, { where: { origen: origen } }).then(() => {
                res.status(200).json({ message: "ok" })
            })
        } else {
            await Archivos.create({ nombre: file.originalname, file: file.buffer.toString('base64'), origen: origen }).then(() => {
                res.status(200).json({ message: "ok" })
            })
        }
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

async function obtenerArchivo(req, res) {
    const { origen } = req.params
    try {
        const exist = await Archivos.findOne({ where: { origen: origen } })
        if (exist) {
            res.status(200).send(exist)
        } else {
            res.status(200).send({ message: "no existe" })
        }
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}

module.exports = {
    //CRUD CATEOGORIA
    crearCategoria,
    obtenerCategoria,
    modificarCategoria,
    eliminarCategoria,
    //CRUD SECCION
    crearSeccion,
    modificarSeccion,
    eliminarSeccion,
    obtenerSeccion,
    //CRUD SUBSECCCION
    crearSubseccion,
    obtenerSubseccion,
    modificarSubseccion,
    eliminarSubseccion,
    //CRUD IMAGENES SECC
    agregarImagenASeccion,
    obtenerImagenesSeccion,
    modificarImagenSecccion,
    eliminarImagenSeccion,
    //CRUD ARCHIVOS SECC
    agregarArchivoASeccion,
    obtenerArchivoSeccion,
    modificarArchivoSeccion,
    eliminarArchivoSeccion,
    //CRUD IMAGENES SUBSECC
    agregarImagenASubseccion,
    obtenerImagenesSubseccion,
    modificarImagenSubseccion,
    eliminarImagenSubseccion,
    //CRUD ARCHIVOS SUBSECC
    agregarArchivoASubseccion,
    obtenerArchivoSubseccion,
    modificarArchivoSubseccion,
    eliminarArchivoSubseccion,
    //GENERALES
    obtenerCategorias,
    navbar,
    //solicitudes de contacto
    obtenerSolicitudesContacto,
    obtenerSolicitudContacto,
    eliminarSolicitudContacto,
    //SOLICITUDES
    obtenerSolicitudes,
    eliminarSolicitud,
    //SUCURSALES
    crearSucursal,
    obtenerSucursales,
    eliminarSucursal,
    modificarSucursal,
    //CRUD IMAGENES SUCURSALES
    obtenerImagenSucursal,
    agregarImagenSucursal,
    modificarImagenSucursal,
    //COMUNICADOS
    obtenerComunicados,
    crearComunicado,
    eliminarComunicado,
    //ARCHUVOS GENERALES
    subirArchivo,
    obtenerArchivo
}

