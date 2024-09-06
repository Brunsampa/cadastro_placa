const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Token é necessário' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Erro de verificação do token:', err);
            return res.status(403).json({ error: 'Token inválido' });
        }
        console.log('Token verificado com sucesso:', user);
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
