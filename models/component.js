const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    marca: { //campo: Intel, AMD, Nvidia...
        type: String,
        required: true
    },
    categoria: { //campo: Procesador, Gráfica, etc.
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    stock: { // Usamos 'stock' en lugar de 'cantidad'
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Component', componentSchema);