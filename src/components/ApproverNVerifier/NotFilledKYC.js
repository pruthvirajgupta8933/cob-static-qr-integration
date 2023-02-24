import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForNotFilled } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import Spinner from "./Spinner";
import moment from "moment";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import Table from "../../_components/table_components/table/Table";
import { NotFilledKYCData } from "../../utilities/tableData";
import Paginataion from "../../_components/table_components/pagination/Pagination";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
// import Pagination from "../../_components/reuseable_components/PaginationForKyc";

const rowData = NotFilledKYCData;
const NotFilledKYC = () => {
  const [data, setData] = useState([]);
  const [notFilledData, setNotFilledData] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);

  const dispatch = useDispatch();
  const loadingState = useSelector((state) => state.kyc.isLoading);
  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  //Map the table data
  const colData = () => {
    return (
      <>
        {data == [] ? (
          <td colSpan={"11"}>
            {" "}
            <div className="nodatafound text-center">No data found </div>
          </td>
        ) : (
          data?.map((data, key) => (
            <tr>
              <td>{key + 1}</td>
              <td>{data.clientCode}</td>
              <td>{data.name}</td>
              <td>{data.emailId}</td>
              <td>{data.contactNumber}</td>
              <td>{data.status}</td>
              <td> {covertDate(data.signUpDate)}</td>
              <td>{data?.isDirect}</td>
            </tr>
          ))
        )}
      </>
    );
  };

  useEffect(() => {
    dispatch(kycForNotFilled({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");
        const data = resp?.payload?.results;
        const totalData = resp?.payload?.count;
        setDataCount(totalData);
        setNotFilledData(data);
        setData(data);
        // console.log("Paginataion Dta ===> ",notFilledData)
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize, dispatch]);


  const searchByText=()=>
  {
    setData(
      notFilledData?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      ))

  }

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY");
    return date;
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
    <div className="container-fluid flleft">
      <div className="form-row">
        <div className="form-group col-lg-6 col-md-12 mt-2">
          <SearchFilter kycSearch={kycSearch} searchText={searchText} isSearchByDropDown={isSearchByDropDown} notFilledData={notFilledData} searchByText={searchByText} setData={setData} setSearchByDropDown={setSearchByDropDown} />
        </div>
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <CountPerPageFilter
            pageSize={pageSize}
            dataCount={dataCount}
            changePageSize={changePageSize}
          />
        </div>
      <div className="mt-1">
        <MerchnatListExportToxl
          URL={"?order_by=-merchantId&search=Not-Filled"}
          filename={"Not-Filled-KYC"}
        />
      </div>
      </div>

      <div className="col-md-12 col-md-offset-4">
        <div className="scroll overflow-auto">
          {loadingState ? (
            <p className="text-center spinner-roll">{<Spinner />}</p>
          ) : (
            <Table row={rowData} col={colData} />
          )}
        </div>
        <nav>
          <Paginataion
            dataCount={dataCount}
            pageSize={pageSize}
            currentPage={currentPage}
            changeCurrentPage={changeCurrentPage}
          />
        </nav>
      </div>
    </div>
  );
};

export default NotFilledKYC;
