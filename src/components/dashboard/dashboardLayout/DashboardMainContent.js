import React, { useEffect } from "react";

import DashboardHeader from './header/DashboardHeader'
import SideNavbar from './side-navbar/SideNavbar'
import classes from "./dashboard-main.module.css"
import Home from '../AllPages/Home'

import TransactionEnquirey from "../AllPages/TransactionEnquirey";
import SettlementReport from "../AllPages/SettlementReport";
import TransactionHistory from "../AllPages/TransactionHistory";
import {
    useRouteMatch, Switch, Route, Redirect, useHistory, useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ClientList from "../AllPages/ClientList";
import PaymentLinkDetail from "../AllPages/createpaymentlink/PaymentLinkDetail";
import Paylink from "../AllPages/Paylink";
import { Profile } from "../AllPages/Profile";
import Emandate from "../AllPages/Emandate";
import PaymentResponse from "../AllPages/PaymentResponse";
import KycForm from "../../KYC/KycForm";
import Test from "../../Otherpages/Test";
import SettlementReportNew from "../AllPages/SettlementReportNew";
import TransactionHistoryDownload from "../AllPages/TransactionHistoryDownload";
import Approver from "../../ApproverNVerifier/Approver";
import ThanksPage from "../../Otherpages/ThanksPage";
import ChangePassword from "../AllPages/ChangePassword";
import Products from "../AllPages/Product Catalogue/Products";
import SabPaisaPricing from "../AllPages/Product Catalogue/SabPaisaPricing";
import TransactionSummery from "../AllPages/TransactionSummery";
import OnboardMerchant from "../../ApproverNVerifier/Onboarderchant/OnboardMerchant";
import RefundTransactionHistory from "../AllPages/RefundTransactionHistory";
import ChargeBackTxnHistory from "../AllPages/ChargeBackTxnHistory";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import { checkClientCodeSlice, createClientProfile } from "../../../slices/auth";
import Sandbox from "../../SandBox/SendBox";
import AssignZone from "../../ApproverNVerifier/AssignZone";
import AdditionalKYC from "../../ApproverNVerifier/AdditionalKYC";
import RateMapping from "../../ApproverNVerifier/RateMapping";
import SignupData from "../../ApproverNVerifier/SignupData";
import MerchantRoute from "../../../ProtectedRoutes/MerchantRoute";
import BankRoute from "../../../ProtectedRoutes/BankRoute";
import VerifierRoute from "../../../ProtectedRoutes/VerifierRoute";
import ApproverRoute from "../../../ProtectedRoutes/ApproverRoute";
import ViewerRoute from "../../../ProtectedRoutes/ViewerRoute";
import SpPg from "../../sabpaisa-pg/SpPg";
import UrlNotFound from "../UrlNotFound";
import { axiosInstanceJWT } from "../../../utilities/axiosInstance";
import API_URL from "../../../config";
import PayoutTransaction from "../../../payout/Ledger";
import TransactionsPayoutHistory from "../../../payout/Transactions";
import Beneficiary from "../../../payout/Beneficiary";
import MISReport from "../../../payout/MISReport";
import MakePayment from '../../../payout/MakePayment';
import OnboardedReport from "../../ApproverNVerifier/OnboardedReport";
import ChallanTransactReport from "../../../B2B_components/ChallanTransactReport";
import B2BRouting from "../../../B2B_components/Routes/B2BRouting";
import { fetchMenuList } from "../../../slices/cob-dashboard/menulistSlice";
import { isNull } from "lodash";
import { merchantSubscribedPlanData } from "../../../slices/merchant-slice/productCatalogueSlice";
import ReferZone from "../../ApproverNVerifier/ReferZone";
import GenerateMid from "../../ApproverNVerifier/GenerateMid";
import { generateWord } from "../../../utilities/generateClientCode";
import TransactionHistoryDoitc from "../AllPages/reports/TransactionHistoryDoitc";
import SettlementReportDoitc from "../AllPages/reports/SettlementReportDoitc";
import MandateReport from "../../../subscription_components/MandateReport";
import BizzAppData from '../../ApproverNVerifier/BizzData';
import CreateMandate from "../../../subscription_components/Create_Mandate/index";
import DebitReport from "../../../subscription_components/DebitReport";
import Faq from "../../../components/Faq/Faq"
import AllowedForAll from "../../../ProtectedRoutes/AllowedForAll";
import ManualRateMapping from "../../ApproverNVerifier/ManualRateMapping";
import HandleResponseModal from "../../../subscription_components/Create_Mandate/HandleResponseModal";
import AuthorizedRoute from "../../../ProtectedRoutes/AuthorizedRoute";
import MerchantReferralOnboard
    from "../../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/MerchantReferralOnboard";
import BankMerchantOnboard from "../../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/BankMerchantOnboard";


function DashboardMainContent() {
    let history = useHistory();
    let { path } = useRouteMatch();

    const { menuListReducer, auth } = useSelector((state) => state);
    const { user } = auth;
    const roles = roleBasedAccess();
    const dispatch = useDispatch();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const mendateRegId = queryParams.get("mendateRegId");


    // create new client code
    useEffect(() => {
        //  check the role and clientcode should be null
        if ((roles?.merchant || roles?.referral) && user?.clientMerchantDetailsList[0]?.clientCode === null) {

            const clientFullName = user?.clientContactPersonName
            const clientMobileNo = user?.clientMobileNo
            const arrayOfClientCode = generateWord(clientFullName, clientMobileNo)

            dispatch(checkClientCodeSlice({ "client_code": arrayOfClientCode })).then(res => {

                let newClientCode = ""
                // if client code available return status true, then make request with the given client
                if (res?.payload?.clientCode !== "" && res?.payload?.status === true) {
                    newClientCode = res?.payload?.clientCode

                } else {
                    newClientCode = Math.random().toString(36).slice(-6).toUpperCase();
                }

                // update new client code
                const data = {
                    loginId: user?.loginId, clientName: user?.clientContactPersonName, clientCode: newClientCode,
                };


                dispatch(createClientProfile(data)).then(clientProfileRes => {
                    // after create the client update the subscribe product
                    const postData = {
                        login_id: user?.loginId
                    }

                    // fetch details of the user registraion
                    axiosInstanceJWT.post(API_URL.website_plan_details, postData).then(res => {
                        const webData = res?.data?.data[0]?.plan_details

                        // if business catagory code is gaming then not subscribed the plan
                        if (user?.clientMerchantDetailsList[0]?.business_cat_code !== "37") {
                            const postData = {
                                clientId: clientProfileRes?.payload?.clientId,
                                applicationName: !isNull(webData?.appName) ? webData?.appName : "Paymentgateway",
                                planId: !isNull(webData?.planid) ? webData?.planid : "1",
                                planName: !isNull(webData?.planName) ? webData?.planName : "Subscription",
                                applicationId: !isNull(webData?.appid) ? webData?.appid : "10"
                            };

                            axiosInstanceJWT.post(API_URL.SUBSCRIBE_FETCHAPPAND_PLAN, postData).then((res) => {
                                dispatch(merchantSubscribedPlanData({ "clientId": clientProfileRes?.payload?.clientId }))

                            })
                        } // end subscribe
                    })
                }).catch(err => console.log(err));
            })

        }
    }, []);


    useEffect(() => {
        const postBody = {
            LoginId: user?.loginId
        }
        dispatch(fetchMenuList(postBody))
    }, [user, dispatch])

    // menuListReducer.enableMenu.length===0 

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

    // console.log("roles", roles)
    return (<React.Fragment>
        <DashboardHeader />

        <div className="container-fluid">
            <div className="row">
                <SideNavbar />

                <main className={`col-md-9 ms-sm-auto col-lg-10 px-md-4 ${classes.main_cob}`}>
                    <Switch>
                        <Route exact path={path}>
                            <Home />
                        </Route>
                        <Route exact path={`${path}/profile`}>
                            <Profile />
                        </Route>
                        <AuthorizedRoute exact path={`${path}/onboard-merchant`} Component={OnboardMerchant} roleList={{ approver: true,  accountManager: true }}>
                            <OnboardMerchant />
                        </AuthorizedRoute>


                        <AuthorizedRoute
                            exact
                            path={`${path}/change-password`}
                            Component={ChangePassword}
                            roleList={{ merchant: true }}
                        >
                            <ChangePassword />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/settled-transaction-merchant`}
                            Component={SettlementReportDoitc}
                            roleList={{ merchant: true }}
                        >
                            <SettlementReportDoitc />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/transaction-history-merchant`}
                            Component={TransactionHistoryDoitc}
                            roleList={{ merchant: true }}
                        >
                            <TransactionHistoryDoitc />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/transaction-summery`}
                            Component={TransactionSummery}
                            roleList={{ merchant: true, bank: true, referral: true }}
                        >
                            <TransactionSummery />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/transaction-enquiry`}
                            Component={TransactionEnquirey}
                            roleList={{ merchant: true, bank: true, referral: true }}
                        >
                            <TransactionEnquirey />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/transaction-history`}
                            Component={TransactionHistory}
                            roleList={{ merchant: true, bank: true, referral: true }}
                        >
                            <TransactionHistory />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/client-list`}
                            Component={ClientList}
                            roleList={{ bank: true, referral: true }}

                        >
                            <ClientList />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exaxt
                            path={`${path}/settlement-report`}
                            Component={SettlementReport}
                            roleList={{ merchant: true, bank: true, referral: true }}
                        >
                            <SettlementReport />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exaxt
                            path={`${path}/refund-transaction-history`}
                            Component={RefundTransactionHistory}
                            roleList={{ merchant: true, bank: true, referral: true }}
                        >
                            <RefundTransactionHistory />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exaxt
                            path={`${path}/chargeback-transaction-history`}
                            Component={ChargeBackTxnHistory}
                            roleList={{ merchant: true, bank: true, referral: true }}
                        >
                            <ChargeBackTxnHistory />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exaxt
                            path={`${path}/product-catalogue`}
                            Component={Products}
                            roleList={{ merchant: true }}
                        >
                            <Products />
                        </AuthorizedRoute>


                        <AuthorizedRoute
                            exaxt
                            path={`${path}/paylink`}
                            Component={Paylink}
                            roleList={{ merchant: true }}
                        >
                            <Paylink />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exaxt
                            path={`${path}/paylinkdetail`}
                            Component={PaymentLinkDetail}
                            roleList={{ merchant: true }}
                        >
                            <PaymentLinkDetail />
                        </AuthorizedRoute>

                        <AuthorizedRoute exact path={`${path}/Sandbox`} Component={Sandbox}
                            roleList={{ merchant: true }}>
                            <Sandbox />
                        </AuthorizedRoute>

                        <AuthorizedRoute exaxt path={`${path}/emandate/`} roleList={{ merchant: true }}>
                            <Emandate />
                        </AuthorizedRoute>


                        <AuthorizedRoute exaxt path={`${path}/payment-response/`} roleList={{ merchant: true }}>
                            <PaymentResponse />
                        </AuthorizedRoute>


                        <AuthorizedRoute
                            exact
                            path={`${path}/settlement-report-new`}
                            Component={SettlementReportNew}
                            roleList={{ merchant: true, bank: true, referral: true }}
                        >
                            <SettlementReportNew />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/transaction-history-new`}
                            Component={TransactionHistoryDownload}
                            roleList={{ merchant: true, bank: true, referral: true }}
                        >
                            <TransactionHistoryDownload />
                        </AuthorizedRoute>

                        <Route exact path={`${path}/sabpaisa-pricing/:id/:name`}>
                            {/* getting issue to get query param in protected route */}
                            <SabPaisaPricing />
                        </Route>

                        <AuthorizedRoute exact path={`${path}/kyc`} Component={KycForm} roleList={{ merchant: true }}>
                            <KycForm />
                        </AuthorizedRoute>


                        <AuthorizedRoute exact path={`${path}/approver`} Component={Approver}
                            roleList={{ approver: true, verifier: true, viewer: true }}
                        >
                            <Approver />
                        </AuthorizedRoute>


                        <AuthorizedRoute exact path={`${path}/approver`} Component={Approver}
                            roleList={{ approver: true, verifier: true, viewer: true }}
                        >
                            <Approver />
                        </AuthorizedRoute>

                        <AuthorizedRoute exact path={`${path}/configuration`} Component={AssignZone} roleList={{ approver: true, verifier: true }}>
                            <AssignZone />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/signup-data`}
                            Component={SignupData}
                            roleList={{ approver: true, verifier: true, viewer: true }}
                        >
                            <SignupData />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/ratemapping`}
                            Component={RateMapping}
                            roleList={{ approver: true }}
                        >
                            <RateMapping />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/additional-kyc`}
                            Component={AdditionalKYC}
                            roleList={{ approver: true, verifier: true, accountManager: true }}
                        >
                            <AdditionalKYC />
                        </AuthorizedRoute>

                        <Route exact path={`${path}/thanks`}>
                            <ThanksPage />
                        </Route>

                        {/* <Route exact path={`${path}/pg-response`} >
                                    <PgResponse />
                                </Route> */}

                        <Route exact path={`${path}/sabpaisa-pg/:subscribeId`} Component={SpPg}>
                            <SpPg />
                        </Route>

                        <AuthorizedRoute exact path={`${path}/payout/ledger`} Component={PayoutTransaction}
                            roleList={{ merchant: true }}>
                            <PayoutTransaction />
                        </AuthorizedRoute>

                        <AuthorizedRoute exact path={`${path}/payout/transactions`}
                            Component={TransactionsPayoutHistory} roleList={{ merchant: true }}>
                            <PayoutTransaction />
                        </AuthorizedRoute>

                        <AuthorizedRoute exact path={`${path}/payout/beneficiary`} Component={Beneficiary}
                            roleList={{ merchant: true }}>
                            <PayoutTransaction />
                        </AuthorizedRoute>

                        <AuthorizedRoute exact path={`${path}/payout/mis_report`} Component={MISReport}
                            roleList={{ merchant: true }}>
                            <PayoutTransaction />
                        </AuthorizedRoute>

                        <AuthorizedRoute exact path={`${path}/payout/payment_status`} Component={MakePayment}
                            roleList={{ merchant: true }}>
                            <PayoutTransaction />
                        </AuthorizedRoute>


                        {/* Routing for Faq */}

                        <AllowedForAll exact path={`${path}/faq`} Component={Faq}>
                            <Faq />
                        </AllowedForAll>


                        {/* Routing for subscription */}
                        {/* ----------------------------------------------------------------------------------------------------|| */}
                        <AuthorizedRoute exact path={`${path}/subscription/mandateReports`}
                            Component={MandateReport} roleList={{ merchant: true }}>
                            <MandateReport />
                        </AuthorizedRoute>

                        <AuthorizedRoute exact path={`${path}/subscription/debitReports`} Component={DebitReport}
                            roleList={{ merchant: true }}>
                            <DebitReport />
                        </AuthorizedRoute>

                        <AuthorizedRoute exact path={`${path}/subscription/mandate_registration`}
                            Component={CreateMandate} roleList={{ merchant: true }}>
                            <CreateMandate />
                        </AuthorizedRoute>

                        {/* -----------------------------------------------------------------------------------------------------|| */}

                        <AuthorizedRoute
                            exact
                            path={`${path}/onboarded-report`}
                            Component={OnboardedReport}
                            roleList={{ approver: true, verifier: true }}
                        >
                            <OnboardedReport />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/referzone`}
                            Component={ReferZone}
                            roleList={{ approver: true, verifier: true }}
                        >
                            <ReferZone />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/generatemid`}
                            Component={GenerateMid}
                            roleList={{ approver: true }}
                        >
                            <GenerateMid />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/bank-onboarding`}
                            Component={BankMerchantOnboard}
                            roleList={{ bank: true, approver: true }}
                        />

                        <AuthorizedRoute
                            exact
                            path={`${path}/referral-onboarding`}
                            Component={MerchantReferralOnboard}
                            roleList={{ approver: true, accountManager: true }}
                        />

                        {roles?.approver && (<Route
                            exact
                            path={`${path}/ratemapping/:loginid`}
                            Component={ManualRateMapping}
                        >
                            <ManualRateMapping />
                        </Route>)}

                        <AuthorizedRoute
                            exact
                            path={`${path}/emami/challan-transactions`}
                            Component={ChallanTransactReport}
                            roleList={{ b2b: true }}>
                            <ChallanTransactReport />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact path={`${path}/bizz-appdata`}
                            Component={BizzAppData}
                            roleList={{ approver: true, verifier: true, viewer: true }}>
                            <BizzAppData />
                        </AuthorizedRoute>

                        <Route path={`${path}/*`} component={UrlNotFound}>
                            <UrlNotFound />
                        </Route>
                    </Switch>
                </main>
            </div>
        </div>

    </React.Fragment>)
}

export default DashboardMainContent