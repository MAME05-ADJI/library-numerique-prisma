// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Bibliotheque {
    // Énumérations
    enum Role {
        ADMIN,
        ETUDIANT,
        PROFESSEUR
    }

    enum TypeOperation {
        DEPOT,
        TELECHARGEMENT,
        CONSULTATION,
        VALIDATION
    }

    enum TypeValidation {
        DOCUMENT,
        EMPRUNT,
        RETOUR
    }

    // Structures
    struct Utilisateur {
        uint256 id;
        string nom;
        string prenom;
        string email;
        Role role;
        uint256 reputationScore;
        bool active;
        uint256 createdAt;
    }

    struct Document {
        uint256 id;
        string titre;
        string auteur;
        string hashFichier;
        string pageCouverture;
        string textMeta;
        string hashDocument;
        string typeDocument;
        uint256 tailleFichier;
        uint256 utilisateurId;
        uint256 categorieId;
        uint256 validationId;
        bool valide;
        uint256 dateDepot;
    }

    struct Transaction {
        uint256 id;
        TypeOperation typeOperation;
        uint256 dateTransaction;
        string hashTransaction;
        uint256 coutTransaction;
        uint256 utilisateurId;
    }

    struct Validation {
        uint256 id;
        uint256 dateValidation;
        string hashValidation;
        address adresseValidateur;
        string sommeDenombreValidation;
        TypeValidation typeValidation;
        uint256 utilisateurId;
        uint256 emprunterDocId;
        bool validee;
    }

    struct EmprunterDoc {
        uint256 id;
        uint256 dateEmprunt;
        uint256 dateRetour;
        uint256 documentId;
        uint256 utilisateurId;
        bool retourne;
    }

    struct Categorie {
        uint256 id;
        string libelle;
        bool active;
    }

    struct Consultation {
        uint256 id;
        uint256 dateConsultation;
        uint256 utilisateurId;
        uint256 documentId;
    }

    struct Telechargement {
        uint256 id;
        uint256 dateTelechargement;
        uint256 utilisateurId;
        uint256 documentId;
    }

    // Variables d'état
    address public owner;
    uint256 private nextUserId = 1;
    uint256 private nextDocumentId = 1;
    uint256 private nextTransactionId = 1;
    uint256 private nextValidationId = 1;
    uint256 private nextEmpruntId = 1;
    uint256 private nextCategorieId = 1;
    uint256 private nextConsultationId = 1;
    uint256 private nextTelechargementId = 1;

    // Mappings
    mapping(uint256 => Utilisateur) public utilisateurs;
    mapping(string => uint256) public emailToUserId;
    mapping(uint256 => Document) public documents;
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => Validation) public validations;
    mapping(uint256 => EmprunterDoc) public emprunts;
    mapping(uint256 => Categorie) public categories;
    mapping(uint256 => Consultation[]) public consultations;
    mapping(uint256 => Telechargement[]) public telechargements;
    mapping(uint256 => uint256[]) public documentsParUtilisateur;
    mapping(uint256 => uint256[]) public documentsParCategorie;

    // Events
    event UtilisateurCree(uint256 indexed id, string email, Role role);
    event DocumentDepose(uint256 indexed id, string titre, uint256 utilisateurId);
    event DocumentValide(uint256 indexed documentId, uint256 validationId);
    event DocumentEmprunte(uint256 indexed empruntId, uint256 documentId, uint256 utilisateurId);
    event DocumentRetourne(uint256 indexed empruntId);
    event DocumentConsulte(uint256 indexed documentId, uint256 utilisateurId);
    event DocumentTelecharge(uint256 indexed documentId, uint256 utilisateurId);
    event TransactionEnregistree(uint256 indexed id, TypeOperation typeOperation, uint256 utilisateurId);
    event CategorieCreee(uint256 indexed id, string libelle);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Seul le proprietaire peut executer cette action");
        _;
    }

    modifier onlyAdmin() {
        require(getUtilisateurRole(msg.sender) == Role.ADMIN, "Seuls les admins peuvent executer cette action");
        _;
    }

    modifier utilisateurExiste(uint256 _utilisateurId) {
        require(utilisateurs[_utilisateurId].id != 0, "Utilisateur n'existe pas");
        _;
    }

    modifier documentExiste(uint256 _documentId) {
        require(documents[_documentId].id != 0, "Document n'existe pas");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Créer l'admin initial
        creerUtilisateur("Admin", "System", "admin@bibliotheque.com", Role.ADMIN);
    }

    // Fonctions pour les utilisateurs
    function creerUtilisateur(
        string memory _nom,
        string memory _prenom,
        string memory _email,
        Role _role
    ) public onlyAdmin returns (uint256) {
        require(emailToUserId[_email] == 0, "Email deja utilise");

        uint256 userId = nextUserId++;
        utilisateurs[userId] = Utilisateur({
            id: userId,
            nom: _nom,
            prenom: _prenom,
            email: _email,
            role: _role,
            reputationScore: 0,
            active: true,
            createdAt: block.timestamp
        });

        emailToUserId[_email] = userId;
        emit UtilisateurCree(userId, _email, _role);
        return userId;
    }

    function getUtilisateur(uint256 _id) public view returns (Utilisateur memory) {
        return utilisateurs[_id];
    }

    function getUtilisateurRole(address _addr) public view returns (Role) {
        // Logique simplifiée - dans un vrai système, vous auriez un mapping address => userId
        return Role.ETUDIANT; // Par défaut
    }

    // Fonctions pour les catégories
    function creerCategorie(string memory _libelle) public onlyAdmin returns (uint256) {
        uint256 categorieId = nextCategorieId++;
        categories[categorieId] = Categorie({
            id: categorieId,
            libelle: _libelle,
            active: true
        });

        emit CategorieCreee(categorieId, _libelle);
        return categorieId;
    }

    // Fonctions pour les documents
    function deposerDocument(
        string memory _titre,
        string memory _auteur,
        string memory _hashFichier,
        string memory _pageCouverture,
        string memory _textMeta,
        string memory _hashDocument,
        string memory _typeDocument,
        uint256 _tailleFichier,
        uint256 _utilisateurId,
        uint256 _categorieId
    ) public utilisateurExiste(_utilisateurId) returns (uint256) {
        require(categories[_categorieId].active, "Categorie n'existe pas");

        uint256 documentId = nextDocumentId++;
        documents[documentId] = Document({
            id: documentId,
            titre: _titre,
            auteur: _auteur,
            hashFichier: _hashFichier,
            pageCouverture: _pageCouverture,
            textMeta: _textMeta,
            hashDocument: _hashDocument,
            typeDocument: _typeDocument,
            tailleFichier: _tailleFichier,
            utilisateurId: _utilisateurId,
            categorieId: _categorieId,
            validationId: 0,
            valide: false,
            dateDepot: block.timestamp
        });

        documentsParUtilisateur[_utilisateurId].push(documentId);
        documentsParCategorie[_categorieId].push(documentId);

        // Enregistrer la transaction
        enregistrerTransaction(TypeOperation.DEPOT, _utilisateurId, 0);

        emit DocumentDepose(documentId, _titre, _utilisateurId);
        return documentId;
    }

    function validerDocument(
        uint256 _documentId,
        string memory _hashValidation,
        string memory _sommeDenombreValidation
    ) public onlyAdmin documentExiste(_documentId) returns (uint256) {
        require(!documents[_documentId].valide, "Document deja valide");

        uint256 validationId = nextValidationId++;
        validations[validationId] = Validation({
            id: validationId,
            dateValidation: block.timestamp,
            hashValidation: _hashValidation,
            adresseValidateur: msg.sender,
            sommeDenombreValidation: _sommeDenombreValidation,
            typeValidation: TypeValidation.DOCUMENT,
            utilisateurId: documents[_documentId].utilisateurId,
            emprunterDocId: 0,
            validee: true
        });

        documents[_documentId].validationId = validationId;
        documents[_documentId].valide = true;

        // Augmenter la réputation de l'utilisateur
        utilisateurs[documents[_documentId].utilisateurId].reputationScore += 10;

        // Enregistrer la transaction
        enregistrerTransaction(TypeOperation.VALIDATION, documents[_documentId].utilisateurId, 5);

        emit DocumentValide(_documentId, validationId);
        return validationId;
    }

    // Fonctions pour les emprunts
    function emprunterDocument(
        uint256 _documentId,
        uint256 _utilisateurId
    ) public documentExiste(_documentId) utilisateurExiste(_utilisateurId) returns (uint256) {
        require(documents[_documentId].valide, "Document non valide");

        uint256 empruntId = nextEmpruntId++;
        emprunts[empruntId] = EmprunterDoc({
            id: empruntId,
            dateEmprunt: block.timestamp,
            dateRetour: 0,
            documentId: _documentId,
            utilisateurId: _utilisateurId,
            retourne: false
        });

        emit DocumentEmprunte(empruntId, _documentId, _utilisateurId);
        return empruntId;
    }

    function retournerDocument(uint256 _empruntId) public {
        require(emprunts[_empruntId].id != 0, "Emprunt n'existe pas");
        require(!emprunts[_empruntId].retourne, "Document deja retourne");

        emprunts[_empruntId].dateRetour = block.timestamp;
        emprunts[_empruntId].retourne = true;

        emit DocumentRetourne(_empruntId);
    }

    // Fonctions pour les consultations et téléchargements
    function consulterDocument(
        uint256 _documentId,
        uint256 _utilisateurId
    ) public documentExiste(_documentId) utilisateurExiste(_utilisateurId) {
        require(documents[_documentId].valide, "Document non valide");

        uint256 consultationId = nextConsultationId++;
        consultations[_documentId].push(Consultation({
            id: consultationId,
            dateConsultation: block.timestamp,
            utilisateurId: _utilisateurId,
            documentId: _documentId
        }));

        // Enregistrer la transaction
        enregistrerTransaction(TypeOperation.CONSULTATION, _utilisateurId, 1);

        emit DocumentConsulte(_documentId, _utilisateurId);
    }

    function telechargerDocument(
        uint256 _documentId,
        uint256 _utilisateurId
    ) public documentExiste(_documentId) utilisateurExiste(_utilisateurId) {
        require(documents[_documentId].valide, "Document non valide");

        uint256 telechargementId = nextTelechargementId++;
        telechargements[_documentId].push(Telechargement({
            id: telechargementId,
            dateTelechargement: block.timestamp,
            utilisateurId: _utilisateurId,
            documentId: _documentId
        }));

        // Enregistrer la transaction
        enregistrerTransaction(TypeOperation.TELECHARGEMENT, _utilisateurId, 2);

        emit DocumentTelecharge(_documentId, _utilisateurId);
    }

    // Fonction privée pour enregistrer les transactions
    function enregistrerTransaction(
        TypeOperation _typeOperation,
        uint256 _utilisateurId,
        uint256 _cout
    ) private {
        uint256 transactionId = nextTransactionId++;
        string memory hashTx = string(abi.encodePacked("TX", toString(transactionId), toString(block.timestamp)));
        
        transactions[transactionId] = Transaction({
            id: transactionId,
            typeOperation: _typeOperation,
            dateTransaction: block.timestamp,
            hashTransaction: hashTx,
            coutTransaction: _cout,
            utilisateurId: _utilisateurId
        });

        emit TransactionEnregistree(transactionId, _typeOperation, _utilisateurId);
    }

    // Fonctions de consultation
    function getDocumentsParUtilisateur(uint256 _utilisateurId) public view returns (uint256[] memory) {
        return documentsParUtilisateur[_utilisateurId];
    }

    function getDocumentsParCategorie(uint256 _categorieId) public view returns (uint256[] memory) {
        return documentsParCategorie[_categorieId];
    }

    function getConsultationsDocument(uint256 _documentId) public view returns (Consultation[] memory) {
        return consultations[_documentId];
    }

    function getTelechargementsDocument(uint256 _documentId) public view returns (Telechargement[] memory) {
        return telechargements[_documentId];
    }

    // Fonction utilitaire pour convertir uint en string
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // Fonctions d'administration
    function mettreAJourReputationUtilisateur(uint256 _utilisateurId, uint256 _nouveauScore) public onlyAdmin {
        utilisateurs[_utilisateurId].reputationScore = _nouveauScore;
    }

    function desactiverUtilisateur(uint256 _utilisateurId) public onlyAdmin {
        utilisateurs[_utilisateurId].active = false;
    }

    function activerUtilisateur(uint256 _utilisateurId) public onlyAdmin {
        utilisateurs[_utilisateurId].active = true;
    }
}