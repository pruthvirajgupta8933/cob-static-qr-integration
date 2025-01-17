import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  txnChartDataSlice,
  clearSuccessTxnsummary,
} from "../../../slices/dashboardSlice";
import { useRouteMatch, Redirect } from "react-router-dom";
import "../css/Home.css";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import {
  GetKycTabsStatus,
  kycUserList,
  kycUserListForMerchant,
} from "../../../slices/kycSlice";
import StepProgressBar from "../../../_components/reuseable_components/StepProgressBar/StepProgressBar";
import KycAlert from "../../KYC/KycAlert";
import { isNull } from "lodash";
import PaymentAlertBox from "./Product Catalogue/PaymentAlertBox";

import moment from "moment";
import ChartContainer from "../../chart/ChartContainer";
import HomeProduct from "./HomeProduct";
import HomeOpenModal from "./HomeOpenModal";
import KycStatusUpdateMessage from "./KycStatusUpdateMesssage";
import menulistService from "../../../services/cob-dashboard/menulist.service";
import toastConfig from "../../../utilities/toastTypes";
import { graphDate } from "../../../utilities/graphDate";
import PasswordExpiry from "../../../_components/reuseable_components/PasswordExpiry";
import paymentLinkService from "../../../services/create-payment-link/paymentLink.service";

