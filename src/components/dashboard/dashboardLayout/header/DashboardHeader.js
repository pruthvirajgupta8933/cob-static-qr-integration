import React from 'react'
import { logout } from "../../../../slices/auth";
import { useDispatch, useSelector } from "react-redux";
import profile from "../../../../assets/images/profile.png";
import { Link } from "react-router-dom";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import headerClasses from "./dashboard-header.module.css"
import Sabpaisalogo3 from "../../../../assets/images/sabpaisa-white-logo1.png";

function DashboardHeader() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const loginId = user?.loginId;
    const username = user?.clientContactPersonName;
    const roles = roleBasedAccess();
    const loggedUser = Object.keys(roles).find((key) => roles[key] === true);

    const exitback = () => {
        dispatch(logout());
    };

    return (
        <header className={`navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow position-fixed ${headerClasses.navbar_cob}`}>

            <a className={`${headerClasses.navbar_brand_cob}  navbar-brand col-md-3 col-lg-2 me-0 px-3`} href={false}> <img src={Sabpaisalogo3} alt="profile" title="profile" className="w-50" /></a>
            <button className={`position-absolute d-md-none collapsed navbar-toggler ${headerClasses.navbar_toggler_cob}`} type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>

            <div className="d-flex col-lg-10 justify-content-between">
                <div>
                    <p className="text-white m-0 ">Welcome back</p>
                    <p className="text-white m-0">{loggedUser} Id &nbsp;: {loginId}</p>

                </div>
                <div>
                    <div className={`navbar-nav ${headerClasses.navbar_nav_cob}`}>
                        {/* <div className="nav-item text-nowrap">
                    <a className="nav-link px-3" href="#">Sign out</a>
                </div> */}
                        <div className="dropdown">
                            <button className="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {username}
                            </button>
                            <ul className="dropdown-menu position-absolute">
                                <li>  <Link to="/dashboard/profile" className="dropdown-item">Profile</Link></li>
                                <li>  <Link onClick={exitback} className="dropdown-item">Log out</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


        </header>

    )
}

export default DashboardHeader