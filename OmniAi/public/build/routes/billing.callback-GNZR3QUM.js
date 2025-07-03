import {
  require_billing
} from "/build/_shared/chunk-7ZHIL76V.js";
import {
  require_logger
} from "/build/_shared/chunk-C3XUUF5F.js";
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

// app/routes/billing.callback.tsx
var import_node = __toESM(require_node(), 1);
var import_billing = __toESM(require_billing(), 1);
var import_logger = __toESM(require_logger(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\billing.callback.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\billing.callback.tsx"
  );
  import.meta.hot.lastModified = "1751565939873.071";
}
var logger = new import_logger.Logger("billing-callback");
function BillingCallback() {
  return null;
}
_c = BillingCallback;
var _c;
$RefreshReg$(_c, "BillingCallback");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  BillingCallback as default
};
//# sourceMappingURL=/build/routes/billing.callback-GNZR3QUM.js.map
