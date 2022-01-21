import React from 'react'
import SideNavbar from './SideNavbar/SideNavbar'
import Home from './AllPages/Home'
import Transaction from './AllPages/Transaction'
import TransactionEnquirey from './AllPages/TransactionEnquirey';
import SettlementReport from './AllPages/SettlementReport';
import TransactionHistory from './AllPages/TransactionHistory';
import Profile from './AllPages/Profile';
import { useRouteMatch,Switch,Route ,Redirect} from 'react-router-dom'

import "./css/Home.css";
import "./css/50.684f163d.chunk.css";
import "./css/main.e3214ff9.chunk.css";
import "./css/loader.css";
import { useSelector } from 'react-redux';
import ClientList from './AllPages/ClientList';
import Subsciption from './AllPages/Subscription';


function Dashboard() {
    let { path } = useRouteMatch();
    const { user: currentUser,isLoggedIn } = useSelector((state) => state.auth);
  // console.log("currentUser",currentUser);
  if (!isLoggedIn) {
    return <Redirect to="/login-page" />;
  }
 
    return (
        <section className="Test gx-app-layout ant-layout ant-layout-has-sider">
                <SideNavbar />
                <Switch>
                <Route exact path={path}>
                    <Home/>
                </Route>
                <Route exact path={`${path}/profile`}>
                     <Profile/>
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
                <Route exaxt path={`${path}/subscription`}>
                     <Subsciption />
                </Route>
                </Switch>
        </section>
    )
}

export default Dashboard
