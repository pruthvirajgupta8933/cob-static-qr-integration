import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { AuthProvider } from "./context/AuthProvider";
import { BrowserRouter, HashRouter, Router } from "react-router-dom";
import setupInterceptors from "./services/setupInterceptors";

ReactDOM.render(
  <Provider store={store}>
    {/* <HashRouter> */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    {/* </HashRouter> */}
  </Provider>,
  document.getElementById("root")
);
setupInterceptors(store);

// If you want your app to work offline and load faster, you can chađinge
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
