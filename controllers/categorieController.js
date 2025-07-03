const categorieService = require('../services/categorieService');

class CategorieController {
  async createCategorie(req, res) {
    try {
      const categorie = await categorieService.createCategorie(req.body);
      res.status(201).json({
        success: true,
        message: 'Catégorie créée avec succès',
        data: categorie
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAllCategories(req, res) {
    try {
      const categories = await categorieService.getAllCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCategorieById(req, res) {
    try {
      const categorie = await categorieService.getCategorieById(req.params.id);
      res.status(200).json({ success: true, data: categorie });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async updateCategorie(req, res) {
    try {
      const categorie = await categorieService.updateCategorie(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Catégorie mise à jour avec succès',
        data: categorie
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteCategorie(req, res) {
    try {
      const result = await categorieService.deleteCategorie(req.params.id);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CategorieController();