function Home() {
  const roles = roleBasedAccess();
  const dispatch = useDispatch();
  const [locationLoader, setLocationLoader] = useState(false);

  const { path } = useRouteMatch();

  const { auth, kyc, productCatalogueSlice, dashboard } = useSelector(
    (state) => state
  );
  const { KycTabStatusStore } = kyc;
  const { user } = auth;
  const { txnChartData } = dashboard;

  const { SubscribedPlanData } = productCatalogueSlice;

  const unPaidProduct = useMemo(() => {
    return SubscribedPlanData?.filter(
      (d) =>
        (isNull(d?.mandateStatus) || d?.mandateStatus === "pending") &&
        d?.plan_code === "005"
    );
  }, [SubscribedPlanData]);

  useEffect(() => {
    if (roles.merchant) {
      dispatch(GetKycTabsStatus({ login_id: user?.loginId }));
      dispatch(kycUserListForMerchant());


      // graph data
      const clientCode = user?.clientMerchantDetailsList[0]?.clientCode;
      const postGraphData = { p_client_code: clientCode };
      dispatch(txnChartDataSlice(postGraphData));



      // paylink api key

      async function getPaymentLinkApiKey() {
        try {
          const response = await paymentLinkService.getPaymentLinkApiKey({ client_code: clientCode });
          sessionStorage.setItem('paymentLinkApiKey', response.data.api_key);
        } catch (error) {
          toastConfig.errorToast("Something went wrong");
        }

      }

      if (!sessionStorage.getItem('paymentLinkApiKey')) {
        getPaymentLinkApiKey();
      }


    }
  }, []);



  useEffect(() => {
    return () => {
      dispatch(clearSuccessTxnsummary());
    };
  }, []);

  // redirect to the internal dashboard
  if (
    roles.approver === true ||
    roles.verifier === true ||
    roles.viewer === true ||
    roles.accountManager === true
  ) {
    return <Redirect to={`${path}/Internal-dashboard`} />;
  }

  // prepare chart data
  let chartDataArr = {};

  let labels = [];
  let values = [];
  let extraValues = [];

  if (roles.merchant) {
    const updatedDate = graphDate(txnChartData || []);
    updatedDate?.map((item) => {
      labels.push(moment(item?.txn_date).format("MMMM Do"));
      values.push(parseInt(item?.txn_no));
      extraValues.push(parseInt(item?.TSR));
    });
  }

  chartDataArr = {
    labels,
    values,
    extraValues,
  };

  function getLocation() {
    setLocationLoader(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      setLocationLoader(false);
      toastConfig.errorToast("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    setLocationLoader(true);
    const saveCord = {
      merchant_latitude: position.coords.latitude,
      merchant_longitude: position.coords.longitude,
      merchant_coordinate_capture_mode: "Dynamic",
      login_id: user?.loginId,
      coordinates_modified_by: user?.loginId,
    };

    menulistService
      .saveGeoLocation(saveCord)
      .then((resp) => {
        if (resp?.data?.status) {
          toastConfig.successToast("Data saved successfully");
          dispatch(kycUserListForMerchant());
          setLocationLoader(false);
        }
      })
      .catch((err) => {
        setLocationLoader(false);
        toastConfig.errorToast(
          "Data is not saved. Please try again after some time"
        );
      });
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        // x.innerHTML = "User denied the request for Geolocation."
        toastConfig.warningToast(
          "It appears that location services are disabled. Please enable location access."
        );
        break;
      case error.POSITION_UNAVAILABLE:
        // x.innerHTML = "Location information is unavailable."
        toastConfig.warningToast("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        // x.innerHTML = "The request to get user location timed out."
        toastConfig.warningToast("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        // x.innerHTML = "An unknown error occurred."
        toastConfig.warningToast("An unknown error occurred.");
        break;
      default:
        toastConfig.warningToast("Location: Something went wrong.");
        break;
    }

    setLocationLoader(false);
  }

  return (
    <section>
      {/* TODO: refactor it */}
      {/* KYC container start from here */}
      {/* {console.log("kyc.kycUserList?.latitude", kyc?.kycUserList?.latitude)} */}
      {kyc?.kycUserList?.latitude === null &&
        kyc?.kycUserList?.longitude === null && (
          <div className="row">
            <div
              className="alert important-notification d-flex justify-content-between p-2"
              role="alert"
            >
              <h6 className="">
                <i className="fa fa-warning" /> Please allow location access for
                the KYC process. This permission is essential for completing
                your KYC verification.
              </h6>
              <button
                className="btn btn-sm cob-btn-primary"
                disabled={locationLoader}
                onClick={getLocation}
              >
                Grant Access
                {locationLoader && (
                  <div
                    className="spinner-border spinner-border-sm text-primary me-2"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

      {/* password expire notification component */}
      <PasswordExpiry />
      {/* hide when login by bank and if businees category b2b */}
      {roles?.bank === true || roles?.b2b === true || roles?.referral ? (
        <></>
      ) : (
        <div className="row row card shadow pt-2">
          <StepProgressBar status={KycTabStatusStore?.status} />
        </div>
      )}

      <hr />
      {/* Dashboard Update  */}
      {roles?.merchant && (
        <div className="row mt-3">
          <div className="col-lg-7 col-sm-12 col-md-12 bg-white shadow rounded">
            {/* chart */}
            <ChartContainer
              chartTitle="Transaction"
              data={chartDataArr}
              extraParamName={"TSR (%)"}
              xAxisTitle="Transaction Date"
              yAxisTitle="No. Of Transaction"
            />
          </div>

          <div className="col-lg-5 col-sm-12 col-md-12">
            <h6 className="primaryColorSecond p-2 text-white">
              Dashboard Update
            </h6>

            {/* KYC alert */}
            <KycAlert />

            {/* payment alert */}

            {unPaidProduct?.length > 0 && (
              <PaymentAlertBox
                cardData={unPaidProduct}
                heading={`Payment Alert`}
                text1={`Kindly pay the amount of the subscribed product`}
                linkName={"Make Payment"}
                bgColor={"bg-white"}
              />
            )}

            {/* KYC Status -Update Message */}
            <KycStatusUpdateMessage />
          </div>
        </div>
      )}

      {(roles?.bank || roles?.referral) && (
        <div className="row">
          <h5>Dashboard</h5>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Transaction Overview</h5>
                <p className="card-text">
                  Stay updated with a summary of recent transactions. Quickly
                  identify key details like amounts, statuses, and payment
                  sources, with options to dive deeper.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Initiate Payment</h5>
                <p className="card-text">
                  Easily send or request payments through a variety of secure
                  options. Choose from multiple payment methods and get
                  real-time confirmation on transaction statuses.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Financial Insights</h5>
                <p className="card-text">
                  Access powerful tools to analyze your financial activities.
                  Identify trends, generate custom reports, and forecast future
                  revenue or expenses to stay ahead of the curve.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <hr />
      <br />
      {/* static content displaying */}

      {/* Display the products  */}
      <HomeProduct />
      {/* Dashboard open pop up start here {IF KYC IS PENDING}*/}
      <HomeOpenModal />
      {/* <HomeOpenModal/> */}
    </section>
  );
}

export default Home;
