/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForApproved } from "../../slices/kycSlice";
import ViewGenerateMidModal from "./ViewGenerateMidModal";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import Table from "../../_components/table_components/table/Table";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import CustomLoader from "../../_components/loader";
import DateFormatter from "../../utilities/DateConvert";
import FormikController from "../../_components/formik/FormikController";
import { Formik, Form } from "formik";
import { fetchParentTypeData } from "../../slices/approver-dashboard/merchantReferralOnboardSlice";
import API_URL from "../../config";
import * as XLSX from 'xlsx';

import { axiosInstance } from "../../utilities/axiosInstance"
function AssignZone() {
  function capitalizeFirstLetter(param) {
    return param?.charAt(0).toUpperCase() + param?.slice(1);
  }
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([]);
  const [isChecked, setIsChecked] = useState(false); 
  

  const AssignZoneData = [
    {
      id: "1",
      name: (
        <span>
          <input
            type="checkbox"
            checked={selectedRows.length === data.length} // Checked if all rows are selected
            onChange={(e) => handleSelectAll(e.target.checked)}
          />{" "}
          Select All
        </span>
      ),
      selector: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.some((selectedRow) => selectedRow.id === row.id)}
          onChange={() => handleSingleSelect(row)}
        />
      ),
      sortable: false,
      width: "100px",
    },
    {
      id: "1",
      name: "S. No.",
      selector: (row) => row.sno,
      sortable: true,
      width: "86px",
    },
    {
      id: "2",
      name: "Client Code",
      selector: (row) => row.clientCode,
      cell: (row) => <div className="removeWhiteSpace">{row?.clientCode}</div>,
      width: "130px",
    },
    {
      id: "3",
      name: "Merchant Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="removeWhiteSpace">
          {capitalizeFirstLetter(row?.name ? row?.name : "NA")}
        </div>
      ),
      width: "200px",
    },
    {
      id: "4",
      name: "Email",
      selector: (row) => row.emailId,
      cell: (row) => <div className="removeWhiteSpace">{row?.emailId}</div>,
      width: "220px",
    },
    {
      id: "5",
      name: "Contact Number",
      selector: (row) => row.contactNumber,
      cell: (row) => (
        <div className="removeWhiteSpace">{row?.contactNumber}</div>
      ),
      width: "150px",
    },
    {
      id: "6",
      name: "KYC Status",
      selector: (row) => row.status,
    },
    {
      id: "7",
      name: "Registered Date",
      selector: (row) => row.signUpDate,
      sortable: true,
      cell: (row) => <div>{DateFormatter(row.signUpDate)}</div>,
      width: "150px",
    },
    {
      id: "8",
      name: "Onboard Type",
      selector: (row) => row.isDirect,
    },
    
  ];
  let initialValues = {
  transaction_from: "",
};
  useEffect(() => {


    const postData = {
      "parent_type": "bank",
      "created_by": "10829"
    }
    dispatch(fetchParentTypeData(postData)).then((res) => {
      setBankList(res?.payload?.data)

    })

  }, []);

