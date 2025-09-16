import Link from "next/link";

export default function Cta() {
  return (
    <section
      className="w-full px-4 py-10 flex flex-col items-center animate-fade-in"
      style={{
        background: "linear-gradient(135deg, #F7E06D 0%, #F2D43D 100%)"
      }}
    >
      <div className="max-w-lg w-full flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Join the movement to<br />redefine healthcare.
        </h2>
        <p className="text-base md:text-lg text-gray-900 text-center mb-8">
          Thousands are already protecting their health and money with Stellar Health Aid.<br />Are you ready?
        </p>
        <Link href="/login" className="w-full">
          <button className="bg-white text-black font-semibold px-5 py-3 rounded-full w-full border-2 border-black text-base hover:bg-gray-50 transition-all duration-300 ease-in-out hover:scale-105">
            Start Your Health Wallet Today
          </button>
        </Link>
      </div>
    </section>
  );
}
