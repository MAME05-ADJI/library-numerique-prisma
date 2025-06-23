const userService = require('../services/userService');
const Validator = require('../utils/validation');

class UserController {
  async createUser(req, res) {
    try {
      const validation = Validator.validateUser(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: validation.errors
        });
      }

      const user = await userService.createUser(req.body);

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la création de l\'utilisateur'
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await userService.getAllUsers(page, limit);

      res.status(200).json({
        success: true,
        message: 'Utilisateurs récupérés avec succès',
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération des utilisateurs'
      });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      res.status(200).json({
        success: true,
        message: 'Utilisateur récupéré avec succès',
        data: user
      });
    } catch (error) {
      const statusCode = error.message === 'Utilisateur non trouvé' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération de l\'utilisateur'
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;

      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Au moins un champ doit être fourni pour la mise à jour'
        });
      }

      const validation = Validator.validateUser(req.body, true);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: validation.errors
        });
      }

      const user = await userService.updateUser(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: user
      });
    } catch (error) {
      const statusCode = error.message === 'Utilisateur non trouvé' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Erreur lors de la mise à jour de l\'utilisateur'
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message === 'Utilisateur non trouvé' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Erreur lors de la suppression de l\'utilisateur'
      });
    }
  }

  async searchUsers(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Le terme de recherche doit contenir au moins 2 caractères'
        });
      }

      const users = await userService.searchUsers(q.trim());

      res.status(200).json({
        success: true,
        message: 'Recherche effectuée avec succès',
        data: users,
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la recherche'
      });
    }
  }
}

module.exports = new UserController();
