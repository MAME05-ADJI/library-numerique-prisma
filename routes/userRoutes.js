const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Routes CRUD
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/search', userController.searchUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
// Routes additionnelles authentification
router.post('/login', userController.loginUser);

module.exports = router;