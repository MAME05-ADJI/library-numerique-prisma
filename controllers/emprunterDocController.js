const emprunterDocService = require('../services/emprunterDocService');

class EmprunterDocController {
  async create(req, res) {
    try {
      const { dateEmprunt, dateRetour } = req.body;
      const newEmprunt = await emprunterDocService.createEmprunt({ dateEmprunt, dateRetour });

      res.status(201).json({
        success: true,
        message: 'Emprunt créé avec succès',
        data: newEmprunt,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const emprunts = await emprunterDocService.getAllEmprunts();
      res.status(200).json({ success: true, data: emprunts });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const emprunt = await emprunterDocService.getEmpruntById(req.params.id);
      res.status(200).json({ success: true, data: emprunt });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const updateData = req.body;
      const updatedEmprunt = await emprunterDocService.updateEmprunt(req.params.id, updateData);
      res.status(200).json({ success: true, message: 'Emprunt mis à jour', data: updatedEmprunt });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await emprunterDocService.deleteEmprunt(req.params.id);
      res.status(200).json({ success: true, message: 'Emprunt supprimé avec succès' });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}

module.exports = new EmprunterDocController();
