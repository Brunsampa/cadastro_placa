const express = require('express');
const multer = require('multer');
const path = require('path');
const Tesseract = require('tesseract.js');
const authenticateToken = require('../middlewares/authenticateToken');
const Placa = require('../models/Placa');

const router = express.Router();

// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Rota para cadastro de placa
router.post('/cadastroPlaca', authenticateToken, upload.single('foto'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo de foto é necessário' });
        }

        const fotoPath = path.join(__dirname, '../public/uploads', req.file.filename);

        // Reconhecimento de texto na imagem usando Tesseract
        Tesseract.recognize(
            fotoPath,
            'eng',
            { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
            const novaPlaca = new Placa({
                usuarioId: req.user.id,
                placa: text.trim(), // O texto reconhecido como placa
                cidade: req.body.cidade, // Cidade definida manualmente
                foto: req.file.filename
            });

            novaPlaca.save()
                .then(() => res.json({ message: 'Placa cadastrada com sucesso', placa: novaPlaca }))
                .catch(error => res.status(500).json({ error: 'Erro ao salvar a placa no banco de dados', details: error }));
        }).catch(error => res.status(500).json({ error: 'Erro ao reconhecer a placa', details: error }));

    } catch (error) {
        res.status(500).json({ error: 'Erro no processamento da requisição', details: error });
    }
});

// Rota para consulta de placa
router.get('/consulta/:placa', authenticateToken, async (req, res) => {
    try {
        const placa = req.params.placa;
        const placaEncontrada = await Placa.findOne({ placa });

        if (!placaEncontrada) {
            return res.status(404).json({ error: 'Placa não encontrada' });
        }

        res.json(placaEncontrada);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar a placa', details: error });
    }
});

// Rota para gerar relatório por cidade
router.get('/relatorio/cidade/:cidade', authenticateToken, async (req, res) => {
    try {
        const cidade = req.params.cidade;
        const placas = await Placa.find({ cidade });

        if (placas.length === 0) {
            return res.status(404).json({ error: 'Nenhuma placa encontrada para essa cidade' });
        }

        res.json(placas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar relatório', details: error });
    }
});

// Outras rotas aqui...

module.exports = router;
