const mongoose = require('mongoose')
const componentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    descripcion:{
        type: String,
        required: true
    }, 
    codigo: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    precio:{
        type: Number,
        required: true
    },
    cantidad:{
        type: Number,
        required: true
    },
    created:{
        type: Date,
        required: true,
        default: Date.now
    }
    
})

const Component = mongoose.model('Component', componentSchema)

module.exports = Component
