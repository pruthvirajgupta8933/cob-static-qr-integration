import React from 'react'
import { logout } from "../../../../slices/auth";
import { useDispatch, useSelector } from "react-redux";
// import profile from "../../../../assets/images/profile.png";
import { Link } from "react-router-dom";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import headerClasses from "./dashboard-header.module.css"
// import themeClasses from "../../../../theme.module.scss"
import Sabpaisalogo from "../../../../assets/images/sabpaisalogo.png";
// import Notification from '../notification/Notification';

const Notification = React.lazy(() => import('../notification/Notification'));


// import Connection from '../../../websocket/Connection';

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
        <header className={`navbar sticky-top flex-md-nowrap p-0 shadow position-fixed ${headerClasses.navbar_cob}  headerBg`}>
          {/* <Connection /> */}
            <a className={`${headerClasses.navbar_brand_cob}  navbar-brand col-md-3 col-lg-2 me-0 px-3`} href={false}>
                <button className={`d-md-none collapsed navbar-toggler `} type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                    {/* <span className="navbar-toggler-icon" /> */}
                    <i className="fa fa-bars"></i>
                </button>
                <img src={Sabpaisalogo} alt="profile" title="profile" className={`${headerClasses.navbar_brand_logo}`} />
            </a>

            <div className={`d-flex justify-content-between ${headerClasses.navbar_mobile}`}>
                <div className={`${headerClasses.cob_d_none_mobile}`}>
                    <p className={`text-white m-0 text-uppercase`}>Welcome back</p>
                    <p className="text-white m-0 text-uppercase">{loggedUser} Id &nbsp;: {loginId}</p>

                </div>
                <div>
                    <div className={`navbar-nav ${headerClasses.navbar_nav_cob}`}>
                        <div className="d-flex">
                      
                            <Notification />
                            <div className="dropdown">
                                <button className="btn cob-primary-btn-bg btn-sm dropdown-toggle text-uppercase text-white" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="fa fa-user" /> {username}
                                </button>
                                <ul className="dropdown-menu position-absolute">
                                    <li>  <Link to="/dashboard/profile" className="dropdown-item">Profile</Link></li>
                                    <li>  <Link onClick={exitback} className="dropdown-item">Log out</Link></li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </header>

    )
}

export default DashboardHeader