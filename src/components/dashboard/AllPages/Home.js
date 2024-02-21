import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TxnChartDataSlice, clearSuccessTxnsummary } from "../../../slices/dashboardSlice";
import { useRouteMatch, Redirect, Link } from "react-router-dom";
import onlineshopinglogo from "../../../assets/images/onlineshopinglogo.png";
import "../css/Home.css";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import {
  GetKycTabsStatus,

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


function Home() {
  const roles = roleBasedAccess();
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const { auth, kyc, productCatalogueSlice, dashboard } = useSelector((state) => state);
  const { KycTabStatusStore, OpenModalForKycSubmit } = kyc;
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

  if (roles.merchant === true) {
    if (user.clientMerchantDetailsList === null) {
      // return <Redirect to={`${path}/profile`} />;
    }
  } else if (
    roles.approver === true ||
    roles.verifier === true ||
    roles.viewer === true ||
    roles.accountManager === true
  ) {
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

  return (
    <section className="">
      {/* KYC container start from here */}
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
          <div className="col-lg-7 col-sm-12 col-md-3">
            {/* chart */}
            <ChartContainer chartTitle="Transaction" data={chartDataArr} extraParamName={"TSR (%)"} xAxisTitle="Transaction Date" yAxisTitle="No. Of Transaction" />
          </div>

          <div className="col-lg-5 col-sm-12 col-md-5">
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
            <KycStatusUpdateMessage/>
             

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
      <HomeOpenModal/>
      <HomeOpenModal/>

    </section>
  );
}

export default Home;
