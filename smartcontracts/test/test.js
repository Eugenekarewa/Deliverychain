const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeliveryManagement, FiatPayment, and ProofOfDelivery", function () {
  let admin, sender, courier, recipient;
  let deliveryManagement, fiatPayment, proofOfDelivery;

  before(async function () {
    // Get signers
    [admin, sender, courier, recipient] = await ethers.getSigners();

    // Deploy DeliveryManagement contract
    const DeliveryManagement = await ethers.getContractFactory("DeliveryManagement");
    deliveryManagement = await DeliveryManagement.deploy();
    await deliveryManagement.deployed();

    // Deploy FiatPayment contract
    const FiatPayment = await ethers.getContractFactory("FiatPayment");
    fiatPayment = await FiatPayment.deploy(deliveryManagement.address);
    await fiatPayment.deployed();

    // Deploy ProofOfDelivery contract
    const ProofOfDelivery = await ethers.getContractFactory("ProofOfDelivery");
    proofOfDelivery = await ProofOfDelivery.deploy(deliveryManagement.address);
    await proofOfDelivery.deployed();
  });

  describe("DeliveryManagement", function () {
    it("should create a delivery", async function () {
      await deliveryManagement.connect(sender).createDelivery(1, courier.address, recipient.address, ethers.utils.parseEther("1"));
      const delivery = await deliveryManagement.deliveries(1);

      expect(delivery.sender).to.equal(sender.address);
      expect(delivery.courier).to.equal(courier.address);
      expect(delivery.recipient).to.equal(recipient.address);
      expect(delivery.totalCost).to.equal(ethers.utils.parseEther("1"));
      expect(delivery.isDelivered).to.be.false;
      expect(delivery.isPaid).to.be.false;
    });

    it("should confirm delivery by the courier", async function () {
      await deliveryManagement.connect(courier).confirmDelivery(1);
      const delivery = await deliveryManagement.deliveries(1);

      expect(delivery.isDelivered).to.be.true;
    });

    it("should cancel delivery by the sender", async function () {
      await deliveryManagement.connect(sender).cancelDelivery(1);
      const delivery = await deliveryManagement.deliveries(1);

      expect(delivery.sender).to.equal(ethers.constants.AddressZero); // Delivery is deleted
    });

    it("should refund payment to the sender", async function () {
      // Create a new delivery for refund testing
      await deliveryManagement.connect(sender).createDelivery(2, courier.address, recipient.address, ethers.utils.parseEther("1"));

      // Deposit payment
      await fiatPayment.connect(sender).depositPayment(2, { value: ethers.utils.parseEther("1") });

      // Cancel delivery and refund payment
      await deliveryManagement.connect(sender).cancelDelivery(2);
      await expect(deliveryManagement.connect(sender).refundPayment(2))
        .to.changeEtherBalance(sender, ethers.utils.parseEther("1"));
    });
  });

  describe("FiatPayment", function () {
    it("should deposit payment for a delivery", async function () {
      // Create a new delivery
      await deliveryManagement.connect(sender).createDelivery(3, courier.address, recipient.address, ethers.utils.parseEther("1"));

      // Deposit payment
      await expect(fiatPayment.connect(sender).depositPayment(3, { value: ethers.utils.parseEther("1") }))
        .to.emit(fiatPayment, "PaymentDeposited")
        .withArgs(3, ethers.utils.parseEther("1"));

      const deposit = await fiatPayment.deposits(3);
      expect(deposit).to.equal(ethers.utils.parseEther("1"));
    });

    it("should release payment to the courier", async function () {
      // Approve delivery
      await proofOfDelivery.connect(recipient).approveDelivery(3);

      // Release payment
      await expect(fiatPayment.connect(admin).releasePayment(3))
        .to.emit(fiatPayment, "PaymentReleased")
        .withArgs(3, courier.address, ethers.utils.parseEther("1"));

      const deposit = await fiatPayment.deposits(3);
      expect(deposit).to.equal(0);
    });
  });

  describe("ProofOfDelivery", function () {
    it("should approve delivery by the recipient", async function () {
      // Create a new delivery
      await deliveryManagement.connect(sender).createDelivery(4, courier.address, recipient.address, ethers.utils.parseEther("1"));

      // Approve delivery
      await expect(proofOfDelivery.connect(recipient).approveDelivery(4))
        .to.emit(proofOfDelivery, "DeliveryApproved")
        .withArgs(4, recipient.address);

      const isApproved = await proofOfDelivery.isDeliveryApproved(4);
      expect(isApproved).to.be.true;
    });
  });
});