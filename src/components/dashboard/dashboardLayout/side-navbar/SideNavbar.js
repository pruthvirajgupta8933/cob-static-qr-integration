import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useRouteMatch, useLocation } from "react-router-dom";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import sideNavClasses from "./sidenavbar.module.css";
import ProgressBar from "../../../../_components/reuseable_components/ProgressBar";

function SideNavbar() {
    const { menuListReducer, auth, themeReducer } = useSelector((state) => state);
    const { url } = useRouteMatch();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const headerMenuToggle = themeReducer.dashboardHeader.headerMenuToggle

    const roleBasedShowTab = roleBasedAccess();
    const enableSettlementReport = ["5208", "5207", "4304", "795"];

    // Determine the selected menu based on the current path
    const selectedMenu = location.pathname.split("/").pop();



    const toggleMenu = (e) => {
        const menuElement = e.currentTarget.nextSibling;
        menuElement.classList.toggle("hide-menu-nav");

        const iconElement = e.currentTarget.querySelector('i');
        if (iconElement) {
            iconElement.classList.toggle("fa-minus");
            iconElement.classList.toggle("fa-plus");
        }
    }

    return (
        <nav id="sidebarMenu" className={`col-md-3 col-lg-2 d-md-block sidebar collapse bg-white text-black font-size-14 ${sideNavClasses.sidebar_cob} ${headerMenuToggle ? 'show' : ''}`}>

            {menuListReducer?.isLoading ? <div className="position-sticky pt-3 pl-3">
                {(roleBasedShowTab?.merchant === true || roleBasedShowTab?.bank === true || roleBasedShowTab?.b2b === true) && (
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link
                                to={url}
                                className={`nav-link ${sideNavClasses.sidebar_menu}  ${selectedMenu === "dashboard" ? sideNavClasses.selected_memu : ""}`}
                            >
                                <i className="fa fa-home"></i>&nbsp;Dashboard
                                {/* <i className="fa fa-angle-right" ariaHidden="true"></i> */}
                            </Link>
                        </li>
                    </ul>
                )}

                {/* render menu from API */}
                {menuListReducer?.enableMenu?.map((menu, index) => (
                    menu?.is_active &&
                    <React.Fragment key={menu.app_name}>
                        <div onClick={(e) => toggleMenu(e)} >
                            <h6 className={`sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted  ${sideNavClasses.sidebar_heading}`}>
                                <span className="font-size-14">{menu.app_name}</span>
                                <div className="link-secondary">
                                    <i className={`fa ${index !== 0 ? 'fa-plus' : 'fa-minus'}`} id={`icon_${menu?.app_code}`}></i>
                                </div>
                            </h6>
                        </div>

                        <ul id={`menulist_${menu.app_code}`} className={`${index !== 0 && 'hide-menu-nav'} nav flex-column mb-2 ml-2`} role="menu">
                            {menu.submenu?.map((submenu) => (
                                submenu?.is_active && <li className="nav-item" role="menuitem" key={submenu.id}>
                                    <Link
                                        to={`${url}/${submenu.url}`}
                                        className={`nav-link ${sideNavClasses.sidebar_menu}  ${selectedMenu === submenu.url.split("/").pop() ? sideNavClasses.selected_memu : ""}`}
                                    >
                                        <i className={submenu.sub_menu_icon}></i>&nbsp;{submenu.submenu_name}
                                    </Link>
                                </li>
                            )
                            )
                            }
                        </ul>
                    </React.Fragment>
                ))}


                <React.Fragment>
                    <div onClick={(e) => toggleMenu(e)} >
                        <h6 className={`sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted  ${sideNavClasses.sidebar_heading}`}>
                            <span className="font-size-14">Latest updates</span>
                            <div className="link-secondary">
                                <i className={`fa fa-plus`}></i>
                            </div>
                        </h6>
                    </div>

                    <ul className=" nav flex-column mb-2 ml-2 hide-menu-nav" role="menu">
                        <li className="nav-item" role="menuitem" >
                            <a
                                href="https://sabpaisa.in/anti-phishing/"
                                target="_blank"
                                rel="noreferrer"
                                className={`nav-link ${sideNavClasses.sidebar_menu}`}>
                                <i className='fa fa-info-circle'></i>&nbsp;Information Bulletin
                            </a>
                        </li>
                    </ul>
                </React.Fragment>

                {/* display menu for selected merchant */}
                {enableSettlementReport.includes(auth?.user?.loginId.toString()) && (
                    <ul className="nav flex-column mt-3" role="menu">
                        <li className="nav-item" role="menuitem">
                            <Link
                                to={`${url}/settlement-report`}
                                className={`nav-link ${sideNavClasses.nav_link} ${selectedMenu === "settlement-report" ? sideNavClasses.selected_memu : ""}`}
                            >
                                <i className="fa fa-bank mr-1"></i>
                                Settlement Report (Files)
                            </Link>
                        </li>
                    </ul>
                )}

                <ul className="nav flex-column mt-2" role="menu">
                    <li className="nav-item" role="menuitem">
                        <Link
                            to={`${url}/faq`}
                            className={`nav-link ${sideNavClasses.nav_link} ${selectedMenu === "faq" ? sideNavClasses.selected_memu : ""}`}
                        >
                            <i className="fa fa-question-circle mr-1" ariaHidden="true"></i>
                            FAQ/Help
                        </Link>
                    </li>
                </ul>
            </div> :
                <div className="text-dark">
                    <ProgressBar />
                </div>

            }

        </nav>
    );
}

export default SideNavbar;

