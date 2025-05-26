import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./context/UserContext";
import { DeviceProvider } from "./context/DeviceContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <DeviceProvider>
        <App />
      </DeviceProvider>
    </UserProvider>
  </StrictMode>
);