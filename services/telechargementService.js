const database = require('../config/database');

class TelechargementService {
  constructor() {
    this.prisma = database.getInstance();
  }

  async createTelechargement(data) {
    return await this.prisma.telechargement.create({
      data,
      include: {
        utilisateur: true,
        document: true,
      },
    });
  }

  async getAllTelechargements() {
    return await this.prisma.telechargement.findMany({
      include: {
        utilisateur: true,
        document: true,
      },
      orderBy: { dateTelechargement: 'desc' },
    });
  }

  async getTelechargementById(id) {
    const telechargement = await this.prisma.telechargement.findUnique({
      where: { id: parseInt(id) },
      include: {
        utilisateur: true,
        document: true,
      },
    });

    if (!telechargement) throw new Error('Téléchargement non trouvé');
    return telechargement;
  }

  async deleteTelechargement(id) {
    return await this.prisma.telechargement.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = new TelechargementService();
