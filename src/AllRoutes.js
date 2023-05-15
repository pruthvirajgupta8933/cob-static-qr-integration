import React from 'react'
import { Switch, Route } from "react-router-dom";
import Dashboard from './components/dashboard/Dashboard';
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
// import InternetConnection from './_components/reuseable_components/InternetConnection';
// import MobileNavbar from './components/dashboard/SideNavbar/MobileNavbar';
import ViewTransactionDetails from './components/Otherpages/ViewTransactionDetails';
import UrlNotFound from './components/dashboard/UrlNotFound';
// import NavBar from './components/dashboard/NavBar/NavBar';
import BizzForm from './components/BizzAppForm/BizzForm'
import PrivacyPolicy from './TermsOfService/PrivacyPolicy';
import TermsAndConditions from './TermsOfService/TermsAndConditions';

function AllRoutes() {

  return (

    <Switch>
      <Route exact path="/login-page">
        <LoginPage />
      </Route>
      <Route exact path="/">
        <LoginPage />
      </Route>
      <Route exact path="/login">
        <LoginPage />
      </Route>
      <Route exact path="/registration">
        <Registration />
      </Route>
      <Route path="/dashboard">
        {/* <MobileNavbar/> */}
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
      <Route path="*" component={UrlNotFound} />
    </Switch>

  );
}

export default AllRoutes
