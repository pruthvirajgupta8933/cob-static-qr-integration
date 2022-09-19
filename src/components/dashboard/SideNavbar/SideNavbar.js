import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom'
import { checkPermissionSlice, logout } from '../../../slices/auth'
// import { enableKycTab, kycModalToggle } from '../../../slices/kycSlice';
import { roleBasedAccess } from '../../../_components/reuseable_components/roleBasedAccess';
import SabpaisaLogo2 from "../../../assets/images/sabpaisa-logo2.png"
import SabpaisaLogo1 from "../../../assets/images/sabpaisa-logo-white.png"
import Sabpaisalogo from "../../../assets/images/sabpaisalogo.png"
import Sabpaisalogo3 from "../../../assets/images/sabpaisa-white-logo1.png"
import Products from "../AllPages/Product Catalogue/Products"

function SideNavbar() {
  const { auth, kyc } = useSelector((state) => state)

  const { user, payLinkPermission } = auth



  if (user !== null && user.userAlreadyLoggedIn) {
    // alert('no login');
    // <Redirect to="/login-page" />
    // alert("aa3");
    // history.push("/login-page");
  }
  var { clientContactPersonName } = user;
  let { url } = useRouteMatch();
  const dispatch = useDispatch();
  const handle = () => {
    dispatch(logout());
    // dispatch(kycModalToggle(true));
    // dispatch(enableKycTab(false));


  }

  useEffect(() => {
    if (user.clientMerchantDetailsList?.length > 0) {
      dispatch(checkPermissionSlice(user?.clientMerchantDetailsList[0]?.clientCode))
    }

  }, [])


  const roleBasedShowTab = roleBasedAccess()



  // console.log("roleBasedShowTab", roleBasedShowTab)
  // console.log(kyc.enableKycTab)

  return (
    <aside className="gx-app-sidebar  gx-layout-sider-dark false ant-layout-sider ant-layout-sider-dark" style={{ background: 'rgb(1, 86, 179)', flex: '0 0 200px', maxWidth: '200px', minWidth: '200px', width: '200px',borderRight: '1px solid' }}>
      <div className="ant-layout-sider-children">
        <div className="gx-sidebar-content">
        <div className="brand-logo d-flex-item-right">
        <div class="float-centre p-4">
                    <img
                      src={Sabpaisalogo3}
                      width={150}
                      alt="sabpaisa"
                      title="sabpaisa"
                    />
                    </div>
            {/* <div className="side_top_wrap_profile">
              <div className="side_top_wrap_toggle"><i className="fa fa-angle-down" /></div>
              <p title="username" className="text-md text-ellipsis text-capitalize ng-binding">{clientContactPersonName}</p>
              {roleBasedShowTab?.merchant === true ? <Link to={`${url}/profile`} className="text-lighter text-ellipsis ng-binding txt-white">Profile</Link> : <></>}
            </div> */}
          </div>
          <div className="sidebar_menu_list">
            <div className="gx-layout-sider-scrollbar" style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
              <div style={{ position: 'absolute', inset: '0px', overflow: 'scroll', marginRight: '-3px', marginBottom: '-3px' }}>
                <ul className="desktop-sidenave-typography ant-menu ant-menu-dark ant-menu-root ant-menu-inline" role="menu" style={{background: 'rgb(1, 86, 179)'}}>
                  {roleBasedShowTab?.merchant === true || roleBasedShowTab?.bank === true ?
                    <li className="ant-menu-item" role="menuitem" >
                      <Link to={`${url}`} className='txt-white'><i className="fa fa-home homeiconsize" aria-hidden="true" /> <span>&nbsp;Dashboard</span></Link>
                    </li>
                    : <React.Fragment></React.Fragment>}

                  {roleBasedShowTab?.merchant === true &&
                    roleBasedShowTab?.approver === false && roleBasedShowTab?.verifier === false ?
                    <li className="ant-menu-item" role="menuitem" >
                      <Link to={`${url}/kyc`} className='txt-white' ><i className="fa fa-file-o" aria-hidden="true" /> <span>&nbsp;Complete KYC</span>
                      {/* <span class="new-tab">new</span> */}
                      </Link>
                    </li>
                    : <React.Fragment></React.Fragment>}


                  {roleBasedShowTab?.approver === true || roleBasedShowTab?.verifier === true ?
                    <li className="ant-menu-item" role="menuitem" >
                      <Link to={`${url}/approver`} className='txt-white' ><i className="fa fa-list" aria-hidden="true" /><span>&nbsp;Merchant List</span>
                      {/* <span class="new-tab">new</span> */}
                      </Link>
                    </li>
                    : <React.Fragment></React.Fragment>}



                  <li className="ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-open" role="menuitem">
                      {roleBasedShowTab?.merchant === true || roleBasedShowTab?.bank === true ?
                    <div className="ant-menu-submenu-title" aria-expanded="true" aria-owns="settlement$Menu" aria-haspopup="true" style={{ paddingLeft: '24px'}}><span className="sidebar-menu-divider-business">Your
                      Business</span><i className="ant-menu-submenu-arrow" /></div> : <></>}



                    <ul id="settlement$Menu" className="ant-menu ant-menu-sub ant-menu-inline" role="menu">
                      {roleBasedShowTab?.merchant === true || roleBasedShowTab?.bank === true ?
                        <React.Fragment>
                          <li className="ant-menu-item" role="menuitem" style={{ paddingLeft: '48px' }}>
                            <Link to={`${url}/transaction-history`} className='txt-white'><i className="fa fa-calendar" aria-hidden="true" />&nbsp;Transaction History </Link>
                          </li>


                          <li className="ant-menu-item" role="menuitem" style={{ paddingLeft: '48px' }}>
                            <Link to={`${url}/transaction-enquiry`} className='txt-white'><i className="fa fa-university" aria-hidden="true" />&nbsp;Transaction Enquiry</Link>
                          </li>
                        </React.Fragment>
                        : <React.Fragment></React.Fragment>}

                      {/* <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}>
                        <Link to={`${url}/view-transaction-with-filter`} className='txt-white'><i className="fa fa-filter" aria-hidden="true" />   Transaction Enquiry With Filter </Link> 
                      </li> */}
                      {roleBasedShowTab?.bank === true ?
                        <li className="ant-menu-item" role="menuitem" style={{ paddingLeft: '48px' }}>
                          <Link to={`${url}/client-list`} className='txt-white'><i className="fa fa-university" aria-hidden="true" /> Client List </Link>
                        </li>
                        : <React.Fragment></React.Fragment>}


                      {roleBasedShowTab?.merchant === true ?
                        <React.Fragment>
                          <li className="ant-menu-item" role="menuitem" style={{ paddingLeft: '48px' }}>
                            <Link to={`${url}/settlement-report-new`} className='txt-white'><i className="fa fa-bars" aria-hidden="true" />
                              &nbsp;<span>Settlement Report</span>
                              {/* <span class="new-tab">new</span> */}
                              </Link>
                          </li>

                          <li className="ant-menu-item" role="menuitem" style={{ paddingLeft: '48px' }}>
                            <Link to={`${url}/product-catalogue`} className='txt-white'><i className="fa fa-book" aria-hidden="true" />&nbsp;Product Catalogue</Link>
                          </li>
                        </React.Fragment>
                        : <React.Fragment></React.Fragment>
                      }



                      {payLinkPermission.length > 0 && payLinkPermission[0].clientId === 1 && roleBasedShowTab?.merchant === true ?
                        <li className="ant-menu-item" role="menuitem" style={{ paddingLeft: '48px' }}>
                          <Link to={`${url}/paylink`} className='txt-white'><i className="fa fa-address-book" aria-hidden="true" />
                            &nbsp; Create Payment Link</Link>
                        </li> : <React.Fragment></React.Fragment>
                      }
                    </ul>
                  </li>

                  {/* <li className="ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-open ant-menu-submenu-selected" role="menuitem">
                    <div className="ant-menu-submenu-title" aria-expanded="true" aria-haspopup="true" style={{ paddingLeft: '24px' }} aria-owns="payment-tool$Menu"><span className="sidebar-menu-divider">Payment
                      Tools</span><i className="ant-menu-submenu-arrow" /></div>
                    <ul id="payment-tool$Menu" className="ant-menu ant-menu-sub ant-menu-inline" role="menu" style={{}}>
                    </ul>
                  </li> */}

                </ul>
              </div>
              <div
                className="track-horizontal"
                style={{ display: "none", opacity: 0 }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "block",
                    height: "100%",
                    cursor: "pointer",
                    borderRadius: "inherit",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    width: "0px",
                  }}
                ></div>
              </div>
              <div
                style={{
                  position: "absolute",
                  width: "6px",
                  transition: "opacity 200ms ease 0s",
                  opacity: 0,
                  right: "2px",
                  bottom: "2px",
                  top: "2px",
                  borderRadius: "3px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "block",
                    width: "100%",
                    cursor: "pointer",
                    borderRadius: "inherit",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    height: "30px",
                    transform: "translateY(31.5706px)",
                  }}
                ></div>
              </div>
            </div>
          </div>
          {/* <div className="sidebar-menu-query"> <a href="https://sabpaisa.in/support-contact-us/" target="_blank" rel="noreferrer"><span className="sidebar-help-button"> <i className="fa fa-user" />Support</span></a></div> */}
        </div>
      </div>
    </aside>
  );
}

export default SideNavbar
