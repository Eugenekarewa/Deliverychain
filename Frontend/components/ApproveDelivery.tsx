"use client"

import { useContractWrite } from "wagmi"
import { Button } from "@/components/ui/button"
import { proofOfDeliveryABI, proofOfDeliveryAddress } from "@/lib/contracts"

interface ApproveDeliveryProps {
  deliveryId: number
}

export default function ApproveDelivery({ deliveryId }: ApproveDeliveryProps) {
  const { write, isLoading, isSuccess } = useContractWrite({
    address: proofOfDeliveryAddress,
    abi: proofOfDeliveryABI,
    functionName: "approveDelivery",
  })

  const handleApprove = () => {
    write({
      args: [BigInt(deliveryId)],
    })
  }

  return (
    <div>
      <Button onClick={handleApprove} disabled={isLoading}>
        {isLoading ? "Approving..." : "Approve Delivery"}
      </Button>
      {isSuccess && <p className="text-green-500 mt-2">Delivery approved successfully!</p>}
    </div>
  )
}

