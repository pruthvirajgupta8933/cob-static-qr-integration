 import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { logout } from "./slices/auth";
import EventBus from "./common/EventBus";
import AllRoutes from "./AllRoutes";
import IdleTimerContainer from "./utilities/IdleTimer";




const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const {auth} = useSelector((state) => state);
  const dispatch = useDispatch();
  

  // console.log(auth)

  const isLoggedIn = auth?.isLoggedIn
  const userAlreadyLoggedIn = auth?.userAlreadyLoggedIn

  

  const [loggin, setLoggin] = useState(false)

  useEffect(() => {
    if(isLoggedIn || userAlreadyLoggedIn ){
      setLoggin(true)
    }else{
      setLoggin(false)
    }
  }, [isLoggedIn,userAlreadyLoggedIn])
  
 

  const logOut = useCallback(() => {
    // alert('hook call useCallback');
    dispatch(logout());
  }, [dispatch]);


  useEffect(() => {
    // check expireTime
    const expireTime = parseInt(localStorage.getItem("expiredTime"), 10);
    // console.log("expiredTime", expireTime)

    if (expireTime > 0 && expireTime > Date.now()) {
        // console.log(`the time now is ${Date.now()} , and expired time is ${expireTime}`)
        setLoggin(true)
    }

}, [])


const logOutUser =(isLoggedIn)=>{
  setLoggin(isLoggedIn)
}

  return (
      <>
      
      {loggin ? <IdleTimerContainer fnLogout={logOutUser} / > : <React.Fragment></React.Fragment>}
        <AllRoutes/>
      </>
  );
};

export default App;
