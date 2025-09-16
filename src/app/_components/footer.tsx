import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-10 px-4 mt-auto">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16 lg:gap-24">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image src="/images/logo.png" alt="Logo" width={56} height={56} />
            <span className="font-bold text-xl text-yellow-400">Health Aid</span>
          </div>
          <p className="text-gray-300 text-sm">
            Decentralized health wallet powered by Stellar blockchain.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link href="dashboard/wallet" className="hover:text-white">Wallet</Link></li>
            <li><Link href="/community" className="hover:text-white">Community</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">Security</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Disclaimer</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-xs">
        <p>&copy; 2025 Stellar HealthAid. All rights reserved.</p>
      </div>
    </footer>
  );
}
