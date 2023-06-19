import React from 'react'
import { Switch, Route } from "react-router-dom";

import ForgetPassword from './components/forgetpassword/ForgetPassword';
import CommonPage from './components/Otherpages/CommonPage';
import EmailVerification from './components/Otherpages/EmailVerification'
import { Recipts } from './components/Otherpages/Recipts';
import StudentRecipets from './components/Otherpages/StudentRecipets';
import ReceiptByEmail from './components/Otherpages/ReceiptByEmail';
import ReceiptWalchand from './components/Otherpages/ReceiptWalchand';
// import EmandatePage from './components/Otherpages/EmandatePage';
// import InternetConnection from './_components/reuseable_components/InternetConnection';
// import MobileNavbar from './components/dashboard/SideNavbar/MobileNavbar';
import ViewTransactionDetails from './components/Otherpages/ViewTransactionDetails';
import UrlNotFound from './components/dashboard/UrlNotFound';

import BizzForm from './components/BizzAppForm/BizzForm'
import PrivacyPolicy from './TermsOfService/PrivacyPolicy';
import TermsAndConditions from './TermsOfService/TermsAndConditions';
// import Test from './components/Otherpages/Test';
// import Header from './components/mainComponent/header/Header';
import Login from './components/mainComponent/login/Login';
import DashboardMainContent from './components/dashboard/dashboardLayout/DashboardMainContent';
import Signup from './components/mainComponent/signup/Signup';

function AllRoutes() {

  return (

    <Switch>
      <Route exact path="/login-page">
        <Login />
      </Route>
      <Route exact path="/">
        <Login />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/registration">
        <Signup />
      </Route>
      <Route path="/dashboard">
        <DashboardMainContent />
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
      <Route exact path="/bizzForm">
        <BizzForm />
      </Route>
      <Route exact path="/ViewTransactionDetails">
        <ViewTransactionDetails />
      </Route>
      <Route exact path="/TermsAndCondtions">
        <TermsAndConditions />
      </Route>
      <Route exact path="/PrivacyPolicy">
        <PrivacyPolicy />
      </Route>
      {/* <Route exact path="/test-login">
        <Test />
      </Route> */}
      <Route path="*" component={UrlNotFound} />
    </Switch>

  );
}

export default AllRoutes
