import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForNotFilled } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import Spinner from "./Spinner";
import moment from "moment";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import Table from "../../_components/table_components/Table";
import { NotFilledKYCData } from "../../utilities/tableData";
import Paginataion from "../../_components/table_components/Pagination";
// import Pagination from "../../_components/reuseable_components/PaginationForKyc";

const rowData = NotFilledKYCData;
const NotFilledKYC = () => {
  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [notFilledData, setNotFilledData] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);

  const dispatch = useDispatch();
  const loadingState = useSelector((state) => state.kyc.isLoading);
  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e.target.value);
  };

  //Map the table data
  const colData = () => {
    return (
      <>
        {data == []  ? (
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
        setSpinner(false);
        setDataCount(totalData);
        setNotFilledData(data);
        setData(data);
        setIsLoaded(false);
        // console.log("Paginataion Dta ===> ",notFilledData)
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize, dispatch,searchText]);

  //------- KYC NOT FILLED SEARCH FILTER ------------//
  useEffect(() => {
    if (searchText?.length > 0) {
      // search by dropdwon
      if (isSearchByDropDown && searchText !== "") {
        let filter = {
          isDirect: searchText,
        };

        let refData = notFilledData;

        refData = refData.filter(function(item) {
          for (let key in filter) {
            if (item[key] === undefined || item[key] !== filter[key]) {
              return false;
            }
          }
          return true;
        });
        setData(refData);
        console.log("search by dropdown");
      } else {
        // search by text
        setData(
          notFilledData?.filter((item) =>
            Object.values(item)
              .join(" ")
              .toLowerCase()
              .includes(searchText?.toLocaleLowerCase())
          )
        );
        console.log("search by text");
      }
    } else {
      setData(notFilledData);
    }

    setSearchByDropDown(false);
  }, [searchText]);
  const totalPages = Math.ceil(dataCount / pageSize);
  let pageNumbers = [];
  if (!Number.isNaN(totalPages)) {
    pageNumbers = [...Array(Math.max(0, totalPages + 1)).keys()].slice(1);
  }

  const nextPage = () => {
    setIsLoaded(true);
    setData([]);
    if (currentPage < pageNumbers?.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    setIsLoaded(true);
    setData([]);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    let lastSevenPage = totalPages - 7;
    if (pageNumbers?.length > 0) {
      let start = 0;
      let end = currentPage + 6;
      if (totalPages > 6) {
        start = currentPage - 1;

        if (parseInt(lastSevenPage) <= parseInt(start)) {
          start = lastSevenPage;
        }
      }
      const pageNumber = pageNumbers.slice(start, end)?.map((pgNumber, i) => {
        return pgNumber;
      });
      setDisplayPageNumber(pageNumber);
    }
  }, [currentPage, totalPages]);

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY");
    return date;
  };

  return (
    <div className="container-fluid flleft">
      <div className="form-row">
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <label>Search</label>
          <input
            className="form-control"
            onChange={(e) => kycSearch(e, "text")}
            type="text"
            placeholder="Search Here"
          />
        </div>

        <div className="form-group col-lg-3 col-md-12 mt-2">
          <label>Count Per Page</label>
          <select
            value={pageSize}
            rel={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
            className="ant-input"
          >
            <DropDownCountPerPage datalength={dataCount} />
          </select>
        </div>
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <label>Onboard Type</label>
          <select
            className="ant-input"
            onChange={(e) => kycSearch(e, "dropdown")}
          >
            <option value="">Select Onboard Type</option>
            <option value="">All</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
        <MerchnatListExportToxl
          URL={"?order_by=-merchantId&search=Not-Filled"}
          filename={"Not-Filled-KYC"}
        />
      </div>

      <div className="col-md-12 col-md-offset-4">
        <div className="scroll overflow-auto">
 
          {loadingState ? (
            <p className="text-center spinner-roll">{<Spinner />}</p>
          ):
          <Table row={rowData} col={colData} />} 
        </div>
        <nav>
     {/* <Paginataion/> */}
          <ul className="pagination justify-content-center">
            {isLoaded === true ? (
              <Spinner />
            ) : (
              <li className="page-item">
                <button className="page-link" onClick={prevPage}>
                  Previous
                </button>
              </li>
            )}

            {displayPageNumber?.map((pgNumber, i) => (
              <li
                key={i}
                className={
                  pgNumber === currentPage ? " page-item active" : "page-item"
                }
                onClick={() => setCurrentPage(pgNumber)}
              >
                <a href={() => false} className={`page-link data_${i}`}>
                  <span>{pgNumber}</span>
                </a>
              </li>
            ))}

            {isLoaded === true ? (
              <Spinner />
            ) : (
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={nextPage}
                  disabled={
                    currentPage === pageNumbers[pageNumbers?.length - 1]
                  }
                >
                  Next
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NotFilledKYC;
