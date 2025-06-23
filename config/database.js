const { PrismaClient } = require('@prisma/client');

class Database {
  constructor() {
    this.prisma = new PrismaClient();
    this.connect();
  }

  async connect() {
    try {
      await this.prisma.$connect();
      console.log('✅ Base de données connectée avec succès');
    } catch (error) {
      console.error('❌ Erreur de connexion à la base de données:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }

  getInstance() {
    return this.prisma;
  }
}

module.exports = new Database();