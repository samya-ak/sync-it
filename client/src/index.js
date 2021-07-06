import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Store from "./components/Store";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
ReactDOM.render(
  <React.StrictMode>
    <Store>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Store>
  </React.StrictMode>,
  document.getElementById("root")
);
