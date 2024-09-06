require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authenticateToken = require('./middlewares/authenticateToken');
const authRoutes = require('./routes/authRoutes');
const placaRoutes = require('./routes/placaRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();

// Conectando ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Middleware para servir arquivos estáticos e JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  });
  
  app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  });
  
  

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/placas', placaRoutes);
app.use('/api/videos', videoRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
