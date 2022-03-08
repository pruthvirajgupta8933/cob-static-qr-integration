import React from 'react'
import SideNavbar from './SideNavbar/SideNavbar'
import Home from './AllPages/Home'
import Transaction from './AllPages/Transaction'
import TransactionEnquirey from './AllPages/TransactionEnquirey';
import SettlementReport from './AllPages/SettlementReport';
import TransactionHistory from './AllPages/TransactionHistory';
import Profile from './AllPages/Profile';
import { useRouteMatch,Switch,Route ,Redirect,useHistory} from 'react-router-dom'

import "./css/Home.css";
import "./css/50.684f163d.chunk.css";
import "./css/main.e3214ff9.chunk.css";
import "./css/loader.css";
import { useSelector } from 'react-redux';
import ClientList from './AllPages/ClientList';
import Subsciption from './AllPages/Subscription';
import PayerDetails from'./AllPages/createpaymentlink/PayerDetails'
import PaymentLinkDetail from './AllPages/createpaymentlink/PaymentLinkDetail';
import Paylink from './AllPages/Paylink';
import {FormikApp} from './AllPages/ProfileTest'
import Emandate from './AllPages/Emandate';
import ChangePassword from './AllPages/ChangePassword';



function Dashboard() {
     // console.log('dashboard call');
     let history = useHistory();
    let { path } = useRouteMatch();
    const { user,isLoggedIn } = useSelector((state) => state.auth);
    
    
//   user!==null && user?. return (<Redirect to="/login-page" />)
     // console.log(user);
  if(user!==null && user.userAlreadyLoggedIn){
     console.log('funciton dashboard call');
     history.push("/login-page");  
    //  alert("aa1");
    
     return <Redirect to="/login-page" />
  }else if(user===null){
     console.log('2 funciton dashboard call');
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
                     {/* <Profile/> we need to change after testing complete */} 
                     <FormikApp />
                </Route>
                <Route exact path={`${path}/change-password`}>
                     <ChangePassword />
                </Route>
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
                </Switch>
        </section>
    )
}

export default Dashboard
