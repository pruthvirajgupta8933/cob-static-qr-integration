import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { checkPermissionSlice, logout } from "../../../slices/auth";
import transHis from "../../../assets/images/transImage.png";
import enquire from "../../../assets/images/enquiry.png";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";

function MobileNavbar() {
    const [toggleNav, setToggleNav] = useState(false);
    const { user, payLinkPermission } = useSelector((state) => state.auth);

    const roleId = user?.roleId;
    const clientContactPersonName = user?.clientContactPersonName;

        let { url } = useRouteMatch();
        const dispatch = useDispatch();
        const handle = () => {
            dispatch(logout());
        };

        useEffect(() => {
            if (user?.clientMerchantDetailsList?.length > 0) {
                dispatch(
                    checkPermissionSlice(user?.clientMerchantDetailsList[0]?.clientCode)
                );
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const contactUs = "https://sabpaisa.in/support-contact-us/";
        const roleBasedShowTab = roleBasedAccess();

        return (
            <nav
                id="navbar1"
                className="mobile-nav-show navbar navbar-expand-md navbar-dark bg-dark fixed-top "
            >
                <div className="container">
                    <span className="navbar-brand text-uppercase">{`${clientContactPersonName?.slice(
                        0,
                        8
                    )} ...`}</span>

                    <button
                        onClick={() => {
                            setToggleNav(!toggleNav);
                        }}
                        className={
                            !toggleNav
                                ? "navbar-toggler toggler-example"
                                : "navbar-toggler toggler-example collapsed"
                        }
                        type="button"
                        data-toggle="collapse"
                        data-target=""
                        aria-controls=""
                        aria-expanded={toggleNav}
                        aria-label="Toggle navigation"
                    >
                        <span className="dark-blue-text">
                            <i className="fa fa-bars fa-1x"></i>
                        </span>
                    </button>
                    {/* <li className="nav-item"> 
                        <Link to={`${url}`} onClick={()=>{setToggleNav(!toggleNav)}} className="nav-link"><i className="fa fa-list" aria-hidden="true" /> Home</Link>
                    </li> */}
                    <div
                        className={
                            toggleNav
                                ? "collapse navbar-collapse show"
                                : "collapse navbar-collapse"
                        }
                        id="navbarSupportedContent1"
                    >
                        <ul className="navbar-nav mr-auto">


                            <li className="nav-item">
                                <div className="clearfix">...</div>
                            </li>

                            {(roleBasedShowTab?.merchant === true || roleBasedShowTab?.bank === true) ? (
                                <li className="nav-item">
                                    <Link
                                        to={`${url}`}
                                        onClick={() => {
                                            setToggleNav(!toggleNav);
                                        }}
                                        className="nav-link"
                                    >
                                        <i className="fa fa-home" aria-hidden="true" /> &nbsp;Dashboard
                                    </Link>
                                </li>) : <></>}

                            {roleBasedShowTab?.merchant === true && (roleBasedShowTab?.approver === false && roleBasedShowTab?.verifier === false) ? (<>

                                <li className="nav-item">
                                    <Link
                                        to={`${url}/kyc`}
                                        onClick={() => {
                                            setToggleNav(!toggleNav);
                                        }}
                                        className="nav-link"
                                    >

                                        <i className="fa fa-file-o" aria-hidden="true" /> &nbsp;Complete KYC
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to={`${url}/sandbox`}
                                        onClick={() => {
                                            setToggleNav(!toggleNav);
                                        }}
                                        className="nav-link"
                                    >
                                        <i className="fa fa-key" aria-hidden="true" /> &nbsp;Integration Kit
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        to={`${url}/settlement-report-new`}
                                        onClick={() => {
                                            setToggleNav(!toggleNav);
                                        }}
                                        className="nav-link"
                                    >
                                        <i className="fa fa-bars" aria-hidden="true" /> &nbsp;Settlement Report
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        to={`${url}/refund-transaction-history`}
                                        onClick={() => {
                                            setToggleNav(!toggleNav);
                                        }}
                                        className="nav-link"
                                    >
                                        <i className="fa fa-list-alt" aria-hidden="true" /> &nbsp;Refund Txn History
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        to={`${url}/chargeback-transaction-history`}
                                        onClick={() => {
                                            setToggleNav(!toggleNav);
                                        }}
                                        className="nav-link"
                                    >
                                        <i className="fa fa-list" aria-hidden="true" /> &nbsp;Chargeback Txn History
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        to={`${url}/product-catalogue`}
                                        onClick={() => {
                                            setToggleNav(!toggleNav);
                                        }}
                                        className="nav-link"
                                    >
                                        <i className="fa fa-book" aria-hidden="true" /> &nbsp;Product Catalogue
                                    </Link>
                                </li>


                            </>) : 
                            <React.Fragment></React.Fragment>
                            }

                            {(roleBasedShowTab?.approver === true || roleBasedShowTab?.verifier === true) ? (
                                <li className="nav-item">
                                <Link
                                    to={`${url}/approver`}
                                    onClick={() => {
                                        setToggleNav(!toggleNav);
                                    }}
                                    className="nav-link"
                                >
                                    <i className="fa fa-list" aria-hidden="true" /> &nbsp;Merchant List
                                </Link>
                            </li>
                            ) : <></>}

                            {(roleBasedShowTab?.merchant === true || roleBasedShowTab?.bank === true) ? (

                                <>
                                <li className="nav-item">
                                <Link
                                    to={`${url}/transaction-summery`}
                                    onClick={() => {
                                        setToggleNav(!toggleNav);
                                    }}
                                    className="nav-link"
                                >
                                    <i className="fa fa-home" aria-hidden="true" /> &nbsp;Transaction Summary
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    to={`${url}/transaction-history`}
                                    onClick={() => {
                                        setToggleNav(!toggleNav);
                                    }}
                                    className="nav-link"
                                >
                                     <img
                                src={transHis}
                                width={17}
                                alt="sabpaisa"
                                title="sabpaisa"
                              /> &nbsp;Transaction History
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    to={`${url}/transaction-enquiry`}
                                    onClick={() => {
                                        setToggleNav(!toggleNav);
                                    }}
                                    className="nav-link"
                                >
                                      <img
                                src={enquire}
                                width={17}
                                alt="sabpaisa"
                                title="sabpaisa"
                              /> &nbsp;Transaction Enquiry
                                </Link>
                            </li>
                                </>
                            ):<></>}


                            {roleBasedShowTab?.bank === true ? (
                                <li className="nav-item">
                                <Link
                                    to={`${url}/client-list`}
                                    onClick={() => {
                                        setToggleNav(!toggleNav);
                                    }}
                                    className="nav-link"
                                >
                                    <i className="fa fa-list" aria-hidden="true" /> &nbsp;Client List
                                </Link>
                            </li>
                             ) : <></>}


                            {(payLinkPermission.length > 0 && payLinkPermission[0].clientId === 1) && roleBasedShowTab?.merchant === true ? (
                                <li className="nav-item">
                                    <Link
                                        to={`${url}/paylink`}
                                        onClick={() => {
                                            setToggleNav(!toggleNav);
                                        }}
                                        className="nav-link"
                                    >
                                        <i className="fa fa-address-book" aria-hidden="true" />{" "}
                                        &nbsp;Create Payment Link
                                    </Link>
                                </li>
                            ) : (
                                <></>
                            )}

                            {roleBasedShowTab?.merchant || roleBasedShowTab?.bank ? (
                                <li className="nav-item">
                                    <Link
                                        to={`${url}/profile`}
                                        onClick={() => {
                                            setToggleNav(!toggleNav);
                                        }}
                                        className="nav-link"
                                    >
                                        <i className="fa fa-user" aria-hidden="true" /> &nbsp;Profile
                                    </Link>
                                </li>
                            ) : (
                                <></>
                            )}
                            <li className="nav-item" onClick={() => handle()}>
                                <a href={() => false} className="nav-link">
                                    <i className="fa fa-briefcase" aria-hidden="true" />
                                    &nbsp; Logout
                                </a>
                            </li>

                            <li className="nav-item">
                                <div className="clearfix">...</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }

export default MobileNavbar;
