import React, { useEffect, useState } from "react";
import { useDispatch , useSelector} from "react-redux";
import { kycForRejectedMerchants } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import Spinner from "./Spinner";
import moment from "moment";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import CommentModal from "./Onboarderchant/CommentModal";
import { PendingVerificationData } from "../../utilities/tableData";
import Paginataion from "../../_components/table_components/pagination/Pagination";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import Table from "../../_components/table_components/table/Table";

const RejectedKYC = () => {
  const roles = roleBasedAccess();
  const loadingState = useSelector((state) => state.kyc.isLoadingForRejected);
  const rowData =  PendingVerificationData;

  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [kycIdClick, setKycIdClick] = useState(null);
  const [rejectedMerchants, setRejectedMerchants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [commentId, setCommentId] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);

  const dispatch = useDispatch();


  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };
  
  const kycForRejectedMerchnats = () => {
    dispatch(
      kycForRejectedMerchants({ page: currentPage, page_size: pageSize })
    )
      .then((resp) => {
        resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");
        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setKycIdClick(data);
        setDataCount(dataCoun);
        setRejectedMerchants(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  };
 
  useEffect(() => {
    kycForRejectedMerchnats();
  }, [currentPage, pageSize]);


 

 
    
  const searchByText = () => {
    setData(
      rejectedMerchants?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
  };


  const colData = () => {
    return (
      data?.map((user, i) => (
        <tr key={i}>
        <td>{i + 1}</td>
        <td>{user.clientCode}</td>
        <td>{user.companyName}</td>
        <td>{user.name}</td>
        <td>{user.emailId}</td>
        <td>{user.contactNumber}</td>
        <td>{user.status}</td>
        <td>{covertDate(user.signUpDate)}</td>
        <td>{user?.isDirect}</td>
        <td>
          <button
            type="button"
            className="btn approve text-white  btn-xs"
            onClick={() => {
              setKycIdClick(user);
              setIsModalOpen(true);
            }}
            data-toggle="modal"
            data-target="#kycmodaldetail"
          >
            View Status
          </button>
        </td>
        <td>
          {roles?.verifier === true ||
          roles?.approver === true ||
          roles?.viewer === true ? (
            <button
              type="button"
              className="btn approve text-white  btn-xs"
              data-toggle="modal"
              onClick={() => {
                setCommentId(user);
                setOpenCommentModal(true);
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
      name: "online",
      value: "online",
    },
    {
      name: "Offline",
      value: "offline",
    },
  ];



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
        <div className="form-group col-lg-3 col-md-12 mt-2">
        <SearchFilter
            kycSearch={kycSearch}
            searchText={searchText}
            searchByText={searchByText}
            setSearchByDropDown={setSearchByDropDown}
          />
        </div>
        {openCommentModal === true ? (
          <CommentModal
            commentData={commentId}
            isModalOpen={openCommentModal}
            setModalState={setOpenCommentModal}
            tabName={"Approved Tab"}
          />
        ) : (
          <></>
        )}
        <div>
          <KycDetailsModal
            kycId={kycIdClick}
            handleModal={setIsModalOpen}
            isOpenModal={isOpenModal}
            renderToPendingKyc={kycForRejectedMerchnats}
          />
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
            notFilledData={rejectedMerchants}
            setData={setData}
            setSearchByDropDown={setSearchByDropDown}
            optionSearchData={optionSearchData}
          />
        </div>
        <MerchnatListExportToxl
          URL={"?order_by=-merchantId&search=Rejected"}
          filename={"Rejected"}
        />
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

export default RejectedKYC;
