import React from "react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[600px] bg-gradient-to-b from-[#903DED] to-[#0C0F2F] flex flex-col items-center justify-center px-[40px] py-[80px]">
      <h1
        className="font-bold text-center text-white"
        style={{
          fontSize: "72px",
          lineHeight: "79px",
        }}
      >
        Automate Everything
      </h1>
      <p
        className="text-center text-white/80 mt-[16px] max-w-[900px]"
        style={{
          fontSize: "20px",
          lineHeight: "28px",
        }}
      >
        Let AI run your store’s products, design, and updates so you can skip the busywork
      </p>
    </section>
  );
}
