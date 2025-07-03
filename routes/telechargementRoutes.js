const express = require('express');
const telechargementController = require('../controllers/telechargementController');

const router = express.Router();

// Utilisation des bons noms de méthodes
router.post('/', telechargementController.create);
router.get('/', telechargementController.getAll);
router.get('/:id', telechargementController.getById);
router.delete('/:id', telechargementController.delete);

module.exports = router;
