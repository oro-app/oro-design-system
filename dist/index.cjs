"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Btn: () => Btn,
  Chip: () => Chip,
  Cta: () => Cta
});
module.exports = __toCommonJS(index_exports);

// src/Cta.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Cta(props) {
  const { size = "standard", inverse = false, className, ...rest } = props;
  const cls = ["oro-cta", `oro-cta--${size}`, inverse && "oro-cta--inverse", className].filter(Boolean).join(" ");
  if (rest.href !== void 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: cls, ...rest });
  }
  const { type = "button", ...buttonProps } = rest;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type, className: cls, ...buttonProps });
}

// src/Btn.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function Btn({ variant = "quiet", className, type = "button", ...rest }) {
  const cls = ["oro-btn", `oro-btn--${variant}`, className].filter(Boolean).join(" ");
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type, className: cls, ...rest });
}

// src/Chip.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function Chip({ pill = false, selected = false, className, type = "button", ...rest }) {
  const cls = ["oro-chip", pill && "oro-chip--pill", className].filter(Boolean).join(" ");
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type, className: cls, "aria-pressed": selected, ...rest });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Btn,
  Chip,
  Cta
});
//# sourceMappingURL=index.cjs.map