"use client";

import type React from "react";
import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"; // Use v1.x hooks
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deliveryManagementABI, deliveryManagementAddress } from "@/lib/contracts";

export default function CreateDelivery() {
  const [deliveryId, setDeliveryId] = useState("");
  const [courier, setCourier] = useState("");
  const [recipient, setRecipient] = useState("");
  const [totalCost, setTotalCost] = useState("");

  const { writeContract, data } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      address: deliveryManagementAddress,
      abi: deliveryManagementABI,
      functionName: "createDelivery",
      args: [BigInt(deliveryId), courier, recipient, BigInt(totalCost)],
    });
  };

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
  );
}