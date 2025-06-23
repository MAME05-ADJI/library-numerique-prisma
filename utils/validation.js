
class Validator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUser(userData, isUpdate = false) {
    const errors = [];

    // Email
    if (!isUpdate && !userData.email) {
      errors.push('Email requis');
    } else if (userData.email && !this.validateEmail(userData.email)) {
      errors.push('Email invalide');
    }

   

    // Password
    if (!isUpdate && !userData.password) {
      errors.push('Mot de passe requis');
    } else if (userData.password && userData.password.length < 6) {
      errors.push('Le mot de passe doit contenir au moins 6 caractères');
    }
// Role
    // if (!isUpdate && !userData.role) {
    //   errors.push('Rôle requis');
    // } else if (userData.role && !this.validateRole(userData.role)) {
    //   errors.push('Rôle invalide (valeurs possibles : admin, etudiant, enseignant)');
    // }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Validator;