const approvedMerchantList = useSelector(
    (state) => state.kyc.kycApprovedList
  );

   
  const loadingState = useSelector((state) => state.kyc.isLoadingForApproved);

  const [bankList, setBankList] = useState([])
  const [midList, setMidList] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [paymentModeList, SetPaymentModeList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalDisplayData, setModalDisplayData] = useState({});
  const [openZoneModal, setOpenModal] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  


  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows([...data]); // Select all rows
      setIsChecked(true)
    } else {
      setSelectedRows([]); // Deselect all rows
      setIsChecked(false)
    }
  };

  const handleSingleSelect = (row) => {
    const selectedIndex = selectedRows.findIndex((selectedRow) => selectedRow.id === row.id);
    if (selectedIndex === -1) {
      setSelectedRows([...selectedRows, row]); // Select single row
      setIsChecked(true)
    } else {
      const updatedSelectedRows = [...selectedRows];
      updatedSelectedRows.splice(selectedIndex, 1); // Deselect single row
      setSelectedRows(updatedSelectedRows);
      setIsChecked(false)
    }
  };

  useEffect(() => {
    const approvedList = approvedMerchantList?.results
    const dataCount = approvedMerchantList?.count

    if (approvedList) {
      setData(approvedList);
      setMidList(approvedList);

      setDataCount(dataCount)
    }
  }, [approvedMerchantList]); //

  const afterGeneratingMid = () => {
    dispatch(
      kycForApproved({
        page: currentPage,
        page_size: pageSize,
        searchquery: "",
        merchantStatus: "Approved",
      })
    )
   
  };

  useEffect(() => {
    dispatch(
      kycForApproved({
        page: currentPage,
        page_size: pageSize,
        searchquery: "",
        merchantStatus: "Approved",
      })
    )
   
  }, [currentPage, pageSize]);

  ////////////////////////////////////////////////// Search filter start here

  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  const searchByText = (text) => {
    setData(
      midList?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
  };

  //function for change current page
  const changeCurrentPage = (page) => {
    setCurrentPage(page);
    setSelectedRows([])

  };

  //function for change page size
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
    setSelectedRows([])
  };

  const txnOption = [
    {key:'',value:"Select"},
    { key: "1", value: "Bank" },
    { key: "2", value: "Manual" }
  ];

  const tempPaymode = [{ key: "", value: "Select" }];
  paymentModeList.map((item) => {
    tempPaymode.push({ key: item.paymodeId, value: item.paymodeName });
  });

  const paymodeList = async () => {
    await axiosInstance
      .get(API_URL.PAY_MODE_LIST)
      .then((res) => {

        SetPaymentModeList(res.data);
      })
      .catch((err) => {

      });
  };

  useEffect(() => {
    paymodeList();

  }, []);


  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(selectedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'selectedRows');
    XLSX.writeFile(workbook, 'Mid Report.xlsx');
  };




  return (
    <section className="">
      <main className="">
        <div className="">
          <div className="">
            <h5 className="ml-3">MID Generation</h5>
          </div>
          <div className="container-fluid mt-5">
            <Formik
              initialValues={initialValues}
            // validationSchema={validationSchema}
            // onSubmit={onSubmit}
            >
              {(formik) => (
                <Form className="">
                  <div className="row">
                    <div className="col-lg-3">

                      <FormikController
                        control="select"
                        className="form-select"
                        label="Select "
                        options={txnOption}
                        name="transaction_from"
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label className="form-label">Select Bank</label>
                        <select className="form-select">
                          <option value="">Select</option>
                          {bankList?.map((data) => (
                            <option value={data?.loginMasterId} key={data?.value}>
                              {data?.client_code
                                ? `${data?.client_code?.toUpperCase()} - ${data?.name?.toUpperCase()}`
                                : data?.name?.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group">
                        <FormikController
                          control="select"
                          label="Payment Mode"
                          name="payment_mode"
                          className="form-select"
                          options={tempPaymode}
                        />
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>



            <div className="row mt-3">
              <div className="form-group col-md-3">
                <SearchFilter
                  kycSearch={kycSearch}
                  searchText={searchText}
                  searchByText={searchByText}
                  setSearchByDropDown={setSearchByDropDown}
                  searchTextByApiCall={true}
                />


              </div>
              <div className="form-group col-md-3">
                <CountPerPageFilter
                  pageSize={pageSize}
                  dataCount={dataCount}
                  currentPage={currentPage}
                  changePageSize={changePageSize}
                  changeCurrentPage={changeCurrentPage}
                />

              </div>
              {isChecked && 
                <div className="form-group col-lg-3">
                  <button
                    className="btn btn-sm text-white mt-4 cob-btn-primary "
                    type="button"
                    onClick={handleExport}
                  >
                    Export
                  </button>
                </div>}

              <div className="">
                <div className="scroll overflow-auto mr-3">
                  <h6>Total Count : {dataCount}</h6>
                  {!loadingState && data?.length !== 0 && (
                    <Table
                      row={AssignZoneData}
                      data={data}
                      dataCount={dataCount}
                      pageSize={pageSize}
                      currentPage={currentPage}
                      changeCurrentPage={changeCurrentPage}
                    />
                  )}
                </div>
                <CustomLoader loadingState={loadingState} />
                {data?.length == 0 && !loadingState && (
                  <h2 className="text-center font-weight-bold">No Data Found</h2>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          {openZoneModal === true ? (
            <ViewGenerateMidModal
              userData={modalDisplayData}
              setOpenModal={setOpenModal}
              afterGeneratingMid={afterGeneratingMid}
            />
          ) : (
            <></>
          )}
        </div>
      </main>
    </section>
  );
}

export default AssignZone;
