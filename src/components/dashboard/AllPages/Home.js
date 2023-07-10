import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TxnChartDataSlice, clearSuccessTxnsummary } from "../../../slices/dashboardSlice";
import { useRouteMatch, Redirect, Link } from "react-router-dom";
import onlineshopinglogo from "../../../assets/images/onlineshopinglogo.png";
import "../css/Home.css";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import {
  GetKycTabsStatus,
  kycUserList,
  UpdateModalStatus,
  
} from "../../../slices/kycSlice";
// import NavBar from "../NavBar/NavBar";
import bro from "../../../assets/images/bro.png";
import congratsImg from "../../../assets/images/congImg.png";
import onlineimg from "../../../assets/images/onlinePayment.png";
import subscriptin from "../../../assets/images/subscribe.png";
import Rupees from "../../../assets/images/payout.png";
import Quick from "../../../assets/images/qwikform.png";
import linkpssa from "../../../assets/images/linkPaisa.png";
import echlln from "../../../assets/images/echallan.png";
import StepProgressBar from "../../../_components/reuseable_components/StepProgressBar/StepProgressBar";
import KycAlert from "../../KYC/KycAlert";
import { DefaultRateMapping } from "../../../utilities/DefaultRateMapping";
import { isNull } from "lodash";
import AlertBox from "../../../_components/reuseable_components/AlertBox";
import classes from "./Home/home.module.css"
import DataVisualizatoin from "../../chart/DataVisualizatoin";
import moment from "moment";


