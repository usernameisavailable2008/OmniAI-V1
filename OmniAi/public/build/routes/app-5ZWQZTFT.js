import {
  useFetcher,
  useLoaderData,
  useRouteLoaderData
} from "/build/_shared/chunk-PLVAC3I5.js";
import "/build/_shared/chunk-GIAAE3CH.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  require_react
} from "/build/_shared/chunk-BOXFZXVX.js";
import {
  require_billing
} from "/build/_shared/chunk-7ZHIL76V.js";
import {
  require_auth
} from "/build/_shared/chunk-BZ5ICFE4.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  createHotContext
} from "/build/_shared/chunk-XJIZBQCA.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/app.tsx
var import_node = __toESM(require_node(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_billing = __toESM(require_billing(), 1);

// app/components/Chatbot.tsx
var import_react2 = __toESM(require_react(), 1);

// app/hooks/useUser.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\hooks\\useUser.ts"
  );
  import.meta.hot.lastModified = "1751059615118.0276";
}
var TIER_FEATURES = {
  TIER1: {
    name: "Basic",
    model: "gpt-3.5-turbo",
    maxTokens: 1e3,
    features: ["Basic product updates", "Simple automations", "Standard support"]
  },
  TIER2: {
    name: "Pro",
    model: "gpt-4",
    maxTokens: 2e3,
    features: ["Advanced store building", "Custom themes", "Priority support"]
  },
  TIER3: {
    name: "Enterprise",
    model: "gpt-4-turbo-preview",
    maxTokens: 4e3,
    features: ["Full store automation", "Custom integrations", "24/7 support"]
  }
};
function useUser() {
  const data = useRouteLoaderData("root");
  const user = data?.user;
  if (!user) {
    throw new Error("User not found in route data");
  }
  return {
    ...user,
    // Tier helpers
    isTier2: () => user.tier >= 2,
    isTier3: () => user.tier === 3,
    getTierFeatures: () => {
      switch (user.tier) {
        case 3:
          return TIER_FEATURES.TIER3;
        case 2:
          return TIER_FEATURES.TIER2;
        default:
          return TIER_FEATURES.TIER1;
      }
    },
    // Feature access helpers
    canUseAdvancedAutomation: () => user.tier >= 2,
    canUseCustomIntegrations: () => user.tier === 3,
    getGPTModel: () => {
      switch (user.tier) {
        case 3:
          return TIER_FEATURES.TIER3.model;
        case 2:
          return TIER_FEATURES.TIER2.model;
        default:
          return TIER_FEATURES.TIER1.model;
      }
    },
    // Upgrade helpers
    needsUpgradeForFeature: (minTier) => user.tier < minTier,
    getUpgradeLink: () => `/settings/billing?from=tier${user.tier}`
  };
}

