import React, { useEffect, useState } from "react";
import "./css/Home.css";
import "./css/50.684f163d.chunk.css";
import "./css/main.e3214ff9.chunk.css";
import "./css/loader.css";

import SideNavbar from "./SideNavbar/SideNavbar";
import Home from "./AllPages/Home";
import TransactionEnquirey from "./AllPages/TransactionEnquirey";
import SettlementReport from "./AllPages/SettlementReport";
import TransactionHistory from "./AllPages/TransactionHistory";
import {
  useRouteMatch,
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ClientList from "./AllPages/ClientList";
import PaymentLinkDetail from "./AllPages/createpaymentlink/PaymentLinkDetail";
import Paylink from "./AllPages/Paylink";
import { Profile } from "./AllPages/Profile";
import Emandate from "./AllPages/Emandate";
import PaymentResponse from "./AllPages/PaymentResponse";
import KycForm from "../KYC/KycForm";
import Test from "../Otherpages/Test";
import SettlementReportNew from "./AllPages/SettlementReportNew";
import TransactionHistoryDownload from "./AllPages/TransactionHistoryDownload";
import Approver from "../ApproverNVerifier/Approver";
import ThanksPage from "../Otherpages/ThanksPage";
import ChangePassword from "./AllPages/ChangePassword";
import Products from "./AllPages/Product Catalogue/Products";
import SabPaisaPricing from "./AllPages/Product Catalogue/SabPaisaPricing";
import TransactionSummery from "./AllPages/TransactionSummery";
import OnboardMerchant from "../ApproverNVerifier/Onboarderchant/OnboardMerchant";
import RefundTransactionHistory from "./AllPages/RefundTransactionHistory";
import ChargeBackTxnHistory from "./AllPages/ChargeBackTxnHistory";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import { createClientProfile } from "../../slices/auth";
import Sandbox from "../SandBox/SendBox";
import AssignZone from "../ApproverNVerifier/AssignZone";
import AdditionalKYC from "../ApproverNVerifier/AdditionalKYC";
import RateMapping from "../ApproverNVerifier/RateMapping";
import SignupData from "../ApproverNVerifier/SignupData";
import MerchantRoute from "../../ProtectedRoutes/MerchantRoute";
import BankRoute from "../../ProtectedRoutes/BankRoute";
import VerifierRoute from "../../ProtectedRoutes/VerifierRoute";
import ApproverRoute from "../../ProtectedRoutes/ApproverRoute";
import ViewerRoute from "../../ProtectedRoutes/ViewerRoute";
import SpPg from "../sabpaisa-pg/SpPg";
import UrlNotFound from "./UrlNotFound";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";
import API_URL from "../../config";
import { userLoggedInStatus } from "../../utilities/userLoggedInStatus";

function Dashboard() {
  let history = useHistory();
  let { path } = useRouteMatch();

  const { user } = useSelector((state) => state.auth);
  // const clientMerchantDetailsList = user?.clientMerchantDetailsList
  const roles = roleBasedAccess();
  const dispatch = useDispatch();
  const locationPath = useLocation()

  const [userLoginStatus, setUserLoginStatus] = useState(false)

  // create new client code
  useEffect(() => {
    if (roles?.merchant) {
      if (user?.clientMerchantDetailsList) {
        if (user?.clientMerchantDetailsList[0]?.clientCode === null) {
          // create new client code
          const uuidCode = Math.random().toString(36).slice(-6).toUpperCase();
          const data = {
            loginId: user?.loginId,
            clientName: user?.clientContactPersonName,
            clientCode: uuidCode,
          };

          dispatch(createClientProfile(data)).then(clientProfileRes => {
            console.log("response of the create client ", clientProfileRes);

            // after create the client update the subscribe product
            const postData = {
              login_id: user?.loginId
            }


            // fetch details of the user registraion
            axiosInstanceAuth.post(API_URL.website_plan_details, postData).then(
              res => {
                console.log("clientProfileRes", clientProfileRes)
                const webData = res?.data?.data[0]?.plan_details
                const postData = {
                  clientId: clientProfileRes?.payload?.clientId,
                  applicationName: webData?.appName,
                  planId: webData?.planid,
                  planName: webData?.planName,
                  applicationId: webData?.appid,
                };

                axiosInstanceAuth.post(
                  API_URL.SUBSCRIBE_FETCHAPPAND_PLAN,
                  postData
                );


              }
            )
          }).catch(err => console.log(err));
        } else {
          // console.log("already created client code")
        }
      }
    }
  }, []);


  // const useStatuss = userLoggedInStatus()

  useEffect(() => {
    const useStatus = userLoggedInStatus()
    setUserLoginStatus(useStatus)
    // console.log("userLoggedInStatus", useStatus)
    if (!useStatus) {
      history.push("/login")
      // return <Redirect to="/login-page" />;
    }
  }, [locationPath])


  if (user !== null && user.userAlreadyLoggedIn) {
    // history.push("/login-page");
    return <Redirect to="/login-page" />;
  } else if (user === null) {
    return <Redirect to="/login-page" />;
  }

  return (
    // console.log(userLoginStatus) 
    userLoginStatus ? 
  //   <section className="Test gx-app-layout ant-layout ant-layout-has-sider">
  //   <div></div>
  //   <SideNavbar />
  //   <Switch>
  //     <Route exact path={path} >
  //       <Home />
  //     </Route>
  //     <Route exact path={`${path}/profile`}>
  //       <Profile />
  //     </Route>
  //     <MerchantRoute exact path={`${path}/change-password`} Component={ChangePassword}>
  //       <ChangePassword />
  //     </MerchantRoute>

  //     {roles?.merchant === true ? (
  //       <MerchantRoute
  //         exact
  //         path={`${path}/transaction-summery`}
  //         Component={TransactionSummery}
  //       >
  //         <TransactionSummery />
  //       </MerchantRoute>
  //     ) : (
  //       <BankRoute
  //         exact
  //         path={`${path}/transaction-summery`}
  //         Component={TransactionSummery}
  //       >
  //         <TransactionSummery />
  //       </BankRoute>
  //     )}

  //     <Route exact path={`${path}/onboard-merchant`}>
  //       <OnboardMerchant />
  //     </Route>

  //     {roles?.merchant === true ? (
  //       <MerchantRoute
  //         exact
  //         path={`${path}/transaction-enquiry`}
  //         Component={TransactionEnquirey}
  //       >
  //         <TransactionEnquirey />
  //       </MerchantRoute>
  //     ) : (
  //       <BankRoute
  //         exact
  //         path={`${path}/transaction-enquiry`}
  //         Component={TransactionEnquirey}
  //       >
  //         <TransactionEnquirey />
  //       </BankRoute>
  //     )}

  //     {roles?.merchant === true ? (
  //       <MerchantRoute
  //         exact
  //         path={`${path}/transaction-history`}
  //         Component={TransactionHistory}
  //       >
  //         <TransactionHistory />
  //       </MerchantRoute>
  //     ) : (
  //       <BankRoute
  //         exact
  //         path={`${path}/transaction-history`}
  //         Component={TransactionHistory}
  //       >
  //         <TransactionHistory />
  //       </BankRoute>
  //     )}

  //     <BankRoute exact path={`${path}/client-list`} Component={ClientList}>
  //       <ClientList />
  //     </BankRoute>

  //     {roles?.merchant === true ? (
  //       <MerchantRoute
  //         exaxt
  //         path={`${path}/settlement-report`}
  //         Component={SettlementReport}
  //       >
  //         <SettlementReport />
  //       </MerchantRoute>
  //     ) : (
  //       <BankRoute
  //         exaxt
  //         path={`${path}/settlement-report`}
  //         Component={SettlementReport}
  //       >
  //         <SettlementReport />
  //       </BankRoute>
  //     )}

  //     {roles?.merchant === true ? (
  //       <MerchantRoute
  //         exaxt
  //         path={`${path}/refund-transaction-history`}
  //         Component={RefundTransactionHistory}
  //       >
  //         <RefundTransactionHistory />
  //       </MerchantRoute>
  //     ) : (
  //       <BankRoute
  //         exaxt
  //         path={`${path}/refund-transaction-history`}
  //         Component={RefundTransactionHistory}
  //       >
  //         <RefundTransactionHistory />
  //       </BankRoute>
  //     )}

  //     {roles?.merchant === true ? (
  //       <MerchantRoute
  //         exaxt
  //         path={`${path}/chargeback-transaction-history`}
  //         Component={ChargeBackTxnHistory}
  //       >
  //         <ChargeBackTxnHistory />
  //       </MerchantRoute>
  //     ) : (
  //       <BankRoute
  //         exaxt
  //         path={`${path}/chargeback-transaction-history`}
  //         Component={ChargeBackTxnHistory}
  //       >
  //         <ChargeBackTxnHistory />
  //       </BankRoute>
  //     )}

  //     <MerchantRoute
  //       exaxt
  //       path={`${path}/product-catalogue`}
  //       Component={Products}
  //     >
  //       {/* <Subsciption /> */}
  //       <Products />
  //     </MerchantRoute>
  //     <MerchantRoute exaxt path={`${path}/paylink`} Component={Paylink}>
  //       <Paylink />
  //     </MerchantRoute>

  //     <MerchantRoute
  //       exaxt
  //       path={`${path}/paylinkdetail`}
  //       Component={PaymentLinkDetail}
  //     >
  //       <PaymentLinkDetail />
  //     </MerchantRoute>

  //     <MerchantRoute exaxt path={`${path}/emandate/`}>
  //       <Emandate />
  //     </MerchantRoute>
  //     <MerchantRoute exaxt path={`${path}/payment-response/`}>
  //       <PaymentResponse />
  //     </MerchantRoute>
  //     <MerchantRoute exact path={`${path}/test/`}>
  //       <Test />
  //     </MerchantRoute>

  //     {/* <Route exact path={`${path}/view-transaction-with-filter`}>
  //     <ViewTransactionWithFilter />
  //   </Route> */}

  //     {roles?.merchant === true ? (
  //       <MerchantRoute
  //         exact
  //         path={`${path}/settlement-report-new`}
  //         Component={SettlementReportNew}
  //       >
  //         <SettlementReportNew />
  //       </MerchantRoute>
  //     ) : (
  //       <BankRoute
  //         exact
  //         path={`${path}/settlement-report-new`}
  //         Component={SettlementReportNew}
  //       >
  //         <SettlementReportNew />
  //       </BankRoute>
  //     )}

  //     {roles?.merchant === true ? (
  //       <MerchantRoute
  //         exact
  //         path={`${path}/transaction-history-new`}
  //         Component={TransactionHistoryDownload}
  //       >
  //         <TransactionHistoryDownload />
  //       </MerchantRoute>
  //     ) : (
  //       <BankRoute
  //         exact
  //         path={`${path}/transaction-history-new`}
  //         Component={TransactionHistoryDownload}
  //       >
  //         <TransactionHistoryDownload />
  //       </BankRoute>
  //     )}

  //     <Route exact path={`${path}/sabpaisa-pricing/:id/:name`}>
  //       {/* getting issue to get query param in protected route */}
  //       <SabPaisaPricing />
  //     </Route>

  //     <MerchantRoute exact path={`${path}/kyc`} Component={KycForm}>
  //       <KycForm />
  //     </MerchantRoute>

  //     {roles?.verifier === true ? (
  //       <VerifierRoute exact path={`${path}/approver`} Component={Approver}>
  //         <Approver />
  //       </VerifierRoute>
  //     ) : roles?.approver === true ? (
  //       <ApproverRoute exact path={`${path}/approver`} Component={Approver}>
  //         <Approver />
  //       </ApproverRoute>
  //     ) : (
  //       <ViewerRoute exact path={`${path}/approver`} Component={Approver}>
  //         <Approver />
  //       </ViewerRoute>
  //     )}

  //     <ApproverRoute exact path={`${path}/assignzone`} Component={AssignZone}>
  //       <AssignZone />
  //     </ApproverRoute>

  //     {roles?.verifier === true ? (
  //       <VerifierRoute
  //         exact
  //         path={`${path}/signup-data`}
  //         Component={SignupData}
  //       >
  //         <SignupData />

  //       </VerifierRoute>
  //     ) : roles?.approver === true ? (
  //       <ApproverRoute
  //         exact
  //         path={`${path}/signup-data`}
  //         Component={SignupData}
  //       >
  //         <SignupData />
  //       </ApproverRoute>
  //     ) : (
  //       <ViewerRoute
  //         exact
  //         path={`${path}/signup-data`}
  //         Component={SignupData}
  //       >
  //         <SignupData />
  //       </ViewerRoute>
  //     )}

  //     <ApproverRoute
  //       exact
  //       path={`${path}/ratemapping`}
  //       Component={RateMapping}
  //     >
  //       <RateMapping />
  //     </ApproverRoute>

  //     <ApproverRoute
  //       exact
  //       path={`${path}/additional-kyc`}
  //       Component={AdditionalKYC}
  //     >
  //       <AdditionalKYC />
  //     </ApproverRoute>

  //     <Route exact path={`${path}/thanks`}>
  //       <ThanksPage />
  //     </Route>
  //     <MerchantRoute exact path={`${path}/Sandbox`} Component={Sandbox}>
  //       <Sandbox />
  //     </MerchantRoute>
  //     {/* <Route exact path={`${path}/pg-response`} >
  //                    <PgResponse />
  //               </Route> */}

  //     <MerchantRoute exact path={`${path}/sabpaisa-pg`} Component={SpPg}>
  //       <SpPg />
  //     </MerchantRoute>
  //     <Route path={`${path}/*`} component={UrlNotFound} />

  //   </Switch>
  // </section>
  <div> <Switch>
  //     <Route exact path={path} >
  //       <Home />
  //     </Route></Switch></div> 
  : <div>Dtat</div>
    // && 
    // (<section className="Test gx-app-layout ant-layout ant-layout-has-sider">
    //   <div></div>
    //   <SideNavbar />
    //   <Switch>
    //     <Route exact path={path} >
    //       <Home />
    //     </Route>
    //     <Route exact path={`${path}/profile`}>
    //       <Profile />
    //     </Route>
    //     <MerchantRoute exact path={`${path}/change-password`} Component={ChangePassword}>
    //       <ChangePassword />
    //     </MerchantRoute>

    //     {roles?.merchant === true ? (
    //       <MerchantRoute
    //         exact
    //         path={`${path}/transaction-summery`}
    //         Component={TransactionSummery}
    //       >
    //         <TransactionSummery />
    //       </MerchantRoute>
    //     ) : (
    //       <BankRoute
    //         exact
    //         path={`${path}/transaction-summery`}
    //         Component={TransactionSummery}
    //       >
    //         <TransactionSummery />
    //       </BankRoute>
    //     )}

    //     <Route exact path={`${path}/onboard-merchant`}>
    //       <OnboardMerchant />
    //     </Route>

    //     {roles?.merchant === true ? (
    //       <MerchantRoute
    //         exact
    //         path={`${path}/transaction-enquiry`}
    //         Component={TransactionEnquirey}
    //       >
    //         <TransactionEnquirey />
    //       </MerchantRoute>
    //     ) : (
    //       <BankRoute
    //         exact
    //         path={`${path}/transaction-enquiry`}
    //         Component={TransactionEnquirey}
    //       >
    //         <TransactionEnquirey />
    //       </BankRoute>
    //     )}

    //     {roles?.merchant === true ? (
    //       <MerchantRoute
    //         exact
    //         path={`${path}/transaction-history`}
    //         Component={TransactionHistory}
    //       >
    //         <TransactionHistory />
    //       </MerchantRoute>
    //     ) : (
    //       <BankRoute
    //         exact
    //         path={`${path}/transaction-history`}
    //         Component={TransactionHistory}
    //       >
    //         <TransactionHistory />
    //       </BankRoute>
    //     )}

    //     <BankRoute exact path={`${path}/client-list`} Component={ClientList}>
    //       <ClientList />
    //     </BankRoute>

    //     {roles?.merchant === true ? (
    //       <MerchantRoute
    //         exaxt
    //         path={`${path}/settlement-report`}
    //         Component={SettlementReport}
    //       >
    //         <SettlementReport />
    //       </MerchantRoute>
    //     ) : (
    //       <BankRoute
    //         exaxt
    //         path={`${path}/settlement-report`}
    //         Component={SettlementReport}
    //       >
    //         <SettlementReport />
    //       </BankRoute>
    //     )}

    //     {roles?.merchant === true ? (
    //       <MerchantRoute
    //         exaxt
    //         path={`${path}/refund-transaction-history`}
    //         Component={RefundTransactionHistory}
    //       >
    //         <RefundTransactionHistory />
    //       </MerchantRoute>
    //     ) : (
    //       <BankRoute
    //         exaxt
    //         path={`${path}/refund-transaction-history`}
    //         Component={RefundTransactionHistory}
    //       >
    //         <RefundTransactionHistory />
    //       </BankRoute>
    //     )}

    //     {roles?.merchant === true ? (
    //       <MerchantRoute
    //         exaxt
    //         path={`${path}/chargeback-transaction-history`}
    //         Component={ChargeBackTxnHistory}
    //       >
    //         <ChargeBackTxnHistory />
    //       </MerchantRoute>
    //     ) : (
    //       <BankRoute
    //         exaxt
    //         path={`${path}/chargeback-transaction-history`}
    //         Component={ChargeBackTxnHistory}
    //       >
    //         <ChargeBackTxnHistory />
    //       </BankRoute>
    //     )}

    //     <MerchantRoute
    //       exaxt
    //       path={`${path}/product-catalogue`}
    //       Component={Products}
    //     >
    //       {/* <Subsciption /> */}
    //       <Products />
    //     </MerchantRoute>
    //     <MerchantRoute exaxt path={`${path}/paylink`} Component={Paylink}>
    //       <Paylink />
    //     </MerchantRoute>

    //     <MerchantRoute
    //       exaxt
    //       path={`${path}/paylinkdetail`}
    //       Component={PaymentLinkDetail}
    //     >
    //       <PaymentLinkDetail />
    //     </MerchantRoute>

    //     <MerchantRoute exaxt path={`${path}/emandate/`}>
    //       <Emandate />
    //     </MerchantRoute>
    //     <MerchantRoute exaxt path={`${path}/payment-response/`}>
    //       <PaymentResponse />
    //     </MerchantRoute>
    //     <MerchantRoute exact path={`${path}/test/`}>
    //       <Test />
    //     </MerchantRoute>

    //     {/* <Route exact path={`${path}/view-transaction-with-filter`}>
    //     <ViewTransactionWithFilter />
    //   </Route> */}

    //     {roles?.merchant === true ? (
    //       <MerchantRoute
    //         exact
    //         path={`${path}/settlement-report-new`}
    //         Component={SettlementReportNew}
    //       >
    //         <SettlementReportNew />
    //       </MerchantRoute>
    //     ) : (
    //       <BankRoute
    //         exact
    //         path={`${path}/settlement-report-new`}
    //         Component={SettlementReportNew}
    //       >
    //         <SettlementReportNew />
    //       </BankRoute>
    //     )}

    //     {roles?.merchant === true ? (
    //       <MerchantRoute
    //         exact
    //         path={`${path}/transaction-history-new`}
    //         Component={TransactionHistoryDownload}
    //       >
    //         <TransactionHistoryDownload />
    //       </MerchantRoute>
    //     ) : (
    //       <BankRoute
    //         exact
    //         path={`${path}/transaction-history-new`}
    //         Component={TransactionHistoryDownload}
    //       >
    //         <TransactionHistoryDownload />
    //       </BankRoute>
    //     )}

    //     <Route exact path={`${path}/sabpaisa-pricing/:id/:name`}>
    //       {/* getting issue to get query param in protected route */}
    //       <SabPaisaPricing />
    //     </Route>

    //     <MerchantRoute exact path={`${path}/kyc`} Component={KycForm}>
    //       <KycForm />
    //     </MerchantRoute>

    //     {roles?.verifier === true ? (
    //       <VerifierRoute exact path={`${path}/approver`} Component={Approver}>
    //         <Approver />
    //       </VerifierRoute>
    //     ) : roles?.approver === true ? (
    //       <ApproverRoute exact path={`${path}/approver`} Component={Approver}>
    //         <Approver />
    //       </ApproverRoute>
    //     ) : (
    //       <ViewerRoute exact path={`${path}/approver`} Component={Approver}>
    //         <Approver />
    //       </ViewerRoute>
    //     )}

    //     <ApproverRoute exact path={`${path}/assignzone`} Component={AssignZone}>
    //       <AssignZone />
    //     </ApproverRoute>

    //     {roles?.verifier === true ? (
    //       <VerifierRoute
    //         exact
    //         path={`${path}/signup-data`}
    //         Component={SignupData}
    //       >
    //         <SignupData />

    //       </VerifierRoute>
    //     ) : roles?.approver === true ? (
    //       <ApproverRoute
    //         exact
    //         path={`${path}/signup-data`}
    //         Component={SignupData}
    //       >
    //         <SignupData />
    //       </ApproverRoute>
    //     ) : (
    //       <ViewerRoute
    //         exact
    //         path={`${path}/signup-data`}
    //         Component={SignupData}
    //       >
    //         <SignupData />
    //       </ViewerRoute>
    //     )}

    //     <ApproverRoute
    //       exact
    //       path={`${path}/ratemapping`}
    //       Component={RateMapping}
    //     >
    //       <RateMapping />
    //     </ApproverRoute>

    //     <ApproverRoute
    //       exact
    //       path={`${path}/additional-kyc`}
    //       Component={AdditionalKYC}
    //     >
    //       <AdditionalKYC />
    //     </ApproverRoute>

    //     <Route exact path={`${path}/thanks`}>
    //       <ThanksPage />
    //     </Route>
    //     <MerchantRoute exact path={`${path}/Sandbox`} Component={Sandbox}>
    //       <Sandbox />
    //     </MerchantRoute>
    //     {/* <Route exact path={`${path}/pg-response`} >
    //                    <PgResponse />
    //               </Route> */}

    //     <MerchantRoute exact path={`${path}/sabpaisa-pg`} Component={SpPg}>
    //       <SpPg />
    //     </MerchantRoute>
    //     <Route path={`${path}/*`} component={UrlNotFound} />

    //   </Switch>
    // </section>)
  );
}

export default Dashboard;
