"use client"

import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi"
import { Button } from "@/components/ui/button"
import {
  deliveryManagementABI,
  deliveryManagementAddress,
  fiatPaymentABI,
  fiatPaymentAddress,
  proofOfDeliveryABI,
  proofOfDeliveryAddress,
} from "@/lib/contracts"

interface DeliveryDetailsProps {
  deliveryId: number
}

export default function DeliveryDetails({ deliveryId }: DeliveryDetailsProps) {
  const { data: delivery } = useContractRead({
    address: deliveryManagementAddress,
    abi: deliveryManagementABI,
    functionName: "deliveries",
    args: [BigInt(deliveryId)],
  })

  const { data: isApproved } = useContractRead({
    address: proofOfDeliveryAddress,
    abi: proofOfDeliveryABI,
    functionName: "isDeliveryApproved",
    args: [BigInt(deliveryId)],
  })

  const { data: depositAmount } = useContractRead({
    address: fiatPaymentAddress,
    abi: fiatPaymentABI,
    functionName: "deposits",
    args: [BigInt(deliveryId)],
  })

  const { write: confirmDelivery, data: confirmData } = useContractWrite({
    address: deliveryManagementAddress,
    abi: deliveryManagementABI,
    functionName: "confirmDelivery",
  })

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransaction({
    hash: confirmData?.hash,
  })

  const { write: approveDelivery, data: approveData } = useContractWrite({
    address: proofOfDeliveryAddress,
    abi: proofOfDeliveryABI,
    functionName: "approveDelivery",
  })

  const { isLoading: isApproving, isSuccess: isApproveSuccess } = useWaitForTransaction({
    hash: approveData?.hash,
  })

  if (!delivery) {
    return <p>Loading delivery details...</p>
  }

  const [sender, courier, recipient, totalCost, isDelivered, isPaid] = delivery

  const handleConfirmDelivery = () => {
    confirmDelivery({ args: [BigInt(deliveryId)] })
  }

  const handleApproveDelivery = () => {
    approveDelivery({ args: [BigInt(deliveryId)] })
  }

  return (
    <div className="space-y-4">
      <p>
        <strong>Sender:</strong> {sender}
      </p>
      <p>
        <strong>Courier:</strong> {courier}
      </p>
      <p>
        <strong>Recipient:</strong> {recipient}
      </p>
      <p>
        <strong>Total Cost:</strong> {totalCost.toString()} wei
      </p>
      <p>
        <strong>Is Delivered:</strong> {isDelivered ? "Yes" : "No"}
      </p>
      <p>
        <strong>Is Paid:</strong> {isPaid ? "Yes" : "No"}
      </p>
      <p>
        <strong>Is Approved:</strong> {isApproved ? "Yes" : "No"}
      </p>
      <p>
        <strong>Deposit Amount:</strong> {depositAmount?.toString() || "0"} wei
      </p>

      <div className="space-y-2">
        {!isDelivered && (
          <Button onClick={handleConfirmDelivery} disabled={isConfirming}>
            {isConfirming ? "Confirming..." : "Confirm Delivery"}
          </Button>
        )}
        {isDelivered && !isApproved && (
          <Button onClick={handleApproveDelivery} disabled={isApproving}>
            {isApproving ? "Approving..." : "Approve Delivery"}
          </Button>
        )}
      </div>
      {isConfirmed && <p className="text-green-500">Delivery confirmed successfully!</p>}
      {isApproveSuccess && <p className="text-green-500">Delivery approved successfully!</p>}
    </div>
  )
}

