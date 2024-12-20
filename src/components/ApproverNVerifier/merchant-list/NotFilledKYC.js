/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForNotFilled } from "../../../slices/kycSlice";
import { NotFilledKYCData } from "../../../utilities/tableData";
import ListLayout from "./ListLayout";

const rowData = NotFilledKYCData;
const NotFilledKYC = () => {
  const loadingState = useSelector((state) => state.kyc.isLoading);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const [onboardType, setOnboardType] = useState("");
  const dispatch = useDispatch();
  const { results: notFilledKycData, count: dataCount } = useSelector(
    (state) => state.kyc.notFilledUserList
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
      };
    });
  }, [notFilledKycData]);

  const fetchData = useCallback(
    (startingSerialNumber) => {
      dispatch(
        kycForNotFilled({
          page: currentPage,
          page_size: pageSize,
          searchquery: searchText,
          merchantStatus: "Not-Filled",
          isDirect: onboardType,
        })
      );
    },
    [currentPage, pageSize, searchText, dispatch, onboardType]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container-fluid flleft">
      <ListLayout
        loadingState={loadingState}
        searchData={notFilledData}
        dataCount={dataCount}
        rowData={rowData}
        data={mappedData}
        setData={setData}
        fetchDataCb={kycForNotFilled}
        merchantStatus="Not-Filled"
      />
    </div>
  );
};

export default NotFilledKYC;
