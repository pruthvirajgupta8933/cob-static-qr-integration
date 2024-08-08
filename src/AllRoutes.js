import React, { Suspense } from 'react'
import { Switch, Route } from "react-router-dom";
const Receipts = React.lazy(() => import("./components/Otherpages/Recipts"))
const EmailVerification = React.lazy(() => import('./components/Otherpages/EmailVerification'))
const StudentRecipets = React.lazy(() => import('./components/Otherpages/StudentRecipets'));
const ReceiptByEmail = React.lazy(() => import('./components/Otherpages/ReceiptByEmail'));
const ReceiptWalchand = React.lazy(() => import('./components/Otherpages/ReceiptWalchand'));
const ViewTransactionDetails = React.lazy(() => import('./components/Otherpages/ViewTransactionDetails'));
const UrlNotFound = React.lazy(() => import('./components/dashboard/UrlNotFound'));
const BizzForm = React.lazy(() => import('./components/BizzAppForm/BizzForm'))
const PrivacyPolicy = React.lazy(() => import('./TermsOfService/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./TermsOfService/TermsAndConditions'));
const Login = React.lazy(() => import('./components/mainComponent/login/Login'));
const DashboardMainContent = React.lazy(() => import('./components/dashboard/dashboardLayout/DashboardMainContent'));
const Signup = React.lazy(() => import('./components/mainComponent/signup/Signup'));
const ForgetPassword = React.lazy(() => import('./components/forgetpassword/ForgetPassword'));

function AllRoutes() {

  const fallbackMsg = (
    <div className="d-flex justify-content-center p-5 m-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  return (

    <Switch>

      <Route exact path="/login-page">
        <Suspense fallback={fallbackMsg} > <Login /> </Suspense>
      </Route>
      <Route exact path="/">
        <Suspense fallback={fallbackMsg} > <Login /> </Suspense>
      </Route>
      <Route exact path="/login">
        <Suspense fallback={fallbackMsg} > <Login /> </Suspense>
      </Route>
      <Route exact path="/registration">
        <Suspense fallback={fallbackMsg} > <Signup /> </Suspense>
      </Route>
      <Route path="/dashboard">
        <Suspense fallback={fallbackMsg} > <DashboardMainContent /> </Suspense>
      </Route>
      <Route path="/forget">
        <Suspense fallback={fallbackMsg} >  <ForgetPassword /> </Suspense>
      </Route>
      <Route exact path="/emailverification/:loginId">
        <Suspense fallback={fallbackMsg} >  <EmailVerification /> </Suspense>
      </Route>
      <Route exact path="/Receipt">
        <Suspense fallback={fallbackMsg} >  <Receipts /></Suspense>
      </Route>
      <Route exact path="/stdReceipt">

        <Suspense fallback={fallbackMsg} >  <StudentRecipets /> </Suspense>

      </Route>
      <Route exact path="/ReceiptByEmail">
        <Suspense fallback={fallbackMsg} >  <ReceiptByEmail /> </Suspense>

      </Route>
      <Route exact path="/ReceiptWalchand">

        <Suspense fallback={fallbackMsg} >  <ReceiptWalchand /> </Suspense>

      </Route>
      <Route exact path="/bizzForm">

        <Suspense fallback={fallbackMsg} > <BizzForm /> </Suspense>

      </Route>
      <Route exact path="/ViewTransactionDetails">
        <Suspense fallback={fallbackMsg} > <ViewTransactionDetails /> </Suspense>

      </Route>
      {/* <Route exact path="/TermsAndCondtions">
        <Suspense fallback={fallbackMsg} > <TermsAndConditions /> </Suspense>

      </Route>
      <Route exact path="/PrivacyPolicy">
        <Suspense fallback={fallbackMsg} > <PrivacyPolicy /> </Suspense>

      </Route> */}
      <Route path="*" component={UrlNotFound} />
    </Switch>

  );
}

export default AllRoutes
