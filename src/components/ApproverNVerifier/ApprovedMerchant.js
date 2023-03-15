/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch , useSelector} from "react-redux";
import { kycForApproved } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import Spinner from "./Spinner";
import moment from "moment";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import CommentModal from "./Onboarderchant/CommentModal";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import { ApprovedTableData } from "../../utilities/tableData";
import Paginataion from "../../_components/table_components/pagination/Pagination";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import Table from "../../_components/table_components/table/Table";
import CustomLoader from "../../_components/loader";


function ApprovedMerchant() {

  const [data, setData] = useState([]);
  const [approvedMerchantData, setApprovedMerchantData] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [commentId, setCommentId] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [isOpenModal, setIsModalOpen] = useState(false)
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);

  const rowData = ApprovedTableData;
  const loadingState = useSelector((state) => state.kyc.isLoadingForApproved);
  const dispatch = useDispatch();
  const roles = roleBasedAccess();



  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  useEffect(() => {
   
    dispatch(kycForApproved({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");
        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
         setDataCount(dataCoun);
         setApprovedMerchantData(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize]);

  /////////////////////////////////////Search filter

// Only used for refreshing the page by passing it to the props
  const approvedTable = () => {
    dispatch(kycForApproved({ page: currentPage, page_size: pageSize }))
    .then((resp) => {
      resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");
      const data = resp?.payload?.results;
      const dataCoun = resp?.payload?.count;
      setData(data);
       setDataCount(dataCoun);
       setApprovedMerchantData(data);
    })

    .catch((err) => {
      toastConfig.errorToast("Data not loaded");
    });
  }


  const searchByText = () => {
    setData(
      approvedMerchantData?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
  };



  // const viewDocument = async (loginMaidsterId) => {
  //   const res = await axiosInstanceJWT
  //     .post(API_URL.DOCUMENT_BY_LOGINID, {
  //       login_id: loginMaidsterId,
  //     })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         const data = res.data;
  //         // setDocImageData(data);
  //         const docId = data[0].documentId;
  //         const file = data[0].filePath;
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Please try again after sometimes.", error);
  //     });
  // };

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY");
      return date
    }


      //function for change current page
  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

   //function for change page size
   const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };
  
    
  const optionSearchData = [
    {
      name: "Select Onboard Type",
      value: "",
    },
    {
      name: "All",
      value: "",
    },
    {
      name: "Online",
      value: "online",
    },
    {
      name: "Offline",
      value: "offline",
    },
  ];


 
    const colData = () => {
      return (
        <>
          {data == [] ? (
            <td colSpan={"11"}>
              {" "}
              <div className="nodatafound text-center">No data found </div>
            </td>
          ) : (
            data?.map((user, i) => (
              <tr key={i}>
              <td>{i + 1}</td>
              <td>{user?.clientCode}</td>
              <td>{user?.companyName}</td>
              <td>{user?.name}</td>
              <td>{user?.emailId}</td>
              <td>{user?.contactNumber}</td>
              <td>{user?.status}</td>
              <td>{covertDate(user.signUpDate)}</td>
              <td>{user?.verified_date === null ? "NA" : covertDate(user?.verified_date)}</td>
              <td>{covertDate(user?.approved_date)}</td>
              <td>{user?.isDirect}</td>
              <td>
               
                
                <button
                    type="button"
                    className="btn approve text-white  btn-xs"
                    onClick={() =>  {setKycIdClick(user); setIsModalOpen(true) }}
                    data-toggle="modal"
                    data-target="#kycmodaldetail"
                  >
                    View Status
                  </button>
                  </td>
                  <td>
              {roles?.verifier === true || roles?.approver === true || roles?.viewer === true ? (
                  <button
                  type="button"
                  className="btn approve text-white  btn-xs"
                  data-toggle="modal"
                  onClick={() => {
                    setCommentId(user)
                    setOpenCommentModal(true)
          
                  }}
                  data-target="#exampleModal"
                  disabled={user?.clientCode === null ? true : false}
                >
                   Comments
                </button>
              ) : <></> }
              </td>
                      
            </tr>
            ))
          )}
        </>
      );
    };

  return (
    <div className="container-fluid flleft">
      <div className="form-group col-lg-3 col-md-12 mt-2">
      <SearchFilter
            kycSearch={kycSearch}
            searchText={searchText}
            searchByText={searchByText}
            setSearchByDropDown={setSearchByDropDown}
          />
      </div>
      <div>

      {openCommentModal === true ? <CommentModal commentData={commentId} isModalOpen={openCommentModal} setModalState={setOpenCommentModal} tabName={"Approved Tab"} /> : <></>}
          
          <KycDetailsModal kycId={kycIdClick} handleModal={setIsModalOpen}  isOpenModal={isOpenModal} renderApprovedTable={approvedTable}/>
        </div>
      <div className="form-group col-lg-3 col-md-12 mt-2">
      <CountPerPageFilter
            pageSize={pageSize}
            dataCount={dataCount}
            changePageSize={changePageSize}
          />
      </div>
      <div className="form-group col-lg-3 col-md-12 mt-2">
      <SearchbyDropDown
            kycSearch={kycSearch}
            searchText={searchText}
            isSearchByDropDown={isSearchByDropDown}
            notFilledData={approvedMerchantData}
            setData={setData}
            setSearchByDropDown={setSearchByDropDown}
            optionSearchData={optionSearchData}
          />
      </div>
      <MerchnatListExportToxl URL = {'?search=Approved&order_by=-approved_date&search_map=approved_date'} filename={"Approved"} />
      <div className="container-fluid flleft p-3 my-3 col-md-12- col-md-offset-4">
        <div className="scroll overflow-auto">

        {!loadingState && data?.length !== 0 && (
            <Table row={rowData} col={colData}
            dataCount={dataCount}
            pageSize={pageSize}
            currentPage={currentPage}
            changeCurrentPage={changeCurrentPage} />
          )}
        </div>
        <CustomLoader loadingState={loadingState} />
        {data?.length == 0 && !loadingState && (
          <h2 className="text-center font-weight-bold">No Data Found</h2>
        )}
      </div>
    </div>
  );
}

export default ApprovedMerchant;