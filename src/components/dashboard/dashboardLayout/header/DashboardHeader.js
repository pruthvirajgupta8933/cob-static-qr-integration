import React, { useEffect, useMemo } from 'react'
import { logout } from "../../../../slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import headerClasses from "./dashboard-header.module.css"
// import Sabpaisalogo from "../../../../assets/images/sabpaisalogo.png";
import sabpaisalogoWhite from "../../../../assets/images/sabpaisalogoWhite.png";
import { dashboardHeaderMenuToggle } from '../../../../slices/theme/themeSlice';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

function DashboardHeader() {
    const dispatch = useDispatch();
    const { auth, themeReducer } = useSelector((state) => state);
    const { user } = auth;
    const loginId = user?.loginId;
    const username = user?.clientContactPersonName;
    const roles = roleBasedAccess();
    const loggedUser = Object.keys(roles).find((key) => roles[key] === true);
    const headerMenuToggle = themeReducer.dashboardHeader.headerMenuToggle

    const location = useLocation();

    const exitback = () => {
        dispatch(logout());
    };

    const toggleHandler = (value) => {
        dispatch(dashboardHeaderMenuToggle(value))
    }


    let urlChagned = useMemo(() => location, [location])
    useEffect(() => {
        dispatch(dashboardHeaderMenuToggle(true))
    }, [urlChagned])



    return (
        <header className={`navbar sticky-top flex-md-nowrap p-0  position-fixed ${headerClasses.navbar_cob}`}>
            <div className={`${headerClasses.navbar_brand_cob}  navbar-brand col-md-3 col-lg-2 me-0 px-3`}>
                <button className={`d-md-none collapsed navbar-toggler `} onClick={() => toggleHandler(headerMenuToggle)} type="button" aria-expanded="false" aria-label="Toggle navigation" >
                    <i className="fa fa-bars"></i>
                </button>
                <img src={sabpaisalogoWhite} alt="profile" title="profile" className={`${headerClasses.navbar_brand_logo}`} />
            </div>

            <div className={`d-flex justify-content-between ${headerClasses.navbar_mobile} px-4`}>
                <div className={`${headerClasses.cob_d_none_mobile} d-flex align-items-center`}>
                    <p className={`m-0 font-size-18 text-capitalize`}>Welcome back</p>
                </div>
                <div className={`navbar-nav ${headerClasses.navbar_nav_cob}  d-flex align-items-center`}>
                    <div className="d-flex align-items-center">
                        <p className="m-0 text-capitalize px-3 font-size-18 ">{loggedUser} Id &nbsp;: {loginId}</p>
                        {/* <Notification /> */}
                        <div className="dropdown">
                            <button className="btn btn-sm dropdown-toggle mr-2 border-1 font-size-18 text-capitalize" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa fa-user-circle font-size-18 " style={{ color: '#286ECD' }} /> {username}
                            </button>
                            <ul className="dropdown-menu position-absolute">
                                <li><Link to="/dashboard/profile" className="dropdown-item">Profile</Link></li>
                                <li><Link to="" onClick={exitback} className="dropdown-item">Log out</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>

    )
}

export default DashboardHeader