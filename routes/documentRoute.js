const express = require('express');
const {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} = require('../controllers/documentController');

const authenticateToken = require('../middleware/authMiddleware');


const { check } = require('express-validator');

const router = express.Router();

router.use(authenticateToken);

router.post(
  '/',
  [
    check('title').notEmpty().withMessage('O título é obrigatório'),
    check('content').notEmpty().withMessage('O conteúdo é obrigatório'),
  ],
  createDocument
);

router.get('/', getAllDocuments);

router.get('/:id', getDocumentById);

router.put(
  '/:id',
  [
    check('title').notEmpty().withMessage('O título é obrigatório'),
    check('content').notEmpty().withMessage('O conteúdo é obrigatório'),
  ],
  updateDocument
);

router.delete('/:id', deleteDocument);

module.exports = router;
