import React from "react";

type PricingTier = {
  id: string;
  title: string;
  price: string;
  features: string[];
  cta: string;
  isPopular?: boolean;
};

interface PricingCardProps {
  tier: PricingTier;
}

export const PricingCard: React.FC<PricingCardProps> = ({ tier }) => {
  return (
    <div className="w-[350px] bg-white rounded-[28px] shadow-lg py-[36px] px-[42px] flex flex-col items-start gap-6">
      <h3 className="text-[28px] font-semibold text-black">{tier.title}</h3>
      <div className="flex items-end gap-1">
        <p className="text-[44px] font-bold text-black">€{tier.price}</p>
        <span className="text-[18px] text-gray-500">/month</span>
      </div>
      <ul className="flex flex-col gap-4 mt-4">
        {tier.features.map((feature, idx) => (
          <li key={idx} className="flex gap-2 items-start select-none">
            <span className="text-green-500">✅</span>
            <span className="text-[16px] text-black leading-[1.6]">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        aria-label={`Start with ${tier.title} plan`}
        className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-[#006CF9] to-[#D408D0] text-white text-[16px] font-semibold cursor-pointer hover:shadow-xl transition-shadow"
      >
        {tier.cta}
      </button>
    </div>
  );
};
