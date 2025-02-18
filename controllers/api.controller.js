const Comunicados = require("../models/proveedores")
const Archivos = require("../models/archivos")
const Solicitudes = require("../models/general/solicitudes")
const Categorias = require("../models/general/categorias")
const Secciones = require("../models/general/secciones")
const Subsecciones = require("../models/general/subsecciones")
const Carrusel = require("../models/andamios/carrusel")
const Anuncio = require("../models/andamios/anuncio")
const Imagenes_Seccion = require("../models/general/imagenes_seccion")
const Archivos_Seccion = require("../models/general/archivos_seccion")
const Imagenes_Sucursales = require("../models/general/imagenes_sucursales")
const Sucursales = require("../models/general/sucursales")
const Imagenes_Subseccion = require("../models/general/imagenes_subseccion")
const Archivos_Subseccion = require("../models/general/archivos_subseccion")
const Contactos = require("../models/general/contactos")

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

async function crearSolicitud(req, res) {
    const { nombre, escolaridad, area, email, telefono, division } = req.body
    const file = req.files[0]

    try {
        await Solicitudes.create({
            nombre: nombre,
            escolaridad: escolaridad,
            area: area,
            email: email,
            telefono: telefono,
            filename: file.originalname,
            file: file.buffer.toString('base64'),
            division: division
        }).then((solicitud) => {
            res.status(200).send(solicitud)
        }).catch((err) => {
            res.status(500).json({ message: err })
        })
    } catch (err) {
        res.status(500).json({ message: "error" })
    }
}

async function crearContacto(req, res) {
    const { nombre, empresa, fijo, celular, correo, estadoIN, estadoOUT, area, duda } = req.body
    const file = req.files[0]
    console.log(nombre)
    console.log(empresa)
    console.log(fijo)
    console.log(celular)
    console.log(correo)
    console.log(estadoIN)
    console.log(estadoOUT)
    console.log(area)
    console.log(duda)
    try {
        await Contactos.create({
            nombre: nombre,
            empresa: empresa,
            fijo: fijo,
            celular: celular,
            correo: correo,
            estadoIN: estadoIN,
            estadoOUT: estadoOUT,
            area: area, 
            duda: duda
        }).then((solicitud) => {
            res.status(200).send(solicitud)
        }).catch((err) => {
            res.status(500).json({ message: err })
        })
    } catch (err) {
        res.status(500).json({ message: "error" })
    }
}

/**
 * @description Obtiene la barra de navegacion con sus categorias, secciones y subsecciones
 * @param {Request} req (area)
 * @param {Response} res (status, message)
 */
async function navbar(req, res) {
    try {

        const { area } = req.params

        const categorias = await Categorias.findAll({
            attributes: ['id', 'nombre', 'tipo', 'url'],
            where: { area: area },
        });
        const navbar = [];

        for (const categoria of categorias) {
            const seccionesYSubsecciones = await obtenerSeccionesYSubsecciones(categoria.id);

            navbar.push({
                id: categoria.id,
                titulo: categoria.nombre,
                tipo: categoria.tipo,
                url: categoria.url,
                secciones: seccionesYSubsecciones,
            });
        }

        res.status(200).send(navbar);
    } catch (error) {
        res.status(500).json({ message: "Error de endpoint: " + error });
    }
}

/**
 * @description Obtiene las secciones y subsecciones de una categoría
 */
async function obtenerSeccionesYSubsecciones(idCategoria) {
    const secciones = await Secciones.findAll({
        where: { categoria: idCategoria },
        attributes: ['id', 'nombre', 'url', 'isTitle'],
    });

    const seccionesConSubsecciones = [];

    for (const seccion of secciones) {
        const subsecciones = await Subsecciones.findAll({
            where: { seccion: seccion.id },
            attributes: ['id', 'nombre', 'url'],
        });

        seccionesConSubsecciones.push({
            id: seccion.id,
            titulo: seccion.nombre,
            url: seccion.url,
            isTitle: seccion.isTitle,
            subsecciones: subsecciones,
        });
    }

    return seccionesConSubsecciones;
}

