const { Op } = require('sequelize');
const Agendamento = require('../models/Agendamento');
const Notificacao = require('../models/Notificacao');

function payload(body, usuarioId) {
  return {
    usuarioId,
    origem: body.origem,
    destino: body.destino,
    dataIda: body.dataIda,
    dataVolta: body.dataVolta || null,
    passageiros: Number(body.passageiros || 1),
    aeroporto: body.aeroporto || null,
    empresaVoo: body.empresaVoo || null,
    status: body.status || 'pendente',
  };
}

async function listar(req, res) {
  const where = req.tipoUsuario === '0' && req.query.usuarioId ? { usuarioId: req.query.usuarioId } : { usuarioId: req.usuarioId };
  return res.json(await Agendamento.findAll({ where, include: [{ model: Notificacao, as: 'notificacoes' }], order: [['id', 'DESC']] }));
}

async function criar(req, res) {
  const { origem, destino, dataIda } = req.body;
  if (!origem || !destino || !dataIda) return res.status(400).json({ erro: 'Origem, destino e data de ida são obrigatórios' });
  return res.status(201).json(await Agendamento.create(payload(req.body, req.usuarioId)));
}

async function atualizar(req, res) {
  const agendamento = await Agendamento.findOne({ where: { id: req.params.id, ...(req.tipoUsuario === '0' ? {} : { usuarioId: req.usuarioId }) } });
  if (!agendamento) return res.status(404).json({ erro: 'Agendamento não encontrado' });
  await agendamento.update(payload(req.body, agendamento.usuarioId));
  return res.json(agendamento);
}

async function cancelar(req, res) {
  const agendamento = await Agendamento.findOne({ where: { id: req.params.id, ...(req.tipoUsuario === '0' ? {} : { usuarioId: req.usuarioId }) } });
  if (!agendamento) return res.status(404).json({ erro: 'Agendamento não encontrado' });
  await agendamento.update({ status: 'cancelada' });
  return res.json(agendamento);
}

async function deletar(req, res) {
  const agendamento = await Agendamento.findOne({
    where: { id: req.params.id, usuarioId: req.usuarioId },
  });
  if (!agendamento) return res.status(404).json({ erro: 'Reserva não encontrada' });
  if (agendamento.status !== 'cancelada') {
    return res.status(400).json({ erro: 'Apenas reservas canceladas podem ser excluídas' });
  }
  await agendamento.destroy();
  return res.json({ sucesso: true, mensagem: 'Reserva excluída com sucesso' });
}

async function criarNotificacao(req, res) {
  const agendamento = await Agendamento.findOne({ where: { id: req.params.id, usuarioId: req.usuarioId } });
  if (!agendamento) return res.status(404).json({ erro: 'Agendamento não encontrado' });
  const { dataNotificacao, horario } = req.body;
  if (!dataNotificacao || !horario) return res.status(400).json({ erro: 'Data e horário são obrigatórios' });
  return res.status(201).json(await Notificacao.create({ agendamentoId: agendamento.id, dataNotificacao, horario, ativo: req.body.ativo ?? true }));
}

async function alternarNotificacao(req, res) {
  const notificacao = await Notificacao.findOne({
    where: { id: req.params.id },
    include: [{ model: Agendamento, as: 'agendamento', where: { usuarioId: req.usuarioId } }],
  });
  if (!notificacao) return res.status(404).json({ erro: 'Notificação não encontrada' });
  await notificacao.update({ ativo: req.body.ativo ?? !notificacao.ativo });
  return res.json(notificacao);
}

async function deletarNotificacao(req, res) {
  const notificacao = await Notificacao.findOne({
    where: { id: req.params.id },
    include: [{ model: Agendamento, as: 'agendamento', where: { usuarioId: req.usuarioId } }],
  });
  if (!notificacao) return res.status(404).json({ erro: 'Notificação não encontrada' });
  await notificacao.destroy();
  return res.json({ sucesso: true });
}

module.exports = { listar, criar, atualizar, cancelar, deletar, criarNotificacao, alternarNotificacao, deletarNotificacao };