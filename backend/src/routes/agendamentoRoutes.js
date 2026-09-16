const express = require('express');
const auth = require('../middlewares/auth');
const controller = require('../controllers/agendamentoController');

const router = express.Router();
router.use(auth);
router.get('/', controller.listar);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.patch('/:id/cancelar', controller.cancelar);
router.delete('/:id', controller.deletar);
router.post('/:id/notificacoes', controller.criarNotificacao);
router.patch('/notificacoes/:id', controller.alternarNotificacao);
router.delete('/notificacoes/:id', controller.deletarNotificacao);

module.exports = router;