import React from "react";
import { logout } from "../../../slices/auth";
import { useDispatch, useSelector } from "react-redux";
import profile from "../../../assets/images/profile.png";
import { Link } from "react-router-dom";
import "./navBar.css";

const NavBar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // console.log(user,"==>")
  const loginId = user.loginId;
  const username = user.clientContactPersonName;

  // const [isHover, setIsHover] = useState(false);

  // const handleMouseEnter = () => {
  //    setIsHover(true);
  // };
  // const handleMouseLeave = () => {
  //    setIsHover(false);
  // };

  // const boxStyle = {
  //   backgroundColor: isHover ? 'lightblue' : 'rgb(0, 191, 255)'
  // };

  const exitback = () => {
    dispatch(logout());
  };
  return (
    <div>
      <nav class="navbar navbar-light" style={{ background: '#140633' }}>
        <ul class="navbar-brand mb-0 h1">
          <img src={profile} alt="profile" title="profile" />
          <h3 className="text-white float-right mt-0">Welcome back</h3>
          <div style={{ fontSize: "13px" }}>
            <span class="text-white text-sm" style={{ paddingLeft: "40px" }}>
              Merchant Id &nbsp;: {loginId}
            </span>
          </div>
        </ul>

        <div>
          {/* Dropdown in the Nav Bar */}
          <div class="dropdown show" style={{ marginRight: "35px" }}>
            <a
              class="btn dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i
                class="fa fa-user fa-2xl"
                aria-hidden="true"
                style={{ fontSize: "24px", color: "white" }}
              ></i>
              <span
                class="glyphicon glyphicon-cog text-white"
                style={{ color: "white" }}
              ></span>
              <span class="caret text-white">{username}</span>
            </a>
            <div
              class="dropdown-menu text-white"
              style={{
                backgroundColor: "rgb(20, 6, 51)",
                height: "7rem",
                width: "10rem",
              }}
            >
              <div class="row px-md-3 p-2">
                <Link to="/dashboard/profile" class="dropdown-item text-white">
                  Profile
                </Link>
                <Link
                  to="/dashboard/change-password"
                  class="dropdown-item text-white"
                >
                  Change Password
                </Link>
                <Link onClick={exitback} class="dropdown-item text-white ">
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
