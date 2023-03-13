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
import { checkClientCodeSlice, createClientProfile } from "../../slices/auth";
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
import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import API_URL from "../../config";
import PayoutTransaction from "../../payout/Ledger";
import TransactionsPayoutHistory from "../../payout/Transactions";
import Beneficiary from "../../payout/Beneficiary";
import MISReport from "../../payout/MISReport";
import MakePayment from '../../payout/MakePayment';
import OnboardedReport from "../ApproverNVerifier/OnboardedReport";
import ChallanTransactReport from "../../B2B_components/ChallanTransactReport";
import B2BRouting from "../../B2B_components/Routes/B2BRouting";
import { fetchMenuList } from "../../slices/cob-dashboard/menulistSlice";
import { isNull } from "lodash";
import { merchantSubscribedPlanData } from "../../slices/merchant-slice/productCatalogueSlice";
import ReferZone from "../ApproverNVerifier/ReferZone";
import GenerateMid from "../ApproverNVerifier/GenerateMid";
import { generateWord } from "../../utilities/generateClientCode";
import TransactionHistoryDoitc from "./AllPages/reports/TransactionHistoryDoitc";
import SettlementReportDoitc from "./AllPages/reports/SettlementReportDoitc";
import MandateReport from "../../subscription_components/MandateReport";
import DebitReports from "../../subscription_components/DebitReports";