async function obtenerCarrusel(req, res) {
    try {
        await Carrusel.findAll().then((rows) => {
            res.status(200).send(rows)
        }).catch((err) => {
            res.status(500).json({ message: err })
        })
    } catch (err) {
        res.status(500).json({ message: "error" })
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

/**
 * @description Obtiene las categorías y secciones de una área para la página de inicio
 * @param {Request} req (area)
 * @param {Response} res (status, message)
 */
async function obtenerInicio(req, res) {
    try {
        const { area } = req.params

        const categorias = await Categorias.findAll({
            attributes: ['id', 'nombre', 'url', 'banner'],
            where: { area: area, mostrar_inicio: true },
        });
        const inicio = [];

        for (const categoria of categorias) {
            const secciones = await Secciones.findAll({
                where: { categoria: categoria.id, mostrar_inicio: true },
                attributes: ['id', 'nombre', 'url', 'imagen_inicio', 'isTitle'],
            });

            inicio.push({
                id: categoria.id,
                titulo: categoria.nombre,
                url: categoria.url,
                banner: categoria.banner,
                secciones: secciones,
            });
        }

        res.status(200).send(inicio)

    } catch (err) {
        res.status(500).json({ message: "error" })
    }
}

async function obtenerTipoCategoria(req, res) {

    try {
        const { url } = req.params

        await Categorias.findOne({
            attributes: ['id', 'tipo', 'nombre'],
            where: { url: url },
        }).then((result) => {
            res.status(200).send(result)
        })
    } catch (error) {
        res.status(500).json({ message: error });
    }

}

/**
 * @description Obtiene las secciones de una categoría por tipo para la pagina de inicio
 * @param {Request} req (id, tipo)
 * @param {Response} res (status, message)
 */
async function obtenerSecciones(req, res) {
    try {
        const { id, tipo } = req.body


        switch (tipo) {
            case 'A': //done
                await Secciones.findAll({
                    where: { categoria: id },
                    attributes: ['id', 'nombre', 'url', 'imagen_inicio', 'isTitle'],
                }).then((secciones) => {
                    res.status(200).send(secciones)
                })
                break;
            case 'B':
                await Secciones.findAll({
                    where: { categoria: id },
                    attributes: ['id', 'nombre', 'descripcion', 'imagen_inicio', 'isTitle'],
                }).then((secciones) => {
                    res.status(200).send(secciones)
                })
                break;
            case 'C':

                console.log('entro a C');
                const seccionesC = await Secciones.findAll({ where: { categoria: id } });

                const elementosConImagenes = [];

                for (const seccion of seccionesC) {
                    // Creamos el objeto elemento con los datos de la sección
                    const elemento = {
                        id: seccion.id,
                        nombre: seccion.nombre,
                        descripcion: seccion.descripcion,
                        btn_contacto: seccion.btn_contacto,
                        imagen_inicio: seccion.imagen_inicio,
                        isTitle: seccion.isTitle
                    };

                    // Buscamos las imágenes relacionadas con esta sección
                    const imagenes = await Imagenes_Seccion.findAll({ where: { id_seccion: seccion.id } }).catch((err) => {
                        console.log(err);
                    })

                    // Añadimos las imágenes al objeto elemento
                    elemento.imagenes = imagenes;

                    // Agregamos el elemento a la lista
                    elementosConImagenes.push(elemento);
                }

                res.status(200).send(elementosConImagenes);

                break;
            case 'D':

                const secciones = await Secciones.findAll({ where: { categoria: id } });

                const elementosConArchivos = [];

                for (const seccion of secciones) {
                    // Creamos el objeto elemento con los datos de la sección
                    const elemento = {
                        id: seccion.id,
                        nombre: seccion.nombre,
                        descripcion: seccion.descripcion,
                        btn_pdf: seccion.btn_pdf,
                        imagen_inicio: seccion.imagen_inicio,
                        isTitle: seccion.isTitle
                    };

                    // Buscamos los archivos relacionados con esta sección
                    const archivos = await Archivos_Seccion.findAll({ where: { id_elemento: seccion.id } });

                    // Añadimos los archivos al objeto elemento
                    elemento.archivos = archivos;

                    // Agregamos el elemento a la lista
                    elementosConArchivos.push(elemento);
                }

                res.status(200).send(elementosConArchivos);

                break;
            default:
                res.status(500).json({ message: "se necesita el tipo de dato" })

        }
    } catch (err) {
        res.status(500).json({ message: "error" })
    }

}

async function obtenerImagenSucursal(req, res) {
    try {

        const { division } = req.params

        const imagenes = await Imagenes_Sucursales.findOne({ where: { division: division } })
        res.status(200).send(imagenes)

    } catch (err) {
        res.status(500).json({ message: "error" })
    }
}

async function obtenerSucursales(req, res) {
    try {
        const { division } = req.params

        const sucursales = await Sucursales.findAll({ where: { division: division } })

        res.status(200).send(sucursales)

    } catch (err) {
        res.status(500).json({ message: "error" })
    }
}

/*
* @description Obtiene la información de una sección
* @param {Request} req (url)
* @param {Response} res (status, message)
*/
async function getSeccion(req, res) {
    try {
        const { url } = req.params;
        const row = await Secciones.findOne({ where: { url } });
        if (!row) {
            return res.status(404).send({ error: 'Sección no encontrada' });
        }
        // Obtener imágenes asociadas
        const imgs = await Imagenes_Seccion.findAll({ where: { id_seccion: row.id } });
        console.log(imgs);
        const processedImgs = imgs.map(img => ({
            ...img.toJSON(),
            img: img.file.toString("base64")
        }));
        // Obtener archivo PDF asociado
        const pdfRow = await Archivos_Seccion.findOne({ where: { id_elemento: row.id } });
        const pdf = pdfRow ? pdfRow.file.toString("base64") : null;
        // Construir el resultado
        const result = {
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            btn_contacto: row.btn_contacto,
            btn_pdf: row.btn_pdf,
            images: processedImgs,
            imagen_inicio: row.imagen_inicio,
            pdf: pdf,
            isTitle: row.isTitle
        };

        // Enviar respuesta
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send('error: ' + error)
    }
}

/**
 * @description Obtiene la información de una subsección
 * @param {Request} req (url)
 * @param {Response} res (status, message)
 */
async function getSubseccion(req, res) {
    try {
        const { url } = req.params;
        const row = await Subsecciones.findOne({ where: { url } });
        if (!row) {
            return res.status(404).send({ error: 'Subsección no encontrada' });
        }
        // Obtener imágenes asociadas
        const imgs = await Imagenes_Subseccion.findAll({ where: { id_subseccion: row.id } });
        const processedImgs = imgs.map(img => ({
            ...img.toJSON(),
            img: img.file.toString("base64")
        }));
        // Obtener archivo PDF asociado
        const pdfRow = await Archivos_Subseccion.findOne({ where: { id_elemento: row.id } });
        const pdf = pdfRow ? pdfRow.file.toString("base64") : null;
        // Construir el resultado
        const result = {
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            btn_contacto: row.btn_contacto,
            btn_pdf: row.btn_pdf,
            images: processedImgs,
            imagen_inicio: row.imagen_inicio,
            pdf: pdf
        };

        // Enviar respuesta
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send('error: ' + error)
    }
}

module.exports = {
    obtenerArchivo,
    obtenerComunicados,
    crearSolicitud,
    crearContacto,
    navbar,
    obtenerCarrusel,
    obtenerAnuncio,
    obtenerInicio,
    obtenerTipoCategoria,
    obtenerSecciones,
    obtenerImagenSucursal,
    obtenerSucursales,
    getSeccion,
    getSubseccion
}