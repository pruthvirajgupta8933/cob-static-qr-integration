import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { logout } from "./slices/auth";
import AllRoutes from "./AllRoutes";
import IdleTimerContainer from "./utilities/IdleTimer";
import { useLocation } from "react-router-dom";
// import ChatBotApp from "./components/chatbot/ChatBotApp"




const App = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const isLoggedIn = auth?.isLoggedIn
  const userAlreadyLoggedIn = auth?.userAlreadyLoggedIn
  const [login, setLogin] = useState(false)
  const locationPath = useLocation()

  // useEffect(() => {
  //   // if (isLoggedIn || userAlreadyLoggedIn) {
  //   //   setLogin(true)
  //   //   console.log("logged in")
  //   // } else {
  //   //   console.log("not logged in")
  //   //   setLogin(false)
  //   // }
  // }, [isLoggedIn, userAlreadyLoggedIn, locationPath])

  useCallback(() => {
    dispatch(logout());
  }, [dispatch]);


  useEffect(() => {
    // login session expireTime if user not idle
    const expireTime = parseInt(localStorage.getItem("expiredTime"), 10);
    if (expireTime > 0 && expireTime > Date.now()) {
      setLogin(true)
    }

  }, [])


  const logOutUser = (isLoggedIn) => {
    setLogin(isLoggedIn)
  }

  return (
    <>
      {login
        ? <IdleTimerContainer fnLogout={logOutUser} /> : <React.Fragment></React.Fragment>}
      <AllRoutes />
    </>
  );
};

export default App;
