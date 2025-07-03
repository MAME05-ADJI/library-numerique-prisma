const database = require('../config/database');

class ConsultationService {
  constructor() {
    this.prisma = database.getInstance();
  }

  async createConsultation(data) {
    return await this.prisma.consultation.create({
      data: {
        utilisateurId: data.utilisateurId,
        documentId: data.documentId
      }
    });
  }

  async getAllConsultations() {
    return await this.prisma.consultation.findMany({
      include: {
        utilisateur: true,
        document: true
      },
      orderBy: {
        dateConsultation: 'desc'
      }
    });
  }

  async getConsultationById(id) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: parseInt(id) },
      include: {
        utilisateur: true,
        document: true
      }
    });

    if (!consultation) {
      throw new Error('Consultation non trouvée');
    }

    return consultation;
  }

  async deleteConsultation(id) {
    const existing = await this.prisma.consultation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      throw new Error('Consultation non trouvée');
    }

    await this.prisma.consultation.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new ConsultationService();
