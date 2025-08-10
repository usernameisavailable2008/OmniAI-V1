import React from "react";

export default function RevenueWidget() {
  return (
    <div className="relative w-full max-w-[640px] mx-auto -mt-[80px]">
      <div className="bg-white/10 backdrop-blur-[20px] rounded-[32px] p-[32px] shadow-lg text-white">
        <h2 className="font-medium" style={{ fontSize: "24px", lineHeight: "32px" }}>
          Your revenue this month is:
        </h2>
        <p className="font-bold mt-[8px]" style={{ fontSize: "48px", lineHeight: "56px" }}>
          $109,683.00
        </p>
        <p className="mt-[4px] text-[#00FF94]" style={{ fontSize: "18px", lineHeight: "24px" }}>
          ▲ +331.52 (0.5%)
        </p>

        <div className="mt-[24px]">
          <svg
            viewBox="0 0 949 488"
            width="100%"
            height="488"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Monthly revenue chart"
            role="img"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient
                id="chartGradient"
                x1="299.847"
                y1="-285.04"
                x2="55.898"
                y2="488.211"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.0432435" stopColor="#00FF26" />
                <stop offset="0.986871" stopColor="#009917" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Fill area */}
            <path
              d="M95.0773 349.014L2 397.46C2 447.464 42.5362 488 92.54 488H840.227C899.2 488 947.078 440.33 947.336 381.358L948.978 4.95713C948.984 3.76226 947.366 3.38878 946.847 4.46503L837.234 231.744L790.849 190.483L744.464 205.684L689.646 134.02L634.827 242.603L601.093 231.744L550.491 390.275L525.191 381.589L499.89 405.477L428.204 366.387L398.687 390.275L318.568 312.096L289.05 327.297L230.015 275.177L183.63 335.984L128.812 312.096L95.0773 349.014Z"
              fill="url(#chartGradient)"
            />

            {/* Line stroke */}
            <path
              d="M946 11L836.432 235.757L790.076 195.086L743.72 210.07L688.936 139.432L634.152 246.459L600.439 235.757L549.869 392.016L524.584 383.454L499.299 407L427.659 368.47L398.159 392.016L318.09 314.957L288.591 329.941L229.593 278.568L183.237 338.503L128.453 314.957L95.7582 349.047L2 397.183"
              stroke="#44FF00"
              strokeWidth="5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
