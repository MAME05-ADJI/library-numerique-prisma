const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// ⚠️ Adresse du contrat déployé (obtenue après le déploiement avec Hardhat)
const CONTRACT_ADDRESS = "0x1f177D014e596e23740011b14b69fBa0BA7f20ff";

// ✅ Récupération de l'ABI générée automatiquement par Hardhat
const CONTRACT_ABI_PATH = path.join(__dirname, "../artifacts/contracts/Bibliotheque.sol/Bibliotheque.json");
const contractJson = JSON.parse(fs.readFileSync(CONTRACT_ABI_PATH, "utf8"));
const abi = contractJson.abi;

// ✅ Configuration du provider (Ganache local)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// ✅ Utilisation de la première clé privée (exemple : UFR1)
const PRIVATE_KEY =  "0x69d02e1bcff2dda1ff011ef196dcbf644d7a586f65a9f08028aa36c36754afa7";// UFR 1
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// ✅ Création de l'instance du contrat
const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

// ✅ Export de l’instance du contrat
module.exports = contractInstance;
