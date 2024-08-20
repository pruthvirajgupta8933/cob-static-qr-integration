import React, { useEffect } from "react";
import DashboardHeader from './header/DashboardHeader'
import SideNavbar from './side-navbar/SideNavbar'
import classes from "./dashboard-main.module.css"
import Home from '../AllPages/Home'
import TransactionEnquirey from "../AllPages/TransactionEnquirey";
import SettlementReport from "../AllPages/SettlementReport";

import {
    useRouteMatch, Switch, Route, Redirect, useHistory, useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ClientList from "../AllPages/ClientList";
import PaymentLinkDetail from "../AllPages/createpaymentlink/PaymentLinkDetail";
import Paylink from "../AllPages/createpaymentlink/Paylink";
// improt Profile
// import { Profile } from "../../AllPages/Profile/Profile";
import Emandate from "../AllPages/Emandate";
import PaymentResponse from "../AllPages/PaymentResponse";
import KycForm from "../../KYC/KycForm";
// import Test from "../../Otherpages/Test";
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
import { logout, updateClientDataInLocal } from "../../../slices/auth";
import Sandbox from "../../SandBox/SendBox";
import AssignZone from "../../ApproverNVerifier/AssignZone";
import AdditionalKYC from "../../ApproverNVerifier/additional-kyc/AdditionalKYC";
import RateMapping from "../../ApproverNVerifier/RateMapping";
import SignupData from "../../ApproverNVerifier/SignupData";
// import MerchantRoute from "../../../ProtectedRoutes/MerchantRoute";
// import BankRoute from "../../../ProtectedRoutes/BankRoute";
// import VerifierRoute from "../../../ProtectedRoutes/VerifierRoute";
// import ApproverRoute from "../../../ProtectedRoutes/ApproverRoute";
// import ViewerRoute from "../../../ProtectedRoutes/ViewerRoute";
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
// import B2BRouting from "../../../B2B_components/Routes/B2BRouting";
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
// import HandleResponseModal from "../../../subscription_components/Create_Mandate/HandleResponseModal";
import AuthorizedRoute from "../../../ProtectedRoutes/AuthorizedRoute";
import MerchantReferralOnboard
    from "../../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/MerchantReferralOnboard";
import BankMerchantOnboard from "../../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/BankMerchantOnboard";
import authService from "../../../services/auth.service";
import MyMerchantList from "../../ApproverNVerifier/MyMerchantList";
import Profile from "../AllPages/Profile/Profile";
import InternalDashboard from "../../ApproverNVerifier/InternalDashboard";
import Widget from "../../widget/Widget";
import MerchantBalance from "../../ApproverNVerifier/MerchantBalance";
import MultiUserOnboard from "../../MultiUserOnboard/MultiUserOnboard";
import toastConfig from "../../../utilities/toastTypes";
import UserInfo from "../../ApproverNVerifier/UserInfo";
import TransactionHistory from "../AllPages/transaction-history/TransactionHistory";
import AssigneAccountManger from "../../ApproverNVerifier/AssigneAccountManger/AssigneAccountManger";
import AadharResponse from "../../ApproverNVerifier/additional-kyc/aadhar-attestr/AadharResponse";
import EditKycDetail from "../../ApproverNVerifier/EditKycDetail/EditKycDetail";


function DashboardMainContent() {
    let history = useHistory();
    let { path } = useRouteMatch();

    const { auth } = useSelector((state) => state);
    const { user } = auth;
    const roles = roleBasedAccess();
    // console.log("roles",roles);
    const dispatch = useDispatch();
    const location = useLocation();

    // const queryParams = new URLSearchParams(location.search);
    // const mendateRegId = queryParams.get("mendateRegId");
    const createAndSaveClientCode = async () => {
        if ((roles?.merchant) && user?.clientMerchantDetailsList[0]?.clientCode === null) {
            const clientFullName = user?.clientContactPersonName
            const clientMobileNo = user?.clientMobileNo
            const arrayOfClientCode = generateWord(clientFullName, clientMobileNo)

            // check client code is existing
            const stepRespOne = await authService.checkClintCode({ "client_code": arrayOfClientCode });
            // console.log("stepRespOne", stepRespOne)
            let newClientCode;
            // if client code available return status true, then make request with the given client
            if (stepRespOne?.data?.clientCode !== "" && stepRespOne?.data?.status === true) {
                newClientCode = stepRespOne?.data?.clientCode
            } else {
                newClientCode = Math.random().toString(36).slice(-6).toUpperCase();
            }

            // update new client code in db
            const data = { loginId: user?.loginId, clientName: user?.clientContactPersonName, clientCode: newClientCode };
            const stepRespTwo = await axiosInstanceJWT.post(API_URL.AUTH_CLIENT_CREATE, data);
            // console.log("stepRespTwo", stepRespTwo)

            let userLocalData = JSON.parse(localStorage?.getItem("user"));
            // console.log("before update - userLocalData", userLocalData)
            let clientMerchantDetailsListLocal = userLocalData.clientMerchantDetailsList[0]
            let mergeClientMerchantDetailsList = Object.assign(clientMerchantDetailsListLocal, stepRespTwo.data);

            // console.log("mergeClientMerchantDetailsList", mergeClientMerchantDetailsList)
            userLocalData.clientMerchantDetailsList = [mergeClientMerchantDetailsList]
            // console.log("after update - userLocalData", userLocalData)
            dispatch(updateClientDataInLocal(userLocalData))
            localStorage?.setItem("user", JSON.stringify(userLocalData))
            // fetch the details selected product by users
            const postData = { login_id: user?.loginId }

            const stepRespThree = await axiosInstanceJWT.post(API_URL.website_plan_details, postData)
            // console.log("stepRespThree", stepRespThree)
            // console.log("user", user)

            const webData = stepRespThree?.data?.data[0]?.plan_details
            // if business catagory code is gaming then not subscribed the plan
            if (user?.clientMerchantDetailsList[0]?.business_cat_code !== "37") {
                const postData = {
                    clientId: stepRespTwo?.data?.clientId,
                    applicationName: !isNull(webData?.appName) ? webData?.appName : "Paymentgateway",
                    planId: !isNull(webData?.planid) ? webData?.planid : "1",
                    planName: !isNull(webData?.planName) ? webData?.planName : "Subscription",
                    applicationId: !isNull(webData?.appid) ? webData?.appid : "10"
                };

                await axiosInstanceJWT.post(API_URL.SUBSCRIBE_FETCHAPPAND_PLAN, postData).then((res) => {

                    dispatch(merchantSubscribedPlanData({ "clientId": stepRespTwo?.data?.clientId }))

                })
            }

        }
    }


    // create new client code
    useEffect(() => {
        createAndSaveClientCode()
    }, []);





    useEffect(() => {
        if (user?.loginId != null && user?.loginId !== undefined && user?.loginId !== "") {
            const postBody = {
                LoginId: user?.loginId
            };
            dispatch(fetchMenuList(postBody))
        } else {
            toastConfig.errorToast("Session Expired")
            dispatch(logout())
        }
    }, [user, dispatch]);


    // menuListReducer.enableMenu.length===0 

    useEffect(() => {
        // fetch subscribe product data
        if (roles.merchant && location?.pathname === "/dashboard") {
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
            <div className="row dashboard_bg">
                <SideNavbar />

                <main className={`col-md-9 ms-sm-auto col-lg-10 px-md-4 ${classes.main_cob} dashboard_bg`}>
                    <Switch>
                        <Route exact path={path}>
                            <Home />
                        </Route>
                        <Route exact path={`${path}/profile`}>
                            <Profile />
                        </Route>
                        <AuthorizedRoute exact path={`${path}/onboard-merchant`} Component={OnboardMerchant} roleList={{ approver: true, viewer: true, accountManager: true }}>
                            <OnboardMerchant />
                        </AuthorizedRoute>


                        <AuthorizedRoute
                            exact
                            path={`${path}/Internal-dashboard`}
                            Component={InternalDashboard}
                            roleList={{ approver: true, viewer: true, verifier: true, accountManager: true }}
                        >
                            <InternalDashboard />
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
                            roleList={{ referral: true }}
                        >
                            <SettlementReportDoitc />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/transaction-history-merchant`}
                            Component={TransactionHistoryDoitc}
                            roleList={{ referral: true }}
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
                            roleList={{ merchant: true, referral: true }}>
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

                        <AuthorizedRoute exact path={`${path}/kyc`} Component={KycForm} roleList={{ merchant: true, referral: true }}>
                            <KycForm />
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
                            roleList={{ approver: true, verifier: true, viewer: true, accountManager: true }}
                        >
                            <AdditionalKYC />
                        </AuthorizedRoute>
                        <AuthorizedRoute
                            exact
                            path={`${path}/aadhar-response`}
                            Component={AadharResponse}
                            roleList={{ approver: true, verifier: true, viewer: true, accountManager: true }}
                        >
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/user-info`}
                            Component={UserInfo}
                            roleList={{ approver: true }}
                        >
                            <UserInfo />
                        </AuthorizedRoute>

                        <Route exact path={`${path}/thanks`}>
                            <ThanksPage />
                        </Route>

                        {/* <Route exact path={`${path}/pg-response`} >
                                    <PgResponse />
                                </Route> */}

                        <Route exact path={`${path}/sabpaisa-pg/:subscribeId/:applicationid`} Component={SpPg}>
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

                        <AuthorizedRoute exact path={`${path}/merchant-balance`} Component={MerchantBalance}
                            roleList={{ approver: true, verifier: true, viewer: true, accountManager: true }}>
                            <MerchantBalance />
                        </AuthorizedRoute>


                        {/* Routing for Faq */}

                        <AllowedForAll exact path={`${path}/faq`} Component={Faq}>
                            <Faq />
                        </AllowedForAll>

                        <AuthorizedRoute exact path={`${path}/widget`} Component={Widget} roleList={{ merchant: true }}>
                            <Widget />
                        </AuthorizedRoute>


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
                            roleList={{ approver: true, viewer: true, accountManager: true }}
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
                            roleList={{ approver: true, verifier: true, viewer: true, accountManager: true }}>
                            <BizzAppData />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact path={`${path}/my-merchant`}
                            Component={MyMerchantList}
                            roleList={{ viewer: true, accountManager: true }}>
                            <MyMerchantList />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/multi-user-onboard`}
                            Component={MultiUserOnboard}
                            roleList={{ accountManager: true, viewer: true }}
                        >
                            <MultiUserOnboard />
                        </AuthorizedRoute>

                        <AuthorizedRoute
                            exact
                            path={`${path}/merchant-assignment`}
                            Component={AssigneAccountManger}
                            roleList={{ approver: true }}
                        >
                            <AssigneAccountManger />
                        </AuthorizedRoute>

                        <AuthorizedRoute exact path={`${path}/edit-kyc-detail`} Component={EditKycDetail} roleList={{ verifier: true}}>
                            <EditKycDetail />
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