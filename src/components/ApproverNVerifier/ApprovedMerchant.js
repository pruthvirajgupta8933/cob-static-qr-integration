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
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import Table from "../../_components/table_components/table/Table";
import CustomLoader from "../../_components/loader";
import ViewDocumentModal from "./Onboarderchant/ViewDocumentModal";


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
  const [openDocumentModal, setOpenDocumentModal] = useState(false);


  const ApprovedTableData = [
    { id: "1", name: "S. No.", selector: (row) => row.sno, sortable: true },
    { id: "2", name: "Client Code", selector: (row) => row.clientCode },
    { id: "3", name: "Company Name", selector: (row) => row.companyName },
    {
      id: "4",
      name: "Merchant Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      id: "5",
      name: "Email",
      selector: (row) => row.emailId,
    },
    {
      id: "6",
      name: "Contact Number",
      selector: (row) => row.contactNumber,
    },
    {
      id: "7",
      name: "KYC Status",
      selector: (row) => row.status,
    },
    {
      id: "8",
      name: "Registered Date",
      selector: (row) => covertDate(row.signUpDate),
      sortable: true,
    },
    {
      id: "9",
      name: "Verified Date",
      selector: (row) => covertDate(row?.verified_date ? row?.verified_date : "NA"),
      sortable: true,
    },
    {
      id: "10",
      name: "Approved Date",
      selector: (row) => covertDate(row?.approved_date ? row?.approved_date : "NA"),
      sortable: true,
    },
    
    {
      id: "11",
      name: "Onboard Type",
      selector: (row) => row.isDirect,
    },
    {
      id: "12",
      name: "View Status",
      cell: (row) => (
        <div className="mt-2">
        <button
        type="button"
        className="btn approve text-white  btn-xs"
        onClick={() =>  {
          setKycIdClick(row); 
          setIsModalOpen(true) 
        }}
        data-toggle="modal"
        data-target="#kycmodaldetail"
      >
        View Status
      </button>
      </div>
      ),
    },
    {
      id: "13",
      name: "Action",
      cell: (row) => (
        <div className="mt-2">
      {roles?.verifier === true || roles?.approver === true || roles?.viewer === true ? (
                  <button
                  type="button"
                  className="btn approve text-white  btn-xs"
                  data-toggle="modal"
                  onClick={() => {
                    setCommentId(row)
                    setOpenDocumentModal(true)
          
                  }}
                  data-target="#exampleModal"
                  disabled={row?.clientCode === null ? true : false}
                >
                   Upload Agreement
                </button>
              ) : <></> }
        </div>
      ),
    },
  ];


  const loadingState = useSelector((state) => state.kyc.isLoadingForApproved);
  const dispatch = useDispatch();
  const roles = roleBasedAccess();
  // console.log("KKKKKKKKKKKKK",commentId);



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

      <div>
        {openDocumentModal === true ? <ViewDocumentModal documentData={commentId} isModalOpen={openDocumentModal} setModalState={setOpenDocumentModal} tabName={"Approved Tab"} /> : <></>}
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
            <Table 
            row={ApprovedTableData}
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
  );
}

export default ApprovedMerchant;