const database = require('../config/database');
const { Prisma } = require('@prisma/client');

class ValidationService {
  constructor() {
    this.prisma = database.getInstance();
  }

  async createValidation(data) {
    try {
      const newValidation = await this.prisma.validation.create({
        data: {
          dateValidation: data.dateValidation || new Date(),
          hashValidation: data.hashValidation,
          adresseValidateur: data.adresseValidateur,
          sommeDenombreValidation: data.sommeDenombreValidation,
          typeValidation: data.typeValidation,
          utilisateurId: data.utilisateurId,
          emprunterDocId: data.emprunterDocId || null,
        }
      });
      return newValidation;
    } catch (error) {
      throw error;
    }
  }

  async getAllValidations() {
    return this.prisma.validation.findMany({
      include: {
        utilisateur: true,
        emprunterDoc: true
      }
    });
  }

  async getValidationById(id) {
    const validation = await this.prisma.validation.findUnique({
      where: { id: parseInt(id) },
      include: {
        utilisateur: true,
        emprunterDoc: true
      }
    });
    if (!validation) throw new Error('Validation non trouvée');
    return validation;
  }

  async deleteValidation(id) {
    await this.getValidationById(id); // Vérifie l’existence
    await this.prisma.validation.delete({
      where: { id: parseInt(id) }
    });
    return { message: 'Validation supprimée avec succès' };
  }
}

module.exports = new ValidationService();
