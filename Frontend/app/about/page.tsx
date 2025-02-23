import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">About DeliverChain</h1>
      <p className="text-lg mb-6">
        DeliverChain is a decentralized delivery management system powered by blockchain technology. We aim to
        revolutionize the logistics industry by providing a transparent, secure, and efficient platform for managing
        deliveries.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
      <p className="text-lg mb-6">
        Our mission is to create a trustless environment for all parties involved in the delivery process, including
        senders, couriers, and recipients. By leveraging smart contracts, we ensure that payments are secure, deliveries
        are traceable, and disputes are minimized.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
      <ul className="list-disc list-inside text-lg mb-6">
        <li>Secure escrow payments using smart contracts</li>
        <li>Real-time tracking of deliveries</li>
        <li>Proof of delivery on the blockchain</li>
        <li>Transparent fee structure</li>
        <li>Decentralized dispute resolution</li>
      </ul>
      <Link href="/deliveries">
        <Button size="lg" className="mt-4">
          Start Using DeliverChain
        </Button>
      </Link>
    </div>
  )
}

