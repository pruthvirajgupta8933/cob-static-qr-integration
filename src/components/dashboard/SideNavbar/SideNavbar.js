import React, { useEffect } from 'react'
import { useDispatch, useSelector} from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom'
import {checkPermissionSlice, logout} from '../../../slices/auth'


function SideNavbar() {

  const {user,payLinkPermission} = useSelector((state)=> state.auth )
  
  if(user!==null && user.userAlreadyLoggedIn){
    // alert('no login');
    // <Redirect to="/login-page" />
    // alert("aa3");
    // history.push("/login-page");
}
  var {roleId,clientContactPersonName}=user;
    let { url } = useRouteMatch();
    const dispatch = useDispatch();
    const handle = ()=>{
      dispatch(logout());

    }

    useEffect(() => {
      if(user.clientMerchantDetailsList?.length > 0 ){
        dispatch(checkPermissionSlice(user?.clientMerchantDetailsList[0]?.clientCode))
      }
      
    }, [])

    
    
    
    return (
      <aside className="gx-app-sidebar  gx-layout-sider-dark false ant-layout-sider ant-layout-sider-dark" style={{flex: '0 0 200px', maxWidth: '200px', minWidth: '200px', width: '200px'}}>
      <div className="ant-layout-sider-children">
        <div className="gx-sidebar-content">
          <div className="side_top_wrap"><span className="switch_live_label">Live</span>
            <div className="side_top_wrap_profile">
              <div className="side_top_wrap_toggle"><i className="fa fa-angle-down" /></div>
              <p title="username" className="text-md text-ellipsis text-capitalize ng-binding">{clientContactPersonName}</p>
               {roleId!==3 && roleId!==13 ?  <Link to={`${url}/profile`} className="text-lighter text-ellipsis ng-binding txt-white">Profile</Link> : <></> }
            </div>
          </div>
          <div className="sidebar_menu_list">
            <div className="gx-layout-sider-scrollbar" style={{position: 'relative', overflow: 'hidden', width: '100%', height: '100%'}}>
              <div style={{position: 'absolute', inset: '0px', overflow: 'scroll', marginRight: '-3px', marginBottom: '-3px'}}>
                <ul className="ant-menu ant-menu-dark ant-menu-root ant-menu-inline" role="menu">
                  <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '24px',color:'white'}}>
                      <Link to={`${url}`} className='txt-white'><i className="fa fa-home" aria-hidden="true" /> Home</Link>
                  </li>
                  <li className="ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-open" role="menuitem">
                    <div className="ant-menu-submenu-title" aria-expanded="true" aria-owns="settlement$Menu" aria-haspopup="true" style={{paddingLeft: '24px'}}><span className="sidebar-menu-divider">Your
                        Business</span><i className="ant-menu-submenu-arrow" /></div>

                    <ul id="settlement$Menu" className="ant-menu ant-menu-sub ant-menu-inline" role="menu">
                      <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}>
                      <Link to={`${url}/transaction-history`} className='txt-white'><i className="fa fa-calendar" aria-hidden="true" />   Transaction History </Link> 
                    </li>

                    <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px',display:"none"}}>
                          <Link to={`${url}/kyc`} className='txt-white'><i className="fa fa-address-book" aria-hidden="true" />
                            &nbsp; Fill KYC Form</Link> 
                          </li>

                      <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}>
                        <Link to={`${url}/transaction-enquiry`} className='txt-white'><i className="fa fa-university" aria-hidden="true" />   Transaction Enquiry </Link> 
                      </li>

                      {/* <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}>
                        <Link to={`${url}/view-transaction-with-filter`} className='txt-white'><i className="fa fa-filter" aria-hidden="true" />   Transaction Enquiry With Filter </Link> 
                      </li> */}
                      {roleId===3 || roleId===13 ? <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}>
                      <Link to={`${url}/client-list`} className='txt-white'><i className="fa fa-university" aria-hidden="true" /> Client List </Link> 
                      </li> 
                      :
                      <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}>
                      <Link to={`${url}/settlement-report`} className='txt-white'><i className="fa fa-bars" aria-hidden="true" />
                      &nbsp; Settlement Report</Link> 
                      </li>
                      }

                      {roleId!==3 && roleId!==13 ? 
                      
                      <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}>
                      <Link to={`${url}/product-catalogue`} className='txt-white'><i className="fa fa-book" aria-hidden="true" />
                      &nbsp; Product Catalogue</Link> 
                      </li>
                      : <></>
                        }
                        
                        { 
                          payLinkPermission.length>0 && payLinkPermission[0].clientId===1 ? 
                          <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}}>
                          <Link to={`${url}/paylink`} className='txt-white'><i className="fa fa-address-book" aria-hidden="true" />
                            &nbsp; Create Payment Link</Link> 
                          </li> :<></>
                        }
                      
                      <li className="ant-menu-item" role="menuitem" style={{paddingLeft: '48px'}} onClick={()=>handle()}><a href={void(0)} ><i className="fa fa-briefcase" aria-hidden="true" />
                      &nbsp; Logout</a>
                      </li>
                    </ul>
                  </li>

                  <li className="ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-open ant-menu-submenu-selected" role="menuitem">
                    <div className="ant-menu-submenu-title" aria-expanded="true" aria-haspopup="true" style={{paddingLeft: '24px'}} aria-owns="payment-tool$Menu"><span className="sidebar-menu-divider">Payment
                        Tools</span><i className="ant-menu-submenu-arrow" /></div>
                    <ul id="payment-tool$Menu" className="ant-menu ant-menu-sub ant-menu-inline" role="menu" style={{}}>
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
          <div className="sidebar-menu-query"> <a href="https://sabpaisa.in/support-contact-us/" rel="noreferre" target="_blank" ><span className="sidebar-help-button"> <i className="fa fa-user" />Support</span></a></div>
        </div>
      </div>
    </aside>
    )
}

export default SideNavbar
