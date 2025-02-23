"use client"

import { useContractWrite } from "wagmi"
import { Button } from "@/components/ui/button"
import { fiatPaymentABI, fiatPaymentAddress } from "@/lib/contracts"

interface DepositPaymentProps {
  deliveryId: number
  totalCost: bigint
}

export default function DepositPayment({ deliveryId, totalCost }: DepositPaymentProps) {
  const { write, isLoading, isSuccess } = useContractWrite({
    address: fiatPaymentAddress,
    abi: fiatPaymentABI,
    functionName: "depositPayment",
  })

  const handleDeposit = () => {
    write({
      args: [BigInt(deliveryId)],
      value: totalCost,
    })
  }

  return (
    <div>
      <Button onClick={handleDeposit} disabled={isLoading}>
        {isLoading ? "Depositing..." : "Deposit Payment"}
      </Button>
      {isSuccess && <p className="text-green-500 mt-2">Payment deposited successfully!</p>}
    </div>
  )
}

