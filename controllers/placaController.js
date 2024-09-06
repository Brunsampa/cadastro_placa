const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Tesseract = require('tesseract.js');
const Placa = require('../models/Placa');
const { validationResult } = require('express-validator');

async function reconhecerPlaca(filePath) {
    try {
        const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
        return text.trim();
    } catch (error) {
        return null;
    }
}

exports.cadastrarPlaca = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const foto = req.files?.foto;
    const { cidade } = req.body;

    if (!foto) {
        return res.status(400).json({ error: 'Arquivo de foto é necessário' });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(foto.mimetype)) {
        return res.status(400).json({ error: 'Apenas arquivos de imagem (JPEG/PNG) são permitidos' });
    }

    const uploadDir = path.join(__dirname, '../public/uploads');
    const fotoPath = path.join(uploadDir, foto.name);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    await foto.mv(fotoPath);

    try {
        const placa = await reconhecerPlaca(fotoPath);
        if (!placa) {
            return res.status(400).json({ error: 'Placa não reconhecida' });
        }

        const novoRegistro = new Placa({ placa, cidade });
        await novoRegistro.save();

        res.json(novoRegistro);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar a imagem' });
    } finally {
        fs.unlinkSync(fotoPath);
    }
};

exports.consultarPlaca = async (req, res) => {
    const { placa } = req.params;
    const registro = await Placa.findOne({ placa });

    if (!registro) {
        return res.status(404).json({ error: 'Placa não encontrada' });
    }

    res.json(registro);
};

exports.gerarRelatorio = async (req, res) => {
    const { cidade } = req.params;
    const registros = await Placa.find({ cidade });

    if (registros.length === 0) {
        return res.status(404).json({ error: 'Nenhum registro encontrado para esta cidade' });
    }

    const doc = new PDFDocument();
    doc.pipe(res);

    registros.forEach((registro, index) => {
        doc.text(`Registro ${index + 1}:`);
        doc.text(`Placa: ${registro.placa}`);
        doc.text(`Cidade: ${registro.cidade}`);
        doc.text(`Data: ${registro.data}`);
        doc.moveDown();
    });

    doc.end();
};
