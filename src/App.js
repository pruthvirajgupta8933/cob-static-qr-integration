import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./slices/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./theme.scss"
import AllRoutes from "./AllRoutes";
import IdleTimerContainer from "./utilities/IdleTimer";


const App = () => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState(false)
  

  useCallback(() => {
    dispatch(logout());
  }, [dispatch]);


  useEffect(() => {
    // login session expireTime if user not idle
    const expireTime = parseInt(sessionStorage.getItem("expiredTime"), 10);
    if (expireTime > 0 && expireTime > Date.now()) {
      setLogin(true)
    }

  }, [])

// logout session expireTime if user not idle
  const logOutUser = (isLoggedIn) => {
    setLogin(isLoggedIn)
  }

  return (
    <React.Fragment>
      {login && <IdleTimerContainer fnLogout={logOutUser} />}
      <AllRoutes />
    </React.Fragment>
  );
};

export default App;
