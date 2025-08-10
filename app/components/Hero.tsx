import { useUser } from "~/hooks/useUser";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { useChat } from "~/hooks/useChat";
import { ChatLoadingSkeleton } from "./LoadingSkeleton";
import { ChatEmptyState } from "./EmptyState";
import { UpgradePrompt, UpgradeTooltip } from "./UpgradePrompt";

interface SuggestedPrompt {
  text: string;
  icon?: string;
  description?: string;
  requiredTier?: 2 | 3;
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { 
    text: "Write a product description",
    icon: "✓",
    description: "Create engaging product copy",
  },
  { 
    text: "Generate an email template",
    icon: "✉",
    description: "Draft professional emails",
  },
  { 
    text: "Build me a full store",
    icon: "🏪",
    description: "Complete store setup with theme",
    requiredTier: 2,
  },
  { 
    text: "Create a custom integration",
    icon: "🔌",
    description: "Connect with external services",
    requiredTier: 3,
  },
];

export default function Hero() {
  const { name, tier, isTier2, isTier3, needsUpgradeForFeature } = useUser();
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { sendMessage, response, isStreaming, error, reset } = useChat({
    onComplete: () => {
      responseRef.current?.scrollIntoView({ behavior: "smooth" });
    },
  });

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handlePromptClick = (prompt: SuggestedPrompt) => {
    if (prompt.requiredTier && needsUpgradeForFeature(prompt.requiredTier)) {
      return;
    }
    setPrompt(prompt.text);
    if (inputRef.current) {
      inputRef.current.focus();
      const length = prompt.text.length;
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(length, length);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isStreaming) return;

    try {
      sendMessage(prompt);
    } catch (error) {
      console.error("Error submitting prompt:", error);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 relative">
      {/* Tier Indicator */}
      {tier === 1 && (
        <div className="absolute top-4 right-4 text-xs text-orange-500 font-medium">
          You're on Tier 1 — some actions are limited.{" "}
          <a href="/settings/billing" className="underline hover:text-orange-400">
            Upgrade
          </a>
        </div>
      )}

      {/* Greeting */}
      <div className="w-full max-w-screen-md">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight break-words mb-6">
          Hi{" "}
          <span className="bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
            {name}
          </span>
          ,
          <br />
          What would you{" "}
          <span className="bg-gradient-to-r from-fuchsia-500 to-blue-600 bg-clip-text text-transparent">
            like to do
          </span>
          ?
        </h1>

        <p className="text-gray-400 mt-4 max-w-xl mx-auto text-base sm:text-lg">
          Use a suggested prompt or type your own to get started.
        </p>
      </div>

      {/* Suggested Prompts */}
      <div className="flex gap-3 sm:gap-4 mt-8 flex-wrap justify-center max-w-2xl px-4">
        {SUGGESTED_PROMPTS.map((item) => {
          const needsUpgrade = item.requiredTier && needsUpgradeForFeature(item.requiredTier);
          const Button = (
            <button
              key={item.text}
              onClick={() => !needsUpgrade && handlePromptClick(item)}
              className={`px-3 sm:px-4 py-2 rounded-lg border border-gray-700 
                       transition-all duration-200 text-gray-200 flex items-center gap-2 group
                       ${needsUpgrade 
                         ? "bg-gray-800/30 hover:bg-gray-800/40" 
                         : "bg-gray-800/50 hover:bg-gray-800 hover:border-purple-500/50 hover:scale-105"
                       }`}
              title={item.description}
            >
              {item.icon && (
                <span className="transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </span>
              )}
              <span className="text-sm sm:text-base">{item.text}</span>
            </button>
          );

          return needsUpgrade ? (
            <UpgradeTooltip key={item.text}>{Button}</UpgradeTooltip>
          ) : (
            Button
          );
        })}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-2xl px-4">
        <div className="relative group">
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Type a command like "Write a product description"'
            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                     text-gray-200 placeholder-gray-400 transition-all duration-200
                     group-hover:border-gray-600"
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={isStreaming || !prompt.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2
                     px-4 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700
                     transition-all duration-200 text-white font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:scale-105 active:scale-95"
          >
            {isStreaming ? "Thinking..." : "Send"}
          </button>
        </div>
      </form>

      {/* Response Area */}
      {(response || error || isStreaming) ? (
        <div
          ref={responseRef}
          className="mt-8 w-full max-w-2xl px-4 text-left"
        >
          {error ? (
            error.message === "upgrade-required" ? (
              <UpgradePrompt
                requiredTier={2}
                feature="Advanced AI features"
                className="mt-4"
              />
            ) : (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200">
                <p className="font-medium">Error</p>
                <p className="text-sm opacity-80">{error.message}</p>
              </div>
            )
          ) : isStreaming ? (
            <ChatLoadingSkeleton />
          ) : (
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <div className="prose prose-invert max-w-none">
                {response}
              </div>
            </div>
          )}
        </div>
      ) : (
        <ChatEmptyState />
      )}

      {/* Logo with Animation */}
      <div className="absolute bottom-6 right-6 transition-opacity duration-500 hover:opacity-100 opacity-80">
        <img
          src="/omniai-logo.svg"
          alt="OmniAI logo"
          className="w-24 sm:w-32 animate-pulse"
          style={{ animationDuration: '3s' }}
        />
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-6 left-6 text-gray-500 text-sm hidden sm:block">
        Press <kbd className="px-2 py-0.5 rounded bg-gray-800/50 border border-gray-700">Enter</kbd> to send
      </div>
    </div>
  );
} 