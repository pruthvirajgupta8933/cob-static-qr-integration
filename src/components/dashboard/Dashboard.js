import React from 'react'
import SideNavbar from './SideNavbar/SideNavbar'
import Home from './AllPages/Home'
import Transaction from './AllPages/Transaction'
import TransactionEnquirey from './AllPages/TransactionEnquirey';
import TransactionEnquireyH from './AllPages/TransactionEnquiryH';
import TransactionHistory from './AllPages/TransactionHistory';
import Profile from './AllPages/Profile';
import { useRouteMatch,Switch,Route ,Redirect} from 'react-router-dom'

import "./css/Home.css";
import "./css/50.684f163d.chunk.css";
import "./css/main.e3214ff9.chunk.css";
import "./css/loader.css";
import { useSelector } from 'react-redux';
import Test from './AllPages/Test';
import ClientList from './AllPages/ClientList';


function Dashboard() {
    let { path } = useRouteMatch();
    const { user: currentUser } = useSelector((state) => state.auth);
  // console.log("currentUser",currentUser);
  if (!currentUser) {
    return <Redirect to="/login" />;
  }
 
    return (
        <section className="Test gx-app-layout ant-layout ant-layout-has-sider">
                <SideNavbar />
                <Switch>
                <Route exact path={path}>
                    <Home/>
                </Route>
                <Route exaxt path={`${path}/profile`}>
                     <Profile/>
                </Route>
                <Route exaxt path={`${path}/transaction`}>
                     <Transaction/>
                </Route>
                <Route exaxt path={`${path}/transaction-enquiry`}>
                     <TransactionEnquirey/>
                </Route>
                <Route exaxt path={`${path}/transaction-history`}>
                     <TransactionHistory/>
                </Route>
                <Route exaxt path={`${path}/transaction-enquiryh`}>
                     <TransactionEnquireyH />
                </Route>
                <Route exaxt path={`${path}/test`}>
                     <Test />
                </Route>
                <Route exact path={`${path}/client-list`}>
                     <ClientList />
                </Route>
                </Switch>
          
         
            
            
        </section>
    )
}

export default Dashboard
