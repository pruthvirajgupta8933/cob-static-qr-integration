import React from 'react'
import headerClasses from "./dashboard-header.module.css"

function DashboardHeader() {
    return (
        <header className={`navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow ${headerClasses.navbar_cob}`}>

            <a className={`${headerClasses.navbar_brand_cob} navbar-brand col-md-3 col-lg-2 me-0 px-3`} href="#">Sabpaisa Logo</a>
            <button className={`position-absolute d-md-none collapsed navbar-toggler ${headerClasses.navbar_toggler_cob}`} type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>

            <div className="d-flex col-lg-10 justify-content-between">
                <div>
                    <p className="text-white me-0 px-3">Welcome back</p>

                </div>
                <div>
                    <div className={`navbar-nav ${headerClasses.navbar_nav_cob}`}>
                        {/* <div className="nav-item text-nowrap">
                    <a className="nav-link px-3" href="#">Sign out</a>
                </div> */}
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Dropdown button
                            </button>
                            <ul className="dropdown-menu position-absolute">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


        </header>

    )
}

export default DashboardHeader