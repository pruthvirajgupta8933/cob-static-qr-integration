import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CustomModal from "../../../_components/custom_modal";
import {
  fetchChildDataList,
  getAllKycStatusData,
} from "../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import ReferralOnboardForm from "../../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/operation-kyc/ReferralOnboardForm/ReferralOnboardForm";
import Table from "../../../_components/table_components/table/Table";
import SearchFilter from "../../../_components/table_components/filters/SearchFilter";
import CountPerPageFilter from "../../../_components/table_components/filters/CountPerPage";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import { Link } from "react-router-dom";
import CustomLoader from "../../../_components/loader";
import { clientListExportApi } from "../../../services/approver-dashboard/merchantReferralOnboard.service";
import toastConfig from "../../../utilities/toastTypes";
import { stringEnc } from "../../../utilities/encodeDecode";
import moment from "moment";
import { saveAs } from "file-saver";
import Blob from "blob";
import { dateFormatBasic } from "../../../utilities/DateConvert";
import ReportLayout from "../../../utilities/CardLayout";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../../_components/formik/FormikController";
import { Form, Formik } from "formik";
import DocViewerComponent from "../../../utilities/DocViewerComponent";
import { kycDocumentUploadList } from "../../../slices/kycSlice";

function ClientList() {
  const convertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY hh:mm a");
    return date;
  };
  const { kyc } = useSelector((state) => state);
  const { KycDocUpload } = kyc;

  function capitalizeFirstLetter(param) {
    return param?.charAt(0).toUpperCase() + param?.slice(1);
  }
  const PasswordCell = ({ password }) => {
    const [visible, setVisible] = useState(false);
    const toggleVisibility = () => {
      setVisible((prevVisible) => !prevVisible);
    };

    return (
      <div className="removeWhiteSpace">
        {visible ? password : "*****"}
        <button className="btn btn-link" onClick={toggleVisibility}>
          {visible ? (
            <i className="fa fa-eye"></i>
          ) : (
            <i className="fa fa-eye-slash"></i>
          )}
        </button>
      </div>
    );
  };

  const [modalToggle, setModalToggle] = useState(false);
  const [docPreviewToggle, setDocPreviewToggle] = useState(false);
  const [docListModalToggle, setDocListModalToggle] = useState(false);
  const [modalToggleFormessage, setModalTogalforMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [kycStatus, setKycStatus] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState(null);

  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const [selectViewDoc, setSelectedViewDoc] = useState("#");

  const docModalToggle = (docData) => {
    setDocListModalToggle(false);
    setDocPreviewToggle(true);
    setSelectedViewDoc(docData);
  };
  const docListModal = (rowData) => {
    setSelectedUserData(rowData);


    setDocListModalToggle(true);
  };

  let history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllKycStatusData()).then((resp) => {
      const data = convertToFormikSelectJson(
        "value",
        "code",
        resp.payload.result
      );
      setKycStatus(data);
    });
  }, []);

  useEffect(() => {
    if (docListModalToggle && selectedUserData) {
      dispatch(kycDocumentUploadList({ login_id: selectedUserData?.loginMasterId }));
    }
  }, [docListModalToggle, selectedUserData, dispatch]);

  const RefrerChiledList = [
    {
      id: "1",
      name: "S.No",
      selector: (row) => row.s_no,
      sortable: true,
      width: "20px",
      cell: (row) => <div className="removeWhiteSpace">{row?.s_no}</div>,
    },

    {
      id: "76",
      key: "client_id",
      name: "Client ID",
      selector: (row) => row?.client_id,
      sortable: true,
      cell: (row) => <div className="removeWhiteSpace">{row?.client_id}</div>,
    },


    {
      id: "2",
      key: "client_code",
      name: "Client Code",
      selector: (row) => row?.client_code,
      sortable: true,
      cell: (row) => <div className="removeWhiteSpace">{row?.client_code}</div>,
    },



    {
      id: "3",
      key: "name",
      name: "Merchant Name",
      selector: (row) => row?.name,
      sortable: true,
      cell: (row) => (
        <div className="removeWhiteSpace">
          {capitalizeFirstLetter(row?.name ? row?.name : "NA")}
        </div>
      ),
      width: "200px",
    },

    {
      id: "75",
      key: "name",
      name: "Kyc Staus",
      selector: (row) => (row?.kyc_status ? row?.kyc_status : "NA"),
      sortable: true,
      cell: (row) => (
        <div className="removeWhiteSpace">
          {(row?.kyc_status)}
        </div>
      ),
      width: "200px",
    },

    {
      id: "34",
      name: "Mcc Code",
      selector: (row) => row?.mcc_code,
      cell: (row) => <div className="removeWhiteSpace">{row?.mcc_code || "NA"}</div>,
    },

    {
      id: "4",
      name: "Mobile Number",
      selector: (row) => row?.mobileNumber,
      cell: (row) => <div className="removeWhiteSpace">{row?.mobileNumber}</div>,
    },
    {
      id: "5",
      name: "Created Date",
      selector: (row) => row.createdDate,
      cell: (row) => (
        <div className="removeWhiteSpace">
          {dateFormatBasic(row?.createdDate)}
        </div>
      ),
      width: "180px",
    },

    {
      id: "6",
      key: "email",
      name: "Email",
      selector: (row) => row?.email,
      sortable: true,
      cell: (row) => <div className="removeWhiteSpace">{row?.email}</div>,
      width: "200px",
    },

    {
      id: "7",
      key: "username",
      name: "User Name",
      selector: (row) => row?.username,
      sortable: true,
      cell: (row) => <div className="removeWhiteSpace">{row?.username}</div>,
      width: "200px",
    },

    {
      id: "9",
      name: "Action",
      cell: (row) => (
        <div>
          <Link
            to={`kyc?kycid=${stringEnc(row?.loginMasterId)}`}
            type="button"
            className="approve text-white  cob-btn-primary   btn-sm"
            data-toggle="modal"
            onClick={() => {
              setModalTogalforMessage(true);
            }}
          >
            Edit Kyc
          </Link>
        </div>
      ),
      omit: user?.roleId === 3,
    },

    {
      id: "10",
      name: "Agreement Doc.",
      cell: (row) => (
        <div>
          <button
            type="button"
            className="approve text-white  cob-btn-primary   btn-sm"
            data-toggle="modal"
            onClick={() => docListModal(row)}
          >
            View Document
          </button>
        </div>
      ),
      omit: user?.roleId !== 3,
    },
  ];

  const exportToExcelFn = async () => {
    setLoading(true);
    setDisable(true);
    const roleType = roleBasedAccess();
    const type = roleType.bank
      ? "bank"
      : roleType.referral
        ? "referrer"
        : "default";

    clientListExportApi({ bank_login_id: user?.loginId, type })
      .then((res) => {
        if (res.status === 200) {
          const data = res?.data;
          setLoading(false);
          setDisable(false);
          const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, `Client-List-Report.xlsx`);
        }
      })
      .catch((err) => {
        if (err.response?.status === 500) {
          toastConfig.errorToast("Something went wrong.");
        }
        setLoading(false);
        setDisable(false);
      });
  };

  const refrerDataList = useSelector(
    (state) => state.merchantReferralOnboardReducer.refrerChiledList.resp
  );

  const loadingState = useSelector(
    (state) => state.merchantReferralOnboardReducer.isLoading
  );

  const [clientListData, setClientListData] = useState([]);
  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState("");

  useEffect(() => {
    const chiledReferList = refrerDataList?.results;
    const dataCount = refrerDataList?.count;

    if (chiledReferList) {
      setData(chiledReferList);
      setClientListData(chiledReferList);
      setDataCount(dataCount);
    }
  }, [refrerDataList]);

  const kycSearch = (e, fieldType) => {
    if (fieldType === "text") {
      setSearchByDropDown(false);
      setSearchText(e);
    }
    if (fieldType === "dropdown") {
      setSearchByDropDown(true);
    }
  };
  const searchByText = (text) => {
    setData(
      clientListData?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = (kycStatusValue) => {
    const roleType = roleBasedAccess();
    const type = roleType.bank
      ? "bank"
      : roleType.referral
        ? "referrer"
        : "default";
    let postObj = {
      page: currentPage,
      page_size: pageSize,
      type: type,
      login_id: user?.loginId,
    };

    if (kycStatusValue) {
      postObj.kyc_status = kycStatusValue;
    }

    dispatch(fetchChildDataList(postObj));
  };

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
    setCurrentPage(1);
  };

  const modalBody = () => {
    return <ReferralOnboardForm referralChild={true} fetchData={fetchData} />;
  };

  const modalBodyForMessage = () => {
    return (
      <div>
        <h6>
          To complete the KYC process, please use the provided username and
          password to log in to the partner dashboard. Once logged in, proceed
          with the KYC verification.
        </h6>
      </div>
    );
  };

  const docListModalBody = () => {
    return (
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Merchant Document</th>

            </tr>
          </thead>
          <tbody>
            {KycDocUpload?.length > 0 ? (
              KycDocUpload.map((doc, i) => (
                <tr key={doc.documentId}>
                  <td>{i + 1}</td>
                  <td>
                    <p className="text-wrap mb-1">
                      <span className="font-weight-bold">Doc.Type:</span>{" "}
                      {doc.doc_type_name}
                    </p>
                    <p>
                      <span className="font-weight-bold">Doc.Status:</span>{" "}
                      {doc.status}
                    </p>
                    <p
                      className="text-primary cursor_pointer text-decoration-underline"
                      rel="noreferrer"
                      onClick={() => docModalToggle(doc)}
                    >
                      View Document
                    </p>
                  </td>


                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No documents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <ReportLayout title="Merchant List">
      <div className="d-flex justify-content-between">
        {user?.roleId === 13 && user.loginId !== 27458 && (
          <div className="col-lg-2 col-md-3 col-sm-4 mb-md-0">
            <button
              className="btn btn-sm cob-btn-primary w-100"
              onClick={() => setModalToggle(true)}
            >
              Add Child Client
            </button>
          </div>
        )}
      </div>
      {docPreviewToggle && (
        <DocViewerComponent
          modalToggle={docPreviewToggle}
          fnSetModalToggle={setDocListModalToggle}
          setDocPreviewToggle={setDocPreviewToggle}

          selectViewDoc={{
            documentUrl: selectViewDoc?.filePath,
            documentName: selectViewDoc?.doc_type_name,
          }}



        />
      )}

      <section className="">
        <div className="container-fluid p-0">
          <div className="row mt-4 align-items-end">
            <div className="col-lg-3 col-md-3 col-sm-4 mb-3 mb-md-0">
              <SearchFilter
                kycSearch={kycSearch}
                searchText={searchText}
                searchByText={searchByText}
                setSearchByDropDown={setSearchByDropDown}
              />
            </div>
            <div className="col-lg-3 col-md-3 col-sm-4 mb-3 mb-md-0">
              <CountPerPageFilter
                pageSize={pageSize}
                dataCount={dataCount}
                changePageSize={changePageSize}
                changeCurrentPage={changeCurrentPage}
              />
            </div>
            <div className="col-lg-3 col-md-3 col-sm-4 mb-3 mb-md-0">
              <Formik
                initialValues={{ status: "" }}
                onSubmit={(values) => {
                  fetchData(values.status);
                }}
              >
                {({ setFieldValue }) => (
                  <Form>
                    <FormikController
                      control="select"
                      name="status"
                      options={kycStatus}
                      label="Kyc Status"
                      className="form-select"
                      onChange={(e) => {
                        setFieldValue("status", e.target.value);
                        fetchData(e.target.value);
                      }}
                    />
                  </Form>
                )}
              </Formik>
            </div>
            <div className="col-lg-1 col-md-3 col-sm-4 mb-2 mb-md-0">
              {data.length > 0 && (
                <button
                  className="btn btn-sm cob-btn-primary"
                  type="button"
                  disabled={disable}
                  onClick={() => exportToExcelFn()}
                >
                  <i className="fa fa-download" />{" "}
                  {loading ? "Downloading..." : "Export"}
                </button>
              )}
            </div>
          </div>

          {!loadingState && data?.length !== 0 && (
            <>
              <div className="col-lg-12 mt-5 mb-2 pl-0 d-flex justify-content-between">
                <h6>Total Count: {dataCount}</h6>
              </div>
              <Table
                row={RefrerChiledList}
                dataCount={dataCount}
                pageSize={pageSize}
                currentPage={currentPage}
                changeCurrentPage={changeCurrentPage}
                data={data}
              />
            </>
          )}

          {!loadingState && data?.length === 0 && (
            <div className="col-lg-12 mt-5 text-center">
              <h6>No data found</h6>
            </div>
          )}

          <CustomLoader loadingState={loadingState} />
        </div>
      </section>

      <CustomModal
        headerTitle={"Add Child Client"}
        modalBody={modalBody}
        modalToggle={modalToggle}
        fnSetModalToggle={() => setModalToggle(false)}
      />

      <CustomModal
        headerTitle={"View Document"}
        modalBody={docListModalBody}
        modalToggle={docListModalToggle}
        fnSetModalToggle={() => setDocListModalToggle(false)}
        size="lg"
      />

      <CustomModal
        headerTitle={"Message"}
        modalBody={modalBodyForMessage}
        modalToggle={modalToggleFormessage}
        fnSetModalToggle={() => setModalTogalforMessage(false)}
      />
    </ReportLayout>
  );
}

export default ClientList;