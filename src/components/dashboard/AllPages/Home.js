import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  subscriptionplan,
  clearSuccessTxnsummary,
} from "../../../slices/dashboardSlice";
import { useRouteMatch, Redirect } from "react-router-dom";
import onlineshopinglogo from "../../../assets/images/onlineshopinglogo.png";
import { Link } from "react-router-dom";
import "../css/Home.css";

import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import {  GetKycTabsStatus, kycUserList, UpdateModalStatus } from "../../../slices/kycSlice";
import NavBar from "../NavBar/NavBar";
import bro from "../../../assets/images/bro.png";
import congratsImg from "../../../assets/images/congImg.png";
import onlineimg from "../../../assets/images/onlinePayment.png";
import paymentlink from "../../../assets/images/paymentLink.png";
import subscriptin from "../../../assets/images/subscribe.png";
import Rupees from "../../../assets/images/payout.png";
import Quick from "../../../assets/images/qwikform.png";
import eposs from "../../../assets/images/epos.png";
import linkpssa from "../../../assets/images/linkPaisa.png";
import echlln from "../../../assets/images/echallan.png";
import StepProgressBar from "../../../_components/reuseable_components/StepProgressBar/StepProgressBar";
import congImg from "../../../assets/images/congImg.png"
import $ from "jquery"
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
function Home() {
  const roles = roleBasedAccess();

  const dispatch = useDispatch();
  let { path } = useRouteMatch();

  const [clientCode, setClientCode] = useState("1");

  const [search, SetSearch] = useState("");
  const [txnList, SetTxnList] = useState([]);
  const [showData, SetShowData] = useState([]);
  // const [roleType, setRoleType] = useState(roles);
  const { dashboard, auth, kyc ,consentKyc} = useSelector((state) => state);

  const kyc_submit_consent = useSelector(
    (state) =>
      state.kyc.consentKyc.status

  );

  


  const { KycTabStatusStore ,OpenModalForKycSubmit  } = kyc;
 

  const [modalState, setModalState] = useState("Not-Filled");
  const [kycmodalState, setKycModalState] = useState(false);

  // console.log("dashboard",dashboard)
  const { isLoading, successTxnsumry } = dashboard;
  const { user } = auth;

  const currentDate = new Date().toJSON().slice(0, 10);
  const fromDate = currentDate;
  const toDate = currentDate;

  var clientCodeArr = [];
  var totalSuccessTxn = 0;
  var totalAmt = 0;

  // const handleshow = () => {
  //   setModalState(!modalState);
  // }

  
  useEffect(() => {
    const objParam = { fromDate, toDate, clientCode };
    var DefaulttxnList = [];
    SetTxnList(DefaulttxnList);
    SetShowData(DefaulttxnList);
    dispatch(subscriptionplan);
    // dispatch(successTxnSummary(objParam));
    dispatch(
      GetKycTabsStatus({
        login_id: user?.loginId,
      })
    );
  }, [clientCode]);

  useEffect(() => {
    setModalState(KycTabStatusStore?.status);
  }, [KycTabStatusStore]);





  //make client code array
  if (
    user?.clientMerchantDetailsList !== null &&
    user.clientMerchantDetailsList?.length > 0
  ) {
    clientCodeArr = user.clientMerchantDetailsList.map((item) => {
      return item.clientCode;
    });
  } else {
    clientCodeArr = [];
  }

  // filter api response data with client code
  useEffect(() => {
    if (successTxnsumry?.length > 0) {
      // eslint-disable-next-line array-callback-return
      var filterData = successTxnsumry?.filter((txnsummery) => {
        if (clientCodeArr.includes(txnsummery.clientCode)) {
          return clientCodeArr.includes(txnsummery.clientCode);
        }
      });
      SetTxnList(filterData);
      SetShowData(filterData);
    } else {
      //successTxnsumry=[];
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successTxnsumry]);

  useEffect(() => {
    search !== ""
      ? SetShowData(
          txnList.filter((txnItme) =>
            Object.values(txnItme)
              .join(" ")
              .toLowerCase()
              .includes(search.toLocaleLowerCase())
          )
        )
      : SetShowData(txnList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {

    dispatch(kycUserList({ login_id: user?.loginId }))
    return () => {
      dispatch(clearSuccessTxnsummary());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    SetSearch(e);
  };

  if (roles.merchant === true) {
    if (user.clientMerchantDetailsList === null) {
      return <Redirect to={`${path}/profile`} />;
    }
  } else if (roles.approver === true || roles.verifier === true) {
    return <Redirect to={`${path}/approver`} />;
  }

  showData.map((item) => {
    totalSuccessTxn += item.noOfTransaction;
    totalAmt += item.payeeamount;
  });

  // console.log("modalState",modalState)

  const handleClose = () => {
    dispatch(UpdateModalStatus(false))
  }


  return (
    <section className="ant-layout Satoshi-Medium">
      {/* {kyc?.KycTabStatusStore?.is_verified === false ? <KycModal /> : <></>} */}

      <div>
        <NavBar />
      </div>

      {/* KYC container start from here */}
      <div className="announcement-banner-container col-lg-12">
      <StepProgressBar  status={kyc?.kycUserList?.status} />
        <div className="announcement-banner-container_new  announcement-banner">
          <div className="onboarding-illustration-top">
            {" "}
            <img
              src={onlineshopinglogo}
              width={400}
              alt="SabPaisa"
              title="SabPaisa"
            />
          </div>
          <div className="row">

            <div
              className="col-12 col-md-3 aos-init aos-animate"
              data-aos="fade-up"
            >
            
              <div className="icon text-primary mb-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g fill="none" fillRule="evenodd">
                    <path d="M0 0h24v24H0z"></path>
                    <path
                      d="M7 3h10a4 4 0 110 8H7a4 4 0 110-8zm0 6a2 2 0 100-4 2 2 0 000 4z"
                      fill="#335EEA"
                    ></path>
                    <path
                      d="M7 13h10a4 4 0 110 8H7a4 4 0 110-8zm10 6a2 2 0 100-4 2 2 0 000 4z"
                      fill="#335EEA"
                      opacity=".3"
                    ></path>
                  </g>
                </svg>{" "}
              </div>
              <h2 className="font-weight-bold">Built for developers</h2>
              <p className="text-muted mb-6 mb-md-0">
                Our kit is built to make your life easier. Variables, build
                tooling, documentation, and reusable components.
              </p>
            </div>
            <div
              className="col-12 col-md-3 aos-init aos-animate"
              data-aos="fade-up"
              data-aos-delay="50"
            >
              <div className="icon text-primary mb-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g fill="none" fillRule="evenodd">
                    <path d="M0 0h24v24H0z"></path>
                    <path
                      d="M5.5 4h4A1.5 1.5 0 0111 5.5v1A1.5 1.5 0 019.5 8h-4A1.5 1.5 0 014 6.5v-1A1.5 1.5 0 015.5 4zm9 12h4a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-1a1.5 1.5 0 011.5-1.5z"
                      fill="#335EEA"
                    ></path>
                    <path
                      d="M5.5 10h4a1.5 1.5 0 011.5 1.5v7A1.5 1.5 0 019.5 20h-4A1.5 1.5 0 014 18.5v-7A1.5 1.5 0 015.5 10zm9-6h4A1.5 1.5 0 0120 5.5v7a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-7A1.5 1.5 0 0114.5 4z"
                      fill="#335EEA"
                      opacity=".3"
                    ></path>
                  </g>
                </svg>{" "}
              </div>
              <h2 className="font-weight-bold">Designed to be modern</h2>
              <p className="text-muted mb-6 mb-md-0">
                Designed with the latest design trends in mind. Our kit feels
                modern, minimal, and beautiful.
              </p>
            </div>
            <div
              className="col-12 col-md-3 aos-init aos-animate"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="icon text-primary mb-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g fill="none" fillRule="evenodd">
                    <path d="M0 0h24v24H0z"></path>
                    <path
                      d="M17.272 8.685a1 1 0 111.456-1.37l4 4.25a1 1 0 010 1.37l-4 4.25a1 1 0 01-1.456-1.37l3.355-3.565-3.355-3.565zm-10.544 0L3.373 12.25l3.355 3.565a1 1 0 01-1.456 1.37l-4-4.25a1 1 0 010-1.37l4-4.25a1 1 0 011.456 1.37z"
                      fill="#335EEA"
                    ></path>
                    <rect
                      fill="#335EEA"
                      opacity=".3"
                      transform="rotate(15 12 12)"
                      x="11"
                      y="4"
                      width="2"
                      height="16"
                      rx="1"
                    ></rect>
                  </g>
                </svg>{" "}
              </div>
              <h2 className="font-weight-bold">Documentation for everything</h2>
              <p className="text-muted mb-0">
                We've written extensive documentation for components and tools,
                so you never have to reverse engineer anything.
              </p>
            </div>

         


            {roles?.merchant === true && modalState !=="Approved" ? (
                <div className="col-12 col-md-12">
                <div class="card col-lg-12- cardkyc pull-left">
                  <div class="font-weight-bold card-body Satoshi-Medium">
                    <span>
                      You can accept payments upto ₹15,000 for now. To extend the
                      limit complete your KYC and get it approved.
                    </span>
                    <Link
                      to={`/dashboard/kyc`}
                      data-toggle="modal"
                      data-target="#exampleModalCenter"
                    >
                      <button
                        class="text-white pull-right kycbtns"
                        style={{
                          backgroundColor: "#0156B3",
                          paddingLeft: "10px",
                        }}
                      >
                        Complete KYC
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-12 col-md-12">
              <div class="card col-lg-12- cardkyc pull-left">
                <div class="font-weight-bold card-body Satoshi-Medium">
                  <span>
                  Congratulations! Your KYC documents have been approved.
                  </span>
                      <button
                        class="text-white pull-right kycbtns"
                        style={{
                          backgroundColor: "#0156B3",
                          paddingLeft: "10px",
                        }}
                        disabled
                      >
                        KYC Done
                      </button>
                </div>
              </div>
            </div>
           
            )}
          </div>
        </div>
        {roles?.merchant === true ? (
          <div class="container">
            <div class="row">
              <div class="col-sm  m-0">
                <div class="card" style={{ height: "236px", width: "462px" }}>
                  <h2 class="card-title dashboardEnablecss">
                    <img
                      class="card-img-left"
                      src={onlineimg}
                      alt="onlinepay"
                      width={40}
                    />{" "}
                    &nbsp;Payment Links
                  </h2>
                  <p className="paragraphcssdashboards">
                    SabPaisa is the World's 1st API Driven Unified Payment
                    Experience Platform having the Best Payment Gateway in
                    India. Collect, transfer & refund your payments online &
                    offline. Get the best success rates with maximum payment
                    modes available including Debit cards, Credit Card, Wallets,
                    UPI, Bharat QR, etc. The Hybrid PG helps businesses collect
                    payments from all the clients and consumers, urban or rural,
                    young or old, online or offline, without worrying about
                    consumer payment behaviour.
                  </p>
                  <Link to={`/dashboard/sabpaisa-pricing/10/Payment%20Links`}>
                    <p className="pricingclasscss">
                      Read More & Pricing &nbsp;{">"}
                      {">"}
                    </p>
                  </Link>
                </div>
              </div>
              <div class="col-sm" style={{ margin: "31px 0" }}>
                <div className="row pt-2 m-0">
                  <div className="col-6 d-flex flex-wrap my-2">
                    <img
                      className="card-img-left mr-2"
                      src={paymentlink}
                      alt="payLink"
                      width={"39px"}
                      height={"39px"}
                    />
                    <p
                      className="foralinkscsshere my-auto "
                      style={{ lineHeight: "25px" }}
                    >
                      Payment Links
                    </p>
                  </div>
                  <div className="col-6 d-flex flex-wrap my-2">
                    <img
                      className="card-img-left mr-2"
                      src={subscriptin}
                      alt="payLink"
                      width={"41px"}
                      height={"41px"}
                    />
                    <p
                      className="foralinkscsshere my-auto"
                      style={{ lineHeight: "25px" }}
                    >
                      Subscriptions
                    </p>
                  </div>
                  <div className="col-6 d-flex flex-wrap my-2">
                    <img
                      className="card-img-left mr-2"
                      src={Rupees}
                      alt="payLink"
                      width={"41px"}
                      height={"41px"}
                    />
                    <p
                      className="foralinkscsshere my-auto"
                      style={{ lineHeight: "25px" }}
                    >
                      Payouts
                    </p>
                  </div>
                  <div className="col-6 d-flex flex-wrap my-2">
                    <img
                      className="card-img-left mr-2"
                      width={"41px"}
                      height={"41px"}
                      src={Quick}
                      alt="payLink"
                    />
                    <p
                      className="foralinkscsshere my-auto"
                      style={{ lineHeight: "25px" }}
                    >
                      QwikForm
                    </p>
                  </div>
                  <div className="col-6 d-flex flex-wrap my-2">
                    <img
                      className="card-img-left mr-2"
                      width={"41px"}
                      height={"41px"}
                      src={eposs}
                      alt="payLink"
                    />
                    <p
                      className="foralinkscsshere my-auto"
                      style={{ lineHeight: "25px" }}
                    >
                      E-POS App
                    </p>
                  </div>
                  <div className="col-6 d-flex flex-wrap my-2">
                    <img
                      className="card-img-left mr-2"
                      width={"41px"}
                      height={"41px"}
                      src={linkpssa}
                      alt="payLink"
                    />
                    <p
                      className="foralinkscsshere my-auto"
                      style={{ lineHeight: "25px" }}
                    >
                      LinkPaisa
                    </p>
                  </div>
                  <div className="col-6 d-flex flex-wrap my-2">
                    <img
                      className="card-img-left mr-2"
                      width={"41px"}
                      height={"41px"}
                      src={echlln}
                      alt="payLink"
                    />
                    <p
                      className="foralinkscsshere my-auto"
                      style={{ lineHeight: "25px" }}
                    >
                      E-Challan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <React.Fragment></React.Fragment>
        )}

       
      </div>
     
      {/* KYC container end here */}

    

      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
        
          <section
            className="features8 cid-sg6XYTl25a flleft"
            id="features08-3"
            style={{ width: "100%" }}
          >
            <div className="container-fluid">
              <div className="row bgcolor">
                <div className="col-lg-12">{/* <KycAlert /> */}</div>
              </div>
            </div>
          </section>
        </div>
      </main>


      {/* Dashboard open pop up start here {IF KYC IS PENDING}*/}

      <div
        className={
          "modal fade mymodals" +
          (modalState === "Not-Filled" ? " show d-block" : " d-none")
        }
        tabIndex="-1"
        role="dialog"
      >
        <div class="modal-dialog modal-dialog-centered " role="document">
          <div class="modal-content">
            <div class="modal-body Satoshi-Medium">
              <button
                type="button"
                onClick={() => {
                  setModalState(!modalState);
                }}
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <div class="row">
                <div class="col-sm">
                  <h1 className="homeModalHeading">Welcome to SabPaisa!</h1>
                  <h2 className="modalscolrsfortext">
                    Complete the KYC to activate your account and start
                    accepting payments. Fill in all the information to start
                    your SabPaisa Payment services.
                  </h2>
                </div>

                <div class="col-sm">
                  <img
                    src={bro}
                    className="modalsimageclass"
                    alt="SabPaisa"
                    title="SabPaisa"
                  />
                </div>
              </div>

              <div class="row Satoshi-Medium">
                <div class="col-lg-4">
                  <Link
                    to={`/dashboard/kyc`}
                    data-toggle="modal"
                    data-target="#exampleModalCenter"
                  >
                    <button className="ModalButtonClr text-white mt-2">
                      <h5 className="m-0">
                        Complete KYC to activate account
                      </h5>
                    </button>
                  </Link>
                </div>
                <div class="col-lg-7">
                  <Link to={`/dashboard`}>
                    <button
                      className="ColrsforredirectProdct  text-white"
                      style={{ marginTop: "9px" }}
                      onClick={() => {
                        setModalState(!modalState);
                      }}
                      aria-label="Close"
                    >
                      <h5 className="m-0">
                        Try out our dashboard
                      </h5>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard open pop up start here {IF KYC IS PENDING}*/}
      {/* Dashboard open pop up start here {IF KYC IS APPROVED}*/}

      <div
        className={
          "modal fade mymodals" +
          (OpenModalForKycSubmit?.isOpen === true ? " show d-block" : " d-none")
        }
        tabIndex="-1"
        role="dialog"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content" style={{width:"709px",marginTop:"1px"}}>
            <div class="modal-body Satoshi-Medium">
              <button
                type="button"
                onClick={() => {
                  handleClose()
                }}
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>

              <div class="container Satoshi-Medium">
                <div class="row justify-content-md-center">
                  <div class="col-md-auto">
                    <ul>
                      <h1
                        className="text-centre"
                        style={{
                          color: "#4BB543",
                          fontWeight: "700",
                          fontStyle: "normal",
                          fontSize: "32px",
                          justifyContent: "center",
                          display: "flex",
                        }}
                      >
                        Congratulations!
                      </h1>

                      <p className="modalscolrsfortextapprv m-0 text-center">
                            You can accept payments upto INR 15,000
                            </p>
                            <p className="modalscolrsfortextapprv m-0 text-center">
                            Your KYC is currently under review. 
                            <br/>
                            <br/>
                            <p className="modalscolrsfortextapprv m-0 text-center">The KYC review process ususally takes 3-4 working days.</p>
                            <p className="modalscolrsfortextapprv m-0 text-center">We will notify you in case we want any clarification on your KYC.</p>

                            </p>
                      <span
                        className="modalscolrsfortextapprv text-center"
                        style={{
                          display: "table-footer-group",
                          justifyContent: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                       
                      </span>
                      
                    </ul>
                  </div>

                  <div class="rounded mx-auto d-block">
                    <img
                      src={congratsImg}
                      width={250}
                      className="modalsimageclass"
                      alt="SabPaisa"
                      title="SabPaisa"
                    />
                  </div>
                </div>
              </div>
 <div className="hrForCard"></div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  className="modalbtnsuccess text-white mt-3 ml-5"
                  onClick={() => handleClose()}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* KYC SUBMIT MODAL AFTER SUBMITTING THE KYC FORM */}
       {/* <section>
       <div
        className={
          "modal hide fade mymodals" +
          (OpenModalForKycSubmit?.isOpen === true ? " show d-block" : " d-none")
        }
        tabIndex="-1"
        role="dialog"
        style={{ marginLeft: "214px", marginTop: "6px" }}
        id="submitKyc"
        data-bs-backdrop="static" data-bs-keyboard="false"
        aria-labelledby="submitKycLabel"
      >
        <div class="modal-dialog modal-dialog-centered " role="document" style={{ maxWidth: 480 }}>
          <div class="modal-content modalsubmitmodal">
            <div class="modal-body Satoshi-Medium">
              <button
                type="button"
                data-bs-dismiss="modal"
                class="close"
                aria-label="Close"
                onClick={() => {
                  handleClose()
                }}
              
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <div class="row">
                          <div class="col-lg-12">
                            <h1
                              className="text-center"
                              style={{
                                color: "#4BB543",
                                fontWeight: "700",
                                fontStyle: "normal",
                                fontSize: "32px",
                              }}
                            >
                              Congratulations!
                            </h1>
                            <p className="modalscolrsfortextapprv m-0 text-center">
                            You can accept payments upto INR 15,000
                            </p>
                            <p className="modalscolrsfortextapprv m-0 text-center">
                            Your KYC is currently under review. 
                            <br/>
                            <br/>
                            The KYC review process ususally takes 3-4 working days.
                            We will notify you in case we want any clarification on your KYC.

                            </p>
                          </div>
                        </div>
                        <div class="row">
                        
                          <div class="col-lg-12 text-center">
                            <img
                              src={congImg}
                              className="modalsimageclass-1"
                              alt="SabPaisa"
                              title="SabPaisa"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="modal-footer p-2">
                        <div className="col-lg-12 p-0 m-0 text-center">
                        <button
                              type="button"
                              class="ColrsforredirectProdct text-white m-0"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                handleClose()
                              }}
                            
                            >
                              Close
                            </button>
                        </div> */}

                        {/* </Link> */}
                      
            {/* </div>
          </div>
        </div>
      </div>
      </section>
       
   
       */}
            {/* KYC SUBMIT MODAL AFTER SUBMITTING THE KYC FORM */}

      {/* Dashboard open pop up start here {IF KYC IS APPROVED}*/}
    </section>
  );
}

export default Home;
