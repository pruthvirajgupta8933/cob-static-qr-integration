import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import Sabpaisalogo3 from "../../../assets/images/sabpaisa-white-logo1.png";
import dashboard from "../../../assets/images/dashb.png";
import "./sidenavbar.css"




const SideNavbar = () => {
  const { menuListReducer } = useSelector((state) => state);
  const [renderMenuList, setRenderMenuList] = useState(<></>);
  const { url } = useRouteMatch();
  const [menuToggleItem, setMenuToggleItem] = useState({
    checked: false,
    items: []
  })

// Do not remove the code

  // const toggleMenu = (e) => {
  //   // console.log("e",e)
  //   console.log("e",e.target.firstElementChild.className)
  
  //   const currentToggle = e.currentTarget.attributes?.istoggle?.value.toString()
  //   if (currentToggle === "true") {
  //     e.currentTarget.attributes.istoggle.value = false
  //     e.currentTarget.className ="hide-menu-nav"
  //     e.target.firstElementChild.className = "fa fa-caret-down"
  //   } else {
  //     e.currentTarget.attributes.istoggle.value = true
  //     e.currentTarget.className="show-menu-nav"      
  //     e.target.firstElementChild.className = "fa fa-caret-up"
  //   }

  // }

  useEffect(() => {
    let tempArrayOfItems = []
    const displayMenu = menuListReducer?.enableMenu?.map((m) => {
      tempArrayOfItems.push(m?.app_code)
      setMenuToggleItem({ ...menuToggleItem, items: tempArrayOfItems })
      return (
        m?.is_active===true && 
        <React.Fragment key={m?.app_name}>
          <div
            className="main-menu-container"
            // onClick={(e) => toggleMenu(e)}
            isToggle="true"
          >
            <span className="sidebar-menu-divider-business">
              {m?.app_name}  <i className={`fa fa-caret-up`} aria-hidden="true"></i>
            </span>

            <ul id={`menulist_${m?.app_code}`} className={`ant-menu ant-menu-sub ant-menu-inline`} role="menu">
              {m?.submenu?.map((sm) => (
                sm?.is_active &&
                <li className="ant-menu-item" role="menuitem" key={sm?.id}>
                  <Link
                    to={`${url}/${sm?.url}`}
                    className="txt-white sidenavFonts"
                  >
                    <i className={sm?.sub_menu_icon}></i>
                    &nbsp;{sm?.submenu_name}
                  </Link>

                </li>
              ))}
            </ul>
          </div>

        </React.Fragment>
      )


    })

    setRenderMenuList(displayMenu)

  }, [menuListReducer]);


  const roleBasedShowTab = roleBasedAccess();


  return (
    <React.Fragment>
     <div className="headers "></div>
      <input type="checkbox" className="openSidebarMenu" id="openSidebarMenu" title="ToggleBar" alt="ToggleBar" />
      {/* htmlfor="openSidebarMenu" that code writen by abhiverma but htmlfor got error when we used inside label code*/}
      <label for="openSidebarMenu" className="sidebarIconToggle ">
        <div className="spinner diagonal part-1"></div>
        <div className="spinner horizontal"></div>
        <div className="spinner diagonal part-2"></div>
      </label>
      <aside className="gx-app-sidebar  gx-layout-sider-dark- false- ant-layout-sider- ant-layout-sider-dark d-none- col-lg-2 p-0 m-0-" id="sidebarMenu">
      <div className="ant-layout-sider-children">
        <div className="gx-sidebar-content">
          <div className="brand-logo d-flex-item-right">
            <div className="float-centre pt-4 text-center- ml-3">
              <Link to={`${url}`} className="txt-white sidenavFonts ">
                <img
                  src={Sabpaisalogo3}
                  width={120}
                  alt="sabpaisa"
                  title="sabpaisa"
                />
              </Link>
            </div>
            <div className="sidebar_menu_list">
              <div
                className="gx-layout-sider-scrollbar"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "0px",
                    overflow: "scroll",
                    marginRight: "-3px",
                    marginBottom: "-3px",
                  }}
                >
                  <ul
                    className="desktop-sidenave-typography ant-menu ant-menu-dark ant-menu-root ant-menu-inline Satoshi-Medium"
                    role="menu"
                    style={{ background: "#140633" }}
                  >
                    {(roleBasedShowTab?.merchant === true || roleBasedShowTab?.bank === true || roleBasedShowTab?.b2b === true) ? (
                      <li className="ant-menu-item" role="menuitem">
                        <Link to={`${url}`} className="txt-white sidenavFonts">
                          <img src={dashboard} width={17} alt="sabpaisa" />
                          <span>&nbsp;Dashboard</span>
                        </Link>
                      </li>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                    {renderMenuList}

                  </ul>
                </div>
                <div
                  className="track-horizontal"
                  style={{ display: "none", opacity: 0 }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "6px",
                      transition: "opacity 200ms ease 0s",
                      opacity: 0,
                      right: "2px",
                      bottom: "2px",
                      top: "2px",
                      borderRadius: "3px",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        display: "block",
                        width: "100%",
                        cursor: "pointer",
                        borderRadius: "inherit",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        height: "30px",
                        transform: "translateY(31.5706px)",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </aside>
    </React.Fragment>
   
  );
};

export default SideNavbar;
