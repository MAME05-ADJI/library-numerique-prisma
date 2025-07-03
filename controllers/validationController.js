const validationService = require('../services/validationService');

class ValidationController {
  async create(req, res) {
    try {
      const validation = await validationService.createValidation(req.body);
      res.status(201).json({
        success: true,
        message: 'Validation créée avec succès',
        data: validation
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la création'
      });
    }
  }

  async getAll(req, res) {
    try {
      const validations = await validationService.getAllValidations();
      res.status(200).json({
        success: true,
        data: validations
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const validation = await validationService.getValidationById(req.params.id);
      res.status(200).json({
        success: true,
        data: validation
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await validationService.deleteValidation(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ValidationController();
