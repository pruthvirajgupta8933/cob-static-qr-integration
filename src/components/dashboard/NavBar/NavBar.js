import React from "react";
import { logout } from "../../../slices/auth";
import { useDispatch, useSelector } from "react-redux";
import profile from "../../../assets/images/profile.png";
import { Link } from "react-router-dom";
import "./navBar.css";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";

const NavBar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const loginId = user.loginId;
  const username = user.clientContactPersonName;
  const roles = roleBasedAccess();
  const loggedUser = Object.keys(roles).find((key) => roles[key] === true);

  const exitback = () => {
    dispatch(logout());
  };
  return (
    <div>
      <nav
        className="navbar navbar-light NunitoSans-Regular minh"
        style={{ background: "#140633" }}
      >
        <ul className="navbar-brand mb-0 h1">
          <img src={profile} alt="profile" title="profile" />
          <h3 className="text-white float-right mt-0">Welcome back</h3>
          <div style={{ fontSize: "13px" }}>
            <span
              className="text-white text-sm text-uppercase"
              style={{ paddingLeft: "40px" }}
            >
              {loggedUser} Id &nbsp;: {loginId}
            </span>
          </div>
        </ul>

        <div>
          {/* Dropdown in the Nav Bar */}
          <div className="dropdown show" style={{ marginRight: "35px" }}>
            <a
              className="btn dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i
                className="fa fa-user fa-2xl"
                aria-hidden="true"
                style={{ fontSize: "24px", color: "white" }}
              ></i>
              <span
                className="glyphicon glyphicon-cog text-white"
                style={{ color: "white" }}
              ></span>
              <span className="caret text-white text-uppercase">{username}</span>
            </a>
            <div
              className="dropdown-menu text-white navpro"
              
            >
              <div className="row px-md-3 p-2">
                <Link to="/dashboard/profile" className="dropdown-item text-white">
                  Profile
                </Link>
                {/* <Link
                  to="/dashboard/change-password"
                  className="dropdown-item text-white"
                >
                  Change Password
                </Link> */}
                <Link onClick={exitback} className="dropdown-item text-white ">
                  Log out
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Dropdown in the Nav Bar */}
      </nav>
    </div>
  );
};

export default NavBar;
