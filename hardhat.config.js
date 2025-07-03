require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: "http://127.0.0.1:7545", // Port utilisé par Ganache
      accounts: [
        "0x69d02e1bcff2dda1ff011ef196dcbf644d7a586f65a9f08028aa36c36754afa7", // UFR 1
        "0xc4c91ee03fb85b04e77bad184cd910d3b49eb436fb1d2f3ecd00cb094684e64d", // UFR 2
        "0xab719a8531777084af4d39060480a9530720623bc0992552d594dfc1e207b42e", // UFR 3
        "0xce5bdb58c82bd1d79d462cbbe88fb0a2a497059a2abd65b22dc2e79a40eb797e", // UFR 4
      ],
    },
  },
};
