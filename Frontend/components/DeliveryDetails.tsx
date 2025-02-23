"use client";

import { Suspense } from "react";
import { useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { deliveryManagementABI, deliveryManagementAddress } from "@/lib/contracts";

interface DeliveryDetailsProps {
  deliveryId: number;
}

interface Delivery {
  sender: string;
  courier: string;
  recipient: string;
  totalCost: bigint;
  isDelivered: boolean;
}

function DeliveryDetailsContent({ deliveryId }: DeliveryDetailsProps) {
  const { data: delivery } = useReadContract({
    address: deliveryManagementAddress,
    abi: deliveryManagementABI,
    functionName: "getDelivery",
    args: [BigInt(deliveryId)],
  });

  const { data: transactionHash } = useReadContract({
    address: deliveryManagementAddress,
    abi: deliveryManagementABI,
    functionName: "getTransactionHash",
    args: [BigInt(deliveryId)],
  });

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: transactionHash as `0x${string}`,
  });

  const typedDelivery = delivery as Delivery | null;

  if (!typedDelivery) {
    return <div>Loading delivery details...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Delivery #{deliveryId}</h2>
      <p>Sender: {typedDelivery.sender}</p>
      <p>Courier: {typedDelivery.courier}</p>
      <p>Recipient: {typedDelivery.recipient}</p>
      <p>Total Cost: {typedDelivery.totalCost.toString()} wei</p>
      <p>Status: {typedDelivery.isDelivered ? "Delivered" : "In Transit"}</p>
      {isLoading && <p>Waiting for transaction confirmation...</p>}
      {isSuccess && <p className="text-green-500">Transaction confirmed!</p>}
    </div>
  );
}

export default function DeliveryDetails({ deliveryId }: DeliveryDetailsProps) {
  return (
    <Suspense fallback={<div>Loading delivery details...</div>}>
      <DeliveryDetailsContent deliveryId={deliveryId} />
    </Suspense>
  );
}