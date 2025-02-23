const { ethers, run } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy DeliveryManagement contract
  const DeliveryManagement = await ethers.getContractFactory("DeliveryManagement");
  const deliveryManagement = await DeliveryManagement.deploy();
  await deliveryManagement.waitForDeployment();

  console.log("DeliveryManagement deployed to:", deliveryManagement.target);

  // Wait for 5 confirmations
  console.log("Waiting for 5 confirmations...");
  await deliveryManagement.deploymentTransaction().wait(5);

  // Verify DeliveryManagement contract
  console.log("Verifying DeliveryManagement contract...");
  await run("verify:verify", {
    address: deliveryManagement.target,
    constructorArguments: [],
  });

  // Deploy FiatPayment contract
  const FiatPayment = await ethers.getContractFactory("FiatPayment");
  const fiatPayment = await FiatPayment.deploy(deliveryManagement.target);
  await fiatPayment.waitForDeployment();

  console.log("FiatPayment deployed to:", fiatPayment.target);

  // Wait for 5 confirmations
  console.log("Waiting for 5 confirmations...");
  await fiatPayment.deploymentTransaction().wait(5);

  // Verify FiatPayment contract
  console.log("Verifying FiatPayment contract...");
  await run("verify:verify", {
    address: fiatPayment.target,
    constructorArguments: [deliveryManagement.target],
  });

  // Deploy ProofOfDelivery contract
  const ProofOfDelivery = await ethers.getContractFactory("ProofOfDelivery");
  const proofOfDelivery = await ProofOfDelivery.deploy(deliveryManagement.target);
  await proofOfDelivery.waitForDeployment();

  console.log("ProofOfDelivery deployed to:", proofOfDelivery.target);

  // Wait for 5 confirmations
  console.log("Waiting for 5 confirmations...");
  await proofOfDelivery.deploymentTransaction().wait(5);

  // Verify ProofOfDelivery contract
  console.log("Verifying ProofOfDelivery contract...");
  await run("verify:verify", {
    address: proofOfDelivery.target,
    constructorArguments: [deliveryManagement.target],
  });

  // Log all contract addresses
  console.log("\nContract Addresses:");
  console.log("DeliveryManagement:", deliveryManagement.target);
  console.log("FiatPayment:", fiatPayment.target);
  console.log("ProofOfDelivery:", proofOfDelivery.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });