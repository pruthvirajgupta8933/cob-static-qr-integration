import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./slices/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
// import "./components/login/Login.css"
import "./theme.scss";
import AllRoutes from "./AllRoutes";
import IdleTimerContainer from "./utilities/IdleTimer";
import { Toaster } from "react-hot-toast";

const App = () => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState(false);

  useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    // login session expireTime if user not idle
    const expireTime = parseInt(localStorage.getItem("expiredTime"), 10);
    if (expireTime > 0 && expireTime > Date.now()) {
      setLogin(true);
    }
    window.addEventListener("load", function (e) {
      var openTabs = this.window.localStorage.getItem("openTabs");

      if (openTabs && openTabs > 0) {
        dispatch(logout());
      } else {
        this.window.localStorage.setItem("openTabs", 1);
      }
    });
    window.addEventListener("unload", function (e) {
      e.preventDefault();
      var openTabs = this.window.localStorage.getItem("openTabs");
      if (openTabs && openTabs > 0) {
        openTabs--;
        this.window.localStorage.setItem("openTabs", openTabs);
      }
      e.returnValue = "";
    });
  }, []);

  // logout session expireTime if user not idle
  const logOutUser = (isLoggedIn) => {
    setLogin(isLoggedIn);
  };

  return (
    <React.Fragment>
      {login && <IdleTimerContainer fnLogout={logOutUser} />}
      <AllRoutes />
      <Toaster />
    </React.Fragment>
  );
};

export default App;
