module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Port standard de Ganache GUI
      network_id: "*",       // Accepter n'importe quel network id
      gas: 6721975,          // Limite de gas
      gasPrice: 20000000000, // Prix du gas en wei
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",     // Version de Solidity
    }
  }
};