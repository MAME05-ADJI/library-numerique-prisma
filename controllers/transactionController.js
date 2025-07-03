const transactionService = require('../services/transactionService');

class TransactionController {
  async create(req, res) {
    try {
      const { typeOperation, coutTransaction, utilisateurId } = req.body;
      const transaction = await transactionService.createTransaction({ typeOperation, coutTransaction, utilisateurId });

      res.status(201).json({
        success: true,
        message: 'Transaction enregistrée',
        data: transaction
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const data = await transactionService.getAllTransactions();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await transactionService.getTransactionById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await transactionService.deleteTransaction(req.params.id);
      res.status(200).json({ success: true, message: 'Transaction supprimée' });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}

module.exports = new TransactionController();
