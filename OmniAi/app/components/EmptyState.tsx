import { ReactNode } from "react";

interface EmptyStateProps {
  variant: "chat" | "roi" | "generic";
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ variant, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="mb-8">
        {variant === "chat" && (
          <img
            src="/empty-chat.svg"
            alt="No chat history"
            className="w-48 h-48 mx-auto"
          />
        )}
        {variant === "roi" && (
          <div className="w-48 h-48 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-24 h-24 text-purple-500/40"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 21H3V3h18v18zM8 17l3-3 2 2 4-4 1 1v3H8v1z" />
              </svg>
            </div>
          </div>
        )}
        {variant === "generic" && (
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <svg
              className="w-24 h-24 text-gray-500/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-8 max-w-md">{description}</p>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ChatEmptyState() {
  return (
    <EmptyState
      variant="chat"
      title="Start Your First Automation"
      description="Ready to supercharge your store? Try asking OmniAI to help you with product descriptions, SEO optimization, or customer service responses."
      action={
        <button
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white 
                   rounded-lg transition-colors duration-200"
        >
          Try a Suggested Prompt
        </button>
      }
    />
  );
}

export function ROIEmptyState() {
  return (
    <EmptyState
      variant="roi"
      title="Your ROI Dashboard"
      description="Track your time savings and automation metrics here. Data will appear after your first commands run."
      action={
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
          {[
            { label: "Commands Run", value: "0" },
            { label: "Time Saved", value: "0 min" },
            { label: "Success Rate", value: "N/A" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-2xl font-semibold text-white mt-1">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
} 