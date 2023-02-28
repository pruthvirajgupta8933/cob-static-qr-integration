import React, { useState, useEffect } from "react";
import { useDispatch , useSelector} from "react-redux";
import { kycForVerified } from "../../slices/kycSlice";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import toastConfig from "../../utilities/toastTypes";
import Spinner from "./Spinner";
import moment from "moment";
import CommentModal from "./Onboarderchant/CommentModal";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import { PendingApprovalData } from "../../utilities/tableData";
import Table from "../../_components/table_components/table/Table";
import Paginataion from "../../_components/table_components/pagination/Pagination";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";

function VerifiedMerchant() {
  const [data, setData] = useState([]);
  const [verfiedMerchant, setVerifiedMerchant] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [commentId, setCommentId] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [isOpenModal, setIsModalOpen] = useState(false)
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);

  const rowData =  PendingApprovalData;
  const loadingState = useSelector((state) => state.kyc.isLoadingForPendingApproval);
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab)
  const currenTab = parseInt(verifierApproverTab?.currenTab)
  


  // console.log(currenTab," Current Tab")
  const roles = roleBasedAccess();

  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  const verifyMerchant = () => {
    dispatch(kycForVerified({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setDataCount(dataCoun);
        setVerifiedMerchant(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  };


  const searchByText = () => {
    setData(
      verfiedMerchant?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
  };


  useEffect(() => {
    dispatch(kycForVerified({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");

        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setKycIdClick(data);
        setDataCount(dataCoun);
        setVerifiedMerchant(data);
      
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  
  
  
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



  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY");
      return date
    }


    const colData = () => {
      return (
        data?.map((user, i) => (
          <tr key={i}>
          <td>{i + 1}</td>
          <td>{user?.clientCode}</td>
          <td>{user?.companyName}</td>
          <td>{user?.name}</td>
          <td>{user?.emailId}</td>
          <td>{user?.contactNumber}</td>
          {/* <td>{user.status}</td> */}
          <td>{covertDate(user?.signUpDate)}</td>
          <td>{user?.verified_date === null  ? "NA" : covertDate(user?.verified_date)}</td>
          <td>{user?.isDirect}</td>
          <td>
          
            <button
              type="button"
              className="btn approve text-white  btn-xs"
              onClick={() => {setKycIdClick(user); setIsModalOpen(true) }}
              data-toggle="modal"
              data-target="#kycmodaldetail"
            >
             { roles?.approver === true && currenTab === 4 ?  "Approve KYC " : "View Status" } 
            </button>
          </td>
          {/* <td>{user?.comments}</td> */}
          <td>
            {roles?.verifier === true || roles?.approver === true || roles?.viewer === true ? (
              <button
                type="button"
                className="btn approve text-white  btn-xs"
                data-toggle="modal"
                onClick={() =>  {                           
                  setCommentId(user)
                  setOpenCommentModal(true)
                }}
                data-target="#exampleModal"
              disabled={user?.clientCode === null ? true : false}
              >
                 Comments
              </button>
            ) : (
              <></>
            )}
            
          </td>
      
        </tr>
        ))
  
  
      )
    }

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

      <div className="form-group col-lg-3 col-md-12 mt-2">
      <CountPerPageFilter
            pageSize={pageSize}
            dataCount={dataCount}
            changePageSize={changePageSize}
          />
      </div>
      {/* <KycDetailsModal kycId={kycIdClick} /> */}
      <div className="form-group col-lg-3 col-md-12 mt-2">
      <SearchbyDropDown
            kycSearch={kycSearch}
            searchText={searchText}
            isSearchByDropDown={isSearchByDropDown}
            notFilledData={verfiedMerchant}
            setData={setData}
            setSearchByDropDown={setSearchByDropDown}
            optionSearchData={optionSearchData}
          />
      </div>
      <MerchnatListExportToxl URL = {'?order_by=-merchantId&search=verified'} filename= {"Pending-Approval"}/>
      <div>
        
      {openCommentModal === true ?  
      <CommentModal commentData={commentId} isModalOpen={openCommentModal} setModalState={setOpenCommentModal} tabName={"Pending Approval"} /> 
      : <></>}
      
      {isOpenModal ? <KycDetailsModal kycId={kycIdClick} handleModal={setIsModalOpen}  isOpenModal={isOpenModal} renderPendingApproval={verifyMerchant}   /> : <></>}
           </div>
      <div className="container-fluid pull-left p-3- my-3- col-md-12- col-md-offset-4">
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
}

export default VerifiedMerchant;
