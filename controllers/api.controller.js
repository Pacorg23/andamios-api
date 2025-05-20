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
const ArchivosConten = require("../models/general/archivos_conten")
const ImagenesConten = require("../models/general/imagenes_conten")
const CategoriasConten = require("../models/general/categorias_conten")
const SeccionesConten = require("../models/general/secciones_conten")
const SubseccionesConten = require("../models/general/subsecciones_conten")
const { where } = require("sequelize")

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
        res.status(500).send('error: ' + error)
    }
}

async function getSubseccionPorPadre(req, res) {
    try {

        const { seccion } = req.params;

        const findSeccionPadre = await Secciones.findOne({ where: { url: seccion } });

        const foundSubsecciones = await Subsecciones.findAll({ where: { seccion: findSeccionPadre.id } });

        //agregar imagen inicio a cada subseccion
        const seccionesModificadas = [];
        for (const subseccion of foundSubsecciones) {
            const seccion = {
                id: subseccion.id,
                nombre: subseccion.nombre,
                url: subseccion.url
            }
            const imagen = await Imagenes_Subseccion.findOne({ where: { id_subseccion: subseccion.id } });
            seccion.imagen_inicio = imagen.file.toString("base64");
            seccionesModificadas.push(seccion);
        }

        res.status(200).send(seccionesModificadas);
    } catch (error) {
        res.status(500).send('error: ' + error)
    }
}
async function getCategoriaContenPorId(req, res) {
    try {
        const { id } = req.params;
        console.log(req.paras)
        const categoria = await CategoriasConten.findOne({ where: { id } });

        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        const secciones = await SeccionesConten.findAll({ where: { Categorias_Id: id } });
        const seccionesId = secciones.map(seccion => seccion.id);
        const subsecciones = await SubseccionesConten.findAll({ where: { Secciones_Conten_Id: seccionesId } });

        const response = {
            id: categoria.id,
            title: categoria.title,
            tipo: categoria.tipo,
            is_active: categoria.is_active,
            has_sections: categoria.has_sections,
            url: categoria.url,
            is_default: categoria.is_default,
            description: categoria.description,
            img: categoria.img,
            pdf: categoria.pdf,
            secciones: secciones.map(seccion => ({
                id: seccion.id,
                title: seccion.title,
                url: seccion.url,
                subsecciones: subsecciones
                    .filter(subseccion => subseccion.Secciones_Conten_Id === seccion.id)
                    .map(subseccion => ({
                        id: subseccion.id,
                        title: subseccion.title,
                        descripcion: subseccion.descripcion,
                    })),
            })),
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error en obtenerCategoriaConten: ", error);
        res.status(500).json({ message: "Error al obtener categoría", error });
    }
}
async function obtenerNavBarConten(req, res) {
    try {
        // Obtener categorías
        const categorias = await CategoriasConten.findAll();
        if (!categorias || categorias.length === 0) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        // Extraer IDs de categorías
        const categoriasIds = categorias.map(categoria => categoria.id);

        // Obtener secciones relacionadas
        const secciones = await SeccionesConten.findAll({ where: { Categorias_Id: categoriasIds } });

        // Construir respuesta
        const response = categorias.map(categoria => ({
            id: categoria.id,
            title: categoria.title,
            tipo: categoria.tipo,
            is_active: categoria.is_active,
            is_default: categoria.is_default,
            has_sections: categoria.has_sections,
            url: categoria.url,
            secciones: secciones
                .filter(seccion => seccion.Categorias_Id === categoria.id)
                .map(seccion => ({
                    id: seccion.id,
                    title: seccion.title,
                    descripcion: seccion.descripcion,
                    url: seccion.url
                }))
        }));

        // Responder con éxito
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error en obtenerNavBarConten: ", error);
        return res.status(500).json({ message: "Error al obtener categoría", error });
    }
}
async function obtenerCategoria(req, res) {
    try {
        const { url } = req.params
        var subsecciones = []
        var SubseccionesnesIds = []
        var imagenesSubsecciones = []
        // Obtener categorías
        const categoria = await CategoriasConten.findOne({ where: { url: url } });
        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        const imagenesCategoria = await ImagenesConten.findAll({ where: { Categorias_Conten_Id: categoria.id } });

        // Obtener secciones relacionadas
        const secciones = await SeccionesConten.findAll({ where: { Categorias_Id: categoria.id } });

        const seccionesIds = secciones.map(categoria => categoria.id);

        const imagenesSecciones = await ImagenesConten.findAll({ where: { Secciones_Conten_Id: seccionesIds } });
        // Obtener subsecciones relacionadas
        if (categoria.tipo == "B") {

            subsecciones = await SubseccionesConten.findAll({ where: { Secciones_Conten_Id: seccionesIds } });
            SubseccionesnesIds = subsecciones.map(categoria => categoria.id);
            imagenesSubsecciones = await ImagenesConten.findAll({ where: { Subsecciones_Conten_Id: SubseccionesnesIds } });
        }

        // Construir respuesta
        const response = [categoria].map(categoria => ({
            id: categoria.id,
            title: categoria.title,
            tipo: categoria.tipo,
            is_active: categoria.is_active,
            is_default: categoria.is_default,
            has_sections: categoria.has_sections,
            url: categoria.url,
            img: categoria.img,
            imgs: imagenesCategoria ? imagenesCategoria
                .filter(imagen => imagen.Categorias_Conten_Id == categoria.id)
                .map(imgaen => ({
                    id: imgaen.id,
                    data: imgaen.data ? imgaen.data : ''
                })) : '',
            description: categoria.description,
            sections: secciones
                .filter(seccion => seccion.Categorias_Id === categoria.id)
                .map(seccion => ({
                    id: seccion.id,
                    title: seccion.title,
                    description: seccion.description,
                    url: seccion.url,
                    img: seccion.img,
                    imgs: imagenesSecciones ? imagenesSecciones
                        .filter(imagen => imagen.Secciones_Conten_Id == seccion.id)
                        .map(imgaen => ({
                            id: imgaen.id,
                            data: imgaen.data ? imgaen.data : ''
                        })) : '',
                    subSecciones: subsecciones ? subsecciones
                        .filter(subseccion => subseccion.Secciones_Conten_Id === seccion.id)
                        .map(subseccion => ({
                            id: subseccion.id,
                            title: subseccion.title,
                            img: subseccion.img ? subseccion.img : '',
                            imgs: imagenesSubsecciones ? imagenesSubsecciones
                                .filter(imagen => imagen.Subsecciones_Conten_Id == subseccion.id)
                                .map(imgaen => ({
                                    id: imgaen.id,
                                    data: imgaen.data ? imgaen.data : ''
                                })) : '',
                        }))
                        : ''
                }))
        }))[0];

        // Responder con éxito
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error en obtenerNavBarConten: ", error);
        return res.status(500).json({ message: "Error al obtener categoría", error });
    }
}
async function obtenerSeccionConten(req, res) {
    try {
        const { url } = req.params
        var subsecciones = []

        // Obtener secciones relacionadas
        const secciones = await SeccionesConten.findOne({ where: { url: url } });

        const seccionesIds = [secciones].map(categoria => categoria.id);

        const imagenesSecciones = await ImagenesConten.findAll({ where: { Secciones_Conten_Id: secciones.id } });

        subsecciones = await SubseccionesConten.findAll({ where: { Secciones_Conten_Id: seccionesIds } });
        SubseccionesnesIds = subsecciones.map(categoria => categoria.id);
        imagenesSubsecciones = await ImagenesConten.findAll({ where: { Subsecciones_Conten_Id: SubseccionesnesIds } });

        // Construir respuesta
        const response = [secciones]
            .map(seccion => ({
                id: seccion.id,
                title: seccion.title,
                description: seccion.description,
                url: seccion.url,
                img: seccion.img,
                imgs: imagenesSecciones ? imagenesSecciones
                    .filter(imagen => imagen.Secciones_Conten_Id == seccion.id)
                    .map(imgaen => ({
                        id: imgaen.id,
                        data: imgaen.data ? imgaen.data : ''
                    })) : '',
                subSecciones: subsecciones ? subsecciones
                    .filter(subseccion => subseccion.Secciones_Conten_Id === seccion.id)
                    .map(subseccion => ({
                        id: subseccion.id,
                        title: subseccion.title,
                        img: subseccion.img ? subseccion.img : '',
                        imgs: imagenesSubsecciones ? imagenesSubsecciones
                            .filter(imagen => imagen.Subsecciones_Conten_Id == subseccion.id)
                            .map(imgaen => ({
                                id: imgaen.id,
                                data: imgaen.data ? imgaen.data : ''
                            })) : '',
                    }))
                    : ''
            }))

        // Responder con éxito
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error en obtenerNavBarConten: ", error);
        return res.status(500).json({ message: "Error al obtener categoría", error });
    }
}

async function obtenerSubSeccionConten(req, res) {
    try {
        const { url } = req.params
        var subsecciones = []
        var SubseccionesnesIds = []
        var imagenesSubsecciones = []

        subsecciones = await SubseccionesConten.findOne({ where: { url: url } });
        imagenesSubsecciones = await ImagenesConten.findAll({ where: { Subsecciones_Conten_Id: subsecciones.id } });

        // Construir respuesta
        const response = [subsecciones]
            .map(subseccion => ({
                id: subseccion.id,
                title: subseccion.title,
                description: subseccion.description,
                img: subseccion.img ? subseccion.img : '',
                imgs: imagenesSubsecciones ? imagenesSubsecciones
                    .filter(imagen => imagen.Subsecciones_Conten_Id == subseccion.id)
                    .map(imgaen => ({
                        id: imgaen.id,
                        data: imgaen.data ? imgaen.data : ''
                    })) : '',
            }))

        // Responder con éxito
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error en obtenerNavBarConten: ", error);
        return res.status(500).json({ message: "Error al obtener categoría", error });
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
    getSubseccion,
    getSubseccionPorPadre,
    obtenerNavBarConten,
    getCategoriaContenPorId,
    obtenerCategoria,
    obtenerSeccionConten,
    obtenerSubSeccionConten
}