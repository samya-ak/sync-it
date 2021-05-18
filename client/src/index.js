import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Store from "./components/Store";
import "./index.css";
ReactDOM.render(
  <React.StrictMode>
    <Store>
      <App />
    </Store>
  </React.StrictMode>,
  document.getElementById("root")
);
