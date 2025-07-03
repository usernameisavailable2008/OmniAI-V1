import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate
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

// app/routes/subscribe.tsx
var import_node = __toESM(require_node(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_billing = __toESM(require_billing(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\subscribe.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\subscribe.tsx"
  );
  import.meta.hot.lastModified = "1751566121177.4055";
}
var meta = () => {
  return [{
    title: "Subscribe to OmniAI"
  }, {
    name: "description",
    content: "Choose your plan and start automating your Shopify store"
  }];
};
function Subscribe() {
  _s();
  const {
    shop,
    selectedPlanId,
    tiers
  } = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();
  const [currentPlanId, setCurrentPlanId] = (0, import_react2.useState)(selectedPlanId);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "subscribe-page", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("style", { children: `
        .subscribe-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #fcd8ff, #d0e5ff);
          font-family: 'Poppins', sans-serif;
          padding: 2rem 1rem;
        }
        
        .subscribe-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .subscribe-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .subscribe-title {
          font-size: 2.5rem;
          font-weight: 600;
          color: #222;
          margin-bottom: 1rem;
        }
        
        .subscribe-subtitle {
          font-size: 1.1rem;
          color: #555;
          line-height: 1.6;
        }
        
        .shop-info {
          background: rgba(255, 255, 255, 0.9);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .shop-info h3 {
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .shop-info p {
          color: #666;
          margin: 0;
        }
        
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .pricing-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 3px solid transparent;
          position: relative;
          overflow: hidden;
        }
        
        .pricing-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #d77cf0, #7aa2ff);
        }
        
        .pricing-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
        }
        
        .pricing-card.selected {
          border-color: #d77cf0;
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(215, 124, 240, 0.2);
        }
        
        .pricing-card.popular {
          transform: scale(1.05);
        }
        
        .pricing-card.popular::after {
          content: 'Most Popular';
          position: absolute;
          top: 1rem;
          right: -2rem;
          background: linear-gradient(135deg, #d77cf0, #7aa2ff);
          color: white;
          padding: 0.5rem 3rem;
          font-size: 0.8rem;
          font-weight: 600;
          transform: rotate(45deg);
        }
        
        .pricing-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .pricing-name {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .pricing-price {
          font-size: 2rem;
          font-weight: 600;
          color: #d77cf0;
          margin-bottom: 0.5rem;
        }
        
        .pricing-period {
          color: #666;
          font-size: 0.9rem;
        }
        
        .pricing-features {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0;
        }
        
        .pricing-features li {
          padding: 0.5rem 0;
          color: #555;
          position: relative;
          padding-left: 1.5rem;
          font-size: 0.95rem;
        }
        
        .pricing-features li::before {
          content: '\u2713';
          position: absolute;
          left: 0;
          color: #d77cf0;
          font-weight: 600;
        }
        
        .subscribe-form {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        .subscribe-button {
          background: linear-gradient(135deg, #d77cf0, #7aa2ff);
          color: white;
          padding: 1rem 2rem;
          border-radius: 999px;
          border: none;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Poppins', sans-serif;
          width: 100%;
          max-width: 300px;
        }
        
        .subscribe-button:hover {
          background: linear-gradient(135deg, #c357e6, #6499ff);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(215, 124, 240, 0.3);
        }
        
        .subscribe-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .error-message {
          background: #fee;
          color: #c33;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .back-button {
          background: transparent;
          color: #666;
          border: 2px solid #ddd;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-right: 1rem;
        }
        
        .back-button:hover {
          border-color: #d77cf0;
          color: #d77cf0;
        }
        
        @media (max-width: 768px) {
          .subscribe-title {
            font-size: 2rem;
          }
          
          .pricing-grid {
            grid-template-columns: 1fr;
          }
          
          .pricing-card.popular {
            transform: none;
          }
        }
      ` }, void 0, false, {
      fileName: "app/routes/subscribe.tsx",
      lineNumber: 103,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "subscribe-container", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "subscribe-header", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "subscribe-title", children: "Choose Your Plan" }, void 0, false, {
          fileName: "app/routes/subscribe.tsx",
          lineNumber: 334,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "subscribe-subtitle", children: "Select the perfect plan for your Shopify automation needs" }, void 0, false, {
          fileName: "app/routes/subscribe.tsx",
          lineNumber: 335,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/subscribe.tsx",
        lineNumber: 333,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "shop-info", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { children: [
          "Store: ",
          shop
        ] }, void 0, true, {
          fileName: "app/routes/subscribe.tsx",
          lineNumber: 341,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Ready to supercharge your Shopify store with AI automation" }, void 0, false, {
          fileName: "app/routes/subscribe.tsx",
          lineNumber: 342,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/subscribe.tsx",
        lineNumber: 340,
        columnNumber: 9
      }, this),
      actionData?.error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "error-message", children: actionData.error }, void 0, false, {
        fileName: "app/routes/subscribe.tsx",
        lineNumber: 345,
        columnNumber: 31
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pricing-grid", children: tiers.map((tier) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `pricing-card ${tier.id === "scale" ? "popular" : ""} ${currentPlanId === tier.id ? "selected" : ""}`, onClick: () => setCurrentPlanId(tier.id), children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pricing-header", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pricing-name", children: tier.name }, void 0, false, {
            fileName: "app/routes/subscribe.tsx",
            lineNumber: 352,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pricing-price", children: [
            "\u20AC",
            tier.price
          ] }, void 0, true, {
            fileName: "app/routes/subscribe.tsx",
            lineNumber: 353,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pricing-period", children: "per month" }, void 0, false, {
            fileName: "app/routes/subscribe.tsx",
            lineNumber: 354,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/subscribe.tsx",
          lineNumber: 351,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "pricing-features", children: tier.features.map((feature, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: feature }, index, false, {
          fileName: "app/routes/subscribe.tsx",
          lineNumber: 358,
          columnNumber: 56
        }, this)) }, void 0, false, {
          fileName: "app/routes/subscribe.tsx",
          lineNumber: 357,
          columnNumber: 15
        }, this)
      ] }, tier.id, true, {
        fileName: "app/routes/subscribe.tsx",
        lineNumber: 350,
        columnNumber: 30
      }, this)) }, void 0, false, {
        fileName: "app/routes/subscribe.tsx",
        lineNumber: 349,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "subscribe-form", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "planId", value: currentPlanId }, void 0, false, {
          fileName: "app/routes/subscribe.tsx",
          lineNumber: 365,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", className: "back-button", onClick: () => navigate("/"), children: "\u2190 Back" }, void 0, false, {
          fileName: "app/routes/subscribe.tsx",
          lineNumber: 366,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "subscribe-button", children: [
          "Subscribe to ",
          import_billing.BILLING_PLANS[currentPlanId]?.name,
          " Plan"
        ] }, void 0, true, {
          fileName: "app/routes/subscribe.tsx",
          lineNumber: 369,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/subscribe.tsx",
        lineNumber: 364,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/subscribe.tsx",
        lineNumber: 363,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/subscribe.tsx",
      lineNumber: 332,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/subscribe.tsx",
    lineNumber: 102,
    columnNumber: 10
  }, this);
}
_s(Subscribe, "9fFUC3z5yPWBlIbuQsbwqZydFC8=", false, function() {
  return [useLoaderData, useActionData, useNavigate];
});
_c = Subscribe;
var _c;
$RefreshReg$(_c, "Subscribe");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Subscribe as default,
  meta
};
//# sourceMappingURL=/build/routes/subscribe-A72BK26F.js.map
