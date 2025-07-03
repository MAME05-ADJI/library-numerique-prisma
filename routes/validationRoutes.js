const express = require('express');
const router = express.Router();
const validationController = require('../controllers/validationController');

// CRUD Validation
router.post('/', validationController.create);
router.get('/', validationController.getAll);
router.get('/:id', validationController.getById);
router.delete('/:id', validationController.delete);

module.exports = router;
