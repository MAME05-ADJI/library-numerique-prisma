const telechargementService = require('../services/telechargementService');

class TelechargementController {
  async create(req, res) {
    try {
      const { utilisateurId, documentId } = req.body;
      const newTelechargement = await telechargementService.createTelechargement({ utilisateurId, documentId });

      res.status(201).json({
        success: true,
        message: 'Téléchargement enregistré avec succès',
        data: newTelechargement,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const data = await telechargementService.getAllTelechargements();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await telechargementService.getTelechargementById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await telechargementService.deleteTelechargement(req.params.id);
      res.status(200).json({ success: true, message: 'Téléchargement supprimé' });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}

module.exports = new TelechargementController();
