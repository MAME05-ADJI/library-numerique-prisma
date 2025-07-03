const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Bibliotheque = await hre.ethers.getContractFactory("Bibliotheque");

 const bibliotheque = await Bibliotheque.deploy([
  "0xef58ecfB2F7937AEa46a87Dab2c12a99077A1716",
  "0x7a9B31c3Da19ab001E1AfA335f787d2bdDF05462",  // <=== corrigé ici
  "0x5F49b4ddF2962632ed99a8Ea7370F88aB5b235f6",
  "0x5d1a64E09Ea7461B931970b94Ea81263b7eE6CD7"
]);


  await bibliotheque.waitForDeployment();

  console.log("Contract deployed to address:", await bibliotheque.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
