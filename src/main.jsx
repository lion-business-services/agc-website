import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { PREVIEW } from "./lib/preview";
import "./styles.css";
import App from "./App.jsx";

// The shareable demo keeps navigation in memory so it works inside any viewer (email preview, file://, iframes).
const Router = PREVIEW ? MemoryRouter : BrowserRouter;

createRoot(document.getElementById("root")).render(
  <StrictMode><Router><App /></Router></StrictMode>,
);
