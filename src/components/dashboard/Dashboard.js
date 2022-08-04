import React from 'react'
import SideNavbar from './SideNavbar/SideNavbar'
import Home from './AllPages/Home'
import Transaction from './AllPages/Transaction'
import TransactionEnquirey from './AllPages/TransactionEnquirey';
import SettlementReport from './AllPages/SettlementReport';
import TransactionHistory from './AllPages/TransactionHistory';
import { useRouteMatch,Switch,Route ,Redirect,useHistory} from 'react-router-dom'

import "./css/Home.css";
import "./css/50.684f163d.chunk.css";
import "./css/main.e3214ff9.chunk.css";
import "./css/loader.css";
import { useSelector } from 'react-redux';
import ClientList from './AllPages/ClientList';
import Subsciption from './AllPages/Subscription';
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



function Dashboard() {

    let history = useHistory();
    let { path } = useRouteMatch();
    const { user } = useSelector((state) => state.auth);
//   user!==null && user?. return (<Redirect to="/login-page" />)
    //  console.log("user",user);
    //  useEffect(() => {
    //   if(user?.roleId === 3 || user?.roleId === 13){
    //     const auth_iv = localStorage.getItem("authiv");
    //     const auth_key = localStorage.getItem("authkey");
    //     dispatch(loginRefferalSlice({username:auth_key,password:auth_iv}))
    //   }
    // }, [])
  if(user!==null && user.userAlreadyLoggedIn){
    //  console.log('funciton dashboard call');
     history.push("/login-page");  
    //  alert("aa1");
    
     return <Redirect to="/login-page" />
  }else if(user===null){
    //  console.log('2 funciton dashboard call');
    // alert("aa2");
    // history.push("/login-page"); 
     return <Redirect to="/login-page" />
  }

    return (
        <section className="Test gx-app-layout ant-layout ant-layout-has-sider">
                <SideNavbar />
                <Switch>
                <Route exact path={path}>
                    <Home/>
                </Route>
                <Route exact path={`${path}/profile`}> 
                     <Profile />
                </Route>
                {/* <Route exact path={`${path}/change-password`}>
                     <ChangePassword />
                </Route> */}
                <Route exact path={`${path}/transaction`}>
                     <Transaction/>
                </Route>
                <Route exact path={`${path}/transaction-enquiry`}>
                     <TransactionEnquirey/>
                </Route>
                <Route exact path={`${path}/transaction-history`}>
                     <TransactionHistory/>
                </Route>
                <Route exact path={`${path}/client-list`}>
                     <ClientList />
               </Route>
                <Route exaxt path={`${path}/settlement-report`}>
                     <SettlementReport/>
                </Route>
                <Route exaxt path={`${path}/product-catalogue`}>
                     <Subsciption />
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

              <Route exact path={`${path}/kyc`} >
                <KycForm />
              </Route>
              
                </Switch>
        </section>
    )
}

export default Dashboard


