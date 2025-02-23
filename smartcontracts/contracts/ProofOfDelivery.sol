// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DeliveryManagement.sol";

contract ProofOfDelivery {
    // Immutable reference to the DeliveryManagement contract
    DeliveryManagement public immutable deliveryContract;

    // Mapping to track approved deliveries
    mapping(uint256 => bool) public approvedDeliveries;

    // Events for tracking state changes
    event DeliveryApproved(uint256 indexed deliveryId, address recipient);

    // Modifier to restrict access to the recipient of a delivery
    modifier onlyRecipient(uint256 deliveryId) {
        require(msg.sender == deliveryContract.getRecipient(deliveryId), "Only recipient can approve");
        _;
    }

    // Constructor to initialize the DeliveryManagement contract address
    constructor(address _deliveryContract) {
        require(_deliveryContract != address(0), "Invalid contract address");
        deliveryContract = DeliveryManagement(_deliveryContract);
    }

    /**
     * @dev Approves a delivery by the recipient.
     * @param deliveryId The unique ID of the delivery.
     */
    function approveDelivery(uint256 deliveryId) external onlyRecipient(deliveryId) {
        require(!approvedDeliveries[deliveryId], "Delivery already approved");

        approvedDeliveries[deliveryId] = true;
        emit DeliveryApproved(deliveryId, msg.sender);
    }

    /**
     * @dev Checks if a delivery is approved.
     * @param deliveryId The unique ID of the delivery.
     * @return True if the delivery is approved, false otherwise.
     */
    function isDeliveryApproved(uint256 deliveryId) external view returns (bool) {
        return approvedDeliveries[deliveryId];
    }
}