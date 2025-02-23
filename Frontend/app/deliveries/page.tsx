"use client"

import { useState, useEffect } from "react"
import { useAccount, useContractRead } from "wagmi"
import { deliveryManagementAddress, deliveryManagementABI } from "@/lib/contracts"
import CreateDelivery from "@/components/CreateDelivery"
import DeliveryList from "@/components/DeliveryList"
import DeliveryDetails from "@/components/DeliveryDetails"

export default function DeliveriesPage() {
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<number | null>(null)
  const { isConnected } = useAccount()

  const { data: latestDeliveryId } = useContractRead({
    address: deliveryManagementAddress,
    abi: deliveryManagementABI,
    functionName: "getLatestDeliveryId",
  })

  useEffect(() => {
    if (latestDeliveryId) {
      setSelectedDeliveryId(Number(latestDeliveryId))
    }
  }, [latestDeliveryId])

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-bold">Please connect your wallet to use the app.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Delivery Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Create New Delivery</h2>
          <CreateDelivery />
          <h2 className="text-2xl font-semibold mt-8 mb-4">Delivery List</h2>
          <DeliveryList onSelectDelivery={setSelectedDeliveryId} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>
          {selectedDeliveryId ? (
            <DeliveryDetails deliveryId={selectedDeliveryId} />
          ) : (
            <p>Select a delivery to view details</p>
          )}
        </div>
      </div>
    </div>
  )
}