// app/components/Chatbot.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\Chatbot.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\Chatbot.tsx"
  );
  import.meta.hot.lastModified = "1751563507870.9866";
}
function Chatbot({
  initialCommand
}) {
  _s();
  const user = useUser();
  const fetcher = useFetcher();
  const [messages, setMessages] = (0, import_react2.useState)([]);
  const [input, setInput] = (0, import_react2.useState)(initialCommand || "");
  const [isProcessing, setIsProcessing] = (0, import_react2.useState)(false);
  const inputRef = (0, import_react2.useRef)(null);
  const promptSuggestions = ["Make my titles more professional?", "What's this month's revenue?", "Update my inventory levels", "Optimize my product descriptions"];
  const handleSubmit = async (commandText) => {
    const command = commandText || input.trim();
    if (!command || isProcessing)
      return;
    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: command,
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("command", command);
    formData.append("tier", user.tier.toString());
    formData.append("shop", user.shopId || "");
    fetcher.submit(formData, {
      method: "POST",
      action: "/api/chat"
    });
  };
  const handlePromptClick = (prompt) => {
    handleSubmit(prompt);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  (0, import_react2.useEffect)(() => {
    if (fetcher.data && fetcher.state === "idle") {
      setIsProcessing(false);
      if (fetcher.data.success) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: fetcher.data.result?.message || "Command executed successfully",
          timestamp: /* @__PURE__ */ new Date()
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: fetcher.data.error || "Command failed",
          timestamp: /* @__PURE__ */ new Date()
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  }, [fetcher.data, fetcher.state]);
  (0, import_react2.useEffect)(() => {
    if (initialCommand && initialCommand.trim() && messages.length === 0) {
      setTimeout(() => {
        handleSubmit(initialCommand);
      }, 500);
    }
  }, [initialCommand]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "omniai-chat", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("style", { children: `
        .omniai-chat {
          display: flex;
          height: 100vh;
          font-family: 'Poppins', sans-serif;
        }
        
        .chat-sidebar {
          width: 60px;
          background: #f9f9f9;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem 0;
          border-right: 1px solid #eee;
        }
        
        .chat-logo {
          margin-bottom: 1rem;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #d77cf0, #7aa2ff);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.2rem;
        }
        
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #fcd8ff, #d0e5ff);
          min-height: 100vh;
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          max-height: calc(100vh - 200px);
        }
        
        .chat-message {
          margin-bottom: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        
        .chat-message.user {
          justify-content: flex-end;
        }
        
        .chat-message.assistant {
          justify-content: flex-start;
        }
        
        .message-content {
          max-width: 70%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          line-height: 1.5;
        }
        
        .chat-message.user .message-content {
          background: linear-gradient(135deg, #d77cf0, #7aa2ff);
          color: white;
          border-bottom-right-radius: 0.25rem;
        }
        
        .chat-message.assistant .message-content {
          background: white;
          color: #333;
          border-bottom-left-radius: 0.25rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .chat-welcome {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          text-align: center;
        }
        
        .hero-text {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #222;
        }
        
        .hero-subtext {
          font-size: 1rem;
          color: #555;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        
        .prompt-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .prompt-buttons button {
          padding: 0.75rem 1.25rem;
          border-radius: 999px;
          border: none;
          background: #fff;
          box-shadow: 0 0 0 1px #ddd;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease-in-out;
          font-family: 'Poppins', sans-serif;
        }
        
        .prompt-buttons button:hover {
          background: #f0f0f0;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .chat-input-container {
          padding: 1rem;
          background: transparent;
        }
        
        .chat-input-wrapper {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 999px;
          padding: 0.75rem 1rem;
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          box-shadow: 0 0 0 2px #d77cf0;
          position: relative;
        }
        
        .chat-input-wrapper input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1rem;
          font-family: 'Poppins', sans-serif;
          background: transparent;
        }
        
        .chat-input-wrapper input::placeholder {
          color: #999;
        }
        
        .chat-input-wrapper button {
          background: linear-gradient(135deg, #d77cf0, #7aa2ff);
          border: none;
          padding: 0.5rem 1rem;
          color: white;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 600;
          margin-left: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          min-width: 40px;
          height: 40px;
        }
        
        .chat-input-wrapper button:hover:not(:disabled) {
          background: linear-gradient(135deg, #c357e6, #6499ff);
        }
        
        .chat-input-wrapper button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .char-count {
          font-size: 0.8rem;
          color: #999;
          margin-left: 0.5rem;
          position: absolute;
          right: 60px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .processing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: white;
          border-radius: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          max-width: 200px;
        }
        
        .processing-dots {
          display: flex;
          gap: 0.25rem;
        }
        
        .processing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d77cf0;
          animation: pulse 1.5s infinite;
        }
        
        .processing-dot:nth-child(2) {
          animation-delay: 0.3s;
        }
        
        .processing-dot:nth-child(3) {
          animation-delay: 0.6s;
        }
        
        @keyframes pulse {
          0%, 60%, 100% {
            opacity: 0.3;
          }
          30% {
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          .chat-sidebar {
            width: 50px;
          }
          
          .hero-text {
            font-size: 1.5rem;
          }
          
          .prompt-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .prompt-buttons button {
            width: 100%;
            max-width: 300px;
          }
          
          .message-content {
            max-width: 85%;
          }
        }
      ` }, void 0, false, {
      fileName: "app/components/Chatbot.tsx",
      lineNumber: 103,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "chat-sidebar", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "chat-logo", children: "AI" }, void 0, false, {
      fileName: "app/components/Chatbot.tsx",
      lineNumber: 369,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/components/Chatbot.tsx",
      lineNumber: 368,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "chat-main", children: [
      messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "chat-welcome", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "hero-text", children: "Talk Shopify to Me" }, void 0, false, {
          fileName: "app/components/Chatbot.tsx",
          lineNumber: 376,
          columnNumber: 26
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "hero-subtext", children: "choose a prompt below or write your own to start chatting with OmniAI" }, void 0, false, {
          fileName: "app/components/Chatbot.tsx",
          lineNumber: 377,
          columnNumber: 14
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "prompt-buttons", children: promptSuggestions.slice(0, 2).map((prompt, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => handlePromptClick(prompt), disabled: isProcessing, children: prompt }, index, false, {
          fileName: "app/components/Chatbot.tsx",
          lineNumber: 381,
          columnNumber: 69
        }, this)) }, void 0, false, {
          fileName: "app/components/Chatbot.tsx",
          lineNumber: 380,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/Chatbot.tsx",
        lineNumber: 375,
        columnNumber: 34
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "chat-messages", children: [
        messages.map((message) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `chat-message ${message.type}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "message-content", children: message.content }, void 0, false, {
          fileName: "app/components/Chatbot.tsx",
          lineNumber: 387,
          columnNumber: 17
        }, this) }, message.id, false, {
          fileName: "app/components/Chatbot.tsx",
          lineNumber: 386,
          columnNumber: 38
        }, this)),
        isProcessing && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "chat-message assistant", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "processing-indicator", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Processing..." }, void 0, false, {
            fileName: "app/components/Chatbot.tsx",
            lineNumber: 393,
            columnNumber: 38
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "processing-dots", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "processing-dot" }, void 0, false, {
              fileName: "app/components/Chatbot.tsx",
              lineNumber: 395,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "processing-dot" }, void 0, false, {
              fileName: "app/components/Chatbot.tsx",
              lineNumber: 396,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "processing-dot" }, void 0, false, {
              fileName: "app/components/Chatbot.tsx",
              lineNumber: 397,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/Chatbot.tsx",
            lineNumber: 394,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/Chatbot.tsx",
          lineNumber: 392,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/components/Chatbot.tsx",
          lineNumber: 391,
          columnNumber: 30
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/Chatbot.tsx",
        lineNumber: 385,
        columnNumber: 20
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "chat-input-container", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "chat-input-wrapper", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { ref: inputRef, type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: handleKeyPress, placeholder: "Ask whatever you want...", maxLength: 1e3, disabled: isProcessing }, void 0, false, {
          fileName: "app/components/Chatbot.tsx",
          lineNumber: 405,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "char-count", children: [
          input.length,
          "/1000"
        ] }, void 0, true, {
          fileName: "app/components/Chatbot.tsx",
          lineNumber: 406,
          columnNumber: 14
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => handleSubmit(), disabled: !input.trim() || isProcessing, "aria-label": "Execute", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M22 2L11 13" }, void 0, false, {
            fileName: "app/components/Chatbot.tsx",
            lineNumber: 409,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M22 2L15 22L11 13L2 9L22 2Z" }, void 0, false, {
            fileName: "app/components/Chatbot.tsx",
            lineNumber: 410,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/Chatbot.tsx",
          lineNumber: 408,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/components/Chatbot.tsx",
          lineNumber: 407,
          columnNumber: 14
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/Chatbot.tsx",
        lineNumber: 404,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/Chatbot.tsx",
        lineNumber: 403,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/Chatbot.tsx",
      lineNumber: 374,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/Chatbot.tsx",
    lineNumber: 102,
    columnNumber: 10
  }, this);
}
_s(Chatbot, "DLhEpUlryVK9NDntbd9MSyyIb7w=", false, function() {
  return [useUser, useFetcher];
});
_c = Chatbot;
var _c;
$RefreshReg$(_c, "Chatbot");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/app.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\app.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\app.tsx"
  );
  import.meta.hot.lastModified = "1751565971626.0706";
}
function App() {
  _s2();
  const {
    isAuthenticated,
    shop,
    tier,
    subscription,
    needsSubscription,
    initialCommand
  } = useLoaderData();
  if (!isAuthenticated) {
    return null;
  }
  if (needsSubscription) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { style: {
      padding: "2rem",
      textAlign: "center"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h2", { children: "Subscription Required" }, void 0, false, {
        fileName: "app/routes/app.tsx",
        lineNumber: 79,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("p", { children: "Please subscribe to continue using OmniAI." }, void 0, false, {
        fileName: "app/routes/app.tsx",
        lineNumber: 80,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("a", { href: `/subscribe?shop=${shop}`, style: {
        display: "inline-block",
        padding: "0.75rem 1.5rem",
        background: "linear-gradient(135deg, #d77cf0, #7aa2ff)",
        color: "white",
        textDecoration: "none",
        borderRadius: "0.5rem",
        fontWeight: "600",
        marginTop: "1rem"
      }, children: "Subscribe Now" }, void 0, false, {
        fileName: "app/routes/app.tsx",
        lineNumber: 81,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app.tsx",
      lineNumber: 75,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Chatbot, { initialCommand }, void 0, false, {
    fileName: "app/routes/app.tsx",
    lineNumber: 95,
    columnNumber: 10
  }, this);
}
_s2(App, "M2rALECJrpv/ZJJE/zXZolk/NT8=", false, function() {
  return [useLoaderData];
});
_c2 = App;
var _c2;
$RefreshReg$(_c2, "App");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  App as default
};
//# sourceMappingURL=/build/routes/app-5ZWQZTFT.js.map
