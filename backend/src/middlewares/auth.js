const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');

  if (!token) return res.status(401).json({ erro: 'Token não informado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    req.tipoUsuario = String(decoded.tipoUsuario);
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};