function Dashboard() {
  let history = useHistory();
  let { path } = useRouteMatch();
  const { user, avalabilityOfClientCode } = useSelector((state) => state.auth);
  const roles = roleBasedAccess();
  const dispatch = useDispatch();
  const location = useLocation();

  // create new client code
  useEffect(() => {
    // console.log("user",user)

    if (roles?.merchant) {
      // console.log("merchant")
      
      if (user?.clientMerchantDetailsList) {

        // console.log("merchant- clientlist available")
        if (user?.clientMerchantDetailsList[0]?.clientCode === null) {

          // console.log("merchant- client code null")
          const clientFullName = user?.clientContactPersonName
          const clientMobileNo = user?.clientMobileNo
          const arrayOfClientCode =  generateWord(clientFullName, clientMobileNo)

          // console.log("arrayOfClientCode",arrayOfClientCode)
          dispatch(checkClientCodeSlice({ "client_code": arrayOfClientCode })).then(res=>{
            // console.log("res",res?.payload?.clientCode)
            let newClientCode = ""
               // if client code available return status true, then make request with the given client

            if (res?.payload?.clientCode !== "" && res?.payload?.status === true) {
              newClientCode = res?.payload?.clientCode
              // console.log("newClientCode-step1",newClientCode)
            } else {
              newClientCode = Math.random().toString(36).slice(-6).toUpperCase();
              // console.log("newClientCode-step2",newClientCode)
            }
  
            // console.log("new cleint code", newClientCode)
  
            // update new client code
            const data = {
              loginId: user?.loginId,
              clientName: user?.clientContactPersonName,
              clientCode: newClientCode,
            };
            // console.log("data", data)
  
            dispatch(createClientProfile(data)).then(clientProfileRes => {
              // console.log("response of the create client ", clientProfileRes);
              // after create the client update the subscribe product
              const postData = {
                login_id: user?.loginId
              }
              // fetch details of the user registraion
              axiosInstanceJWT.post(API_URL.website_plan_details, postData).then(
                res => {
                  // console.log("clientProfileRes", clientProfileRes)
                  const webData = res?.data?.data[0]?.plan_details
                  const postData = {
                    clientId: clientProfileRes?.payload?.clientId,
                    applicationName: !isNull(webData?.appName) ? webData?.appName : "Paymentgateway",
                    planId: !isNull(webData?.planid) ? webData?.planid : "1",
                    planName: !isNull(webData?.planName) ? webData?.planName : "Subscription",
                    applicationId: !isNull(webData?.appid) ? webData?.appid : "10"
                  };
  
                  axiosInstanceJWT.post(
                    API_URL.SUBSCRIBE_FETCHAPPAND_PLAN,
                    postData
                  ).then((res) => {
                    dispatch(merchantSubscribedPlanData({ "clientId": clientProfileRes?.payload?.clientId }))
  
                  })
                }
              )
            }).catch(err => console.log(err));
          })
          
        }


      }
    }
  }, []);



  useEffect(() => {
    const postBody = {
      LoginId: user?.loginId
    }
    dispatch(fetchMenuList(postBody))
  }, [user, dispatch])


  useEffect(() => {
    // fetch subscribe product data
    if (location?.pathname === "/dashboard") {
      dispatch(merchantSubscribedPlanData({ "clientId": user?.clientMerchantDetailsList[0]?.clientId }))
    }
  }, [location])

  if (user !== null && user.userAlreadyLoggedIn) {
    history.push("/login-page");
    return <Redirect to="/login-page" />;
  } else if (user === null) {
    return <Redirect to="/login-page" />;
  }

  return (
    <section className="Test gx-app-layout ant-layout ant-layout-has-sider">
      <div></div>
      <SideNavbar />
      <Switch>
        <Route exact path={path} >
          <Home />
        </Route>
        <Route exact path={`${path}/profile`}>
          <Profile />
        </Route>
        <MerchantRoute
          exact
          path={`${path}/change-password`}
          Component={ChangePassword}
        >
          <ChangePassword />
        </MerchantRoute>

        <MerchantRoute
          exact
          path={`${path}/settled-transaction-merchant`}
          Component={SettlementReportDoitc}
        >
          <SettlementReportDoitc />
        </MerchantRoute>

        <MerchantRoute
          exact
          path={`${path}/transaction-history-merchant`}
          Component={TransactionHistoryDoitc}
        >
          <TransactionHistoryDoitc />
        </MerchantRoute>

        {roles?.merchant === true ? (
          <MerchantRoute
            exact
            path={`${path}/transaction-summery`}
            Component={TransactionSummery}
          >
            <TransactionSummery />
          </MerchantRoute>
        ) : (
          <BankRoute
            exact
            path={`${path}/transaction-summery`}
            Component={TransactionSummery}
          >
            <TransactionSummery />
          </BankRoute>
        )}

        <Route exact path={`${path}/onboard-merchant`}>
          <OnboardMerchant />
        </Route>

        {roles?.merchant === true ? (
          <MerchantRoute
            exact
            path={`${path}/transaction-enquiry`}
            Component={TransactionEnquirey}
          >
            <TransactionEnquirey />
          </MerchantRoute>
        ) : (
          <BankRoute
            exact
            path={`${path}/transaction-enquiry`}
            Component={TransactionEnquirey}
          >
            <TransactionEnquirey />
          </BankRoute>
        )}

        {roles?.merchant === true ? (
          <MerchantRoute
            exact
            path={`${path}/transaction-history`}
            Component={TransactionHistory}
          >
            <TransactionHistory />
          </MerchantRoute>
        ) : (
          <BankRoute
            exact
            path={`${path}/transaction-history`}
            Component={TransactionHistory}
          >
            <TransactionHistory />
          </BankRoute>
        )}

        <BankRoute exact path={`${path}/client-list`} Component={ClientList}>
          <ClientList />
        </BankRoute>

        {roles?.merchant === true ? (
          <MerchantRoute
            exaxt
            path={`${path}/settlement-report`}
            Component={SettlementReport}
          >
            <SettlementReport />
          </MerchantRoute>
        ) : (
          <BankRoute
            exaxt
            path={`${path}/settlement-report`}
            Component={SettlementReport}
          >
            <SettlementReport />
          </BankRoute>
        )}

        {roles?.merchant === true ? (
          <MerchantRoute
            exaxt
            path={`${path}/refund-transaction-history`}
            Component={RefundTransactionHistory}
          >
            <RefundTransactionHistory />
          </MerchantRoute>
        ) : (
          <BankRoute
            exaxt
            path={`${path}/refund-transaction-history`}
            Component={RefundTransactionHistory}
          >
            <RefundTransactionHistory />
          </BankRoute>
        )}

        {roles?.merchant === true ? (
          <MerchantRoute
            exaxt
            path={`${path}/chargeback-transaction-history`}
            Component={ChargeBackTxnHistory}
          >
            <ChargeBackTxnHistory />
          </MerchantRoute>
        ) : (
          <BankRoute
            exaxt
            path={`${path}/chargeback-transaction-history`}
            Component={ChargeBackTxnHistory}
          >
            <ChargeBackTxnHistory />
          </BankRoute>
        )}

        <MerchantRoute
          exaxt
          path={`${path}/product-catalogue`}
          Component={Products}
        >
          {/* <Subsciption /> */}
          <Products />
        </MerchantRoute>
        <MerchantRoute exaxt path={`${path}/paylink`} Component={Paylink}>
          <Paylink />
        </MerchantRoute>

        <MerchantRoute
          exaxt
          path={`${path}/paylinkdetail`}
          Component={PaymentLinkDetail}
        >
          <PaymentLinkDetail />
        </MerchantRoute>

        <MerchantRoute exaxt path={`${path}/emandate/`}>
          <Emandate />
        </MerchantRoute>
        <MerchantRoute exaxt path={`${path}/payment-response/`}>
          <PaymentResponse />
        </MerchantRoute>
        <MerchantRoute exact path={`${path}/test/`}>
          <Test />
        </MerchantRoute>

        {/* <Route exact path={`${path}/view-transaction-with-filter`}>
          <ViewTransactionWithFilter />
        </Route> */}

        {roles?.merchant === true ? (
          <MerchantRoute
            exact
            path={`${path}/settlement-report-new`}
            Component={SettlementReportNew}
          >
            <SettlementReportNew />
          </MerchantRoute>
        ) : (
          <BankRoute
            exact
            path={`${path}/settlement-report-new`}
            Component={SettlementReportNew}
          >
            <SettlementReportNew />
          </BankRoute>
        )}

        {roles?.merchant === true ? (
          <MerchantRoute
            exact
            path={`${path}/transaction-history-new`}
            Component={TransactionHistoryDownload}
          >
            <TransactionHistoryDownload />
          </MerchantRoute>
        ) : (
          <BankRoute
            exact
            path={`${path}/transaction-history-new`}
            Component={TransactionHistoryDownload}
          >
            <TransactionHistoryDownload />
          </BankRoute>
        )}

        <Route exact path={`${path}/sabpaisa-pricing/:id/:name`}>
          {/* getting issue to get query param in protected route */}
          <SabPaisaPricing />
        </Route>

        <MerchantRoute exact path={`${path}/kyc`} Component={KycForm}>
          <KycForm />
        </MerchantRoute>

        {roles?.verifier === true ? (
          <VerifierRoute exact path={`${path}/approver`} Component={Approver}>
            <Approver />
          </VerifierRoute>
        ) : roles?.approver === true ? (
          <ApproverRoute exact path={`${path}/approver`} Component={Approver}>
            <Approver />
          </ApproverRoute>
        ) : (
          <ViewerRoute exact path={`${path}/approver`} Component={Approver}>
            <Approver />
          </ViewerRoute>
        )}

        <ApproverRoute exact path={`${path}/assignzone`} Component={AssignZone}>
          <AssignZone />
        </ApproverRoute>

        {roles?.verifier === true ? (
          <VerifierRoute
            exact
            path={`${path}/signup-data`}
            Component={SignupData}
          >
            <SignupData />

          </VerifierRoute>
        ) : roles?.approver === true ? (
          <ApproverRoute
            exact
            path={`${path}/signup-data`}
            Component={SignupData}
          >
            <SignupData />
          </ApproverRoute>
        ) : (
          <ViewerRoute
            exact
            path={`${path}/signup-data`}
            Component={SignupData}
          >
            <SignupData />
          </ViewerRoute>
        )}

        <ApproverRoute
          exact
          path={`${path}/ratemapping`}
          Component={RateMapping}
        >
          <RateMapping />
        </ApproverRoute>

        <ApproverRoute
          exact
          path={`${path}/additional-kyc`}
          Component={AdditionalKYC}
        >
          <AdditionalKYC />
        </ApproverRoute>

        <Route exact path={`${path}/thanks`}>
          <ThanksPage />
        </Route>
        <MerchantRoute exact path={`${path}/Sandbox`} Component={Sandbox}>
          <Sandbox />
        </MerchantRoute>
        {/* <Route exact path={`${path}/pg-response`} >
                         <PgResponse />
                    </Route> */}

        <Route exact path={`${path}/sabpaisa-pg/:subscribeId`} Component={SpPg}>
          <SpPg />
        </Route>

        <MerchantRoute exact path={`${path}/payout/ledger`} Component={PayoutTransaction}>
          <SpPg />
        </MerchantRoute>
        <MerchantRoute exact path={`${path}/payout/transactions`} Component={TransactionsPayoutHistory}>
          <SpPg />
        </MerchantRoute>
        <MerchantRoute exact path={`${path}/payout/beneficiary`} Component={Beneficiary}>
          <SpPg />
        </MerchantRoute>
        <MerchantRoute exact path={`${path}/payout/mis_report`} Component={MISReport}>
          <SpPg />
        </MerchantRoute>
        <MerchantRoute exact path={`${path}/payout/payment_status`} Component={MakePayment}>
          <SpPg />
        </MerchantRoute>


        {/* Routing for subscription */}
        {/* ----------------------------------------------------------------------------------------------------|| */}
        <MerchantRoute exact path={`${path}/subscription/mandateReports`} Component={MandateReport}>
          <SpPg />
        </MerchantRoute>
        <MerchantRoute exact path={`${path}/subscription/debitReports`} Component={DebitReports}>
          <SpPg />
        </MerchantRoute>
        

        {/* -----------------------------------------------------------------------------------------------------|| */}


        {roles?.verifier && (
          <VerifierRoute
            exact
            path={`${path}/onboarded-report`}
            Component={OnboardedReport}
          >
            <SignupData />

          </VerifierRoute>
        )}


        {roles?.approver && (
          <ApproverRoute
            exact
            path={`${path}/onboarded-report`}
            Component={OnboardedReport}
          >
            <SignupData />
          </ApproverRoute>
        )}


        {roles?.approver && (
          <ApproverRoute
            exact
            path={`${path}/referzone`}
            Component={ReferZone}
          >
            <ReferZone />
          </ApproverRoute>
        )}


        {roles?.approver && (
          <ApproverRoute
            exact
            path={`${path}/generatemid`}
            Component={GenerateMid}
          >
            <ReferZone />
          </ApproverRoute>
        )}



        <B2BRouting exact path={`${path}/emami/challan-transactions`} Component={ChallanTransactReport}>
          <ChallanTransactReport />
        </B2BRouting>

        <Route path={`${path}/*`} component={UrlNotFound} >
          <UrlNotFound />
        </Route>
      </Switch>
    </section>
  );
}

export default Dashboard;
