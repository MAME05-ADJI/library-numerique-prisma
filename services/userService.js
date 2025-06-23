const bcrypt = require('bcryptjs');
const database = require('../config/database');
const jwt = require('jsonwebtoken');

class UserService {
  constructor() {
    this.prisma = database.getInstance();
    this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
  }



  // Générer un token JWT
  generateAccessToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn }
    );
  }

  // Connexion d'un utilisateur
  async login(email, motDePasse) {
    try {
      // Rechercher l'utilisateur par email
      const user = await this.prisma.utilisateur.findUnique({
        where: { email: email }
      });

      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
      if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Préparer les données utilisateur (sans le mot de passe)
      const userWithoutPassword = {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        reputationScore: user.reputationScore,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      // Générer les tokens
      const accessToken = this.generateAccessToken(userWithoutPassword);

      return {
        user: userWithoutPassword,
        accessToken,
        expiresIn: this.jwtExpiresIn
      };
    } catch (error) {
      throw error;
    }
  }
  async createUser(userData) {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = await this.prisma.utilisateur.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(userData.motDePasse, 10);

      // Créer l'utilisateur
      const user = await this.prisma.utilisateur.create({
        data: {
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          motDePasse: hashedPassword,
          role: userData.role,
           reputationScore: userData.reputationScore || 0
        },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          role: true,
          reputationScore: true,
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
        this.prisma.utilisateur.findMany({
          skip,
          take: limit,
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            role: true,
            reputationScore: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.utilisateur.count()
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
      const user = await this.prisma.utilisateur.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          role: true,
          reputationScore: true,
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

  async getUserByEmail(email) {
    try {
      const user = await this.prisma.utilisateur.findUnique({
        where: { email: email },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          role: true,
          reputationScore: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserForAuthentication(email) {
    try {
      const user = await this.prisma.utilisateur.findUnique({
        where: { email: email },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          motDePasse: true,
          role: true,
          reputationScore: true
        }
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, updateData) {
    try {
      const parsedId = parseInt(id);
      console.log(`Mise à jour de l'utilisateur avec ID: ${parsedId}`, updateData);
      // Vérifier si l'utilisateur existe
      const existingUser = await this.prisma.utilisateur.findUnique({
        where: { id: parsedId },
      });

      if (!existingUser) {
        throw new Error('Utilisateur non trouvé');
      }

      // Si email est modifié, vérifier qu'il n'existe pas déjà
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await this.prisma.utilisateur.findUnique({
          where: { email: updateData.email }
        });

        if (emailExists) {
          throw new Error('Cet email est déjà utilisé');
        }
      }

      // Préparer les données à mettre à jour
      const dataToUpdate = {};
      
      if (updateData.nom) dataToUpdate.nom = updateData.nom;
      if (updateData.prenom) dataToUpdate.prenom = updateData.prenom;
      if (updateData.email) dataToUpdate.email = updateData.email;
      if (updateData.role) dataToUpdate.role = updateData.role;
      if (updateData.reputationScore !== undefined) dataToUpdate.reputationScore = updateData.reputationScore;

      // Hasher le nouveau mot de passe si fourni
      if (updateData.motDePasse) {
        dataToUpdate.motDePasse = await bcrypt.hash(updateData.motDePasse, 10);
      }

      // Mettre à jour l'utilisateur
      const updatedUser = await this.prisma.utilisateur.update({
        where: { id: parsedId },
        data: dataToUpdate,
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          role: true,
          reputationScore: true,
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
      const existingUser = await this.prisma.utilisateur.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingUser) {
        throw new Error('Utilisateur non trouvé');
      }

      // Supprimer l'utilisateur (les relations seront supprimées automatiquement avec onDelete: Cascade)
      await this.prisma.utilisateur.delete({
        where: { id: parseInt(id) }
      });

      return { message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
      throw error;
    }
  }

  async searchUsers(searchTerm) {
    try {
      const users = await this.prisma.utilisateur.findMany({
        where: {
          OR: [
            { nom: { contains: searchTerm } },
            { prenom: { contains: searchTerm } },
            { email: { contains: searchTerm } }
          ]
        },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          role: true,
          reputationScore: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return users;
    } catch (error) {
      throw error;
    }
  }

  async getUsersByRole(role, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [users, total] = await Promise.all([
        this.prisma.utilisateur.findMany({
          where: { role: role },
          skip,
          take: limit,
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            role: true,
            reputationScore: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.utilisateur.count({
          where: { role: role }
        })
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

  async updateUserReputation(id, reputationScore) {
    try {
      const updatedUser = await this.prisma.utilisateur.update({
        where: { id: id },
        data: { reputationScore: reputationScore },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          role: true,
          reputationScore: true,
          updatedAt: true
        }
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserStats() {
    try {
      const stats = await this.prisma.utilisateur.groupBy({
        by: ['role'],
        _count: {
          role: true
        }
      });

      const totalUsers = await this.prisma.utilisateur.count();

      return {
        totalUsers,
        roleDistribution: stats.reduce((acc, stat) => {
          acc[stat.role] = stat._count.role;
          return acc;
        }, {})
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();