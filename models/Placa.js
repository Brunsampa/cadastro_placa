const mongoose = require('mongoose');

const placaSchema = new mongoose.Schema({
    placa: { type: String, required: true },
    cidade: { type: String, required: true },
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Placa', placaSchema);
