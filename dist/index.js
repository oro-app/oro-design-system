// src/Cta.tsx
import { jsx } from "react/jsx-runtime";
function Cta(props) {
  const { size = "standard", inverse = false, className, ...rest } = props;
  const cls = ["oro-cta", `oro-cta--${size}`, inverse && "oro-cta--inverse", className].filter(Boolean).join(" ");
  if (rest.href !== void 0) {
    return /* @__PURE__ */ jsx("a", { className: cls, ...rest });
  }
  const { type = "button", ...buttonProps } = rest;
  return /* @__PURE__ */ jsx("button", { type, className: cls, ...buttonProps });
}

// src/Btn.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function Btn({ variant = "quiet", className, type = "button", ...rest }) {
  const cls = ["oro-btn", `oro-btn--${variant}`, className].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx2("button", { type, className: cls, ...rest });
}

// src/Chip.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
function Chip({ pill = false, selected = false, className, type = "button", ...rest }) {
  const cls = ["oro-chip", pill && "oro-chip--pill", className].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx3("button", { type, className: cls, "aria-pressed": selected, ...rest });
}
export {
  Btn,
  Chip,
  Cta
};
//# sourceMappingURL=index.js.map