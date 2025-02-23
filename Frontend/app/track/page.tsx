"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default function TrackPage() {
  const [deliveryId, setDeliveryId] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<{
    id: string;
    status: "pending" | "in-transit" | "delivered" | "not-found";
    estimatedDelivery: string;
  } | null>(null);

  const handleTrackDelivery = () => {
    // Simulate fetching delivery status from an API or smart contract
    const mockDeliveryData = [
      { id: "12345", status: "in-transit" as const, estimatedDelivery: "2023-10-25" },
      { id: "67890", status: "delivered" as const, estimatedDelivery: "2023-10-20" },
    ];

    const delivery = mockDeliveryData.find((d) => d.id === deliveryId);

    if (delivery) {
      setDeliveryStatus({
        id: delivery.id,
        status: delivery.status,
        estimatedDelivery: delivery.estimatedDelivery,
      });
    } else {
      setDeliveryStatus({
        id: deliveryId,
        status: "not-found" as const,
        estimatedDelivery: "N/A",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Track Your Delivery</h1>
      <p className="text-lg text-gray-600 mb-8">
        Enter your delivery ID to track the status of your package.
      </p>

      {/* Track Delivery Form */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter Delivery ID"
            value={deliveryId}
            onChange={(e) => setDeliveryId(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleTrackDelivery} className="bg-primary hover:bg-primary/90">
            Track
          </Button>
        </div>

        {/* Delivery Status */}
        {deliveryStatus && (
          <div className="mt-8 p-6 border rounded-lg bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Delivery Status</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Package className="h-6 w-6 text-primary" />
                <span className="text-lg">Delivery ID: {deliveryStatus.id}</span>
              </div>
              <div className="flex items-center space-x-2">
                {deliveryStatus.status === "pending" && <Clock className="h-6 w-6 text-yellow-500" />}
                {deliveryStatus.status === "in-transit" && <Clock className="h-6 w-6 text-blue-500" />}
                {deliveryStatus.status === "delivered" && <CheckCircle className="h-6 w-6 text-green-500" />}
                {deliveryStatus.status === "not-found" && <XCircle className="h-6 w-6 text-red-500" />}
                <span className="text-lg">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      deliveryStatus.status === "delivered"
                        ? "text-green-500"
                        : deliveryStatus.status === "not-found"
                        ? "text-red-500"
                        : "text-blue-500"
                    }`}
                  >
                    {deliveryStatus.status === "not-found"
                      ? "Not Found"
                      : deliveryStatus.status.charAt(0).toUpperCase() + deliveryStatus.status.slice(1)}
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-gray-500" />
                <span className="text-lg">
                  Estimated Delivery: {deliveryStatus.estimatedDelivery}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}