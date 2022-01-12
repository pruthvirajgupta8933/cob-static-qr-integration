import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,

    useHistory
  } from "react-router-dom";
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import Header from './components/login/Headre'
import Registration from './components/registration/Registration';
import { useDispatch,useSelector } from 'react-redux';


function AllRoutes(){

  
    return (
        <Router >
          <div>
            <Switch>
              <Route exact path="/">
                <Login />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/registration">
                <Registration />
              </Route>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
            </Switch>
          </div>
        </Router>
      );
}

export default AllRoutes
