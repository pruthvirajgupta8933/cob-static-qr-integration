import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector} from 'react-redux';
import { Link,

    useRouteMatch,useHistory } from 'react-router-dom'
import {checkPermissionSlice, logout} from '../../../slices/auth'



function MobileNavbar() {
    const [toggleNav, setToggleNav] = useState(false)
    let history = useHistory();
    const {user,payLinkPermission} = useSelector((state)=> state.auth )
    
    const roleId = user?.roleId;
    const clientContactPersonName = user?.clientContactPersonName;
    if(user!==null && user.userAlreadyLoggedIn){
      // alert('no login');
      // <Redirect to="/login-page" />
      // alert("aa3");
      // history.push("/login-page");
  }
    
      let { path, url } = useRouteMatch();
      const dispatch = useDispatch();
      const handle = ()=>{
        dispatch(logout());
      }
  
      useEffect(() => {
        if(user?.clientMerchantDetailsList?.length > 0 ){
          dispatch(checkPermissionSlice(user?.clientMerchantDetailsList[0]?.clientCode))
        }
        
      }, [])
  
      
      

    return (
            <nav id="navbar1" className="mobile-nav-show navbar navbar-expand-md navbar-dark bg-dark fixed-top ">
                <div className="container">
                
                <span className="navbar-brand">{ `${clientContactPersonName?.slice(0,8)} ...` }</span>

                <button onClick={()=>{setToggleNav(!toggleNav)}} className={!toggleNav? "navbar-toggler toggler-example" : "navbar-toggler toggler-example collapsed" } type="button" data-toggle="collapse" data-target="" aria-controls="" aria-expanded={toggleNav} aria-label="Toggle navigation"><span className="dark-blue-text">
                <i className="fa fa-bars fa-1x"></i></span>
                </button>
                 {/* <li className="nav-item"> 
                        <Link to={`${url}`} onClick={()=>{setToggleNav(!toggleNav)}} className="nav-link"><i className="fa fa-home" aria-hidden="true" /> Home</Link>
                    </li> */}
            <div className= { toggleNav ? "collapse navbar-collapse show" :  "collapse navbar-collapse"}  id="navbarSupportedContent1">
            <ul className="navbar-nav mr-auto">
                {roleId!==3 && roleId!==13 ?
                    <li className="nav-item"> 
                        <Link  to={`${url}/profile`} onClick={()=>{setToggleNav(!toggleNav)}} className="nav-link"><i className="fa fa-user" aria-hidden="true" /> &nbsp;Profile</Link>
                    </li> : <></> }

                    <li className="nav-item">
                    <div className="clearfix">...</div> 
                    </li> 
                    <li className="nav-item"> 
                        <Link to={`${url}`} onClick={()=>{setToggleNav(!toggleNav)}} className="nav-link"><i className="fa fa-home" aria-hidden="true" /> &nbsp;Home</Link>
                    </li> 
                    
                    <li className="nav-item"> 
                        <Link to={`${url}/transaction-history`} onClick={()=>{setToggleNav(!toggleNav)}} className="nav-link"> <i className="fa fa-calendar" aria-hidden="true" /> &nbsp;  Transaction History</Link>
                    </li> 

                    <li className="nav-item" style={{display:"none"}}> 
                        <Link  to={`${url}/kyc`} onClick={()=>{setToggleNav(!toggleNav)}} className="nav-link"><i className="fa fa-address-book" aria-hidden="true" /> &nbsp; Fill KYC Form</Link>
                    </li> 
                    
                    <li className="nav-item"> 
                        <Link to={`${url}/transaction-enquiry`} onClick={()=>{setToggleNav(!toggleNav)}} className="nav-link"> <i className="fa fa-calendar" aria-hidden="true" /> &nbsp;  Transaction Enquiry </Link>
                    </li>
                    
                    <li className="nav-item"> 
                        <Link to={`${url}/view-transaction-with-filter`} onClick={()=>{setToggleNav(!toggleNav)}} className="nav-link"> <i className="fa fa-filter" aria-hidden="true" /> &nbsp; Transaction Enquiry With Filter </Link>
                    </li>

                    {roleId===3 || roleId===13 ? <li className="nav-item"> 
                        <Link  to={`${url}/client-list`}  onClick={()=>{setToggleNav(!toggleNav)}} className="nav-link"><i className="fa fa-university" aria-hidden="true" />  &nbsp;Client List </Link>
                    </li>  : 
                    
                    <li className="nav-item"> 
                        <Link to={`${url}/settlement-report`}  onClick={()=>{setToggleNav(!toggleNav)}} className="nav-link"><i className="fa fa-bars" aria-hidden="true" /> &nbsp; Settlement Report</Link>
                    </li>  }


                   

                    {roleId!==3 && roleId!==13 ? 
                    <li className="nav-item"> 
                        <Link to={`${url}/product-catalogue`}onClick={()=>{setToggleNav(!toggleNav)}} className="nav-link"><i className="fa fa-book" aria-hidden="true" /> &nbsp;Product Catalogue</Link>
                    </li>  : <></> }

                    { 
                          payLinkPermission.length>0 && payLinkPermission[0].clientId===1 ? 
                    <li className="nav-item"> 
                        <Link to={`${url}/paylink`} onClick={()=>{setToggleNav(!toggleNav)}} className="nav-link"><i className="fa fa-address-book" aria-hidden="true" /> &nbsp;Create Payment Link</Link>
                    </li> : <></> }


                    <li className="nav-item" onClick={()=>handle()}> 
                    <a href={void(0)} className="nav-link"><i className="fa fa-briefcase" aria-hidden="true" />
                        &nbsp; Logout</a>
                    </li> 

                    <li className="nav-item">
                    <div className="clearfix">...</div> 
                    </li> 
                    
                    <li className="nav-item">
                    <a href="https://sabpaisa.in/support-contact-us/" target="_blank" ><span className="sidebar-help-button"> <i className="fa fa-user" />Support</span></a>
                    </li> 
                    </ul>
                </div>
                </div>
            </nav>
    )
}

export default MobileNavbar