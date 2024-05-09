import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TxnChartDataSlice, clearSuccessTxnsummary } from "../../../slices/dashboardSlice";
import { useRouteMatch, Redirect, Link } from "react-router-dom";
import onlineshopinglogo from "../../../assets/images/onlineshopinglogo.png";
import "../css/Home.css";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import {
  GetKycTabsStatus,
  kycUserList,

} from "../../../slices/kycSlice";



import StepProgressBar from "../../../_components/reuseable_components/StepProgressBar/StepProgressBar";
import KycAlert from "../../KYC/KycAlert";
import { isNull } from "lodash";
import PaymentAlertBox from "./Product Catalogue/PaymentAlertBox";

import moment from "moment";
import ChartContainer from "../../chart/ChartContainer";
import HomeContent from "./HomeContent";
import HomeProduct from "./HomeProduct";
import HomeOpenModal from "./HomeOpenModal";
import KycStatusUpdateMessage from "./KycStatusUpdateMesssage";
import menulistService from "../../../services/cob-dashboard/menulist.service";
import toastConfig from "../../../utilities/toastTypes";


function Home() {
  const roles = roleBasedAccess();
  const dispatch = useDispatch();
  const [locationLoader, setLocationLoader] = useState(false)

  const { path } = useRouteMatch();


  const { auth, kyc, productCatalogueSlice, dashboard } = useSelector((state) => state);
  const { KycTabStatusStore } = kyc;
  const { user } = auth;
  const { txnChartData } = dashboard

  const { SubscribedPlanData } = productCatalogueSlice;
  // console.log("SubscribedPlanData", SubscribedPlanData)

  const unPaidProduct = useMemo(() => {
    return SubscribedPlanData?.filter(
      (d) =>
        (isNull(d?.mandateStatus) || d?.mandateStatus === "pending") &&
        d?.plan_code === "005"
    );
  }, [SubscribedPlanData])




  useEffect(() => {
    // console.log("user",user?.clientMerchantDetailsList[0]?.clientCode)
    if (roles.merchant) {
      dispatch(GetKycTabsStatus({ login_id: user?.loginId }));
      dispatch(kycUserList({ login_id: user?.loginId }));
      dispatch(TxnChartDataSlice({ "p_client_code": user?.clientMerchantDetailsList[0]?.clientCode }))
    }

  }, []);



  useEffect(() => {
    // comment unwanted api call
    // dispatch(kycUserList({ login_id: user?.loginId }));
    return () => {
      dispatch(clearSuccessTxnsummary());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // useEffect(() => {
  //   if (roles.merchant) {
  //     getLocation()
  //   }

  // }, [])



  // const geoCordVal = useMemo(() => {
  //   return { geoCord, kyc, roles };
  // }, [geoCord, kyc?.kycUserList?.latitude, kyc?.kycUserList?.longitude, roles]);

  // useEffect(() => {
  //   const { latitude, longitude } = kyc?.kycUserList || {};

  //   if (latitude === null && longitude === null && roles.merchant) {
  //     const saveCord = {
  //       merchant_latitude: geoCord.latitude,
  //       merchant_longitude: geoCord.longitude,
  //       merchant_coordinate_capture_mode: "Dynamic",
  //       login_id: user?.loginId,
  //       coordinates_modified_by: user?.loginId
  //     };

  //     console.log("trigger api to save lat and long", saveCord);
  //     // Uncomment the line below to execute the API call when ready
  //     // menulistService.saveGeoLocation(saveCord).then(resp => console.log(resp)).catch(err => console.log(err));
  //   }
  // }, []);



  // if (roles.merchant === true) {
  //   if (user.clientMerchantDetailsList === null) {
  //     // return <Redirect to={`${path}/profile`} />;
  //   }
  // } else if (
  //   roles.approver === true ||
  //   roles.verifier === true ||
  //   roles.viewer === true ||
  //   roles.accountManager === true
  // ) {
  //   return <Redirect to={`${path}/Internal-dashboard`} />;
  // }

  // redirect to the internal dashboard
  if (roles.approver === true ||
    roles.verifier === true ||
    roles.viewer === true ||
    roles.accountManager === true) {
    return <Redirect to={`${path}/Internal-dashboard`} />;

  }



  // filter only subscription plan



  // prepare chart data
  let chartDataArr = {};

  let labels = []
  let values = []
  let extraValues = []

  if (roles.merchant) {
    txnChartData?.map((item) => {
      labels.push(moment(item?.txnDate).format('MMMM Do'))
      values.push(parseInt(item?.txnNo))
      extraValues.push(parseInt(item?.tsr))
    }
    )
  }

  chartDataArr = {
    labels,
    values,
    extraValues
  }

  // console.log("unPaidProduct", unPaidProduct)
  function getLocation() {
    setLocationLoader(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      setLocationLoader(false)
      toastConfig.errorToast("Geolocation is not supported by this browser.")
    }
  }

  function showPosition(position) {
    setLocationLoader(true)
    const saveCord = {
      merchant_latitude: position.coords.latitude,
      merchant_longitude: position.coords.longitude,
      merchant_coordinate_capture_mode: "Dynamic",
      login_id: user?.loginId,
      coordinates_modified_by: user?.loginId
    };


    menulistService.saveGeoLocation(saveCord).then(resp => {
      if (resp?.data?.status) {
        toastConfig.successToast("Data saved successfully")
        dispatch(kycUserList({ login_id: user?.loginId }));
        setLocationLoader(false)
      }
    }).catch(err => {
      setLocationLoader(false)
      toastConfig.errorToast("Data is not saved. Please try again after some time")
    }
    );


  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        // x.innerHTML = "User denied the request for Geolocation."
        toastConfig.warningToast("It appears that location services are disabled. Please enable location access.")
        break;
      case error.POSITION_UNAVAILABLE:
        // x.innerHTML = "Location information is unavailable."
        toastConfig.warningToast("Location information is unavailable.")
        break;
      case error.TIMEOUT:
        // x.innerHTML = "The request to get user location timed out."
        toastConfig.warningToast("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
        // x.innerHTML = "An unknown error occurred."
        toastConfig.warningToast("An unknown error occurred.")
        break;
      default:
        toastConfig.warningToast("Location: Something went wrong.")
        break;
    }

    setLocationLoader(false)
  }


  // console.log(kyc.kycUserList?.latitude)
  // console.log(kyc.kycUserList?.longitude)
  // if (!kyc?.kycUserList?.latitude && kyc?.kycUserList?.longitude) {
  //   console.log("dfdfd")
  // }




  const longitude = kyc?.kycUserList?.longitude || null
  const latitude = kyc?.kycUserList?.latitude || null

  console.log(longitude, latitude)
  return (
    <section>
      {/* KYC container start from here */}
      {/* {console.log("kyc.kycUserList?.latitude", kyc?.kycUserList?.latitude)} */}
      {(kyc?.kycUserList?.latitude === null && kyc?.kycUserList?.longitude === null) &&
        <div className="row important-notification">
          <div className="alert alert-warning d-flex justify-content-between" role="alert">
            <h6><i className="fa fa-warning" /> Please allow location access for the KYC process. This permission is essential for completing your KYC verification.</h6>
            <button className="btn btn-sm cob-btn-primary" disabled={locationLoader} onClick={getLocation}>
              Grant Access
              {locationLoader && <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>}
            </button>
          </div>
        </div>}



      <div className="row">

        {/* hide when login by bank and if businees category b2b */}
        {roles?.bank === true || roles?.b2b === true ? (
          <></>
        ) : (
          <StepProgressBar status={KycTabStatusStore?.status} />
        )}
      </div>

      <hr />
      {/* Dashboard Update  */}
      {roles?.merchant &&
        <div className="row mt-3">
          <div className="col-lg-7 col-sm-12 col-md-12">
            {/* chart */}
            <ChartContainer chartTitle="Transaction" data={chartDataArr} extraParamName={"TSR (%)"} xAxisTitle="Transaction Date" yAxisTitle="No. Of Transaction" />
          </div>

          <div className="col-lg-5 col-sm-12 col-md-12">
            <h6 className="bg-secondary p-2 text-white">Dashboard Update</h6>

            {/* KYC alert */}
            <KycAlert />

            {/* payment alert */}

            {unPaidProduct?.length > 0 && (
              <PaymentAlertBox
                cardData={unPaidProduct}
                heading={`Payment Alert`}
                text1={`Kindly pay the amount of the subscribed product`}
                linkName={"Make Payment"}
                bgColor={"alert-danger"}
              />
            )}


            {/* KYC Status -Update Message */}
            <KycStatusUpdateMessage />


          </div>
        </div>
      }
      <hr />
      <br />
      {/* static content displaying */}

      <HomeContent />
      {/* Display the products  */}
      <HomeProduct />
      {/* Dashboard open pop up start here {IF KYC IS PENDING}*/}
      <HomeOpenModal />
      {/* <HomeOpenModal/> */}

    </section>
  );
}

export default Home;
