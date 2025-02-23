// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DeliveryManagement.sol";

contract FiatPayment {
    // Immutable reference to the DeliveryManagement contract
    DeliveryManagement public immutable deliveryContract;

    // Mapping to track deposits for each delivery
    mapping(uint256 => uint256) public deposits;

    // Events for tracking payment activities
    event PaymentDeposited(uint256 indexed deliveryId, uint256 amount);
    event PaymentReleased(uint256 indexed deliveryId, address courier, uint256 amount);

    // Modifier to restrict access to the sender of a delivery
    modifier onlySender(uint256 deliveryId) {
        require(msg.sender == deliveryContract.getSender(deliveryId), "Only sender can deposit");
        _;
    }

    // Modifier to restrict access to the admin of the DeliveryManagement contract
    modifier onlyAdmin() {
        require(msg.sender == deliveryContract.admin(), "Only admin can release payment");
        _;
    }

    // Constructor to initialize the DeliveryManagement contract address
    constructor(address _deliveryContract) {
        require(_deliveryContract != address(0), "Invalid contract address");
        deliveryContract = DeliveryManagement(_deliveryContract);
    }

    /**
     * @dev Allows the sender to deposit payment for a delivery.
     * @param deliveryId The ID of the delivery.
     */
    function depositPayment(uint256 deliveryId) external payable onlySender(deliveryId) {
        uint256 totalCost = deliveryContract.getTotalCost(deliveryId);
        require(msg.value > 0, "Deposit must be greater than zero");
        require(msg.value == totalCost, "Incorrect deposit amount");

        deposits[deliveryId] += msg.value;
        emit PaymentDeposited(deliveryId, msg.value);
    }

    /**
     * @dev Allows the admin to release payment to the courier after delivery approval.
     * @param deliveryId The ID of the delivery.
     */
    function releasePayment(uint256 deliveryId) external onlyAdmin {
        require(deliveryContract.isDeliveryApproved(deliveryId), "Delivery not approved");
        require(deposits[deliveryId] > 0, "No deposit available");

        address courier = deliveryContract.getCourier(deliveryId);
        uint256 amount = deposits[deliveryId];

        deposits[deliveryId] = 0;
        payable(courier).transfer(amount);
        emit PaymentReleased(deliveryId, courier, amount);
    }
}