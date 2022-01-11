import React from 'react'
import SideNavbar from './SideNavbar/SideNavbar'
import Home from './AllPages/Home'
import Transaction from './AllPages/Transaction'
import TransactionEnquirey from './AllPages/TransactionEnquirey';
import TransactionHistory from './AllPages/TransactionHistory';
import Profile from './AllPages/Profile';
import { useRouteMatch,Switch,Route } from 'react-router-dom'

import "./css/loader.css";
import "./css/50.684f163d.chunk.css";
import "./css/main.e3214ff9.chunk.css";
import "./css/loader.css";


function Dashboard() {
    let { path } = useRouteMatch();
 
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

                </Switch>
          
         
            
            
        </section>
    )
}

export default Dashboard
