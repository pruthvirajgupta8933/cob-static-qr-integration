import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveAs } from "file-saver";
import moment from "moment";
import { getAssignedMerchantData } from "./businessDevelopmentSlice/BusinessDevelopmentSlice";
import {
  assignmentTypeApi,
  exportAssignedMerchant,
} from "../../slices/assign-accountmanager-slice/assignAccountMangerSlice";
import Table from "../../_components/table_components/table/Table";
import DateFormatter from "../../utilities/DateConvert";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import SkeletonTable from "../../_components/table_components/table/skeleton-table";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import { setKycMasked } from "../../slices/kycSlice";

const AssignedMerchant = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const loginId = user?.loginId;
  const roleId = user?.roleId;
  const assigneMerchantList = useSelector(
    (state) => state.merchantAssignedReducer.assignedMerchantList
  );
  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilterData, setSearchFilterData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const { isKycMasked } = useSelector((state) => state.kyc);

  useEffect(() => {
    if (assigneMerchantList?.results) {
      setData(assigneMerchantList.results);
      setDataCount(assigneMerchantList.count || 0);
      setSearchFilterData(assigneMerchantList.results);
    }
  }, [assigneMerchantList]);

  const loadingState = useSelector(
    (state) => state.merchantAssignedReducer.isLoading
  );

  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  const searchByText = (text) => {
    setData(
      searchFilterData?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
  };

  useEffect(() => {
    dispatch(assignmentTypeApi()).then((response) => {
      const assignmentTypes = response?.payload?.assignment_type || [];
      const filteredAssignment = assignmentTypes.find(
        (item) => item.role_id === roleId
      );

      if (filteredAssignment) {
        const queryParams = {
          page: currentPage,
          page_size: pageSize,
          search_query: searchText,
          operation: isKycMasked ? "u" : "k",
        };

        const payload = {
          assignment_type: filteredAssignment.value,
          assigned_login_id: loginId,
        };

        dispatch(getAssignedMerchantData({ queryParams, payload }));
      }
    });
  }, [
    dispatch,
    loginId,
    roleId,
    currentPage,
    pageSize,
    searchText,
    isKycMasked,
  ]);

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const changePageSize = (size) => {
    setPageSize(size);
  };

  const AssinedMerchantData = [
    {
      id: "1",
      name: "S.No",
      selector: (row) => row.s_no,
      sortable: true,
      width: "95px",
    },
    {
      id: "2",
      name: "Name",
      selector: (row) => row.login_id?.name,
      width: "130px",
    },
    {
      id: "3",
      name: "Email",
      selector: (row) => row.login_id?.email,
      sortable: true,
      width: "200px",
    },
    {
      id: "4",
      name: "Client Code",
      selector: (row) => row.login_id?.master_client_id?.clientCode,
      width: "220px",
    },
    {
      id: "5",
      name: "UserName",
      selector: (row) => row.login_id?.username,
      width: "220px",
    },
    {
      id: "6",
      name: "Kyc Status",
      selector: (row) => row.status,
      width: "150px",
    },
    {
      id: "7",
      name: "Created Date",
      selector: (row) => DateFormatter(row.login_id?.createdDate),
    },
    {
      id: "8",
      name: "Onboard Type",
      selector: (row) => row.login_id?.onboard_type,
    },
  ];
  const exportToExcelFn = () => {
    const role = roleBasedAccess();
    let now = moment().format("YYYY-M-D");
    let splitDate = now.split("-");
    if (splitDate[1].length === 1) {
      splitDate[1] = "0" + splitDate[1];
    }
    if (splitDate[2].length === 1) {
      splitDate[2] = "0" + splitDate[2];
    }
    splitDate = splitDate.join("-");
    dispatch(
      exportAssignedMerchant({
        login_id: loginId,
        type: role?.accountManager
          ? "account_manager"
          : role?.businessDevelopment
          ? "business_development_manager"
          : role?.zonalManager
          ? "zonal_manager"
          : "",
      })
    ).then((res) => {
      const blob = new Blob([res?.payload], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `Assigned_Merchant_REPORT_${splitDate}.csv`);
    });
  };
  return (
    <section>
      <main>
        <div>
          <h5>Assigned Merchant</h5>
          <div className="row mt-5">
            <div className="form-group col-lg-3 col-md-12 mt-1">
              <SearchFilter
                kycSearch={kycSearch}
                searchText={searchText}
                searchByText={searchByText}
                setSearchByDropDown={setSearchByDropDown}
                searchTextByApiCall={true}
              />
            </div>
            <div className="form-group col-lg-3 col-md-12 mt-1">
              <CountPerPageFilter
                pageSize={pageSize}
                dataCount={dataCount}
                currentPage={currentPage}
                changePageSize={changePageSize}
                changeCurrentPage={changeCurrentPage}
              />
            </div>
            {data.length > 0 && (
              <>
                <div className="form-group col-lg-1 col-md-12 mt-4">
                  <button
                    className="btn cob-btn-primary btn-sm"
                    type="button"
                    onClick={() => exportToExcelFn()}
                    style={{ backgroundColor: "rgb(1, 86, 179)" }}
                  >
                    Export
                  </button>
                </div>
                <div className="form-group col-lg-1 col-md-12 mt-4">
                  <button
                    className="btn btn-sm cob-btn-primary"
                    // disabled={disable}
                    type="button"
                    onClick={() => {
                      dispatch(setKycMasked(!isKycMasked));
                    }}
                  >
                    <i
                      className={`fa ${
                        isKycMasked ? "fa-eye-slash" : "fa-eye"
                      } text-white pr-1`}
                    />
                    {isKycMasked ? "Unmask" : "Mask"}
                    {/* {loading ? "Downloading..." : "Export"} */}
                  </button>
                </div>
              </>
            )}
          </div>
          <div>
            <div className="scroll overflow-auto">
              <h6>Total Count : {dataCount}</h6>
              {!loadingState && data.length > 0 && (
                <Table
                  row={AssinedMerchantData}
                  data={data}
                  dataCount={dataCount}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  changeCurrentPage={changeCurrentPage}
                />
              )}
            </div>
            {loadingState && <SkeletonTable />}
            {data.length === 0 && !loadingState && (
              <h6 className="text-center font-weight-bold">No Data Found</h6>
            )}
          </div>
        </div>
      </main>
    </section>
  );
};

export default AssignedMerchant;
