// fileUploadService.js
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const mime = require('mime-types');

class FileUploadService {
  constructor() {
    this.uploadDir = path.join(__dirname, '..', 'public', 'uploads');
    this.fileDir = path.join(this.uploadDir, 'files');
    this.imageDir = path.join(this.uploadDir, 'images');
    
    this.ensureDirectoriesExist();
  }

  async ensureDirectoriesExist() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.mkdir(this.fileDir, { recursive: true });
      await fs.mkdir(this.imageDir, { recursive: true });
    } catch (error) {
      console.error('Erreur lors de la création des répertoires:', error);
      throw error;
    }
  }

  /**
   * Génère un nom de fichier unique
   */
  generateUniqueFilename(originalName) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(originalName);
    return `${timestamp}-${randomString}${extension} `;
  }

  /**
   * Sauvegarde un fichier de ressource
   * @param {Object} file Le fichier à sauvegarder (req.file de multer)
   * @returns {Promise<string>} L'URL du fichier sauvegardé
   */
  async saveFile(file) {
    if (!file) {
      throw new Error('Aucun fichier fourni');
    }

    // Vérifier que le buffer n'est pas vide
    if (!file.buffer || file.buffer.length === 0) {
      throw new Error('Le fichier est vide ou corrompu');
    }

    const uniqueFilename = this.generateUniqueFilename(file.originalname);
    const filePath = path.join(this.fileDir, uniqueFilename);

    try {
      // Écriture avec spécification explicite du format binaire
      await fs.writeFile(filePath, file.buffer, { flag: 'w' });

      // Vérification que le fichier a été correctement écrit
      const savedFile = await fs.readFile(filePath);
      if (savedFile.length !== file.buffer.length) {
        throw new Error('Erreur lors de la sauvegarde : taille incorrecte');
      }

      console.log(
        ` Fichier sauvegardé:  ${filePath}, taille: ${file.buffer.length} bytes, `
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du fichier:', error);
      throw new Error( `Impossible de sauvegarder le fichier: ${error.message} `);
    }

    return  `/api/files/${uniqueFilename} `;
  }

  /**
   * Sauvegarde une image de ressource
   * @param {Object} image L'image à sauvegarder (req.file de multer)
   * @returns {Promise<string>} L'URL de l'image sauvegardée
   */
  async saveImage(image) {
    if (!image) {
      throw new Error('Aucune image fournie');
    }

    // Vérifier que le buffer n'est pas vide
    if (!image.buffer || image.buffer.length === 0) {
      throw new Error("L'image est vide ou corrompue");
    }

    // Vérification du type de fichier
    const fileType = mime.lookup(image.originalname);
    if (!fileType || !fileType.startsWith('image/')) {
      throw new Error('Le fichier doit être une image');
    }

    const uniqueFilename = this.generateUniqueFilename(image.originalname);
    const imagePath = path.join(this.imageDir, uniqueFilename);

    try {
      // Écriture avec spécification explicite du format binaire
      await fs.writeFile(imagePath, image.buffer, { flag: 'w' });

      // Vérification que le fichier a été correctement écrit
      const savedImage = await fs.readFile(imagePath);
      if (savedImage.length !== image.buffer.length) {
        throw new Error('Erreur lors de la sauvegarde : taille incorrecte');
      }

      console.log(
         `Image sauvegardée: ${imagePath}, taille: ${image.buffer.length} bytes `,
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'image:", error);
      throw new Error( `Impossible de sauvegarder l'image: ${error.message} `);
    }

    return  `/api/images/${uniqueFilename} `;
  }

  /**
   * Supprime un fichier ou une image existant(e)
   * @param {string} fileUrl L'URL du fichier à supprimer
   */
  async deleteFile(fileUrl) {
    if (!fileUrl) return;

    try {
      let filePath;

      if (fileUrl.startsWith('/api/files/')) {
        const filename = path.basename(fileUrl);
        filePath = path.join(this.fileDir, filename);
      } else if (fileUrl.startsWith('/api/images/')) {
        const filename = path.basename(fileUrl);
        filePath = path.join(this.imageDir, filename);
      } else {
        return; // URL non reconnue
      }

      await fs.unlink(filePath);
      console.log( `Fichier supprimé: ${filePath} `);
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      // Ne pas propager l'erreur si le fichier n'existe pas
    }
  }

  /**
   * Récupère un fichier
   * @param {string} filename Nom du fichier
   * @returns {Promise<{buffer: Buffer, mimeType: string}>} Le buffer du fichier et son type MIME
   */
  async getFile(filename) {
    const filePath = path.join(this.fileDir, filename);

    try {
      const buffer = await fs.readFile(filePath);
      const mimeType = mime.lookup(filename) || 'application/octet-stream';

      return { buffer, mimeType };
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier:', error);
      throw new Error('Fichier non trouvé ou inaccessible');
    }
  }

  /**
   * Récupère une image
   * @param {string} filename Nom de l'image
   * @returns {Promise<{buffer: Buffer, mimeType: string}>} Le buffer de l'image et son type MIME
   */
  async getImage(filename) {
    const imagePath = path.join(this.imageDir, filename);

    try {
      const buffer = await fs.readFile(imagePath);
      const mimeType = mime.lookup(filename) || 'image/jpeg';

      return { buffer, mimeType };
    } catch (error) {
      console.error("Erreur lors de la lecture de l'image:", error);
      throw new Error('Image non trouvée ou inaccessible');
    }
  }

  /**
   * Vérifie si un fichier existe
   * @param {string} filename Nom du fichier
   * @param {'file'|'image'} type Type de fichier ('file' ou 'image')
   * @returns {Promise<boolean>} True si le fichier existe
   */
  async fileExists(filename, type = 'file') {
    try {
      const filePath =
        type === 'file'
          ? path.join(this.fileDir, filename)
          : path.join(this.imageDir, filename);

      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = FileUploadService;