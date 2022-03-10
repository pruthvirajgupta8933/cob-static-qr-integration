import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";



import { logout } from "./slices/auth";

import EventBus from "./common/EventBus";
import AllRoutes from "./AllRoutes";


const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    alert('hook call useCallback');
    dispatch(logout());

  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
    //   setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
    //   setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    } else {
    //   setShowModeratorBoard(false);
    //   setShowAdminBoard(false);
    }

    EventBus.on("logout", () => {
      alert("event bus call")
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  return (
      <>
      
        <AllRoutes/>
      </>
  );
};

export default App;
