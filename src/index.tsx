import React from "react";
import { createRoot } from "react-dom/client";

const rootEl = document.querySelector("#root");
if (!rootEl) throw new Error("Cannot find root element with that id");
const root = createRoot(rootEl);
root.render(
  <div>
    Main page
  </div>
);
