const database = require('../config/database');
const prisma = database.getInstance();

class CategorieService {
  async createCategorie(data) {
    const existing = await prisma.categorie.findUnique({
      where: { libelle: data.libelle }
    });
    if (existing) throw new Error('Cette catégorie existe déjà');

    return prisma.categorie.create({
      data,
      select: {
        id: true,
        libelle: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getAllCategories() {
    return prisma.categorie.findMany({
      select: {
        id: true,
        libelle: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getCategorieById(id) {
    const categorie = await prisma.categorie.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        libelle: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!categorie) throw new Error('Catégorie non trouvée');
    return categorie;
  }

  async updateCategorie(id, data) {
    const existing = await prisma.categorie.findUnique({ where: { id: parseInt(id) } });
    if (!existing) throw new Error('Catégorie non trouvée');

    return prisma.categorie.update({
      where: { id: parseInt(id) },
      data,
      select: {
        id: true,
        libelle: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async deleteCategorie(id) {
    const existing = await prisma.categorie.findUnique({ where: { id: parseInt(id) } });
    if (!existing) throw new Error('Catégorie non trouvée');

    await prisma.categorie.delete({ where: { id: parseInt(id) } });
    return { message: 'Catégorie supprimée avec succès' };
  }
}

module.exports = new CategorieService();
