import React, { useEffect } from 'react'
import "./css/Home.css";
import "./css/50.684f163d.chunk.css";
import "./css/main.e3214ff9.chunk.css";
import "./css/loader.css";

import SideNavbar from './SideNavbar/SideNavbar'
import Home from './AllPages/Home'
import Transaction from './AllPages/Transaction'
import TransactionEnquirey from './AllPages/TransactionEnquirey';
import SettlementReport from './AllPages/SettlementReport';
import TransactionHistory from './AllPages/TransactionHistory';
import { useRouteMatch, Switch, Route, Redirect, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import ClientList from './AllPages/ClientList';
import PaymentLinkDetail from './AllPages/createpaymentlink/PaymentLinkDetail';
import Paylink from './AllPages/Paylink';
import { Profile } from './AllPages/Profile';
import Emandate from './AllPages/Emandate';
import PaymentResponse from './AllPages/PaymentResponse';
import KycForm from '../KYC/KycForm';
import Test from '../Otherpages/Test';
import ViewTransactionWithFilter from './AllPages/ViewTransactionWithFilter';
import SettlementReportNew from './AllPages/SettlementReportNew';
import TransactionHistoryDownload from './AllPages/TransactionHistoryDownload';
import Approver from '../ApproverNVerifier/Approver';
import ThanksPage from '../Otherpages/ThanksPage';
import ChangePassword from './AllPages/ChangePassword';
import Products from './AllPages/Product Catalogue/Products';
import SabPaisaPricing from './AllPages/Product Catalogue/SabPaisaPricing';
import TransactionSummery from './AllPages/TransactionSummery';
import OnboardMerchant from '../ApproverNVerifier/Onboarderchant/OnboardMerchant';
import RefundTransactionHistory from './AllPages/RefundTransactionHistory';
import ChargeBackTxnHistory from './AllPages/ChargeBackTxnHistory';
import { roleBasedAccess } from '../../_components/reuseable_components/roleBasedAccess';
import { createClientProfile } from '../../slices/auth';



function Dashboard() {
     let history = useHistory();
     let { path } = useRouteMatch();
     const { user } = useSelector((state) => state.auth);
     const roles = roleBasedAccess()

     const dispatch = useDispatch()


     useEffect(() => {
          if (roles?.merchant) {
               if (user?.clientMerchantDetailsList) {
                    if (user?.clientMerchantDetailsList[0]?.clientCode === null) {
                         const uuidCode = Math.random().toString(36).slice(-6).toUpperCase();

                         const data = {
                              "loginId": user?.loginId,
                              "clientName": user?.clientContactPersonName,
                              "clientCode": uuidCode,
                         }

                         dispatch(createClientProfile(data))
                         // .then(res => {
                         //      console.log(res)
                         // }).catch(err => {
                         //      console.log(err)
                         // })
                         // console.log("client code is null")
                    } else {
                         // console.log("client code is not null")
                    }
               }
          }
     }, [])

     if (user !== null && user.userAlreadyLoggedIn) {
          history.push("/login-page");
          return <Redirect to="/login-page" />
     } else if (user === null) {
          return <Redirect to="/login-page" />
     }





     return (
          <section className="Test gx-app-layout ant-layout ant-layout-has-sider">
               <div>
                    {/* <a style={{display: "none"}} href="empty" id="ref" >ref</a>
                <button onClick={(e)=>exportCSV(e)}>Export CSV</button> */}
               </div>
               <SideNavbar />
               <Switch>
                    <Route exact path={path}>
                         <Home />
                    </Route>
                    <Route exact path={`${path}/profile`}>
                         <Profile />
                    </Route>
                    <Route exact path={`${path}/change-password`}>
                         <ChangePassword />
                    </Route>
                    <Route exact path={`${path}/transaction`}>
                         <Transaction />
                    </Route>
                    <Route exact path={`${path}/transaction-summery`}>
                         <TransactionSummery />
                    </Route>
                    <Route exact path={`${path}/onboard-merchant`}>
                         <OnboardMerchant />
                    </Route>
                    <Route exact path={`${path}/transaction-enquiry`}>
                         <TransactionEnquirey />
                    </Route>
                    <Route exact path={`${path}/transaction-history`}>
                         <TransactionHistory />
                    </Route>
                    <Route exact path={`${path}/client-list`}>
                         <ClientList />
                    </Route>
                    <Route exaxt path={`${path}/settlement-report`}>
                         <SettlementReport />
                    </Route>
                    <Route exaxt path={`${path}/refund-transaction-history`}>
                         <RefundTransactionHistory />
                    </Route>
                    <Route exaxt path={`${path}/chargeback-transaction-history`}>
                         <ChargeBackTxnHistory />
                    </Route>
                    <Route exaxt path={`${path}/product-catalogue`}>
                         {/* <Subsciption /> */}
                         <Products />
                    </Route>
                    <Route exaxt path={`${path}/paylink`}>
                         <Paylink />
                    </Route>
                    <Route exaxt path={`${path}/paylinkdetail`}>
                         <PaymentLinkDetail />
                    </Route>
                    <Route exaxt path={`${path}/emandate/`}>
                         <Emandate />
                    </Route>
                    <Route exaxt path={`${path}/payment-response/`}>
                         <PaymentResponse />
                    </Route>
                    <Route exact path={`${path}/kyc/`}>
                         <KycForm />
                    </Route>
                    <Route exact path={`${path}/test/`}>
                         <Test />
                    </Route>
                    <Route exact path={`${path}/view-transaction-with-filter`} >
                         <ViewTransactionWithFilter />
                    </Route>

                    <Route exact path={`${path}/settlement-report-new`} >
                         <SettlementReportNew />
                    </Route>

                    <Route exact path={`${path}/transaction-history-new`} >
                         <TransactionHistoryDownload />
                    </Route>
                    <Route exact path={`${path}/sabpaisa-pricing/:id/:name`} >
                         <SabPaisaPricing />
                    </Route>

                    <Route exact path={`${path}/kyc`} >
                         <KycForm />
                    </Route>

                    <Route exact path={`${path}/approver`} >
                         <Approver />
                    </Route>
                    <Route exact path={`${path}/thanks`} >
                         <ThanksPage />
                    </Route>

               </Switch>
          </section>
     )
}

export default Dashboard
