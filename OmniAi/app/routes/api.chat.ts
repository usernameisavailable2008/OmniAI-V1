import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { CommandProcessor } from '~/services/command-processor.server';
import { PerformanceService } from '~/services/performance.server';
import { FeedbackService } from '~/services/feedback.server';
import { APIRouter } from '~/services/api-router.server';
import { authenticateAdmin } from '~/utils/shopify.server';
import type { CommandContext } from '~/services/api-router.server';
import type { Session } from '@shopify/shopify-api';
import OpenAI from "openai";
import { env } from "~/utils/env.server";
import { useUser, TIER_FEATURES } from "~/hooks/useUser";
import { AuthService } from "~/services/auth.server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Helper to check if a prompt requires Tier 2
function requiresTier2(prompt: string): boolean {
  const tier2Keywords = [
    "build me a store",
    "create a store",
    "setup a store",
    "custom theme",
    "theme customization",
    "advanced automation",
  ];
  return tier2Keywords.some(keyword => 
    prompt.toLowerCase().includes(keyword.toLowerCase())
  );
}

// Helper to check if a prompt requires Tier 3
function requiresTier3(prompt: string): boolean {
  const tier3Keywords = [
    "custom integration",
    "integrate with",
    "connect to external",
    "api integration",
    "webhook setup",
  ];
  return tier3Keywords.some(keyword => 
    prompt.toLowerCase().includes(keyword.toLowerCase())
  );
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const prompt = formData.get("prompt");

    if (!prompt || typeof prompt !== "string") {
      return json({ error: "Prompt is required" }, { status: 400 });
    }

    // Authenticate user and get tier
    const authService = AuthService.getInstance();
    const { isAuthenticated, tier } = await authService.authenticate(request);
    
    if (!isAuthenticated) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check tier requirements
    if (requiresTier3(prompt) && tier < 3) {
      return json({ error: "upgrade-required", requiredTier: 3 }, { status: 403 });
    }

    if (requiresTier2(prompt) && tier < 2) {
      return json({ error: "upgrade-required", requiredTier: 2 }, { status: 403 });
    }

    // Get appropriate model for user's tier
    const tierFeatures = TIER_FEATURES[`TIER${tier}` as keyof typeof TIER_FEATURES];

    // Create stream response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await openai.chat.completions.create({
            model: tierFeatures.model,
            messages: [{ role: "user", content: prompt }],
            stream: true,
            temperature: 0.7,
            max_tokens: tierFeatures.maxTokens,
          });

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }

          controller.close();
        } catch (error: any) {
          console.error("OpenAI API Error:", error);
          controller.error(new Error("Failed to generate response"));
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}; 