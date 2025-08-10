import React from "react";

/**
 * Pixel-accurate, desktop-only hero + revenue section
 * Mirrors the Figma export values given by the user.
 *
 * Notes:
 * - Fixed container width (1726px) to match Figma canvas.
 * - Absolute positioning maintained for 1:1 visual parity.
 * - Gradients and blurs use inline styles when Tailwind utilities aren’t precise enough.
 * - Replace placeholder image paths with your real assets in /public/images.
 */
export default function HeroAndRevenue() {
  return (
    <section
      className="relative mx-auto overflow-y-scroll"
      style={{
        position: "relative",
        width: "1726px",
        height: "1166px", // This section covers the "Frame 18" hero + revenue area
        background: "#FFFFFF",
      }}
      aria-label="OmniAI Hero and Revenue"
    >
      {/* ===== Background image behind the gradient ===== */}
      <div
        style={{
          position: "absolute",
          width: "1838px",
          height: "1220px",
          left: "0px",
          top: "-13px",
          backgroundImage: "url(/images/LEkEkAKZQjXZkzadbHHsVj.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      {/* ===== Main purple-to-navy gradient overlay (opacity 0.85) ===== */}
      <div
        style={{
          position: "absolute",
          width: "1730px",
          height: "1168px",
          left: "-4px",
          top: "-2.5px",
          // Radial gradient (as in Figma). CSS may render slightly differently; this is the closest spec-compliant approach.
          background:
            "radial-gradient(493.91% 107.49% at 52.08% -72.66%, #903DED 0%, #0C0F2F 100%), #0C0F2F",
          opacity: 0.85,
        }}
        aria-hidden="true"
      />

      {/* ===== “How much is this month’s revenue?” blurred pill ===== */}
      <div
        style={{
          position: "absolute",
          width: "926.07px",
          height: "115.76px",
          left: "672px",
          top: "349px",
          background:
            "linear-gradient(214.91deg, rgba(0,0,0,0) 7.72%, rgba(0,0,0,0.2) 84.32%), rgba(217,217,217,0.12)",
          backdropFilter: "blur(22.1194px)",
          WebkitBackdropFilter: "blur(22.1194px)",
          borderRadius: "67.0955px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        role="img"
        aria-label="Revenue query pill"
      >
        <p
          style={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 300,
            fontSize: "47.1881px",
            lineHeight: "0",
            letterSpacing: "-0.06em",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          How much is this month’s revenue?
        </p>
      </div>

      {/* ===== Large “Automate Everything” heading ===== */}
      <div
        style={{
          position: "absolute",
          width: "1726px",
          height: "418px",
          left: "0px",
          top: "-80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "68.5355px",
            lineHeight: "24px", // Figma says 24 (very tight). Keeping for fidelity.
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          Automate Everything
        </h1>
      </div>

      {/* ===== Subheading copy ===== */}
      <div
        style={{
          position: "absolute",
          width: "1726px",
          height: "312px",
          left: "0px",
          top: "82px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "42.4478px",
            lineHeight: "10px", // Figma indicates 10 (very tight)
            letterSpacing: "-0.06em",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          Let AI run your store’s products, design, and updates so you can skip the busywork
        </p>
      </div>

      {/* ===== Glass card container for revenue panel (Rectangle 22) ===== */}
      <div
        style={{
          position: "absolute",
          width: "952.77px",
          height: "572px",
          left: "106.65px",
          top: "504px",
          background:
            "linear-gradient(214.91deg, rgba(0, 0, 0, 0) 7.72%, rgba(0, 0, 0, 0.2) 84.32%), rgba(217, 217, 217, 0.12)",
          backdropFilter: "blur(16.8228px)",
          WebkitBackdropFilter: "blur(16.8228px)",
          borderRadius: "107.11px",
        }}
        aria-label="Revenue glass panel"
      />

      {/* ===== Small brand image on the glass card (93.93 x 58.71) ===== */}
      <div
        style={{
          position: "absolute",
          left: "13px",
          top: "586.44px",
          width: "93.93px",
          height: "58.71px",
          borderRadius: "8.13141px",
          backgroundImage: "url(/images/Untitled52_20250628183032.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      {/* ===== “Your revenue this month is:” label (rotated -0.22deg) ===== */}
      <div
        style={{
          position: "absolute",
          left: "144.22px",
          top: "586.44px",
          transform: "rotate(-0.22deg)",
          width: "576.49px",
          height: "0px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "35.8902px",
            lineHeight: "0",
            letterSpacing: "-0.06em",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          Your revenue this month is:
        </p>
      </div>

      {/* ===== Revenue amount (rotated 0.37deg) ===== */}
      <div
        style={{
          position: "absolute",
          left: "154px",
          top: "649px",
          transform: "rotate(0.37deg)",
          width: "431.25px",
          height: "0px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "71.7804px",
            lineHeight: "0",
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          $109.683,00
        </p>
      </div>

      {/* ===== Green delta text ===== */}
      <div
        style={{
          position: "absolute",
          left: "163px",
          top: "665px",
          width: "422px",
          height: "80px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "24px",
            lineHeight: "29px",
            color: "#44FF00",
            margin: 0,
          }}
        >
          ▲+331,52 (0.5%)
        </p>
      </div>

      {/* ===== Chart SVG (exact from your Figma/Builder data) ===== */}
      <div
        style={{
          position: "absolute",
          left: "111px",
          top: "588px",
          width: "947px",
          height: "488px",
        }}
        aria-label="Revenue chart"
        role="img"
      >
        <svg
          viewBox="0 0 949 488"
          width="947"
          height="488"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
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

          {/* Fill area (Vector 2) */}
          <path
            d="M95.0773 349.014L2 397.46C2 447.464 42.5362 488 92.54 488H840.227C899.2 488 947.078 440.33 947.336 381.358L948.978 4.95713C948.984 3.76226 947.366 3.38878 946.847 4.46503L837.234 231.744L790.849 190.483L744.464 205.684L689.646 134.02L634.827 242.603L601.093 231.744L550.491 390.275L525.191 381.589L499.89 405.477L428.204 366.387L398.687 390.275L318.568 312.096L289.05 327.297L230.015 275.177L183.63 335.984L128.812 312.096L95.0773 349.014Z"
            fill="url(#chartGradient)"
          />

          {/* Line stroke (Vector 1) */}
          <path
            d="M946 11L836.432 235.757L790.076 195.086L743.72 210.07L688.936 139.432L634.152 246.459L600.439 235.757L549.869 392.016L524.584 383.454L499.299 407L427.659 368.47L398.159 392.016L318.09 314.957L288.591 329.941L229.593 278.568L183.237 338.503L128.453 314.957L95.7582 349.047L2 397.183"
            stroke="#44FF00"
            strokeWidth="5"
          />
        </svg>
      </div>

      {/* ===== Tiny gray dot to the right of the question pill (Ellipse 5) ===== */}
      <div
        style={{
          position: "absolute",
          width: "26.54px",
          height: "26.54px",
          left: "1633.46px",
          top: "394.71px",
          background: "#D9D9D9",
          borderRadius: "9999px",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
