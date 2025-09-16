import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full px-4 py-3 flex items-center justify-between border-b bg-white sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo.png"
          alt="Stellar Health Aid Logo"
          width={150}
          height={40}
          className="drop-shadow-lg"
        />
      </div>
      <Link href="/login">
        <button className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full shadow hover:bg-yellow-500 transition">
          Get Started
        </button>
      </Link>
    </header>
  );
}
