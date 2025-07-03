import {
  require_auth
} from "/build/_shared/chunk-BZ5ICFE4.js";
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
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:~/config/env.server
var require_env = __commonJS({
  "empty-module:~/config/env.server"(exports, module) {
    module.exports = {};
  }
});

// app/routes/auth.callback.tsx
var import_node = __toESM(require_node(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_logger = __toESM(require_logger(), 1);
var import_env = __toESM(require_env(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\auth.callback.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\auth.callback.tsx"
  );
  import.meta.hot.lastModified = "1751566632664.552";
}
var logger = new import_logger.Logger("auth-callback");
var sessionStorage = (0, import_node.createCookieSessionStorage)({
  cookie: {
    name: "shopify_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [import_env.env.SESSION_SECRET],
    secure: import_env.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60
    // 24 hours
  }
});
function AuthCallback() {
  return null;
}
_c = AuthCallback;
var _c;
$RefreshReg$(_c, "AuthCallback");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  AuthCallback as default
};
//# sourceMappingURL=/build/routes/auth.callback-HUKSVEJB.js.map
