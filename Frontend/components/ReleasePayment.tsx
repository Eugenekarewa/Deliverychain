"use client"

import { useContractWrite } from "wagmi"
import { Button } from "@/components/ui/button"
import { fiatPaymentABI, fiatPaymentAddress } from "@/lib/contracts"

interface ReleasePaymentProps {
  deliveryId: number
}

export default function ReleasePayment({ deliveryId }: ReleasePaymentProps) {
  const { write, isLoading, isSuccess } = useContractWrite({
    address: fiatPaymentAddress,
    abi: fiatPaymentABI,
    functionName: "releasePayment",
  })

  const handleRelease = () => {
    write({
      args: [BigInt(deliveryId)],
    })
  }

  return (
    <div>
      <Button onClick={handleRelease} disabled={isLoading}>
        {isLoading ? "Releasing..." : "Release Payment"}
      </Button>
      {isSuccess && <p className="text-green-500 mt-2">Payment released successfully!</p>}
    </div>
  )
}

