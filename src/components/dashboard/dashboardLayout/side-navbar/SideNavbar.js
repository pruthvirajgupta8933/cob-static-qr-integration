import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useRouteMatch, useLocation } from "react-router-dom";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import sideNavClasses from "./sidenavbar.module.css";

function SideNavbar() {
    const { menuListReducer, auth } = useSelector((state) => state);
    const { url } = useRouteMatch();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const roleBasedShowTab = roleBasedAccess();
    const enableSettlementReport = ["5208", "5207", "4304", "795"];

    // Determine the selected menu based on the current path
    const selectedMenu = location.pathname.split("/").pop();

    useEffect(() => {
        // Additional logic if needed when the selected menu changes

    }, [selectedMenu]);

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
        <nav id="sidebarMenu" className={`col-md-3 col-lg-2 d-md-block sidebar collapse cob-primary-btn-bg ${sideNavClasses.sidebar_cob}`}>
            <div className="position-sticky pt-3">
                {(roleBasedShowTab?.merchant === true || roleBasedShowTab?.bank === true || roleBasedShowTab?.b2b === true) && (
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link
                                to={url}
                                className={`nav-link ${sideNavClasses.nav_link} ${selectedMenu === "dashboard" ? sideNavClasses.selected_memu : ""}`}
                            >
                                <i className="fa fa-home"></i>&nbsp;
                                Dashboard
                            </Link>
                        </li>
                    </ul>
                )}

                {/* render menu from API */}
                {menuListReducer?.enableMenu?.map((menu) => (
                    <React.Fragment key={menu.app_name}>
                        <div onClick={(e) => toggleMenu(e)} className={`your-custom-class ${isMenuOpen ? 'open-menu' : 'closed-menu'}`}>
                            <h6 className={`sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted ${sideNavClasses.sidebar_heading}`}>
                                <span>{menu.app_name}</span>
                                <a className="link-secondary" href={false} aria-label="Add a new report">
                                    <i className={`fa ${isMenuOpen ? 'fa-minus' : 'fa-plus'}`} id={`icon_${menu?.app_code}`}></i>
                                </a>
                            </h6>
                        </div>

                        <ul id={`menulist_${menu.app_code}`} className="nav flex-column mb-2" role="menu">
                            {menu.submenu?.map((submenu) => (
                                auth?.user?.loginId.toString() === "11235" ? (
                                    submenu?.is_active &&
                                    submenu?.id !== 5 &&
                                    submenu?.id !== 6 &&
                                    submenu?.id !== 7 &&
                                    submenu?.id !== 8 && (
                                        <li className="nav-item" role="menuitem" key={submenu.id}>
                                            <Link
                                                to={`${url}/${submenu.url}`}
                                                className={`nav-link ${sideNavClasses.nav_link} ${selectedMenu === submenu.url.split("/").pop() ? sideNavClasses.selected_memu : ""}`}
                                            >
                                                <i className={submenu.sub_menu_icon}></i>&nbsp;{submenu.submenu_name}
                                            </Link>
                                        </li>
                                    )) : (
                                    submenu?.is_active && <li className="nav-item" role="menuitem" key={submenu.id}>
                                        <Link
                                            to={`${url}/${submenu.url}`}
                                            className={`nav-link ${sideNavClasses.nav_link} ${selectedMenu === submenu.url.split("/").pop() ? sideNavClasses.selected_memu : ""}`}
                                        >
                                            <i className={submenu.sub_menu_icon}></i>&nbsp;{submenu.submenu_name}
                                        </Link>
                                    </li>
                                )))
                            }
                        </ul>
                    </React.Fragment>
                ))}

                {/* display menu for selected merchant */}
                {auth?.user?.loginId.toString() === "11235" && (
                    <ul className="nav flex-column" role="menu">
                        <li className="nav-item" role="menuitem">
                            <Link
                                to={`${url}/transaction-history-merchant`}
                                className={`nav-link ${sideNavClasses.nav_link} ${selectedMenu === "transaction-history-merchant" ? sideNavClasses.selected_memu : ""}`}
                            >
                                <i className="fa fa-bank"></i>
                                Transactions History
                            </Link>
                        </li>
                        <li className="nav-item" role="menuitem">
                            <Link
                                to={`${url}/settled-transaction-merchant`}
                                className={`nav-link ${sideNavClasses.nav_link} ${selectedMenu === "settled-transaction-merchant" ? sideNavClasses.selected_memu : ""}`}
                            >
                                <i className="fa fa-bank"></i>
                                Settlement Report
                            </Link>
                        </li>
                    </ul>
                )}

                {/* display menu for selected merchant */}
                {enableSettlementReport.includes(auth?.user?.loginId.toString()) && (
                    <ul className="nav flex-column" role="menu">
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

                <ul className="nav flex-column" role="menu">
                    <li className="nav-item" role="menuitem">
                        <Link
                            to={`${url}/faq`}
                            className={`nav-link ${sideNavClasses.nav_link} ${selectedMenu === "faq" ? sideNavClasses.selected_memu : ""}`}
                        >
                            <i className="fa fa-question-circle mr-1" aria-hidden="true"></i>
                            FAQ/Help
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default SideNavbar;

