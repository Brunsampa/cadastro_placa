const express = require('express');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const authenticateToken = require('../middlewares/authenticateToken');
const Placa = require('../models/Placa');

const router = express.Router();

// Rota para gerar relatório em PDF
router.get('/relatorio/cidade/:cidade', authenticateToken, async (req, res) => {
    try {
        const { cidade } = req.params;
        const placas = await Placa.find({ cidade });

        if (placas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma placa encontrada para esta cidade' });
        }

        const doc = new PDFDocument();

        // Configura o arquivo de saída
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        // Adiciona título
        doc.fontSize(20).text(`Relatório de Placas - Cidade: ${cidade}`, { align: 'center' });
        doc.moveDown();

        // Adiciona cada placa no PDF
        placas.forEach((placa, index) => {
            doc.fontSize(12).text(`Placa: ${placa.placa}`, { continued: true });
            doc.text(`Data: ${placa.data.toLocaleDateString()}`, { align: 'right' });
            doc.moveDown();
        });

        doc.end();

    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar o relatório', details: error });
    }
});

module.exports = router;
