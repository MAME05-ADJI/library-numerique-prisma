const express = require('express');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const database = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à la base de données via Prisma
database.getInstance(); // Assure que Prisma est initialisé

// Middlewares globaux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes utilisateurs
app.use('/api/users', userRoutes);

// Route d'accueil/test
app.get('/', (req, res) => {
  res.json({
    message: '✅ API Prisma + Express fonctionne correctement',
    endpoints: {
      'POST /api/users': 'Créer un utilisateur',
      'GET /api/users': 'Lister les utilisateurs (avec pagination)',
      'GET /api/users/search?q=terme': 'Rechercher des utilisateurs',
      'GET /api/users/:id': 'Obtenir un utilisateur par ID',
      'PUT /api/users/:id': 'Mettre à jour un utilisateur',
      'DELETE /api/users/:id': 'Supprimer un utilisateur'
    }
  });
});

// Middleware de gestion d'erreurs personnalisées
app.use(errorHandler);

// Route 404 pour toutes les autres requêtes non définies
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '❌ Route non trouvée'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

// Arrêt propre : déconnexion de Prisma
const shutdown = async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await database.disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = app;
