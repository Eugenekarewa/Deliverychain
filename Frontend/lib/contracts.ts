export const deliveryManagementAddress = "0x..." // Replace with actual contract address
export const fiatPaymentAddress = "0x..." // Replace with actual contract address
export const proofOfDeliveryAddress = "0x..." // Replace with actual contract address

export const deliveryManagementABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "deliveryId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "DeliveryApproved",
    type: "event",
  },
  // ... (rest of the DeliveryManagement ABI)
]

export const fiatPaymentABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_deliveryContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "deliveryId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaymentDeposited",
    type: "event",
  },
  // ... (rest of the FiatPayment ABI)
]

export const proofOfDeliveryABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_deliveryContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "deliveryId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "DeliveryApproved",
    type: "event",
  },
  // ... (rest of the ProofOfDelivery ABI)
]

