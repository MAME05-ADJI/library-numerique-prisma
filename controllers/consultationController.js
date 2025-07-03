const consultationService = require('../services/consultationService');

class ConsultationController {
  async createConsultation(req, res) {
    try {
      const consultation = await consultationService.createConsultation(req.body);
      res.status(201).json({
        success: true,
        message: 'Consultation enregistrée avec succès',
        data: consultation
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la création de la consultation'
      });
    }
  }

  async getAllConsultations(req, res) {
    try {
      const consultations = await consultationService.getAllConsultations();
      res.status(200).json({
        success: true,
        message: 'Consultations récupérées avec succès',
        data: consultations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération des consultations'
      });
    }
  }

  async getConsultationById(req, res) {
    try {
      const consultation = await consultationService.getConsultationById(req.params.id);
      res.status(200).json({
        success: true,
        data: consultation
      });
    } catch (error) {
      const status = error.message === 'Consultation non trouvée' ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteConsultation(req, res) {
    try {
      await consultationService.deleteConsultation(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Consultation supprimée avec succès'
      });
    } catch (error) {
      const status = error.message === 'Consultation non trouvée' ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ConsultationController();
