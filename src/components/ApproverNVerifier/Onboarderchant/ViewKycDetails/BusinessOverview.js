import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { verifyKycEachTab, GetKycTabsStatus } from '../../../../slices/kycSlice';
import { toast } from "react-toastify";
import { rejectKycOperation } from "../../../../slices/kycOperationSlice"
import VerifyRejectBtn from './VerifyRejectBtn';
// import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { KYC_STATUS_REJECTED, KYC_STATUS_VERIFIED } from '../../../../utilities/enums';
import CustomModal from '../../../../_components/custom_modal';
import Table from '../../../../_components/table_components/table/Table';


const BusinessOverview = (props) => {
  const { KycTabStatus, selectedUserData } = props;

  const dispatch = useDispatch();
  const { auth, kyc } = useSelector((state) => state);
  const { merchantWhitelistWebsite } = kyc

  const [customModal, setCustomModal] = useState(false);

  const { kycUserList } = useSelector(state => state?.kyc || {});
  let isVerified = KycTabStatus?.general_info_status?.toString()?.toLocaleLowerCase() === KYC_STATUS_VERIFIED?.toString()?.toLocaleLowerCase() ? true : false;
  let isRejected = KycTabStatus?.general_info_status?.toString()?.toLocaleLowerCase() === KYC_STATUS_REJECTED?.toString()?.toLocaleLowerCase() ? true : false;

  let commentsStatus = KycTabStatus.business_info_reject_comments;




  const { user } = auth;
  const { loginId } = user;





  const handleVerifyClick = async () => {
    try {
      const verifierDetails = {
        login_id: selectedUserData.loginMasterId,
        business_info_verified_by: loginId,
      };

      const resp = await dispatch(verifyKycEachTab(verifierDetails));

      if (resp?.payload?.business_info_status) {
        toast.success(resp.payload.business_info_status);
      } else if (resp?.payload?.detail) {
        toast.error(resp.payload.detail);
      }
    } catch (error) {
      toast.error("Try Again Network Error");
    }
  };



  const handleRejectClick = async (business_info_reject_comments = "") => {
    const rejectDetails = {
      login_id: selectedUserData.loginMasterId,
      business_info_rejected_by: loginId,
      business_info_reject_comments: business_info_reject_comments,
    };

    if (window.confirm("Reject Business Overview?")) {
      try {
        const resp = await dispatch(rejectKycOperation(rejectDetails));

        if (resp?.payload?.merchant_info_status) {
          toast.success(resp.payload.business_info_status);
        } else if (resp?.payload) {
          toast.error(resp.payload);
        }

        dispatch(GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId })); // Used to remove kyc button because updated in redux store
      } catch (error) {
        toast.error("Try Again Network Error");
      }
    }
  };
  const formElements = [
    {
      className: "col-sm-6 col-md-6 col-lg-6",
      label: "Business Type",
      required: true,
      color: "red",
      value: kycUserList?.business_type_name,
      inputType: "text"
    },
    {
      className: "col-sm-6 col-md-6 col-lg-6",
      label: "Business Category",
      required: true,
      color: "red",
      value: kycUserList?.business_category_name,
      inputType: "text"
    },
    {
      className: "col-sm-6 col-md-6 col-lg-6",
      label: "Business Description",
      required: true,
      color: "red",
      value: selectedUserData?.billingLabel,
      inputType: "textarea"
    },
    {
      className: "col-sm-6 col-md-6 col-lg-6",
      label: "Expected Transactions/Year",
      required: true,
      color: "red",
      value: selectedUserData?.expectedTransactions,
      inputType: "text"
    },
    {
      className: "col-sm-3 col-md-3 col-lg-3",
      label: "Avg Ticket Amount",
      required: true,
      color: "red",
      value: selectedUserData?.avg_ticket_size,
      inputType: "text"
    },
    {
      className: "col-sm-3 col-md-3 col-lg-3",
      label: "Platform Type",
      required: false,            // mandotry stars
      color: "",
      value: kycUserList?.platform_name,
      inputType: "text"
    },
    {
      className: "col-sm-6 col-md-6 col-lg-6",
      label: "Merchant wish to accept payments on:",
      required: false,
      color: "red",
      value: selectedUserData?.website_app_url,
      inputType: "textarea",
      isConditional: true,
      conditionalMessage: "Merchant has accepted payments without any web/app"
    }
  ];

  // console.log(selectedUserData?.website_app_url)

  const listRow = [
    {
      id: "1",
      name: "URL",
      selector: (row) => row.clientName,
      sortable: true,
      // width: "170px"
    },
    {
      id: "2",
      name: "Status",
      cell: (row) => <div className="removeWhiteSpace">{row?.clientId === 1 ? "Active" : "Inactive"}</div>,
      width: "130px",
    },
    {
      id: "3",
      name: "Client Code",
      selector: (row) => row.clientCode,
      sortable: true,

    },
  ]

  const modalBody = () => {
    return (
      <div className="scroll overflow-auto">
        <Table
          row={listRow}
          data={merchantWhitelistWebsite}
        />
      </div>

    )


  }


  return (
    <div className="row p-1 mb-4 border">

      <h6>Business Overview</h6>
      {formElements.map((element, index) => (
        <div className={`${element.className} mb-3`} key={uuidv4()}>
          {element.inputType === "textarea" && element.isConditional ? (
            selectedUserData?.is_website_url === true ? (
              <div>
                <label className="">
                  {element.label}{" "}
                  {element.required && <span style={{ color: element.color }}>*</span>}
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  disabled="true"
                  cols={4}
                  rows={3}
                  value={element.value}
                ></textarea>

                <button className="btn btn-sm cob-btn-primary my-3" onClick={() => setCustomModal(true)}>View Website Whitelist status</button>

                {customModal && <CustomModal
                  modalBody={modalBody}
                  headerTitle={"Website Whitelist"}
                  modalToggle={customModal}
                  fnSetModalToggle={setCustomModal}
                />}
              </div>

            ) : (
              <div className={element.className}>
                <p className="font-weight-bold text-danger">
                  {element.conditionalMessage}
                </p>
              </div>
            )
          ) : (
            <>
              <label className="">
                {element.label}{" "}
                {element.required && <span style={{ color: element.color }}>*</span>}
              </label>
              <input
                type={element.inputType}
                className="form-control "
                disabled="true"
                value={element.value}
              />

            </>



          )}
        </div>


      ))}


      <div className="form-row g-3">
        <div className="col-lg-6 font-weight-bold ">
          <p className='m-0'>Status : <span>{KycTabStatus?.business_info_status}</span></p>
          <p className='m-0'>Comments : <span>{KycTabStatus?.business_info_reject_comments}</span></p>
        </div>

        <div className="col-lg-6">
          <VerifyRejectBtn
            KycTabStatus={KycTabStatus?.business_info_status}
            ContactComments={commentsStatus}
            KycVerifyStatus={{ handleVerifyClick, isVerified }}
            KycRejectStatus={{ handleRejectClick, isRejected }}
            btnText={{ verify: "Verify", Reject: "Reject" }}
          />
        </div>
      </div>

    </div>

  )
}

export default BusinessOverview
