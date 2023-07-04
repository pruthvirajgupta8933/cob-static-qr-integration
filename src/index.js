import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
// import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import setupInterceptors from "./services/setupInterceptors";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

// console.log("setupInterceptors",setupInterceptors)


ReactDOM.render(
  <Provider store={store}>
    {/* <HashRouter> */}
    <BrowserRouter>
        <App />
    </BrowserRouter>
    {/* </HashRouter> */}
  </Provider>,
  document.getElementById("root")
);
// console.log("store",store)
setupInterceptors(store);

// If you want your app to work offline and load faster, you can chađinge
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
