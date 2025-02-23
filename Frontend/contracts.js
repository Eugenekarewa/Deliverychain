import { ethers } from 'ethers';
import DeliveryManagementABI from './abis/DeliveryManagement.json';
import FiatPaymentABI from './abis/FiatPayment.json';
import ProofOfDeliveryABI from './abis/ProofOfDelivery.json';

const deliveryManagementAddress = 'YOUR_DELIVERY_MANAGEMENT_CONTRACT_ADDRESS';
const fiatPaymentAddress = 'YOUR_FIAT_PAYMENT_CONTRACT_ADDRESS';
const proofOfDeliveryAddress = 'YOUR_PROOF_OF_DELIVERY_CONTRACT_ADDRESS';

export const getDeliveryManagementContract = (signerOrProvider) => {
  return new ethers.Contract(deliveryManagementAddress, DeliveryManagementABI, signerOrProvider);
};

export const getFiatPaymentContract = (signerOrProvider) => {
  return new ethers.Contract(fiatPaymentAddress, FiatPaymentABI, signerOrProvider);
};

export const getProofOfDeliveryContract = (signerOrProvider) => {
  return new ethers.Contract(proofOfDeliveryAddress, ProofOfDeliveryABI, signerOrProvider);
};