const database = require('../config/database');

class EmprunterDocService {
  constructor() {
    this.prisma = database.getInstance();
  }

  async createEmprunt(data) {
    return await this.prisma.emprunterDoc.create({
      data,
    });
  }

  async getAllEmprunts() {
    return await this.prisma.emprunterDoc.findMany({
      orderBy: { dateEmprunt: 'desc' },
    });
  }

  async getEmpruntById(id) {
    const emprunt = await this.prisma.emprunterDoc.findUnique({
      where: { id: parseInt(id) },
    });
    if (!emprunt) throw new Error('Emprunt non trouvé');
    return emprunt;
  }

  async updateEmprunt(id, updateData) {
    return await this.prisma.emprunterDoc.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
  }

  async deleteEmprunt(id) {
    await this.prisma.emprunterDoc.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = new EmprunterDocService();
