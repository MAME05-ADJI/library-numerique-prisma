const database = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class DocumentService {
  constructor() {
    this.prisma = database.getInstance();
  }

  async createDocument(data) {
    try {
      data.hashDocument = uuidv4(); // Génère un hash unique
      const document = await this.prisma.document.create({
        data,
        select: {
          id: true,
          titre: true,
          auteur: true,
          fichier: true,
          dateDepot: true,
          hashDocument: true,
          typeDocumentAccepte: true,
          tailleFichier: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return document;
    } catch (error) {
      throw error;
    }
  }

  async getAllDocuments(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.document.count()
    ]);
    return {
      documents,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    };
  }

  async getDocumentById(id) {
    const document = await this.prisma.document.findUnique({
      where: { id: parseInt(id) }
    });
    if (!document) throw new Error('Document non trouvé');
    return document;
  }

  async updateDocument(id, updateData) {
    const document = await this.getDocumentById(id);
    if (!document) throw new Error('Document non trouvé');
    return await this.prisma.document.update({
      where: { id: parseInt(id) },
      data: updateData
    });
  }

  async deleteDocument(id) {
    const document = await this.getDocumentById(id);
    if (!document) throw new Error('Document non trouvé');
    await this.prisma.document.delete({
      where: { id: parseInt(id) }
    });
    return { message: 'Document supprimé avec succès' };
  }

  async searchDocuments(query) {
    return await this.prisma.document.findMany({
      where: {
        OR: [
          { titre: { contains: query, mode: 'insensitive' } },
          { auteur: { contains: query, mode: 'insensitive' } }
        ]
      }
    });
  }
}

module.exports = new DocumentService();
