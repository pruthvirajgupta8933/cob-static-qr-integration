import React from 'react'
import sideNavClasses from "./sidenavbar.module.css"


function SideNavbar() {
    return (
        <nav id="sidebarMenu" className={`col-md-3 col-lg-2 d-md-block bg-light sidebar collapse ${sideNavClasses.sidebar_cob}`}>
            <div className="position-sticky pt-3">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a className={`nav-link ${sideNavClasses.nav_link} active`} aria-current="page" href="#">
                            <span data-feather="home" />
                            Dashboard
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${sideNavClasses.nav_link}`} href="#">
                            <span data-feather="file" />
                            Orders
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${sideNavClasses.nav_link}`} href="#">
                            <span data-feather="shopping-cart" />
                            Products
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${sideNavClasses.nav_link}`} href="#">
                            <span data-feather="users" />
                            Customers
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${sideNavClasses.nav_link}`} href="#">
                            <span data-feather="bar-chart-2" />
                            Reports
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${sideNavClasses.nav_link}`} href="#">
                            <span data-feather="layers" />
                            Integrations
                        </a>
                    </li>
                </ul>
                <h6 className={`sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted ${sideNavClasses.sidebar_heading}`}>
                    <span>Saved reports</span>
                    <a className="link-secondary" href="#" aria-label="Add a new report">
                        <span data-feather="plus-circle" />
                    </a>
                </h6>
                <ul className="nav flex-column mb-2">
                    <li className="nav-item">
                        <a className={`nav-link ${sideNavClasses.nav_link}`} href="#">
                            <span data-feather="file-text" />
                            Current month
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${sideNavClasses.nav_link}`} href="#">
                            <span data-feather="file-text" />
                            Last quarter
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${sideNavClasses.nav_link}`} href="#">
                            <span data-feather="file-text" />
                            Social engagement
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${sideNavClasses.nav_link}`} href="#">
                            <span data-feather="file-text" />
                            Year-end sale
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default SideNavbar