module.exports = function admin(req, res, next) {
  if (req.tipoUsuario !== '0') return res.status(403).json({ erro: 'Acesso restrito ao administrador' });
  next();
};