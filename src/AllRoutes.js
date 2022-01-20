import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect ,
    useHistory
  } from "react-router-dom";
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import Header from './components/login/Headre'
import Registration from './components/registration/Registration';
import { useDispatch,useSelector } from 'react-redux';
import LoginPage from './components/login/LoginPage';
import CommonPage from './components/Otherpages/CommonPage';



function AllRoutes(){
  
    return (
        <Router >
          <div>
            <Switch>
              <Route exact path="/">
                <LoginPage />
              </Route>
              <Route exact path="/login">
                <LoginPage />
              </Route>
              <Route exact path="/login-page-old">
                <Login />
              </Route>
              <Route exact path="/registration">
                <Registration />
              </Route>
              <Route path="/dashboard">
                <Dashboard />

              </Route>

              <Route exact path="/commonpages">
                <CommonPage />

              </Route>
            </Switch>
          </div>
        </Router>
      );
}

export default AllRoutes
