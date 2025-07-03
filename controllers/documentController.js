const documentService = require('../services/documentService');

class DocumentController {
  async createDocument(req, res) {
    try {
      const document = await documentService.createDocument(req.body);
      res.status(201).json({
        success: true,
        message: 'Document créé avec succès',
        data: document
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getDocumentById(req, res) {
    try {
      const { id } = req.params;
      const document = await documentService.getDocumentById(id);
      res.status(200).json({ success: true, data: document });
    } catch (error) {
      const status = error.message === 'Document non trouvé' ? 404 : 500;
      res.status(status).json({ success: false, message: error.message });
    }
  }

  async getAllDocuments(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await documentService.getAllDocuments(page, limit);
      res.status(200).json({
        success: true,
        data: result.documents,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateDocument(req, res) {
    try {
      const { id } = req.params;
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, message: 'Au moins un champ doit être fourni' });
      }
      const updatedDoc = await documentService.updateDocument(id, req.body);
      res.status(200).json({ success: true, data: updatedDoc });
    } catch (error) {
      const status = error.message === 'Document non trouvé' ? 404 : 400;
      res.status(status).json({ success: false, message: error.message });
    }
  }

  async deleteDocument(req, res) {
    try {
      const { id } = req.params;
      const result = await documentService.deleteDocument(id);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      const status = error.message === 'Document non trouvé' ? 404 : 500;
      res.status(status).json({ success: false, message: error.message });
    }
  }

  async searchDocuments(req, res) {
    try {
      const { q } = req.query;
      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Le terme de recherche doit contenir au moins 2 caractères'
        });
      }
      const documents = await documentService.searchDocuments(q.trim());
      res.status(200).json({ success: true, data: documents, count: documents.length });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new DocumentController();
