import React, { useState } from "react";
import { PricingCard } from "./PricingCard";

const PRICING_TIERS = [
  {
    id: "tier-1",
    title: "Tier 1",
    price: "85",
    features: [
      "GPT-3.5 access",
      "Text-based edits",
      "Titles, prices, and descriptions",
      "Single Shopify store integration",
    ],
    cta: "Start now",
  },
  {
    id: "tier-2",
    title: "Tier 2",
    price: "170",
    features: [
      "All Tier 1 features",
      "GPT-4o access",
      "Full store generation (1x/month)",
      "Basic ROI analysis",
    ],
    cta: "Get started",
    isPopular: true,
  },
  {
    id: "tier-3",
    title: "Tier 3",
    price: "299",
    features: [
      "All Tier 2 features",
      "Up to 5 stores per month",
      "Advanced automation",
      "Priority support",
    ],
    cta: "Upgrade now",
  },
];

export const PricingSection: React.FC = () => {
  return (
    <section className="w-full bg-[#F5F7FA] pt-[140px] pb-[180px] font-poppins">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        <h2 className="text-[55px] font-semibold leading-[66px] text-black mb-[76px]">
          Start Scaling Today
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-[56px]">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
};
