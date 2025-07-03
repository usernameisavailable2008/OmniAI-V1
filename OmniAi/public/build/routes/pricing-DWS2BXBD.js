import {
  useLoaderData,
  useSubmit
} from "/build/_shared/chunk-PLVAC3I5.js";
import "/build/_shared/chunk-GIAAE3CH.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  require_react
} from "/build/_shared/chunk-BOXFZXVX.js";
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
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:~/services/subscription.server
var require_subscription = __commonJS({
  "empty-module:~/services/subscription.server"(exports, module) {
    module.exports = {};
  }
});

// app/routes/pricing.tsx
var React = __toESM(require_react(), 1);
var import_node = __toESM(require_node(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_subscription = __toESM(require_subscription(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\pricing.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\pricing.tsx"
  );
  import.meta.hot.lastModified = "1750885040875.8389";
}
function Pricing() {
  _s();
  const {
    shop,
    currentSubscription,
    plans
  } = useLoaderData();
  const [selected, setSelected] = React.useState(currentSubscription?.tier || 2);
  const [loading, setLoading] = React.useState(false);
  const submit = useSubmit();
  const handleSelect = (tier) => setSelected(tier);
  const handleChoose = (tier) => {
    setSelected(tier);
    setLoading(true);
    const formData = new FormData();
    formData.append("tier", tier.toString());
    submit(formData, {
      method: "post"
    });
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { style: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at top right, #3f2287 0%, #0f0c26 60%)",
    color: "#fff",
    padding: "40px 12px"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "wrapper", style: {
    maxWidth: 960,
    width: "100%",
    textAlign: "center"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { width: "0", height: "0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("defs", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("linearGradient", { id: "grad", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", { offset: "0%", stopColor: "#d946ef" }, void 0, false, {
        fileName: "app/routes/pricing.tsx",
        lineNumber: 143,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", { offset: "100%", stopColor: "#6366f1" }, void 0, false, {
        fileName: "app/routes/pricing.tsx",
        lineNumber: 144,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/pricing.tsx",
      lineNumber: 142,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/pricing.tsx",
      lineNumber: 141,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/pricing.tsx",
      lineNumber: 140,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "logo", style: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 48
    }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { viewBox: "0 0 512 512", style: {
        width: 32,
        height: 32,
        fill: "url(#grad)"
      }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M256 0 329 182 512 256 329 330 256 512 183 330 0 256 183 182Z" }, void 0, false, {
        fileName: "app/routes/pricing.tsx",
        lineNumber: 159,
        columnNumber: 12
      }, this) }, void 0, false, {
        fileName: "app/routes/pricing.tsx",
        lineNumber: 155,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { style: {
        fontSize: "1.75rem",
        fontWeight: 600
      }, children: "OmniAI" }, void 0, false, {
        fileName: "app/routes/pricing.tsx",
        lineNumber: 160,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/pricing.tsx",
      lineNumber: 148,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { style: {
      fontSize: "clamp(2rem,5vw,3rem)",
      fontWeight: 600,
      lineHeight: 1.2,
      marginBottom: 48
    }, children: [
      "Select a plan that's",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
        fileName: "app/routes/pricing.tsx",
        lineNumber: 171,
        columnNumber: 31
      }, this),
      "right for you"
    ] }, void 0, true, {
      fileName: "app/routes/pricing.tsx",
      lineNumber: 165,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "plans", style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
      gap: 28
    }, children: plans.map((plan) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { className: `card${selected === plan.tier ? " selected" : ""}`, "data-tier": plan.name, style: {
      position: "relative",
      padding: selected === plan.tier ? "36px 28px 96px" : "36px 28px 96px",
      borderRadius: 18,
      background: "rgba(255,255,255,0.02)",
      border: selected === plan.tier ? "1px solid transparent" : "1px solid rgba(255,255,255,0.12)",
      borderImage: selected === plan.tier ? "linear-gradient(135deg,#d946ef,#6366f1) 1" : void 0,
      boxShadow: selected === plan.tier ? "0 0 12px rgba(152, 87, 255, .8), 0 0 24px rgba(152, 87, 255, .5)" : void 0,
      overflow: "hidden",
      transition: "border .25s, box-shadow .25s",
      cursor: "pointer"
    }, onClick: () => handleSelect(plan.tier), children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { style: {
        fontSize: "1.25rem",
        fontWeight: 600,
        marginBottom: 12
      }, children: plan.name }, void 0, false, {
        fileName: "app/routes/pricing.tsx",
        lineNumber: 191,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "price", style: {
        fontSize: "2.5rem",
        fontWeight: 700,
        marginBottom: 4
      }, children: [
        "\u20AC",
        plan.price
      ] }, void 0, true, {
        fileName: "app/routes/pricing.tsx",
        lineNumber: 196,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "cycle", style: {
        fontSize: ".9rem",
        color: "#c2c2d5",
        marginBottom: 24
      }, children: "/month" }, void 0, false, {
        fileName: "app/routes/pricing.tsx",
        lineNumber: 201,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { style: {
        listStyle: "none",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontSize: ".95rem",
        marginBottom: 40,
        color: "#c2c2d5"
      }, children: plan.features.map((f, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { style: {
        position: "relative"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { style: {
          color: "#d946ef",
          marginRight: 8
        }, children: "\u2022" }, void 0, false, {
          fileName: "app/routes/pricing.tsx",
          lineNumber: 219,
          columnNumber: 21
        }, this),
        f
      ] }, i, true, {
        fileName: "app/routes/pricing.tsx",
        lineNumber: 216,
        columnNumber: 46
      }, this)) }, void 0, false, {
        fileName: "app/routes/pricing.tsx",
        lineNumber: 206,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "btn", style: {
        position: "absolute",
        left: "50%",
        bottom: 32,
        transform: "translateX(-50%)",
        width: "70%",
        padding: "12px 0",
        borderRadius: 10,
        background: selected === plan.tier ? "linear-gradient(135deg,#d946ef,#6366f1)" : "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "#fff",
        fontSize: "1rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "background .2s, box-shadow .2s",
        boxShadow: selected === plan.tier ? "0 1px 6px rgba(0,0,0,.25)" : void 0,
        opacity: loading && selected === plan.tier ? 0.7 : 1
      }, onClick: (e) => {
        e.stopPropagation();
        handleChoose(plan.tier);
      }, disabled: loading || currentSubscription?.tier === plan.tier, children: currentSubscription?.tier === plan.tier ? "Current Plan" : loading && selected === plan.tier ? "Redirecting..." : "Choose Plan" }, void 0, false, {
        fileName: "app/routes/pricing.tsx",
        lineNumber: 225,
        columnNumber: 15
      }, this)
    ] }, plan.tier, true, {
      fileName: "app/routes/pricing.tsx",
      lineNumber: 179,
      columnNumber: 30
    }, this)) }, void 0, false, {
      fileName: "app/routes/pricing.tsx",
      lineNumber: 174,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/pricing.tsx",
    lineNumber: 134,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/pricing.tsx",
    lineNumber: 125,
    columnNumber: 10
  }, this);
}
_s(Pricing, "MB++SfO7YySeahQLjjBccl8093A=", false, function() {
  return [useLoaderData, useSubmit];
});
_c = Pricing;
var _c;
$RefreshReg$(_c, "Pricing");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Pricing as default
};
//# sourceMappingURL=/build/routes/pricing-DWS2BXBD.js.map
