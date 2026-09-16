const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

function publicUser(usuario, req) {
  const user = usuario.toJSON ? usuario.toJSON() : { ...usuario };
  delete user.senha;
  if (user.foto && !user.foto.startsWith('http')) {
    user.foto = `${req.protocol}://${req.get('host')}${user.foto}`;
  }
  return user;
}

async function criar(req, res) {
  try {
    const { nome, email, senha, tipoUsuario = '1' } = req.body || {};
    if (!nome || !email || !senha) return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });

    const existe = await Usuario.findOne({ where: { email: email.trim().toLowerCase() } });
    if (existe) return res.status(409).json({ erro: 'Email já cadastrado' });

    const usuario = await Usuario.create({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha: await bcrypt.hash(senha, 10),
      tipoUsuario: String(tipoUsuario),
      foto: req.file ? `/uploads/${req.file.filename}` : null,
    });
    return res.status(201).json(publicUser(usuario, req));
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    const usuario = await Usuario.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) return res.status(401).json({ erro: 'Email ou senha inválidos' });

    const token = jwt.sign({ id: usuario.id, email: usuario.email, tipoUsuario: usuario.tipoUsuario }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ usuario: publicUser(usuario, req), token });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}

async function listar(req, res) {
  const usuarios = await Usuario.findAll({ attributes: { exclude: ['senha'] }, order: [['id', 'ASC']] });
  return res.json(usuarios.map((usuario) => publicUser(usuario, req)));
}

async function buscarPorId(req, res) {
  const usuario = await Usuario.findByPk(req.params.id, { attributes: { exclude: ['senha'] } });
  if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
  return res.json(publicUser(usuario, req));
}

async function atualizar(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    const { nome, email, senha, tipoUsuario } = req.body;
    await usuario.update({
      nome: nome ?? usuario.nome,
      email: email ? email.trim().toLowerCase() : usuario.email,
      senha: senha ? await bcrypt.hash(senha, 10) : usuario.senha,
      tipoUsuario: tipoUsuario ?? usuario.tipoUsuario,
      foto: req.file ? `/uploads/${req.file.filename}` : usuario.foto,
    });
    return res.json(publicUser(usuario, req));
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}

async function alterarSenha(req, res, redefinir = false) {
  const { email, senhaAtual, novaSenha, confirmarSenha } = req.body;
  if (!email || !novaSenha || !confirmarSenha || (!redefinir && !senhaAtual)) return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  if (novaSenha !== confirmarSenha) return res.status(400).json({ erro: 'As senhas não coincidem' });
  const usuario = await Usuario.findOne({ where: { email: email.trim().toLowerCase() } });
  if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
  if (!redefinir && !(await bcrypt.compare(senhaAtual, usuario.senha))) return res.status(401).json({ erro: 'Senha atual inválida' });
  await usuario.update({ senha: await bcrypt.hash(novaSenha, 10) });
  return res.json({ mensagem: 'Senha atualizada com sucesso' });
}

async function deletar(req, res) {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
  await usuario.destroy();
  return res.json({ sucesso: true, mensagem: 'Usuário removido com sucesso' });
}

module.exports = {
  criar,
  login,
  listar,
  buscarPorId,
  atualizar,
  deletar,
  alterarSenha: (req, res) => alterarSenha(req, res),
  redefinirSenha: (req, res) => alterarSenha(req, res, true),
};