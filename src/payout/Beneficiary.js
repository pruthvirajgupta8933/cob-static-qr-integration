import React, { useEffect, useState } from "react";
import { fetchBeneficiaryDetails } from "../slices/payoutSlice";
import { useSelector, useDispatch } from "react-redux";
import NavBar from "../components/dashboard/NavBar/NavBar";
import Spinner from "../_components/reuseable_components/ProgressBar";
import DropDownCountPerPage from "../_components/reuseable_components/DropDownCountPerPage";
import Table from "../_components/table_components/table/Table";
import { beneficiaryRowData } from "../utilities/tableData";
import Paginataion from "../_components/table_components/pagination/Pagination";
import {
  fetchClientCode,
} from "../slices/payoutSlice";

const Beneficiary = () => {
  const dispatch = useDispatch();
  const payoutBeneficiaryState = useSelector((state) => state.payout);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const TotalData = payoutBeneficiaryState?.beneficiaryList?.count;
  const beneficiaryData = payoutBeneficiaryState?.beneficiaryList.results;
  const loadingState = useSelector((state) => state.payout.isLoading);

  useEffect(() => {
    dispatch(fetchClientCode()).then((res) => {
      fetchBeneficiaryList();
    });
  }, [currentPage, pageSize]);

  const fetchBeneficiaryList = () => {
    const data = {
      pageSize: pageSize,
      pageNumber: currentPage,
    };
    dispatch(fetchBeneficiaryDetails({ data }));
  };
  const makeFirstLetterCapital = (str) => {
    let resultString = str.charAt(0).toUpperCase() + str.substring(1);
    return resultString;
  };


  //Map the table data
  const colData = () => {
    return (
      <>
        {beneficiaryData == [] ? (
          <td colSpan={"11"}>
            {" "}
            <div className="nodatafound text-center">No data found </div>
          </td>
        ) : (
          beneficiaryData?.map((data, key) => (
            <tr>
              <td>{makeFirstLetterCapital(data.full_name)}</td>
              <td>{data.account_number}</td>
              <td>{data.ifsc_code}</td>
              <td>{data.upi_id}</td>
            </tr>
          ))
        )}
      </>
    );
  };
  //function for change current page
  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };
  //function for change page size
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };
  return (
    <>
      <section className="ant-layout">
        <div>
          <NavBar />
        </div>
        {payoutBeneficiaryState.isLoading && <Spinner />}
        <main className="gx-layout-content ant-layout-content NunitoSans-Regular">
          <div className="gx-main-content-wrapper">
            <div className="right_layout my_account_wrapper right_side_heading">
              <h1 className="m-b-sm gx-float-left">Beneficiary Details</h1>
            </div>
            <div class="table-responsive">
              <div className="col-md-12 ml-4 col-md-offset-4">
                <div className="scroll overflow-auto">
                  {loadingState ? (
                    <p className="text-center spinner-roll">{<Spinner />}</p>
                  ) : (
                    <Table row={beneficiaryRowData} col={colData} />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <Paginataion
                dataCount={TotalData}
                pageSize={pageSize}
                currentPage={currentPage}
                changeCurrentPage={changeCurrentPage}
              />
            </div>
          </div>
        </main>
      </section>
    </>
  );
};
export default Beneficiary;
