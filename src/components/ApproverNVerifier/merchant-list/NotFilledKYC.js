/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { kycListByStatus } from "../../../slices/kycSlice";
import { NotFilledKYCData } from "../../../utilities/tableData";
import { KYC_STATUS_NOT_FILLED } from "../../../utilities/enums";
import ListLayout from "./ListLayout";

const rowData = NotFilledKYCData;

const NotFilledKYC = () => {
  // const loadingState = useSelector((state) => state.kyc.isLoading);
  const {
    results: notFilledKycData,
    count: dataCount,
    loading: loadingState,
  } = useSelector(
    (state) => state.kyc.kycListByStatus?.[KYC_STATUS_NOT_FILLED] || {}
  );

  const [notFilledData, setNotFilledData] = useState(notFilledKycData);
  const [data, setData] = useState(notFilledKycData);

  const mappedData = useMemo(() => {
    return notFilledKycData?.map((item) => {
      return {
        sno: item.sno,
        name: item.name,
        clientCode: item.clientCode,
        emailId: item.emailId,
        contactNumber: item.contactNumber,
        status: item.status,
        signUpDate: item.signUpDate,
        isDirect: item.isDirect,
        zoneName: item.zoneName,
        onboard_type: item.onboard_type,
      };
    });
  }, [notFilledKycData]);

  return (
    <div className="container-fluid flleft">
      <ListLayout
        loadingState={loadingState}
        searchData={notFilledData}
        dataCount={dataCount}
        rowData={rowData}
        data={mappedData}
        setData={setData}
        fetchDataCb={kycListByStatus}
        merchantStatus={KYC_STATUS_NOT_FILLED}
        orderByField="-id"
      />
    </div>
  );
};

export default NotFilledKYC;
