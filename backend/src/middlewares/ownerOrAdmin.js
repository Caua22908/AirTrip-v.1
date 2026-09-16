module.exports = function ownerOrAdmin(req, res, next) {
  if (req.tipoUsuario !== '0' && String(req.usuarioId) !== String(req.params.id)) {
    return res.status(403).json({ erro: 'Você só pode editar o próprio perfil' });
  }
  next();
};