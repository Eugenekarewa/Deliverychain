"use client"

import { useState, useEffect } from "react"
import { useContractRead } from "wagmi"
import { deliveryManagementABI, deliveryManagementAddress } from "@/lib/contracts"

interface DeliveryListProps {
  onSelectDelivery: (deliveryId: number) => void
}

export default function DeliveryList({ onSelectDelivery }: DeliveryListProps) {
  const [deliveries, setDeliveries] = useState<number[]>([])

  const { data: latestDeliveryId } = useContractRead({
    address: deliveryManagementAddress,
    abi: deliveryManagementABI,
    functionName: "getLatestDeliveryId",
  })

  useEffect(() => {
    if (latestDeliveryId) {
      const ids = Array.from({ length: Number(latestDeliveryId) }, (_, i) => i + 1)
      setDeliveries(ids)
    }
  }, [latestDeliveryId])

  return (
    <ul className="space-y-2">
      {deliveries.map((id) => (
        <li key={id} className="cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => onSelectDelivery(id)}>
          Delivery #{id}
        </li>
      ))}
    </ul>
  )
}

