const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const jwt = require('../auth/jwt.auth')
const contenController = require('../controllers/conten.controller')

//zona FORMDATA /////////////////////////////////////////////////////////////////////////////////////////////////
//Archivos
router.post('/initFile', upload.any(), jwt.tokenMiddleware, contenController.initFile)
router.delete('/deleteFile', jwt.tokenMiddleware, contenController.deleteFile)
router.post('conten/modificarArchivos', upload.any(), jwt.tokenMiddleware, contenController.modificarArchivos)
router.get('conten/obtenerArchivosCategoria', jwt.tokenMiddleware, contenController.obtenerArchivosCategoria)
router.get('conten/obtenerArchivosSeccion', jwt.tokenMiddleware, contenController.obtenerArchivosSeccion)
router.get('conten/obtenerArchivosSubsecciones', jwt.tokenMiddleware, contenController.obtenerArchivosSubsecciones)

//Categorias
router.post('/initCategory', upload.any(), jwt.tokenMiddleware, contenController.initCategory)
router.delete('/deleteCategories/:id', jwt.tokenMiddleware, contenController.deleteCategories)
router.put('/setCategory', upload.any(), jwt.tokenMiddleware, contenController.setCategory)
router.get('/getCategories', jwt.tokenMiddleware, contenController.getCategories)
router.get('/getCategoriesById/:id', jwt.tokenMiddleware, contenController.getCategoriesById)

//Imagenes
router.post('/initImage', upload.any(), jwt.tokenMiddleware, contenController.initImage)
router.delete('/deleteImage/:id', jwt.tokenMiddleware, contenController.deleteImage)
router.delete('/restartImagesCategory/:id', upload.any(), jwt.tokenMiddleware, contenController.restartImagesCategory)
router.delete('/restartImagesSection/:id', upload.any(), jwt.tokenMiddleware, contenController.restartImagesSection)
router.delete('/restartImagesSubsection/:id', upload.any(), jwt.tokenMiddleware, contenController.restartImagesSubsection)
router.get('/getImagesByCategoryId/:id', jwt.tokenMiddleware, contenController.getImagesByCategoryId)

//Secciones
router.post('/initSection', upload.any(), jwt.tokenMiddleware, contenController.initSection)
router.get('/getSectionInfo/:id', jwt.tokenMiddleware, contenController.getSectionInfo)
router.get('/getSectionById/:id', contenController.getSectionById)
router.get('/getSectionsByFatherId/:id', contenController.getSectionsByFatherId)
router.delete('/deleteSection/:id', jwt.tokenMiddleware, contenController.eliminarSecciones)
router.put('/setSection', upload.any(), jwt.tokenMiddleware, contenController.setSection)

//Subsecciones
router.post('/initSubsection', upload.any(), jwt.tokenMiddleware, contenController.initSubsection)
router.get('/getSubsectionsById/:id', upload.any(), jwt.tokenMiddleware, contenController.getSubsectionsById)
router.put('/setSubsection', upload.any(), jwt.tokenMiddleware, contenController.setSubsection)
router.delete('/deleteSubsection/:id', jwt.tokenMiddleware, contenController.deleteSubsection)
router.get('/getSubsectionsByFatherId/:id', jwt.tokenMiddleware, contenController.getSubsectionsByFatherId)

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
