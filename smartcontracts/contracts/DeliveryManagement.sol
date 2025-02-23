// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DeliveryManagement {
    // Struct to represent a delivery
    struct Delivery {
        address sender;
        address courier;
        address recipient;
        uint256 totalCost;
        bool isDelivered;
        bool isPaid;
    }

    // Mappings to store deliveries and approvals
    mapping(uint256 => Delivery) public deliveries;
    mapping(uint256 => bool) public approvedDeliveries;

    // Admin address is immutable to save gas
    address public immutable admin;

    // Events for tracking state changes
    event DeliveryCreated(uint256 indexed deliveryId, address sender, address courier, address recipient, uint256 totalCost);
    event DeliveryConfirmed(uint256 indexed deliveryId, address courier);
    event DeliveryApproved(uint256 indexed deliveryId, address recipient);
    event DeliveryCanceled(uint256 indexed deliveryId, address sender);
    event PaymentRefunded(uint256 indexed deliveryId, address sender, uint256 amount);

    // Modifiers for access control
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlySender(uint256 deliveryId) {
        require(msg.sender == deliveries[deliveryId].sender, "Only sender can perform this action");
        _;
    }

    modifier onlyCourier(uint256 deliveryId) {
        require(msg.sender == deliveries[deliveryId].courier, "Only assigned courier can perform this action");
        _;
    }

    modifier onlyRecipient(uint256 deliveryId) {
        require(msg.sender == deliveries[deliveryId].recipient, "Only recipient can perform this action");
        _;
    }

    // Constructor to set the admin address
    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Creates a new delivery.
     * @param deliveryId The unique ID of the delivery.
     * @param courier The address of the courier.
     * @param recipient The address of the recipient.
     * @param totalCost The total cost of the delivery.
     */
    function createDelivery(
        uint256 deliveryId,
        address courier,
        address recipient,
        uint256 totalCost
    ) external {
        require(deliveries[deliveryId].sender == address(0), "Delivery ID already exists");
        require(courier != address(0), "Invalid courier address");
        require(recipient != address(0), "Invalid recipient address");
        require(totalCost > 0, "Total cost must be greater than zero");

        deliveries[deliveryId] = Delivery({
            sender: msg.sender,
            courier: courier,
            recipient: recipient,
            totalCost: totalCost,
            isDelivered: false,
            isPaid: false
        });

        emit DeliveryCreated(deliveryId, msg.sender, courier, recipient, totalCost);
    }

    /**
     * @dev Confirms delivery by the courier.
     * @param deliveryId The unique ID of the delivery.
     */
    function confirmDelivery(uint256 deliveryId) external onlyCourier(deliveryId) {
        deliveries[deliveryId].isDelivered = true;
        emit DeliveryConfirmed(deliveryId, msg.sender);
    }

    /**
     * @dev Approves delivery by the recipient.
     * @param deliveryId The unique ID of the delivery.
     */
    function approveDelivery(uint256 deliveryId) external onlyRecipient(deliveryId) {
        approvedDeliveries[deliveryId] = true;
        emit DeliveryApproved(deliveryId, msg.sender);
    }

    /**
     * @dev Cancels a delivery by the sender.
     * @param deliveryId The unique ID of the delivery.
     */
    function cancelDelivery(uint256 deliveryId) external onlySender(deliveryId) {
        require(!deliveries[deliveryId].isDelivered, "Delivery already confirmed");
        require(!approvedDeliveries[deliveryId], "Delivery already approved");

        delete deliveries[deliveryId];
        emit DeliveryCanceled(deliveryId, msg.sender);
    }

    /**
     * @dev Refunds the payment to the sender if the delivery is canceled.
     * @param deliveryId The unique ID of the delivery.
     */
    function refundPayment(uint256 deliveryId) external payable onlySender(deliveryId) {
        require(!deliveries[deliveryId].isDelivered, "Delivery already confirmed");
        require(!approvedDeliveries[deliveryId], "Delivery already approved");
        require(deliveries[deliveryId].totalCost > 0, "No payment to refund");

        uint256 refundAmount = deliveries[deliveryId].totalCost;
        deliveries[deliveryId].totalCost = 0;

        payable(msg.sender).transfer(refundAmount);
        emit PaymentRefunded(deliveryId, msg.sender, refundAmount);
    }

    /**
     * @dev Returns the sender of a delivery.
     * @param deliveryId The ID of the delivery.
     * @return The sender's address.
     */
    function getSender(uint256 deliveryId) external view returns (address) {
        return deliveries[deliveryId].sender;
    }

    /**
     * @dev Returns the courier of a delivery.
     * @param deliveryId The ID of the delivery.
     * @return The courier's address.
     */
    function getCourier(uint256 deliveryId) external view returns (address) {
        return deliveries[deliveryId].courier;
    }

    /**
     * @dev Returns the recipient of a delivery.
     * @param deliveryId The ID of the delivery.
     * @return The recipient's address.
     */
    function getRecipient(uint256 deliveryId) external view returns (address) {
        return deliveries[deliveryId].recipient;
    }

    /**
     * @dev Returns the total cost of a delivery.
     * @param deliveryId The ID of the delivery.
     * @return The total cost.
     */
    function getTotalCost(uint256 deliveryId) external view returns (uint256) {
        return deliveries[deliveryId].totalCost;
    }

    /**
     * @dev Checks if a delivery is approved.
     * @param deliveryId The ID of the delivery.
     * @return True if the delivery is approved, false otherwise.
     */
    function isDeliveryApproved(uint256 deliveryId) external view returns (bool) {
        return approvedDeliveries[deliveryId];
    }

    /**
     * @dev Checks if a delivery is delivered.
     * @param deliveryId The ID of the delivery.
     * @return True if the delivery is delivered, false otherwise.
     */
    function isDeliveryDelivered(uint256 deliveryId) external view returns (bool) {
        return deliveries[deliveryId].isDelivered;
    }
}