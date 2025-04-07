const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const jwt = require('../auth/jwt.auth')
const contenController = require('../controllers/conten.controller')

//zona FORMDATA /////////////////////////////////////////////////////////////////////////////////////////////////
//Archivos
router.post('conten/agregarArchivos',upload.any(), jwt.tokenMiddleware,contenController.agregarArchivos)
router.delete('conten/eliminarArchivos', jwt.tokenMiddleware,contenController.eliminarArchivos)
router.post('conten/modificarArchivos',upload.any(), jwt.tokenMiddleware,contenController.modificarArchivos)
router.get('conten/obtenerArchivosCategoria', jwt.tokenMiddleware,contenController.obtenerArchivosCategoria)
router.get('conten/obtenerArchivosSeccion', jwt.tokenMiddleware,contenController.obtenerArchivosSeccion)
router.get('conten/obtenerArchivosSubsecciones', jwt.tokenMiddleware,contenController.obtenerArchivosSubsecciones)

//Categorias
router.post('/initCategory',upload.any(),jwt.tokenMiddleware, contenController.initCategory)
router.delete('/deleteCategories/:id', jwt.tokenMiddleware,contenController.deleteCategories)
router.put('/setCategory',upload.any(), jwt.tokenMiddleware,contenController.setCategory)
router.get('/getCategories', jwt.tokenMiddleware,contenController.getCategories)
router.get('/getCategoriesById/:id', jwt.tokenMiddleware,contenController.getCategoriesById)

//Imagenes
router.post('conten/agregarImagenes',upload.any(), jwt.tokenMiddleware,contenController.agregarImagenes)
router.delete('conten/eliminarImagenes', jwt.tokenMiddleware,contenController.eliminarImagenes)
router.post('conten/modificarImagenes',upload.any(), jwt.tokenMiddleware,contenController.modificarImagenes)
router.get('conten/obtenerImagenesCategoria', jwt.tokenMiddleware,contenController.obtenerImagenesCategoria)
router.get('conten/obtenerImagenesSeccion', jwt.tokenMiddleware,contenController.obtenerImagenesSeccion)
router.get('conten/obtenerImagenesSubsecciones', jwt.tokenMiddleware,contenController.obtenerImagenesSubsecciones)

//Secciones
router.post('conten/agregarSecciones',upload.any(), jwt.tokenMiddleware,contenController.agregarSecciones)
router.get('conten/obtenerSecciones', jwt.tokenMiddleware,contenController.obtenerSecciones)
router.get('/getSectionsById/:id',contenController.getSectionsById)
router.delete('conten/eliminarSecciones', jwt.tokenMiddleware,contenController.eliminarSecciones)
router.post('conten/modificarSecciones',upload.any(), jwt.tokenMiddleware,contenController.modificarSecciones)

//Subsecciones
router.post('conten/agregarSubsecciones',upload.any(), jwt.tokenMiddleware,contenController.agregarSubsecciones)
router.post('conten/modificarSubsecciones',upload.any(), jwt.tokenMiddleware,contenController.modificarSubsecciones)
router.delete('conten/eliminarSubsecciones', jwt.tokenMiddleware,contenController.eliminarSubsecciones)
router.get('conten/obtenerSubsecciones', jwt.tokenMiddleware,contenController.obtenerSubsecciones)

//Teest
// router.get('/conten/test', contenController.test)

// //ZONA JSON
// router.use(express.json())
// //Anuncio
// router.post('/agregarAnuncio',upload.any(),jwt.tokenMiddleware ,contenController.crearAnuncio)
// router.get('/obtenerAnuncio',jwt.tokenMiddleware,contenController.obtenerAnuncio)
// router.delete('/eliminarAnuncio/:id',jwt.tokenMiddleware,contenController.eliminarAnuncio)
// router.put('/modificarAnuncio', upload.any(),jwt.tokenMiddleware, contenController.modificarAnuncio)

module.exports = router;
