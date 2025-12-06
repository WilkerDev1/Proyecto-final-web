const express = require('express');
const router = express.Router();
const Component = require('../models/component');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de imagen
const carpetaupload = path.join(__dirname, '../upload');
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, carpetaupload);
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + "_" + file.originalname);
    }
});
var upload = multer({ storage: storage }).single('image');

// --- RUTAS ---

// 1. INICIO - Mostrar componentes
router.get('/', async (req, res) => {
    try {
        const components = await Component.find({});
        res.render('index', { titulo: 'PC Master Race Store', components: components });
    } catch(error) {
        res.json({ message: error.message });
    }
});

// 2. FORMULARIO AGREGAR
router.get('/add', (req, res) => {
    res.render('addcomponent', { titulo: 'Agregar Hardware' });
});

// 3. GUARDAR COMPONENTE
router.post('/add', upload, (req, res) => {
    const component = new Component({
        nombre: req.body.nombre,
        marca: req.body.marca,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        stock: req.body.stock,
        image: req.file ? req.file.filename : ''
    });

    component.save()
        .then(() => {
            req.session.message = {
                type: 'success',
                message: '¡Componente agregado al inventario!'
            };
            res.redirect('/');
        })
        .catch(err => res.json({ message: err.message, type: 'danger' }));
});

// 4. FORMULARIO EDITAR
router.get('/edit/:id', async (req, res) => {
    try {
        const component = await Component.findById(req.params.id);
        if(!component) return res.redirect('/');
        res.render('editcomponent', { titulo: 'Editar Hardware', component: component });
    } catch(err) {
        res.redirect('/');
    }
});

// 5. ACTUALIZAR
router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id;
    let newImage = '';

    if (req.file) {
        newImage = req.file.filename;
        try {
            fs.unlinkSync(path.join(__dirname, '../upload/' + req.body.old_image));
        } catch(err) { console.log(err); }
    } else {
        newImage = req.body.old_image;
    }

    try {
        await Component.findByIdAndUpdate(id, {
            nombre: req.body.nombre,
            marca: req.body.marca,
            categoria: req.body.categoria,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            stock: req.body.stock,
            image: newImage
        });
        req.session.message = { type: 'success', message: 'Componente actualizado correctamente' };
        res.redirect('/');
    } catch(err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// 6. ELIMINAR
router.get('/delete/:id', async (req, res) => {
    try {
        const result = await Component.findByIdAndDelete(req.params.id);
        if(result && result.image != ''){
            try {
                fs.unlinkSync(path.join(__dirname, '../upload/' + result.image));
            } catch(err) { console.log(err); }
        }
        req.session.message = { type: 'info', message: 'Componente eliminado' };
        res.redirect('/');
    } catch(err) {
        res.json({ message: err.message });
    }
});

module.exports = router;