import {
  createHotContext
} from "/build/_shared/chunk-XJIZBQCA.js";
import "/build/_shared/chunk-UWV35TSL.js";
import "/build/_shared/chunk-PNG5AS42.js";

// app/routes/favicon.ico.tsx
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\favicon.ico.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\favicon.ico.tsx"
  );
  import.meta.hot.lastModified = "1751572167491.4497";
}
function Favicon() {
  return null;
}
_c = Favicon;
var _c;
$RefreshReg$(_c, "Favicon");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Favicon as default
};
//# sourceMappingURL=/build/routes/favicon.ico-WPZEI2K3.js.map
