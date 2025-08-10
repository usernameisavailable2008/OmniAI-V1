import React from "react";

export type Tier = {
  name: string;
  priceText: string;
  features: string[];
  tierId: number;
};

interface PricingPageProps {
  tiers: Tier[];
  onSubscribe: (tierId: number) => void;
}

export default function PricingPage({ tiers, onSubscribe }: PricingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[rgba(0,77,255,0.15)] via-[rgba(255,0,162,0.15)] to-[rgba(0,0,0,0.44)] px-4 py-16">
      <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 text-center">Choose Your Plan</h1>
      <p className="text-white/70 text-lg mb-12 text-center max-w-2xl">
        Unlock OmniAI’s full potential by choosing the subscription tier that fits your business.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {tiers.map((tier) => (
          <div
            key={tier.tierId}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 flex flex-col justify-between shadow-lg border border-white/20"
          >
            <div>
              <h2 className="text-white text-2xl font-bold mb-2">{tier.name}</h2>
              <p className="text-white/80 text-lg mb-6">{tier.priceText}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feat, i) => (
                  <li key={i} className="text-white/70 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D408D0]"></span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => onSubscribe(tier.tierId)}
              className="bg-gradient-to-br from-[#D408D0] to-[#006CF9] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
              aria-label={`Subscribe to ${tier.name}`}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
