// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const PropertySale = await ethers.getContractFactory("PropertySale");
    const propertySale = await PropertySale.deploy();
  
    console.log("PropertySale contract address:", propertySale.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
  