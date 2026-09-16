const express = require('express');
const controller = require('../controllers/usuarioController');
const upload = require('../config/multer');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const ownerOrAdmin = require('../middlewares/ownerOrAdmin');

const router = express.Router();
router.post('/login', controller.login);
router.post('/', upload.single('foto'), controller.criar);
router.post('/inserir', upload.single('foto'), controller.criar);
router.put('/alterar-senha', controller.alterarSenha);
router.put('/redefinir-senha', controller.redefinirSenha);
router.get('/', auth, admin, controller.listar);
router.get('/:id', auth, controller.buscarPorId);
router.put('/:id', auth, ownerOrAdmin, upload.single('foto'), controller.atualizar);
router.delete('/:id', auth, admin, controller.deletar);

module.exports = router;