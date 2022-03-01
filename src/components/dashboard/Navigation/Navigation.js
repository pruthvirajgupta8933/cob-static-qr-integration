import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useParams,
  useRouteMatch,
  useHistory,
  Redirect,
} from "react-router-dom";
import { logout } from "../../../slices/auth";

function SideNavbarNav() {
  let history = useHistory();
  const { user } = useSelector((state) => state.auth);
  // console.log(user);
  if (user !== null && user.userAlreadyLoggedIn) {
    alert("no login");
    // <Redirect to="/login-page" />
    history.push("/login-page");
  }
  var { roleId, clientContactPersonName } = user;
  let { path, url } = useRouteMatch();
  const dispatch = useDispatch();
  const handle = () => {
    dispatch(logout());
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
              <i className="fa fa-home" aria-hidden="true" /> Home
            </Link>
          </li>
          <li className="events">
            <Link to={`${url}/transaction-history`} className="txt-white">
              <i className="fa fa-calendar" aria-hidden="true" /> Transaction
              History{" "}
            </Link>
          </li>
          <li className="calendar">
            <Link to={`${url}/transaction-enquiry`} className="txt-white">
              <i className="fa fa-university" aria-hidden="true" /> Transaction
              Enquiry{" "}
            </Link>
          </li>

          {roleId === 3 || roleId === 13 ? (
            <li className="calendar" role="menuitem">
              <Link to={`${url}/client-list`} className="txt-white">
                <i className="fa fa-university" aria-hidden="true" /> Client
                List{" "}
              </Link>
            </li>
          ) : (
            <li className="ant-menu-item" role="menuitem">
              <Link to={`${url}/settlement-report`} className="txt-white">
                <i className="fa fa-bars" aria-hidden="true" />
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
                <i className="fa fa-university" aria-hidden="true" /> Client
                List{" "}
              </Link>
            </li>
          ) : (
            <li className="ant-menu-item" role="menuitem">
              <Link to={`${url}/settlement-report`} className="txt-white">
                <i className="fa fa-bars" aria-hidden="true" />
                &nbsp; Settlement Report
              </Link>
            </li>
          )}

          {roleId !== 3 && roleId !== 13 ? (
            <React.Fragment>
              <li className="ant-menu-item" role="menuitem">
                <Link to={`${url}/subscription`} className="txt-white">
                  <i className="fa fa-bell" aria-hidden="true" />
                  &nbsp; Subscription
                </Link>
              </li>
              <li className="ant-menu-item" role="menuitem">
                <Link to={`${url}/paylink`} className="txt-white">
                  <i className="fa fa-address-book" aria-hidden="true" />
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
            <a href="">
              <i class="fa fa-log-out"></i>
              &nbsp; Logout
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SideNavbarNav;
