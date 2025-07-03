const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');

class TransactionService {
  constructor() {
    this.prisma = database.getInstance();
  }

  async createTransaction(data) {
    const hashTransaction = uuidv4();

    return await this.prisma.transactions.create({
      data: {
        ...data,
        hashTransaction,
      },
      include: {
        utilisateur: true,
      },
    });
  }

  async getAllTransactions() {
    return await this.prisma.transactions.findMany({
      include: { utilisateur: true },
      orderBy: { dateTransaction: 'desc' }
    });
  }

  async getTransactionById(id) {
    const transaction = await this.prisma.transactions.findUnique({
      where: { id: parseInt(id) },
      include: { utilisateur: true }
    });

    if (!transaction) throw new Error('Transaction non trouvée');
    return transaction;
  }

  async deleteTransaction(id) {
    return await this.prisma.transactions.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = new TransactionService();
