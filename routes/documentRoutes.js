const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// CRUD + Recherche
router.post('/', documentController.createDocument);
router.get('/', documentController.getAllDocuments);
router.get('/search', documentController.searchDocuments);
router.get('/:id', documentController.getDocumentById);
router.put('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
