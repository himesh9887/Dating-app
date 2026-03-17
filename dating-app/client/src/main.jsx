import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SocketProvider } from "./context/SocketContext.jsx";
import store from "./redux/store";
import { loadCurrentUser } from "./redux/slices/authSlice";
import "./index.css";

if (localStorage.getItem("spark-token")) {
  store.dispatch(loadCurrentUser());
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "demo-client"}>
      <Provider store={store}>
        <BrowserRouter>
          <SocketProvider>
            <App />
          </SocketProvider>
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
