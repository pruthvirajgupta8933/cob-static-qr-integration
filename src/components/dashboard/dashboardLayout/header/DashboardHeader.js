import React, { useEffect, useMemo } from "react";
import { logout } from "../../../../slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import headerClasses from "./dashboard-header.module.css";
// import Sabpaisalogo from "../../../../assets/images/sabpaisalogo.png";
import sabpaisalogoWhite from "../../../../assets/images/sabpaisalogoWhite.png";
import { dashboardHeaderMenuToggle } from "../../../../slices/theme/themeSlice";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { clearKycDetailsByMerchantLoginId, clearKycState } from "../../../../slices/kycSlice";

function DashboardHeader() {
  const dispatch = useDispatch();
  const { auth, themeReducer } = useSelector((state) => state);
  const { user } = auth;
  const loginId = user?.loginId;
  const username = user?.clientContactPersonName;
  const roles = roleBasedAccess();
  const loggedUser = Object.keys(roles).find((key) => roles[key] === true);
  const headerMenuToggle = themeReducer.dashboardHeader.headerMenuToggle;

  const location = useLocation();

  const exitback = () => {

    dispatch(clearKycState());
    // dispatch(clearKycDetailsByMerchantLoginId());
    dispatch(logout());

  };

  const toggleHandler = (value) => {
    dispatch(dashboardHeaderMenuToggle(value));
  };

  let urlChagned = useMemo(() => location, [location]);
  useEffect(() => {
    dispatch(dashboardHeaderMenuToggle(true));
  }, [urlChagned]);

  return (
    <header
      className={`navbar sticky-top flex-md-nowrap p-0 position-fixed ${headerClasses.navbar_cob}`}
    >
      <div
        className={`${headerClasses.navbar_brand_cob}  navbar-brand col-md-3 col-lg-2 me-0 px-3`}
      >
        <button
          className={`d-md-none collapsed navbar-toggler `}
          onClick={() => toggleHandler(headerMenuToggle)}
          type="button"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fa fa-bars"></i>
        </button>
        <img
          src={sabpaisalogoWhite}
          alt="profile"
          title="profile"
          className={`${headerClasses.navbar_brand_logo} ml-2`}
        />
      </div>

      <div className={`${headerClasses.navbar_mobile}`}>
        <div className={`navbar-nav ${headerClasses.navbar_nav_cob}`}>
          <div className="d-flex justify-content-between">
            <p
              className={`m-0 font-size-16 text-capitalize ${headerClasses.col1} ${headerClasses.cob_d_none_mobile}`}
            >
              Welcome back
            </p>
            <p
              className={`m-0 text-capitalize px-3 font-size-16 ${headerClasses.col2} ${headerClasses.cob_d_none_mobile}`}
            >
              {loggedUser} Id &nbsp;: {loginId}
            </p>
            <div className={`dropdown ${headerClasses.col3}`}>
              <button
                className="btn btn-sm dropdown-toggle mr-2 border-1 font-size-16 text-capitalize p-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i
                  className="fa fa-user-circle font-size-16 "
                  style={{ color: "#286ECD" }}
                />{" "}
                {username.length > 15
                  ? username.substring(0, 15) + "..."
                  : username}
              </button>
              <ul className="dropdown-menu position-absolute">
                <li>
                  <Link to="/dashboard/profile" className="dropdown-item">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="" onClick={exitback} className="dropdown-item">
                    Log out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
