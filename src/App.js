 import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { logout } from "./slices/auth";
import AllRoutes from "./AllRoutes";
import IdleTimerContainer from "./utilities/IdleTimer";
import ChatBotApp from "./components/chatbot/ChatBotApp"




const App = () => {
  const {auth} = useSelector((state) => state);
  const dispatch = useDispatch();
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
  
  useCallback (() => {
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

console.log("loggin",loggin)
  return (
      <>
      { loggin 
      ? <IdleTimerContainer fnLogout={logOutUser} / > : <React.Fragment></React.Fragment>}
        <AllRoutes/>
        <ChatBotApp key={loggin} />
         </>
  );
};

export default App;
