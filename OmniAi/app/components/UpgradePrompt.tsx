import { useUser, TIER_FEATURES } from "~/hooks/useUser";
import { Link } from "@remix-run/react";

interface UpgradePromptProps {
  requiredTier: 2 | 3;
  feature?: string;
  className?: string;
}

export function UpgradePrompt({ requiredTier, feature, className = "" }: UpgradePromptProps) {
  const { tier, getUpgradeLink } = useUser();
  const targetTier = TIER_FEATURES[`TIER${requiredTier}` as keyof typeof TIER_FEATURES];

  return (
    <div className={`rounded-lg border border-purple-500/20 bg-purple-500/5 p-6 ${className}`}>
      <div className="flex items-start gap-4">
        {/* Crown Icon */}
        <div className="flex-shrink-0 p-2 bg-purple-500/10 rounded-lg">
          <svg
            className="w-6 h-6 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4l3 8h6l-6 6-3-4-3 4-6-6h6l3-8z"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-purple-300 mb-2">
            Upgrade to {targetTier.name}
          </h3>
          
          <p className="text-gray-400 mb-4">
            {feature
              ? `"${feature}" requires ${targetTier.name} or higher.`
              : `You're currently on Tier ${tier}. Upgrade to unlock more features.`}
          </p>

          <div className="space-y-2 mb-4">
            {targetTier.features.map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-sm text-gray-400">
                <svg
                  className="w-4 h-4 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feat}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Link
              to={getUpgradeLink()}
              className="inline-flex items-center px-4 py-2 bg-purple-600 
                       hover:bg-purple-700 text-white rounded-lg transition-colors 
                       duration-200"
            >
              Upgrade Now
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 
                       transition-colors duration-200"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UpgradeTooltip({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative">
      <div className="opacity-50 cursor-not-allowed">{children}</div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                    px-3 py-1 bg-gray-800 text-white text-sm rounded-lg 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    pointer-events-none whitespace-nowrap">
        Upgrade to unlock
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 
                      border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
} 