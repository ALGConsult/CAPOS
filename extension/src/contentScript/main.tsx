import { mountApp } from "./App";
import caposCss from "./capos.css?inline";

const ROOT_ID = "capos-extension-root";

function init() {
  if (document.getElementById(ROOT_ID)) return;

  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:2147483645;";
  document.body.appendChild(root);

  const shadow = root.attachShadow({ mode: "closed" });
  const style = document.createElement("style");
  style.textContent =
    `.capos-root { pointer-events: none; }\n.capos-root > * { pointer-events: auto; }\n\n` +
    caposCss;
  shadow.appendChild(style);

  mountApp(shadow);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
