const express = require('express');
const emprunterDocController = require('../controllers/emprunterDocController');

const router = express.Router();

// CRUD EmpruntDocs
router.post('/', emprunterDocController.create);
router.get('/', emprunterDocController.getAll);
router.get('/:id', emprunterDocController.getById);
router.put('/:id', emprunterDocController.update);
router.delete('/:id', emprunterDocController.delete);

module.exports = router;
