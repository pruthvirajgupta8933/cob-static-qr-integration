import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import Registration from './components/registration/Registration';
import LoginPage from './components/login/LoginPage';
import ForgetPassword from './components/forgetpassword/ForgetPassword';
import CommonPage from './components/Otherpages/CommonPage';
import EmailVerification from './components/Otherpages/EmailVerification'
import { Recipts } from './components/Otherpages/Recipts';
import StudentRecipets from './components/Otherpages/StudentRecipets';
import ReceiptByEmail from './components/Otherpages/ReceiptByEmail';
import ReceiptWalchand from './components/Otherpages/ReceiptWalchand';
import EmandatePage from './components/Otherpages/EmandatePage';



function AllRoutes(){
  
  
    return (
        <Router >
          <div>
            <Switch>
              <Route exact path="/">
                <LoginPage />
              </Route>
              <Route exact path="/login-page">
                <LoginPage />
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
              <Route path="/forget">
                <ForgetPassword />
              </Route>
              <Route exact path="/emailverification/:loginId">
                <EmailVerification />
              </Route>
              <Route exact path="/Receipt">
                <Recipts />
              </Route>
              <Route exact path="/stdReceipt">
                <StudentRecipets />
              </Route>
              <Route exact path="/ReceiptByEmail">
                <ReceiptByEmail />
              </Route>
              <Route exact path="/ReceiptWalchand">
                <ReceiptWalchand />
              </Route>
              <Route exact path="/EmandatePage/">
                <EmandatePage />
              </Route>

             
            </Switch>
          </div>
        </Router>
      );
}

export default AllRoutes
