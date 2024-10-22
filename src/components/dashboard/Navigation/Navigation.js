import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch, useHistory } from "react-router-dom";
import { logout } from "../../../slices/auth";
import { clearKycState } from "../../../slices/kycSlice";
import { referralOnboardSlice } from "../../../slices/approver-dashboard/referral-onboard-slice";

function SideNavbarNav() {
  let history = useHistory();
  const { user } = useSelector((state) => state.auth);
  if (user !== null && user.userAlreadyLoggedIn) {
    alert("no login");
    history.push("/login-page");
  }
  var { roleId } = user;
  let { url } = useRouteMatch();
  const dispatch = useDispatch();
  const handle = () => {
    dispatch(logout());
    dispatch(clearKycState());
    dispatch(referralOnboardSlice.actions.resetBasicDetails());
  };

  return (
    <aside className="gx-app-sidebar  gx-layout-sider-dark- false- ant-layout-sider- ant-layout-sider-dark">
      <nav id="slide-menu">
        <ul>
          <li>
            {roleId !== 3 && roleId !== 13 ? (
              <Link
                to={`${url}/profile`}
                className="text-lighter text-ellipsis ng-binding txt-white"
              >
                Profile
              </Link>
            ) : (
              <></>
            )}
          </li>
          <li className="timeline">
            <Link to={`${url}`} className="txt-white">
              <i className="fa fa-home" ariaHidden="true" /> Home
            </Link>
          </li>
          <li className="events">
            <Link to={`${url}/transaction-history`} className="txt-white">
              <i className="fa fa-calendar" ariaHidden="true" /> Transaction
              History{" "}
            </Link>
          </li>
          <li className="calendar">
            <Link to={`${url}/transaction-enquiry`} className="txt-white">
              <i className="fa fa-university" ariaHidden="true" /> Transaction
              Enquiry{" "}
            </Link>
          </li>

          {roleId === 3 || roleId === 13 ? (
            <li className="calendar" role="menuitem">
              <Link to={`${url}/client-list`} className="txt-white">
                <i className="fa fa-university" ariaHidden="true" /> Client List{" "}
              </Link>
            </li>
          ) : (
            <li className="ant-menu-item" role="menuitem">
              <Link to={`${url}/settlement-report`} className="txt-white">
                <i className="fa fa-bars" ariaHidden="true" />
                &nbsp; Settlement Report
              </Link>
            </li>
          )}
          {roleId === 3 || roleId === 13 ? (
            <li
              className="ant-menu-item"
              role="menuitem"
              style={{ paddingLeft: "48px" }}
            >
              <Link to={`${url}/client-list`} className="txt-white">
                <i className="fa fa-university" ariaHidden="true" /> Client List{" "}
              </Link>
            </li>
          ) : (
            <li className="ant-menu-item" role="menuitem">
              <Link to={`${url}/settlement-report`} className="txt-white">
                <i className="fa fa-bars" ariaHidden="true" />
                &nbsp; Settlement Report
              </Link>
            </li>
          )}

          {roleId !== 3 && roleId !== 13 ? (
            <React.Fragment>
              <li className="ant-menu-item" role="menuitem">
                <Link to={`${url}/subscription`} className="txt-white">
                  <i className="fa fa-bell" ariaHidden="true" />
                  &nbsp; Subscription
                </Link>
              </li>
              <li className="ant-menu-item" role="menuitem">
                <Link to={`${url}/paylink`} className="txt-white">
                  <i className="fa fa-address-book" ariaHidden="true" />
                  &nbsp; Create Payment Link
                </Link>
              </li>
            </React.Fragment>
          ) : (
            <></>
          )}
          <li
            className="ant-menu-item"
            role="menuitem"
            onClick={() => handle()}
          >
            <a href={() => false}>
              <i className="fa fa-log-out"></i>
              &nbsp; Logout
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SideNavbarNav;
