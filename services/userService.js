
const bcrypt = require('bcryptjs');
const database = require('../config/database');

class UserService {
  constructor() {
    this.prisma = database.getInstance();
  }

  async createUser(userData) {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Créer l'utilisateur
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            name: true,
           role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.user.count()
      ]);

      return {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page * limit < total,
          hasPrevious: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, updateData) {
    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await this.prisma.user.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingUser) {
        throw new Error('Utilisateur non trouvé');
      }

      // Si email est modifié, vérifier qu'il n'existe pas déjà
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await this.prisma.user.findUnique({
          where: { email: updateData.email }
        });

        if (emailExists) {
          throw new Error('Cet email est déjà utilisé');
        }
      }

      // Hasher le nouveau mot de passe si fourni
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      // Mettre à jour l'utilisateur
      const updatedUser = await this.prisma.user.update({
        where: { id: parseInt(id) },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
         role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await this.prisma.user.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingUser) {
        throw new Error('Utilisateur non trouvé');
      }

      // Supprimer l'utilisateur
      await this.prisma.user.delete({
        where: { id: parseInt(id) }
      });

      return { message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
      throw error;
    }
  }

  async searchUsers(searchTerm) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { email: { contains: searchTerm } }
          ]
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return users;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();