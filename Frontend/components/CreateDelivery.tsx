"use client"

import type React from "react"

import { useState } from "react"
import { useContractWrite, useWaitForTransaction } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deliveryManagementABI, deliveryManagementAddress } from "@/lib/contracts"

export default function CreateDelivery() {
  const [deliveryId, setDeliveryId] = useState("")
  const [courier, setCourier] = useState("")
  const [recipient, setRecipient] = useState("")
  const [totalCost, setTotalCost] = useState("")

  const { write, data } = useContractWrite({
    address: deliveryManagementAddress,
    abi: deliveryManagementABI,
    functionName: "createDelivery",
  })

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    write({
      args: [BigInt(deliveryId), courier, recipient, BigInt(totalCost)],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        placeholder="Delivery ID"
        value={deliveryId}
        onChange={(e) => setDeliveryId(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Courier Address"
        value={courier}
        onChange={(e) => setCourier(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Total Cost (in wei)"
        value={totalCost}
        onChange={(e) => setTotalCost(e.target.value)}
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Delivery"}
      </Button>
      {isSuccess && <p className="text-green-500">Delivery created successfully!</p>}
    </form>
  )
}

