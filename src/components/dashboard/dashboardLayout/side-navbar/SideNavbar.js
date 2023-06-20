import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import sideNavClasses from "./sidenavbar.module.css"


function SideNavbar() {

    const { menuListReducer, auth } = useSelector((state) => state);
    const [renderMenuList, setRenderMenuList] = useState(<></>);
    const { url } = useRouteMatch();
    const [menuToggleItem, setMenuToggleItem] = useState({
        checked: false,
        items: [],
    });


    const toggleMenu = (e) => {
        e.currentTarget.nextSibling.classList.toggle("hide-menu-nav")
    }




    useEffect(() => {

        let tempArrayOfItems = [];
        let menuTempObj = {}

        const displayMenu = menuListReducer?.enableMenu?.map((m, index) => {

            menuTempObj[m?.app_code] = true

            tempArrayOfItems.push(m?.app_code);
            setMenuToggleItem({ ...menuToggleItem, items: tempArrayOfItems });
            return (
                m?.is_active === true && (
                    <React.Fragment key={m?.app_name}>

                        <h6 className={`sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted ${sideNavClasses.sidebar_heading}`} onClick={(e) => toggleMenu(e)}>
                            <span> {m?.app_name}</span>
                            <a className="link-secondary" href={false} aria-label="Add a new report">
                                <i className="fa fa-plus"></i>
                            </a>
                        </h6>

                        <ul
                            id={`menulist_${m?.app_code}`}
                            className="nav flex-column mb-2"
                            role="menu"
                        >
                            {m?.submenu?.map((sm) =>
                                sm?.is_active &&
                                    auth?.user?.loginId.toString() === "11235" ? (
                                    sm?.id !== 5 &&
                                    sm?.id !== 6 &&
                                    sm?.id !== 7 &&
                                    sm?.id !== 8 && (

                                        <li className="nav-item"
                                            role="menuitem"
                                            key={sm?.id}
                                        >
                                            <Link
                                                to={`${url}/${sm?.url}`}
                                                className={`nav-link ${sideNavClasses.nav_link}`}
                                            >
                                                <i className={sm?.sub_menu_icon}></i>
                                                &nbsp;{sm?.submenu_name}
                                            </Link>
                                        </li>
                                    )
                                ) : (
                                    <li className="nav-item" role="menuitem" key={sm?.id}>
                                        <Link
                                            to={`${url}/${sm?.url}`}
                                            className={`nav-link ${sideNavClasses.nav_link}`}
                                        >
                                            <i className={sm?.sub_menu_icon}></i>
                                            &nbsp;{sm?.submenu_name}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>

                    </React.Fragment>
                )
            );
        });

        setRenderMenuList(displayMenu);

    }, [menuListReducer]);


    // console.log("itemRef", itemRef)

    const roleBasedShowTab = roleBasedAccess();

    // enable for seleted merhcant live merchant id
    const enableSettlementReport = ["5208", "5207", "4304", "795"];

    return (
        <nav id="sidebarMenu" className={`col-md-3 col-lg-2 d-md-block sidebar collapse cob-primary-btn-bg ${sideNavClasses.sidebar_cob}`}>
            <div className="position-sticky pt-3">
                {(roleBasedShowTab?.merchant === true ||
                    roleBasedShowTab?.bank === true ||
                    roleBasedShowTab?.b2b === true) && (
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link to={url} className={`nav-link ${sideNavClasses.nav_link} active`}>
                                    <i className="fa fa-home"></i>&nbsp;
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    )}
                {/* render menu from API */}
                {renderMenuList}

                {/* display menu for selected merchant */}
                {auth?.user?.loginId.toString() === "11235" && (

                    <ul
                        className="nav flex-column"
                        role="menu"
                    >
                        <li className="nav-item" role="menuitem">
                            <Link
                                to={`${url}/transaction-history-merchant`}
                                className={`nav-link ${sideNavClasses.nav_link}`}
                            >
                                <i className="fa fa-bank"></i>
                                Transactions History
                            </Link>
                        </li>
                        <li className="nav-item" role="menuitem">
                            <Link
                                to={`${url}/settled-transaction-merchant`}
                                className={`nav-link ${sideNavClasses.nav_link}`}
                            >
                                <i className="fa fa-bank"></i>
                                Settlement Report
                            </Link>
                        </li>
                    </ul>
                )}
                {/* display menu for selected merchant */}
                {enableSettlementReport.includes(auth?.user?.loginId.toString()) && (

                    <ul
                        className="nav flex-column"
                        role="menu"
                    >
                        <li className="nav-item" role="menuitem">
                            <Link
                                to={`${url}/settlement-report`}
                                className={`nav-link ${sideNavClasses.nav_link}`}
                            >
                                <i className="fa fa-bank mr-1"></i>
                                Settlement Report (Files)
                            </Link>
                        </li>
                    </ul>
                )}

                <ul  className="nav flex-column"
                        role="menu">
                    <li className="nav-item" role="menuitem">
                        <Link
                            to={`${url}/faq`}
                            className={`nav-link ${sideNavClasses.nav_link}`}
                        >
                            <i class="fa fa-question-circle mr-1" aria-hidden="true"></i>
                            FAQ/Help
                        </Link>
                    </li>
                </ul>

            </div>
        </nav>
    )
}

export default SideNavbar