import React from 'react'
import { Link,
    useParams,
    useRouteMatch } from 'react-router-dom'

function SideNavbar() {
    let { path, url } = useRouteMatch();
    return (
      <aside className="gx-app-sidebar  gx-layout-sider-dark false ant-layout-sider ant-layout-sider-dark" style={{flex: '0 0 200px', maxWidth: '200px', minWidth: '200px', width: '200px', marginTop: '35px'}}>
      <div className="ant-layout-sider-children">
        <div className="gx-sidebar-content">
          <div className="side_top_wrap"><span className="switch_live_label">Live</span>
            <div className="side_top_wrap_profile">
              <div className="side_top_wrap_toggle"><i className="fa fa-angle-down" /></div>
              <p title="VISHAL ANAND" className="text-md text-ellipsis text-capitalize ng-binding">ABHISHEK VERMA</p>
              {/* <a href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/dashboard/profile.html" className="text-lighter text-ellipsis ng-binding txt-white">My
                Profile</a> */}
                <Link to={`${url}/profile`} className="text-lighter text-ellipsis ng-binding txt-white">Profile</Link>
            </div>
          </div>
          <div className="sidebar_menu_list">
            <div className="gx-layout-sider-scrollbar" style={{position: 'relative', overflow: 'hidden', width: '100%', height: '100%'}}>
              <div style={{position: 'absolute', inset: '0px', overflow: 'scroll', marginRight: '-3px', marginBottom: '-3px'}}>
                <ul className="ant-menu ant-menu-dark ant-menu-root ant-menu-inline" role="menu">
                  <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '24px',color:'white'}}>
                  
                  {/* <a href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/dashboard/payout.html"><i className="fa fa-home" aria-hidden="true" />
                      Home</a> */}
                      <Link to={`${url}`} className='txt-white'><i className="fa fa-home" aria-hidden="true" /> Home</Link>
                 </li>
                  <li className="ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-open" role="menuitem">
                    <div className="ant-menu-submenu-title" aria-expanded="true" aria-owns="settlement$Menu" aria-haspopup="true" style={{paddingLeft: '24px'}}><span className="sidebar-menu-divider">Your
                        Business</span><i className="ant-menu-submenu-arrow" /></div>
                    <ul id="settlement$Menu" className="ant-menu ant-menu-sub ant-menu-inline" role="menu">
                      <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}>
                      <Link to={`${url}/transaction-history`} className='txt-white'><i className="fa fa-list-ul" aria-hidden="true" />   Transaction History </Link> 
                      {/* <a href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/dashboard/transaction.html"><i className="fa fa-list-ul" aria-hidden="true" /> Transactions</a> */}
                    </li>
                      <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}>
                      {/* <a href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/dashboard/settlement.html"><i className="fa fa-university" aria-hidden="true" />
                        Transaction Enquiry</a> */}
                        <Link to={`${url}/transaction-enquiry`} className='txt-white'><i className="fa fa-university" aria-hidden="true" />   Transaction Enquiry </Link> 
                      </li>
                      <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}><a href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/dashboard/refunds.html"><i className="fa fa-exchange" aria-hidden="true" />
                          Refunds</a>
                      </li>
                      <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}><a href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/dashboard/completekyc.html"><i className="fa fa-university" aria-hidden="true" />
                          Complete KYC</a>
                      </li>
                    </ul>
                  </li>
                  <li className="ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-open" role="menuitem">
                    <div className="ant-menu-submenu-title" aria-expanded="true" aria-haspopup="true" style={{paddingLeft: '24px'}} aria-owns="proposal$Menu"><span className="sidebar-menu-divider">Your
                        Proposals</span><i className="ant-menu-submenu-arrow" /></div>
                    <ul id="proposal$Menu" className="ant-menu ant-menu-sub ant-menu-inline" role="menu" style={{}}>
                      <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}><a href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/dashboard/quotation.html"><i className="fa fa-clone" aria-hidden="true" />
                          Quotations</a></li>
                      <li className="ant-menu-item ant-menu-item-active" role="menuitem" style={{paddingLeft: '48px'}}><a href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/dashboard/proforma.html"><i className="fa fa-inr" aria-hidden="true" />
                          Proforma Invoices</a></li>
                    </ul>
                  </li>
                  <li className="ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-open ant-menu-submenu-selected" role="menuitem">
                    <div className="ant-menu-submenu-title" aria-expanded="true" aria-haspopup="true" style={{paddingLeft: '24px'}} aria-owns="payment-tool$Menu"><span className="sidebar-menu-divider">Payment
                        Tools</span><i className="ant-menu-submenu-arrow" /></div>
                    <ul id="payment-tool$Menu" className="ant-menu ant-menu-sub ant-menu-inline" role="menu" style={{}}>
                      <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}><a href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/dashboard/invoice.html"><i className="fa fa-inr" aria-hidden="true" />
                          Invoices</a>
                      </li>
                      <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}>
                        <a href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/dashboard/paymentlink.html"><i className="fa fa-money" aria-hidden="true" />
                          Payment
                          Links</a>
                      </li>
                      <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}><a href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/dashboard/subscriptions.html"><i className="fa fa-briefcase" aria-hidden="true" />
                          Services<i className="sidebar_badge">Soon</i></a></li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="track-horizontal" style={{display: 'none', opacity: 0}}>
                <div style={{position: 'relative', display: 'block', height: '100%', cursor: 'pointer', borderRadius: 'inherit', backgroundColor: 'rgba(0, 0, 0, 0.2)', width: '0px'}}>
                </div>
              </div>
              <div style={{position: 'absolute', width: '6px', transition: 'opacity 200ms ease 0s', opacity: 0, right: '2px', bottom: '2px', top: '2px', borderRadius: '3px'}}>
                <div style={{position: 'relative', display: 'block', width: '100%', cursor: 'pointer', borderRadius: 'inherit', backgroundColor: 'rgba(0, 0, 0, 0.2)', height: '30px', transform: 'translateY(31.5706px)'}}>
                </div>
              </div>
            </div>
          </div>
          <div className="sidebar-menu-query"><span className="sidebar-help-button"><i className="icon icon-queries" />Support</span></div>
        </div>
      </div>
    </aside>
    )
}

export default SideNavbar
