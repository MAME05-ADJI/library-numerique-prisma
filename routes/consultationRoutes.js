const express = require('express');
const consultationController = require('../controllers/consultationController');

const router = express.Router();

router.post('/', consultationController.createConsultation);
router.get('/', consultationController.getAllConsultations);
router.get('/:id', consultationController.getConsultationById);
router.delete('/:id', consultationController.deleteConsultation);

module.exports = router;
