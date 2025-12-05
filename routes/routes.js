const express = require('express')
const router = express.Router()
const Component = require('../models/component')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// CARPETA UPLOAD
const carpetaupload = path.join(__dirname, '../upload')

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, carpetaupload)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname)
    }    
})

var upload = multer({ storage: storage }).single('image')


// LISTAR TODOS LOS COMPONENTES
router.get('/', async (req, res) =>{
    try {
        const components = await Component.find({})
        res.render('index', {titulo: 'Inicio', components: components})
    }
    catch(error) {
        res.json({ message: error.message })
    }
})


// FORMULARIO PARA AGREGAR
router.get('/add', (req, res) =>{
    res.render('addcomponent', {titulo: 'Agregar Componentes'})
})


// GUARDAR COMPONENTE NUEVO
router.post('/add', upload, (req, res) =>{
    
    const component = new Component({
        name: req.body.name,
        descripcion: req.body.descripcion,
        codigo: req.body.codigo,
        precio: req.body.precio,
        cantidad: req.body.cantidad,
        image: req.file.filename
    })

    component.save()
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})


// FORMULARIO EDITAR
router.get('/edit/:id', async (req, res) => {
    try {
        const component = await Component.findById(req.params.id)

        if(!component) return res.redirect('/')

        res.render('editcomponent', {
            titulo: 'Editar Componente',
            component: component
        })

    } catch(error) {
        res.status(500).send()
    }
})


// ACTUALIZAR COMPONENTE
router.post('/update/:id', upload, async (req, res) => {

    let newImage = ''

    if (req.file) {
        newImage = req.file.filename

        // eliminar imagen anterior
        try{
            fs.unlinkSync(path.join(__dirname, '../upload/', req.body.old_image))
        }
        catch(error) {
            console.log('Error eliminando archivo:', error)
        }

    } else {
        newImage = req.body.old_image
    }

    try {

        await Component.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            descripcion: req.body.descripcion,
            codigo: req.body.codigo,
            precio: req.body.precio,
            cantidad: req.body.cantidad,
            image: newImage
        })

        req.session.message = {
            message: 'Componente editado correctamente',
            type: 'success'
        }

        res.redirect('/')

    } catch(error){
        res.json({
            message: error.message,
            type: 'danger'
        })
    }
})


// ELIMINAR COMPONENTE
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id

    try {
        const component = await Component.findByIdAndDelete(id)

        if(component && component.image){
            try {
                fs.unlinkSync(path.join(__dirname, '../upload/', component.image))
            }
            catch(error) {
                console.log("Error eliminando imagen:", error)
            }
        }

        req.session.message = {
            message:'Componente Eliminado correctamente',
            type: 'info'
        }

        res.redirect('/')

    }
    catch(error){
        res.json({
            message: error.message,
            type: 'danger'
        })
    }
})


module.exports = router
