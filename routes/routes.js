const express = require('express')
const router = express.Router()
const User = require('../models/users')
const multer = require('multer')
const path = require('path')
const { error } = require('console')

const carpetaupload = path.join(__dirname, '../upload')

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, carpetaupload)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname)
    }    
})

var upload = multer({
    storage: storage
}).single('image')

router.get('/', (req, res) =>{
    res.render('index', {titulo: 'Inicio'})
})

router.get('/add', (req, res) =>{
    res.render('adduser', {titulo: 'Agregar Usuarios'})
})

router.post('/add', upload, (req, res) =>{
    const user = new User({
        
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
    })
    
    user.save().then(()=>{
        console.log('Guardado correctamente')

        res.redirect('/')
    }).catch((error) =>{
        console.log(error)
    })
})
module.exports = router