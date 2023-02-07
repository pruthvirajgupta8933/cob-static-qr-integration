<<<<<<< HEAD
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
=======
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
>>>>>>> 11706d1d23156a1aa4251b44f6197d08b09d77b6
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

  // const toggleMenu = (e) => {
  
  //   const currentToggle = e.currentTarget.attributes?.istoggle?.value.toString()
  //   if (currentToggle === "true") {
  //     e.currentTarget.attributes.istoggle.value = false
  //     e.currentTarget.className ="hide-menu-nav"
  //   } else {
  //     e.currentTarget.attributes.istoggle.value = true
  //     e.currentTarget.className="show-menu-nav"      
  //   }

<<<<<<< HEAD
=======
  // }

>>>>>>> 11706d1d23156a1aa4251b44f6197d08b09d77b6
  useEffect(() => {
    let tempArrayOfItems = []
    const displayMenu = menuListReducer?.enableMenu?.map((m) => {
      tempArrayOfItems.push(m?.app_code)
      setMenuToggleItem({ ...menuToggleItem, items: tempArrayOfItems })
      return (
        <React.Fragment key={m?.app_name}>
          <div
            className="main-menu-container"
            // onClick={(e) => toggleMenu(e)}
            isToggle="true"
          >
            <span className="sidebar-menu-divider-business">
              {m?.app_name}  <i class="fa fa-caret-down d-none" aria-hidden="true"></i>
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

<<<<<<< HEAD
  const [payoutMenus, setPayoutMenus] = useState(true);

  const ShowPayoutMenus = useCallback(() => {
    setPayoutMenus(!payoutMenus);
  }, [payoutMenus]);

  return (
    <aside
      className="gx-app-sidebar  gx-layout-sider-dark false ant-layout-sider ant-layout-sider-dark"
      style={{
        background: "#140633",
        flex: "0 0 200px",
        maxWidth: "200px",
        minWidth: "200px",
        width: "200px",
        borderRight: "1px solid",
      }}
    >
      <div className="ant-layout-sider-children">
        <div className="gx-sidebar-content">
          <div className="brand-logo d-flex-item-right">
            <div className="float-centre p-4">
              <Link to={`${url}`} className="txt-white sidenavFonts">
                <img
                  src={Sabpaisalogo3}
                  width={150}
                  alt="sabpaisa"
                  title="sabpaisa"
                />
              </Link>
=======
  return (
    <>
      <div className="headers "></div>
      <input type="checkbox" className="openSidebarMenu" id="openSidebarMenu" title="ToggleBar" alt="ToggleBar" />
      {/* htmlfor="openSidebarMenu" that code writen by abhiverma but htmlfor got error when we used inside label code*/}
      <label for="openSidebarMenu" className="sidebarIconToggle ">
        <div className="spinner diagonal part-1"></div>
        <div className="spinner horizontal"></div>
        <div className="spinner diagonal part-2"></div>
      </label>
      <aside className="gx-app-sidebar  gx-layout-sider-dark- false- ant-layout-sider- ant-layout-sider-dark d-none- col-lg-2 p-0 m-0-" id="sidebarMenu">
        <div className="ant-layout-sider-children" >
          <div className="gx-sidebar-content-">
            <div className="brand-logo d-flex-item-right">
              <div className="float-centre p-4">
                <Link to={`${url}`} className="txt-white sidenavFonts">
                  <img
                    src={Sabpaisalogo3}
                    width={150}
                    alt="sabpaisa"
                    title="sabpaisa"
                  />
                </Link>
              </div>
>>>>>>> 11706d1d23156a1aa4251b44f6197d08b09d77b6
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
<<<<<<< HEAD
                  {roleBasedShowTab?.merchant === true ||
                  roleBasedShowTab?.bank === true ? (
                    <li className="ant-menu-item" role="menuitem">
                      <Link to={`${url}`} className="txt-white sidenavFonts">
                        <img src={dashboard} width={17} alt="sabpaisa" />
                        <span>&nbsp;Dashboard</span>
                      </Link>
                    </li>
                  ) : (
                    <React.Fragment></React.Fragment>
                  )}

                  {roleBasedShowTab?.merchant === true &&
                  roleBasedShowTab?.approver === false &&
                  roleBasedShowTab?.verifier === false ? (
                    <>
                      <li className="ant-menu-item" role="menuitem">
                        <Link
                          to={`${url}/kyc`}
                          className="txt-white sidenavFonts"
                        >
                          <i className="fa fa-file-o" aria-hidden="true" />{" "}
                          <span>&nbsp;Complete KYC</span>
                        </Link>
                      </li>
                      <li className="ant-menu-item" role="menuitem">
                        <Link
                          to={`${url}/sandbox`}
                          className="txt-white sidenavFonts"
                          data-toggle="modal"
                          data-target="#exampleModalCenter"
                        >
                          <i className="fa fa-key" aria-hidden="true" />{" "}
                          <span>&nbsp;Integration Kit</span>
                        </Link>
                      </li>

                      <li
                        className="ant-menu-item"
                        role="menuitem"
                        style={{ paddingLeft: "48px" }}
                      >
                        <Link
                          to={`${url}/product-catalogue`}
                          className="txt-white sidenavFonts"
                        >
                          <i className="fa fa-book" aria-hidden="true" />
                          &nbsp;Product Catalogue
                        </Link>
                      </li>
                    </>
                  ) : (
                    <React.Fragment></React.Fragment>
                  )}

                  {roleBasedShowTab?.approver === true ||
                  roleBasedShowTab?.verifier === true ||
                  roleBasedShowTab?.viewer === true ? (
                    <li className="ant-menu-item" role="menuitem">
                      <Link
                        to={`${url}/approver`}
                        className="txt-white sidenavFonts"
                      >
                        <i className="fa fa-list" aria-hidden="true" />
                        <span>&nbsp;Merchant List</span>
                        {/* <span className="new-tab">new</span> */}
                      </Link>
                    </li>
                  ) : (
                    <React.Fragment></React.Fragment>
                  )}

                  {roleBasedShowTab?.approver === true ? (
                    <>
                      <li className="ant-menu-item" role="menuitem">
                        <Link
                          to={`${url}/additional-kyc`}
                          className="txt-white sidenavFonts"
                        >
                          <i className="fa fa-user" aria-hidden="true" />
                          <span>&nbsp;Additional KYC</span>
                          {/* <span className="new-tab">new</span> */}
                        </Link>
                      </li>

                      <li className="ant-menu-item" role="menuitem">
                        <Link
                          to={`${url}/assignzone`}
                          className="txt-white sidenavFonts"
                        >
                          <i className="fa fa-list-alt" aria-hidden="true" />
                          <span>&nbsp;Assign Zone</span>
                          {/* <span className="new-tab">new</span> */}
                        </Link>
                      </li>
                      <li className="ant-menu-item" role="menuitem">
                        <Link
                          to={`${url}/ratemapping`}
                          className="txt-white sidenavFonts"
                        >
                          <i className="fa fa-bar-chart" aria-hidden="true" />
                          <span>&nbsp;Rate Mapping</span>
                          {/* <span className="new-tab">new</span> */}
                        </Link>
                      </li>
                    </>
                  ) : (
                    <React.Fragment></React.Fragment>
                  )}

                  {roleBasedShowTab?.approver === true ||
                  roleBasedShowTab?.verifier === true ||
                  roleBasedShowTab?.viewer === true ? (
                    <li className="ant-menu-item" role="menuitem">
                      <Link
                        to={`${url}/signup-data`}
                        className="txt-white sidenavFonts"
                      >
                        <i className="fa fa-user" aria-hidden="true" />
                        <span>&nbsp;Signup Data</span>
                        {/* <span className="new-tab">new</span> */}
                      </Link>
                    </li>
                  ) : (
                    <React.Fragment></React.Fragment>
                  )}

                  <li
                    className="ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-open"
                    role="menuitem"
                  >
                    {roleBasedShowTab?.merchant === true ||
                    roleBasedShowTab?.bank === true ? (
                      <div
                        className="ant-menu-submenu-title"
                        aria-expanded="true"
                        aria-owns="settlement$Menu"
                        aria-haspopup="true"
                        style={{ paddingLeft: "24px" }}
                      >
                        <span className="sidebar-menu-divider-business">
                          Your Business
                        </span>
                        <i className="ant-menu-submenu-arrow" />
                      </div>
=======
                  <ul
                    className="desktop-sidenave-typography ant-menu ant-menu-dark ant-menu-root ant-menu-inline Satoshi-Medium"
                    role="menu"
                    style={{ background: "#140633" }}
                  >
                    {(roleBasedShowTab?.merchant === true || roleBasedShowTab?.bank === true) ? (
                      <li className="ant-menu-item" role="menuitem">
                        <Link to={`${url}`} className="txt-white sidenavFonts">
                          <img src={dashboard} width={17} alt="sabpaisa" />
                          <span>&nbsp;Dashboard</span>
                        </Link>
                      </li>
>>>>>>> 11706d1d23156a1aa4251b44f6197d08b09d77b6
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                    {renderMenuList}


                    {/* {roleBasedShowTab?.merchant === true && (roleBasedShowTab?.approver === false && roleBasedShowTab?.verifier === false) ? (
                      <>
                        <li className="ant-menu-item" role="menuitem">
                          <Link
                            to={`${url}/kyc`}
                            className="txt-white sidenavFonts" >
                            <i className="fa fa-file-o" aria-hidden="true" />{" "}
                            <span>&nbsp;Complete KYC</span>
                          </Link>
                        </li>
                        <li className="ant-menu-item" role="menuitem">
                          <Link
                            to={`${url}/sandbox`}
                            className="txt-white sidenavFonts"
                            data-toggle="modal"
                            data-target="#exampleModalCenter"
                          >
                            <i className="fa fa-key" aria-hidden="true" />{" "}
                            <span>&nbsp;Integration Kit</span>
                          </Link>
                        </li>

<<<<<<< HEAD
                    <ul
                      id="settlement$Menu"
                      className="ant-menu ant-menu-sub ant-menu-inline"
                      role="menu"
                    >
                      {roleBasedShowTab?.merchant === true ||
                      roleBasedShowTab?.bank === true ? (
=======
>>>>>>> 11706d1d23156a1aa4251b44f6197d08b09d77b6
                        <li
                          className="ant-menu-item"
                          role="menuitem"
                        // style={{ paddingLeft: "48px" }}
                        >
                          <Link
                            to={`${url}/product-catalogue`}
                            className="txt-white sidenavFonts"
                          >
                            <i className="fa fa-book" aria-hidden="true" />
                            &nbsp;Product Catalogue
                          </Link>
                        </li>
                      </>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )} */}

                    {/* {(roleBasedShowTab?.approver === true || roleBasedShowTab?.verifier === true || roleBasedShowTab?.viewer === true) ? (
                      <li className="ant-menu-item" role="menuitem">
                        <Link
                          to={`${url}/approver`}
                          className="txt-white sidenavFonts"
                        >
                          <i className="fa fa-list" aria-hidden="true" />
                          <span>&nbsp;Merchant List</span>
                          { 
                            // <span className="new-tab">new</span> 
                            }
                        </Link>
                      </li>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )} */}

                    {/* {(roleBasedShowTab?.approver === true) ? (
                      <>
                        <li className="ant-menu-item" role="menuitem">
                          <Link
                            to={`${url}/additional-kyc`}
                            className="txt-white sidenavFonts"
                          >
                            <i className="fa fa-user" aria-hidden="true" />
                            <span>&nbsp;Additional KYC</span>
                          </Link>
                        </li>


                        <li className="ant-menu-item" role="menuitem">
                          <Link
                            to={`${url}/assignzone`}
                            className="txt-white sidenavFonts"
                          >
                            <i className="fa fa-list-alt" aria-hidden="true" />
                            <span>&nbsp;Assign Zone</span>
                          </Link>
                        </li>
                        <li className="ant-menu-item" role="menuitem">
                          <Link
                            to={`${url}/ratemapping`}
                            className="txt-white sidenavFonts"
                          >
                            <i className="fa fa-bar-chart" aria-hidden="true" />
                            <span>&nbsp;Rate Mapping</span>
                            {//<span className="new-tab">new</span>
                            }
                          </Link>
                        </li>
                      </>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )} */}

                    {/* {roleBasedShowTab?.approver === true || roleBasedShowTab?.verifier === true || roleBasedShowTab?.viewer === true ? (
                      <li className="ant-menu-item" role="menuitem">
                        <Link
                          to={`${url}/signup-data`}
                          className="txt-white sidenavFonts"
                        >
                          <i className="fa fa-user" aria-hidden="true" />
                          <span>&nbsp;Signup Data</span>
                        </Link>
                      </li>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )} */}

                    {/* <li
                      className="ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-open"
                      role="menuitem"
                    >
                      {(roleBasedShowTab?.merchant === true || roleBasedShowTab?.bank === true) ? (
                        <div
                          className="ant-menu-submenu-title"
                          aria-expanded="true"
                          aria-owns="settlement$Menu"
                          aria-haspopup="true"
                          style={{ paddingLeft: "24px" }}
                        >
                          <span className="sidebar-menu-divider-business">
                            Your Business
                          </span>
                          <i className="ant-menu-submenu-arrow" />
                        </div>
                      ) : (
                        <></>
                      )}

<<<<<<< HEAD
                      {roleBasedShowTab?.merchant === true ||
                      roleBasedShowTab?.bank === true ? (
                        <React.Fragment>
=======
                      <ul
                        id="settlement$Menu"
                        className="ant-menu ant-menu-sub ant-menu-inline"
                        role="menu"
                      >
                        {(roleBasedShowTab?.merchant === true || roleBasedShowTab?.bank === true) ? (
>>>>>>> 11706d1d23156a1aa4251b44f6197d08b09d77b6
                          <li
                            className="ant-menu-item"
                            role="menuitem"
                          >
                            <Link
                              to={`${url}/transaction-summery`}
                              className="txt-white sidenavFonts"
                            >
                              <img
                                src={enquire}
                                width={17}
                                alt="sabpaisa"
                                title="sabpaisa"
                              />
                              &nbsp;Transaction Summary
                            </Link>
                          </li>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}

                        {roleBasedShowTab?.merchant === true || roleBasedShowTab?.bank === true ? (
                          <React.Fragment>
                            <li
                              className="ant-menu-item"
                              role="menuitem"
                            >
                              <Link
                                to={`${url}/transaction-history`}
                                className="txt-white sidenavFonts"
                              >
                                <img
                                  src={transHis}
                                  width={17}
                                  alt="sabpaisa"
                                  title="sabpaisa"
                                />
                                &nbsp;Transaction History
                              </Link>
                            </li>

                            <li
                              className="ant-menu-item"
                              role="menuitem"
                            >
                              <Link
                                to={`${url}/transaction-enquiry`}
                                className="txt-white sidenavFonts"
                              >
                                <img
                                  src={enquire}
                                  width={17}
                                  alt="sabpaisa"
                                  title="sabpaisa"
                                />
                                &nbsp;Transaction Enquiry
                              </Link>
                            </li>
                          </React.Fragment>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}

                        {roleBasedShowTab?.bank === true ? (
                          <li
                            className="ant-menu-item"
                            role="menuitem"
                          >
                            <Link
                              to={`${url}/client-list`}
                              className="txt-white sidenavFonts"
                            >
                              <i
                                className="fa fa-university"
                                aria-hidden="true"
                              />
                              &nbsp;Client List
                            </Link>
                          </li>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}


                        {roleBasedShowTab?.merchant === true || roleBasedShowTab?.bank === true ? (

                          <React.Fragment>
                            {roleBasedShowTab?.Enable_Settlement_Report_Excel.includes(user?.clientMerchantDetailsList[0]?.clientCode) ?
                              <li
                                className="ant-menu-item"
                                role="menuitem"
                              >
                                <Link
                                  to={`${url}/settlement-report`}
                                  className="txt-white sidenavFonts"
                                >
                                  <i className="fa fa-bars" aria-hidden="true" />
                                  <span>&nbsp;Settlement Report (Excel)</span>
                                </Link>
                              </li> : <></>}


                            <li
                              className="ant-menu-item"
                              role="menuitem"
                            >
                              <Link
                                to={`${url}/settlement-report-new`}
                                className="txt-white sidenavFonts"
                              >
                                <i className="fa fa-bars" aria-hidden="true" />
                                <span>&nbsp;Settlement Report</span>
                              </Link>
                            </li>
                            <li
                              className="ant-menu-item"
                              role="menuitem"
                            >
                              <Link
                                to={`${url}/refund-transaction-history`}
                                className="txt-white sidenavFonts"
                              >
                                <i className="fa fa-list-alt" aria-hidden="true" />
                                <span>&nbsp;Refund Txn History</span>
                              </Link>
                            </li>
                            <li
                              className="ant-menu-item"
                              role="menuitem"
                            >
                              <Link
                                to={`${url}/chargeback-transaction-history`}
                                className="txt-white sidenavFonts"
                              >
                                <i className="fa fa-list" aria-hidden="true" />
                                <span>&nbsp;Chargeback Txn History</span>
                              </Link>
                            </li>
                          </React.Fragment>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}

                      {payLinkPermission.length > 0 &&
                      payLinkPermission[0].clientId === 1 &&
                      roleBasedShowTab?.merchant === true ? (
                        <li
                          className="ant-menu-item"
                          role="menuitem"
                          style={{ paddingLeft: "48px" }}
                        >
                          <Link
                            to={`${url}/paylink`}
                            className="txt-white sidenavFonts"
                          >
                            <i
<<<<<<< HEAD
                              className="fa fa-university"
                              aria-hidden="true"
                            />
                            &nbsp;Client List
                          </Link>
                        </li>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}

                      {roleBasedShowTab?.merchant === true ||
                      roleBasedShowTab?.bank === true ? (
                        <React.Fragment>
                          {roleBasedShowTab?.Enable_Settlement_Report_Excel.includes(
                            user?.clientMerchantDetailsList[0]?.clientCode
                          ) ? (
                            <li
                              className="ant-menu-item"
                              role="menuitem"
                              style={{ paddingLeft: "48px" }}
                            >
                              <Link
                                to={`${url}/settlement-report`}
                                className="txt-white sidenavFonts"
                              >
                                <i className="fa fa-bars" aria-hidden="true" />
                                <span>&nbsp;Settlement Report (Excel)</span>
                              </Link>
                            </li>
                          ) : (
                            <></>
                          )}

                          <li
                            className="ant-menu-item"
                            role="menuitem"
                            style={{ paddingLeft: "48px" }}
                          >
                            <Link
                              to={`${url}/settlement-report-new`}
                              className="txt-white sidenavFonts"
                            >
                              <i className="fa fa-bars" aria-hidden="true" />
                              <span>&nbsp;Settlement Report</span>
                            </Link>
                          </li>
                          <li
                            className="ant-menu-item"
                            role="menuitem"
                            style={{ paddingLeft: "48px" }}
                          >
                            <Link
                              to={`${url}/refund-transaction-history`}
                              className="txt-white sidenavFonts"
                            >
                              <i
                                className="fa fa-list-alt"
                                aria-hidden="true"
                              />
                              <span>&nbsp;Refund Txn History</span>
                            </Link>
                          </li>
                          <li
                            className="ant-menu-item"
                            role="menuitem"
                            style={{ paddingLeft: "48px" }}
                          >
                            <Link
                              to={`${url}/chargeback-transaction-history`}
                              className="txt-white sidenavFonts"
                            >
                              <i className="fa fa-list" aria-hidden="true" />
                              <span>&nbsp;Chargeback Txn History</span>
                            </Link>
                          </li>
                          {/* {roleBasedShowTab?.bank === true ? <></> :

                          <li
                            className="ant-menu-item"
                            role="menuitem"
                            style={{ paddingLeft: "48px" }}
                          >
                            <Link
                              to={`${url}/product-catalogue`}
                              className="txt-white sidenavFonts"
                            >
                              <i className="fa fa-book" aria-hidden="true" />
                              &nbsp;Product Catalogue
                            </Link>
                          </li>
                      } */}
                        </React.Fragment>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}

                      {payLinkPermission.length > 0 &&
                      payLinkPermission[0].clientId === 1 &&
                      roleBasedShowTab?.merchant === true ? (
                        <li
                          className="ant-menu-item"
                          role="menuitem"
                          style={{ paddingLeft: "48px" }}
                        >
                          <Link
                            to={`${url}/paylink`}
                            className="txt-white sidenavFonts"
                          >
                            <i
=======
>>>>>>> 11706d1d23156a1aa4251b44f6197d08b09d77b6
                              className="fa fa-address-book"
                              aria-hidden="true"
                            />
                            &nbsp; Create Payment Link
                          </Link>
                        </li>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}

                      {roleBasedShowTab?.merchant === true ? (
                        <React.Fragment>
                          {roleBasedShowTab?.Enable_Settlement_Report_Excel.includes(
                            user?.clientMerchantDetailsList[0]?.clientCode
                          ) ? (
                            <li
                              className="ant-menu-item"
                              role="menuitem"
                              style={{ paddingLeft: "48px" }}
                            >
                              <Link
                                to={`${url}/settlement-report`}
                                className="txt-white sidenavFonts"
                              >
                                <i className="fa fa-bars" aria-hidden="true" />
                                <span>&nbsp;Settlement Report (Excel)</span>
                              </Link>
                            </li>
                          ) : (
                            <></>
                          )}
                        </React.Fragment>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
                    </ul>
<<<<<<< HEAD
                  </li>
                  <li
                    className="ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-open"
                    role="menuitem"
                  >
                    {roleBasedShowTab?.merchant === true ||
                    roleBasedShowTab?.bank === true ? (
                      <div
                        className="ant-menu-submenu-title"
                        aria-expanded="true"
                        aria-owns="settlement$Menu"
                        aria-haspopup="true"
                        style={{ paddingLeft: "24px" }}
                        onClick={ShowPayoutMenus}
                      >
                        <span className="sidebar-menu-divider-business d-flex justify-content-between">
                          Payout
                          <div style={{ textAlign: "end" }}>
                            {payoutMenus ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-chevron-down"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-chevron-up"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                                />
                              </svg>
                            )}
                          </div>
                        </span>
                      </div>
                    ) : (
                      <></>
                    )}
                    {payoutMenus && (
                      <>
                        <ul
                          id="settlement$Menu"
                          className="ant-menu ant-menu-sub ant-menu-inline"
                          role="menu"
                        >
                          {roleBasedShowTab?.merchant === true ||
                          roleBasedShowTab?.bank === true ? (
                            <li
                              className="ant-menu-item"
                              role="menuitem"
                              style={{ paddingLeft: "48px" }}
                            >
                              <Link
                                to={`${url}/ledger`}
                                className="txt-white sidenavFonts"
                              >
                                &nbsp;Ledger
                              </Link>
                            </li>
                          ) : (
                            <React.Fragment></React.Fragment>
                          )}
                        </ul>
                        <ul
                          id="settlement$Menu"
                          className="ant-menu ant-menu-sub ant-menu-inline"
                          role="menu"
                        >
                          {roleBasedShowTab?.merchant === true ||
                          roleBasedShowTab?.bank === true ? (
                            <li
                              className="ant-menu-item"
                              role="menuitem"
                              style={{ paddingLeft: "48px" }}
                            >
                              <Link
                                to={`${url}/transactions`}
                                className="txt-white sidenavFonts"
                              >
                                &nbsp;Transactions
                              </Link>
                            </li>
                          ) : (
                            <React.Fragment></React.Fragment>
                          )}
                        </ul>
                        <ul
                          id="settlement$Menu"
                          className="ant-menu ant-menu-sub ant-menu-inline"
                          role="menu"
                        >
                          {roleBasedShowTab?.merchant === true ||
                          roleBasedShowTab?.bank === true ? (
                            <li
                              className="ant-menu-item"
                              role="menuitem"
                              style={{ paddingLeft: "48px" }}
                            >
                              <Link
                                to={`${url}/beneficiary`}
                                className="txt-white sidenavFonts"
                              >
                                &nbsp;Beneficiary
                              </Link>
                            </li>
                          ) : (
                            <React.Fragment></React.Fragment>
                          )}
                        </ul>
                        <ul
                          id="settlement$Menu"
                          className="ant-menu ant-menu-sub ant-menu-inline"
                          role="menu"
                        >
                          {roleBasedShowTab?.merchant === true ||
                          roleBasedShowTab?.bank === true ? (
                            <li
                              className="ant-menu-item"
                              role="menuitem"
                              style={{ paddingLeft: "48px" }}
                            >
                              <Link
                                to={`${url}/mis_report`}
                                className="txt-white sidenavFonts"
                              >
                                &nbsp;MIS Report
                              </Link>
                            </li>
                          ) : (
                            <React.Fragment></React.Fragment>
                          )}
                        </ul>
                        <ul
                          id="settlement$Menu"
                          className="ant-menu ant-menu-sub ant-menu-inline"
                          role="menu"
                        >
                          {roleBasedShowTab?.merchant === true ||
                          roleBasedShowTab?.bank === true ? (
                            <li
                              className="ant-menu-item"
                              role="menuitem"
                              style={{ paddingLeft: "48px" }}
                            >
                              <Link
                                to={`${url}/payment_status`}
                                className="txt-white sidenavFonts"
                              >
                                &nbsp;Make Payment
                              </Link>
                            </li>
                          ) : (
                            <React.Fragment></React.Fragment>
                          )}
                        </ul>
                      </>
                    )}
                  </li>
                </ul>
              </div>
              <div
                className="track-horizontal"
                style={{ display: "none", opacity: 0 }}
              >
=======
                  </li> */}

                    {/* {roleBasedShowTab?.merchant === true ? (
                    <div
                      className="ant-menu-submenu-title"
                      aria-expanded="true"
                      aria-owns="settlement$Menu"
                      aria-haspopup="true"
                      style={{ paddingLeft: "24px" }}
                      onClick={() => setShowB2B(!showB2B)}
                    >
                      <span className="sidebar-menu-divider-business d-flex justify-content-between">
                        Back To Business
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-chevron-down"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                            />
                          </svg>
                        </div>
                      </span>
                    </div>
                  ) : (
                    <></>
                  )} */}

                    {/* {roleBasedShowTab?.merchant === true && showB2B ? (
                    <li
                      className="ant-menu-item"
                      role="menuitem"
                      style={{ paddingLeft: "48px" }}
                    >
                      <Link
                        to={`${url}/emami/challan-transactions`}
                        className="txt-white sidenavFonts"
                      >
                        <img
                          src={transHis}
                          width={17}
                          alt="sabpaisa"
                          title="sabpaisa"
                        />
                        &nbsp;Challan Transactions
                      </Link>
                    </li>
                  ) : (
                    <React.Fragment></React.Fragment>
                  )} */}


                  </ul>
                </div>
>>>>>>> 11706d1d23156a1aa4251b44f6197d08b09d77b6
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
      </aside>



    </>

  );
};

export default SideNavbar;
