import React from 'react'
import { Switch, Route } from "react-router-dom";
import Dashboard from './components/dashboard/Dashboard';
// import Login from './components/login/Login';
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
import Test from './components/Otherpages/Test';
import InternetConnection from './_components/reuseable_components/InternetConnection';
import MobileNavbar from './components/dashboard/SideNavbar/MobileNavbar';
import ViewTransactionDetails from './components/Otherpages/ViewTransactionDetails';

import DemoReg from './components/login/DemoReg';
import DemoLogin from './components/login/DemoLogin';
import ResetPassword from './components/forgetpassword/ResetPassword';
import ThankingCardForReset from './components/forgetpassword/ThankingCardForReset';



function AllRoutes(){

  return (
        // <Router >
          <div>
          <InternetConnection />

            <Switch>             
              <Route exact path="/login-page">
                <LoginPage />
              </Route>
              <Route exact path="/registration">
                <Registration />
              </Route>
              <Route path="/dashboard">
                <MobileNavbar/>
                <Dashboard />
              </Route>
              <Route exact path="/commonpages">
                <CommonPage />
              </Route>
              <Route path="/forget">
                <ForgetPassword />
              </Route>
              <Route path="/reset">
                <ResetPassword />
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
              <Route exact path="/login">
                <LoginPage />
              </Route>
              <Route exact path="/">
                <LoginPage />
              </Route>
              <Route exact path="/test">
                <Test />
              </Route>
              <Route exact path="/ViewTransactionDetails">
                <ViewTransactionDetails />
              </Route>
              <Route exact path="/demo-login">
                <DemoLogin/>
              </Route>
              <Route exact path="/demo-reg">
                <DemoReg/>
              </Route>
              <Route exact path="/thanks-card">
                <ThankingCardForReset />
              </Route>

            </Switch>
          </div>
        // </Router>
      );
}


export default AllRoutes
