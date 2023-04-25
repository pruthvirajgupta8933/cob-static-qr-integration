import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  subscriptionplan,
  clearSuccessTxnsummary,
} from "../../../slices/dashboardSlice";
import { useRouteMatch, Redirect, Link } from "react-router-dom";
import onlineshopinglogo from "../../../assets/images/onlineshopinglogo.png";
import "../css/Home.css";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import {
  GetKycTabsStatus,
  kycUserList,
  UpdateModalStatus,
} from "../../../slices/kycSlice";
import NavBar from "../NavBar/NavBar";
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

function Home() {
  const roles = roleBasedAccess();
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const [modalState, setModalState] = useState("Not-Filled");
  const [isRateMappingInProcess, setIsRateMappingInProcess] = useState(false);

  const { auth, kyc, productCatalogueSlice } = useSelector((state) => state);
  const { KycTabStatusStore, OpenModalForKycSubmit } = kyc;
  const { user } = auth;

  const { SubscribedPlanData } = productCatalogueSlice;

  useEffect(() => {
    GetKycTabsStatus({ login_id: user?.loginId });
  }, [user]);

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

  return (
    <section className="ant-layout Satoshi-Medium NunitoSans-Regular">
      <div className="m_none">
        <NavBar />
      </div>

      {/* KYC container start from here */}
      <div className="announcement-banner-container col-lg-12">
        {/* hide when login by bank and businees category b2b */}
        {roles?.bank === true || roles?.b2b === true ? (
          <></>
        ) : (
          <StepProgressBar status={kyc?.kycUserList?.status} />
        )}

        {/* KYC ALETT */}
        {roles?.merchant === true ? (
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

              
            <KycAlert />
          </React.Fragment>
        ) : (
          <></>
        )}

        <div className="announcement-banner-container_new  announcement-banner">
          <div className="onboarding-illustration-top">
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

            {roles?.merchant === true &&
              kyc?.kycUserList?.status !== "Approved" && (
                <div className="col-12 col-md-12">
                  <div className="card col-lg-12- cardkyc pull-left">
                    <div className="font-weight-bold card-body Satoshi-Medium">
                      <span>
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
                <div className="col-12 col-md-12">
                  <div className="card col-lg-12- cardkyc pull-left">
                    <div className="font-weight-bold card-body Satoshi-Medium">
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
        </div>

        {roles?.merchant === true && (
          <div className="container">
            <div className="row">
              <div className="col-sm  m-0 no-pad">
                <div className="card">
                  <h2 className="card-title dashboardEnablecss">
                    <img
                      className="card-img-left"
                      src={subscriptin}
                      alt="onlinepay"
                    />
                    &nbsp;Payment Links
                  </h2>
                  <p className="paragraphcssdashboards">
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
              <div className="col-sm mt-31">
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
      {roles?.bank === true || roles?.b2b === true ? (
        <></>
      ) : (
        <div
          className={
            "modal fade mymodals" +
            (modalState === "Not-Filled" ? " show d-block" : " d-none")
          }
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered " role="document">
            <div className="modal-content">
              <div className="modal-body Satoshi-Medium">
                {/* ratemapping loader  */}
                <DefaultRateMapping setFlag={setIsRateMappingInProcess} />

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

                    <div className="row">
                      <div className="col-sm">
                        <h1 className="homeModalHeading">
                          Welcome to SabPaisa!
                        </h1>
                        <h2 className="modalscolrsfortext">
                          Complete the KYC to activate your account and start
                          accepting payments. Fill in all the information to
                          start your SabPaisa Payment services.
                        </h2>
                      </div>

                      <div className="col-sm">
                        <img
                          src={bro}
                          className="modalsimageclass"
                          alt="SabPaisa"
                          title="SabPaisa"
                        />
                      </div>
                    </div>

                    <div className="row Satoshi-Medium">
                      <div className="col-lg-4">
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
                      <div className="col-lg-7">
                        <Link to={`/dashboard`}>
                          <button
                            className="ColrsforredirectProdct  text-white"
                            style={{ marginTop: "9px" }}
                            onClick={() => {
                              setModalState(!modalState);
                            }}
                            aria-label="Close"
                          >
                            <h5 className="m-0">Try out our dashboard</h5>
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
            <div className="modal-body Satoshi-Medium">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>

              <div className="container Satoshi-Medium">
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
