import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <section className="w-full px-4 pt-8 pb-4 flex flex-col items-center text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 leading-tight">
        Healthcare is broken in Brazil.<br />We’re here to fix it.
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-md mx-auto">
        A decentralized health wallet that protects your money, makes it grow,
        and ensures it’s always there when you need it most.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs mx-auto mb-6">
        <Link href="/login">
          <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full w-full shadow hover:bg-yellow-500 transition text-base md:text-lg">
            Create Your Health Wallet
          </button>
        </Link>
        <a
          href="https://github.com/ceciliaromao/stellar-health-aid"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-white border-2 border-black text-black font-semibold px-6 py-3 rounded-full w-full hover:bg-gray-50 transition text-base md:text-lg">
            Check Documentation
          </button>
        </a>
      </div>
      <div className="flex justify-center mt-8">
        <Image
          src="/images/mockups.png"
          alt="App Mockups"
          width={1179}
          height={1042}
          className="w-full max-w-[1179px] h-auto rounded-xl"
          priority
        />
      </div>
    </section>
  );
}