function Home() {
  const roles = roleBasedAccess();
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const [modalState, setModalState] = useState("Not-Filled");
  const [isRateMappingInProcess, setIsRateMappingInProcess] = useState(false);

  const { auth, kyc, productCatalogueSlice, dashboard } = useSelector((state) => state);
  const { KycTabStatusStore, OpenModalForKycSubmit } = kyc;
  const { user } = auth;
  const {txnChartData} = dashboard

  const { SubscribedPlanData } = productCatalogueSlice;

  useEffect(() => {
    // console.log("user",user?.clientMerchantDetailsList[0]?.clientCode)
    dispatch(GetKycTabsStatus({ login_id: user?.loginId }));
    roles.merchant && dispatch(TxnChartDataSlice({"p_client_code":user?.clientMerchantDetailsList[0]?.clientCode}))
  }, []);

  useEffect(() => {
    // console.log(kyc?.kycUserList)
    setModalState(KycTabStatusStore?.status);
  }, [KycTabStatusStore]);

  useEffect(() => {
    dispatch(kycUserList({ login_id: user?.loginId }));
    return () => {
      dispatch(clearSuccessTxnsummary());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (roles.merchant === true) {
    if (user.clientMerchantDetailsList === null) {
      // return <Redirect to={`${path}/profile`} />;
    }
  } else if (
    roles.approver === true ||
    roles.verifier === true ||
    roles.viewer === true
  ) {
    return <Redirect to={`${path}/approver`} />;
  }

  const handleClose = () => {
    dispatch(UpdateModalStatus(false));
  };

  // filter only subscription plan
  const unPaidProduct = SubscribedPlanData?.filter(
    (d) =>
      (isNull(d?.mandateStatus) || d?.mandateStatus === "pending") &&
      d?.plan_code === "005"
  );

  // prepare chart data
  let chartDataArr = [["Date", "Number Of Transaction"]]
    if(roles.merchant){
      txnChartData?.map((item)=>(
      chartDataArr.push([moment(item?.txnDate).format('MMMM Do YYYY'), parseInt(item?.txnNo)])))
    }

    // if no transaction found
    if(chartDataArr.length===1){
      chartDataArr.push([moment(Date()).format('MMMM Do YYYY'), 0])
    }
  

  return (
    <section className="">
      {/* KYC container start from here */}
      <div className="row">
        {/* hide when login by bank and businees category b2b */}
        {roles?.bank === true || roles?.b2b === true ? (
          <></>
        ) : (
          <StepProgressBar status={kyc?.kycUserList?.status} />
        )}
      </div>

      <div className="row">
        <div className="col-lg-12">
          {roles?.merchant === true && (
            <React.Fragment>
              {unPaidProduct?.length > 0 && (
                <AlertBox
                  cardData={unPaidProduct}
                  // key={data?.clientSubscribedPlanDetailsId}
                  heading={`Payment Alert`}
                  text1={`Kindly pay the amount of the subscribed product`}
                  // text2={`Product : ${data?.applicationName}` }
                  // text3={`Product Plan : ${data?.planName}`}
                  // linkUrl={`dashboard/sabpaisa-pg/${data?.clientSubscribedPlanDetailsId}`}
                  linkName={"Make Payment"}
                  bgColor={"alert-danger"}
                />
              )
              }
            </React.Fragment>
          )}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-12">
          {/* KYC ALETT */}
          <KycAlert />
          {roles?.merchant && chartDataArr?.length>1 && <DataVisualizatoin data={chartDataArr} chartTitle="Recent Transaction" />}

        </div>
      </div>
      <br />

      <div className="row">
        <div className="col-sm-9 d-flex flex-wrap justify-content-center">

          <div
            className="col-lg-4"
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
            <h5 className="font-weight-bold">Built for developers</h5>
            <p className="text-muted mb-6 mb-md-0">
              Our kit is built to make your life easier. Variables, build
              tooling, documentation, and reusable components.
            </p>
          </div>

          <div
            className="col-lg-4"
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
            <h5 className="font-weight-bold">Designed to be modern</h5>
            <p className="text-muted mb-6 mb-md-0">
              Designed with the latest design trends in mind. Our kit feels
              modern, minimal, and beautiful.
            </p>
          </div>

          <div
            className="col-lg-4"
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
            <h5 className="font-weight-bold">Documentation for everything</h5>
            <p className="text-muted mb-0">
              We've written extensive documentation for components and tools,
              so you never have to reverse engineer anything.
            </p>
          </div>
        </div>

        <div className={`col-lg-3 ${classes.mobile_d_none}`}>
          <img
            src={onlineshopinglogo}
            width={400}
            alt="SabPaisa"
            title="SabPaisa"
            className={`${classes.banner_image}`}
          />
        </div>
      </div>

      <br />
      <br />
      <br />
      <div className="row kyc-link">

        {roles?.merchant === true &&
          kyc?.kycUserList?.status !== "Approved" && (
            <div className="col-lg-12 col-md-12">
              <div className="card col-lg-12- cardkyc pull-left">
                <div className="card-body ">
                  <span className="font-weight-bold">
                    You can accept payments upto ₹10,000 for now. To extend
                    the limit complete your KYC and get it approved.
                  </span>
                  <Link
                    to={`/dashboard/kyc`}
                    data-toggle="modal"
                    data-target="#exampleModalCenter"
                  >
                    <button
                      className="text-white  kycbtns"
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
          )}
        {roles?.merchant === true &&
          kyc?.kycUserList?.status === "Approved" && (
            <div className="col-lg-12 col-md-12">
              <div className="card col-lg-12- cardkyc pull-left">
                <div className="font-weight-bold card-body ">
                  <span>
                    Congratulations! Your KYC documents have been approved.
                  </span>
                  <button
                    className="text-white pull-right kycbtns"
                    disabled
                  >
                    KYC Done
                  </button>
                </div>
              </div>
            </div>
          )}

      </div>

      <br />
      <br />
      <div className="row">
        {roles?.merchant === true && (
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-6">
                <div className="">
                  <h4 className="card-title">
                    <img
                      className="card-img-left"
                      src={subscriptin}
                      alt="onlinepay"
                    />
                    &nbsp;Payment Links
                  </h4>
                  <p className="">
                    Payment Links is the world’s first Unified link-based
                    payment method, for payment collections with the help of
                    links for a wide range of payment modes. Collect payments
                    even without a website through easy payment links. Payment
                    Links offers password-protected and shortened payment links
                    for seamless payment collection.
                  </p>
                  <Link to={`/dashboard/sabpaisa-pricing/13/PayLink`}>
                    <p className="pricingclasscss">
                      Read More & Pricing &nbsp;{">"}
                      {">"}
                    </p>
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row pt-2 m-0">
                  <div className="col-6 d-flex flex-wrap my-2 no-pad">
                    <img
                      className="card-img-left mr-2"
                      src={onlineimg}
                      alt="payLink"
                      width={"41px"}
                      height={"41px"}
                    />
                    <p
                      className="foralinkscsshere my-auto "
                      style={{ lineHeight: "25px" }}
                    >
                      Payment Gateway
                    </p>
                  </div>
                  <div className="col-6 d-flex flex-wrap my-2 no-pad pr-2">
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
                      Subscriptions
                    </p>
                  </div>

                  <div className="col-6 d-flex flex-wrap my-2 no-pad">
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
                  <div className="col-6 d-flex flex-wrap my-2 no-pad">
                    <img
                      className="card-img-left mr-2"
                      width={"41px"}
                      height={"41px"}
                      src={subscriptin}
                      alt="payLink"
                    />
                    <p
                      className="foralinkscsshere my-auto"
                      style={{ lineHeight: "25px" }}
                    >
                      Payment Links
                    </p>
                  </div>
                  <div className="col-6 d-flex flex-wrap my-2 no-pad">
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
                  <div className="col-6 d-flex flex-wrap my-2 no-pad">
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
                      Offline payments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KYC container end here */}


      {/* Dashboard open pop up start here {IF KYC IS PENDING}*/}
      {roles?.bank === true || roles?.b2b === true ? (
        <></>
      ) : (
        <div
          className={
            "modal fade mymodals " +
            (modalState === "Not-Filled" ? " show d-block" : " d-none")
          }
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered " role="document">
            <div className="modal-content">
              <div className="modal-body ">
                {/* ratemapping loader  */}
                {/* <DefaultRateMapping setFlag={setIsRateMappingInProcess} /> */}

                {!isRateMappingInProcess && (
                  <div className="">
                    <button
                      type="button"
                      onClick={() => {
                        setModalState(!modalState);
                      }}
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>

                    <div className="row text-center">
                      <div className="col-lg-12">
                        <h1 className="homeModalHeading">
                          Welcome to SabPaisa!
                        </h1>
                        <h6 className="">
                          Complete the KYC to activate your account and start
                          accepting payments. Fill in all the information to
                          start your SabPaisa Payment services.
                        </h6>
                      </div>

                      <div className="col-lg-12">
                        <img
                          src={bro}
                          className="w-75"
                          alt="SabPaisa"
                          title="SabPaisa"
                        />
                      </div>
                    </div>

                    <div className="row mt-3 ">
                      <div className="col-lg-6 text-align-end">
                        <Link
                          to={`/dashboard/kyc`}
                          data-toggle="modal"
                          data-target="#exampleModalCenter"
                        >
                          <button className="ModalButtbtn btn-sm cob-btn-primary">

                            Complete the KYC

                          </button>
                        </Link>
                      </div>
                      <div className="col-lg-6">
                        <Link to={`/dashboard`} >
                          <button
                            className="btn btn-sm cob-btn-secondary"
                            onClick={() => {
                              setModalState(!modalState);
                            }}
                            aria-label="Close"
                          >
                            Try out our dashboard
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard open pop up start here {IF KYC IS PENDING}*/}
      {/* Dashboard open pop up start here {IF KYC IS APPROVED}*/}
      {/* need to fix this modal on condition */}
      <div
        className={
          "modal fade mymodals " +
          (OpenModalForKycSubmit?.isOpen === true ? " show d-block" : " d-none")
        }
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div
            className="modal-content"
            style={{ width: "709px", marginTop: "70px" }}
          >
            
            <div className="modal-body ">
              <div className="container">
                <div className="row justify-content-end"> <button
                type="button"
                onClick={() => {
                  handleClose();
                }}
                className="cob-close-btn btn btn-default text-end"
                data-dismiss="modal"
                aria-label="Close"
              > X </button></div>
                <div className="row justify-content-md-center">
                  <div className="col-md-auto">
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
                        You can accept payments upto INR 10,000
                      </p>
                      <p className="modalscolrsfortextapprv m-0 text-center">
                        Your KYC is currently under review.
                        <br />
                        <br />
                        <p className="modalscolrsfortextapprv m-0 text-center">
                          The KYC review process usually takes 3-4 working days.
                        </p>
                        <p className="modalscolrsfortextapprv m-0 text-center">
                          We will notify you in case we want any clarification
                          on your KYC.
                        </p>
                      </p>
                      <span
                        className="modalscolrsfortextapprv text-center"
                        style={{
                          display: "table-footer-group",
                          justifyContent: "center",
                          whiteSpace: "nowrap",
                        }}
                      ></span>
                    </ul>
                  </div>

                  <div className="rounded mx-auto d-block text-center">
                    <img
                      src={congratsImg}
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
      {/* Dashboard open pop up start here {IF KYC IS APPROVED}*/}
    </section>
  );
}

export default Home;
