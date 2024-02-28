import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { verifyKycEachTab, GetKycTabsStatus } from '../../../../slices/kycSlice';
import { toast } from "react-toastify";
import { rejectKycOperation } from "../../../../slices/kycOperationSlice"
import VerifyRejectBtn from './VerifyRejectBtn';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';


const BusinessOverview = (props) => {
  const { businessTypeResponse, businessCategoryResponse, KycTabStatus, platform, selectedUserData } = props;
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  let isVerified = KycTabStatus?.business_info_status === "Verified" ? true : false;
  let isRejected = KycTabStatus?.business_info_status === "Verified" ? true : false;

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
      value: businessTypeResponse,
      inputType: "text"
    },
    {
      className: "col-sm-6 col-md-6 col-lg-6",
      label: "Business Category",
      required: true,
      color: "red",
      value: businessCategoryResponse,
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
      value: platform,
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




  return (
    <div className="row p-1 mb-4 border">

      <h5 className="">Business Overview</h5>
      {formElements.map((element, index) => (
        <div className={`${element.className}`} key={uuidv4()}>
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
                  id="inputPassword3"
                  disabled="true"
                  cols={4}
                  rows={3}
                  value={element.value}
                ></textarea>
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
                id="inputPassword3"
                disabled="true"
                value={element.value}
              />
              {index < formElements.length - 1 && <div className='mb-3'></div>}
            </>


          )}
        </div>
      ))}


      {/* <div className="form-row g-3">
        <div className="col-sm-6 col-md-6 col-lg-6">
          <label className="">
            Business Type<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            disabled="true"
            value={businessTypeResponse}
          />
        </div>


        <div className="col-sm-6 col-md-6 col-lg-6">
          <label className="">
            Business Category<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            disabled="true"
            value={businessCategoryResponse}
          />
        </div>
      </div>

      <div className="form-row g-3">
        <div className="col-sm-6 col-md-6 col-lg-6">
          <label className="">
            Business Description <span style={{ color: "red" }}>*</span>
          </label>

          <textarea
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={
              selectedUserData?.billingLabel
            }
          >
          </textarea>
        </div>


        <div className="col-sm-6 col-md-6 col-lg-6">
          <label
            className="col-form-label p-0"
            style={{ marginTop: "15px" }}
          >
            Expected Transactions/Year{" "}
            <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={
              selectedUserData?.expectedTransactions
            }
          />
        </div>
      </div>

      <div className="form-row g-3">
        <div className="col-sm-3 col-md-3 col-lg-3">
          <label className="">
            Avg Ticket Amount<span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={
              selectedUserData?.avg_ticket_size
            }
          />
        </div>

        <div className="col-sm-3 col-md-3 col-lg-3">
          <label className="">
            Platform Type
          </label>

          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={platform}
          />
        </div>

        <div className="col-sm-6 col-md-6 col-lg-6">
          <label className="">
            {selectedUserData?.is_website_url === true ?
              <>
                Merchant wish to accept payments on :
                <textarea
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  cols={4}
                  rows={3}
                  value={
                    selectedUserData?.website_app_url
                  }
                ></textarea>
              </>
              :
              <p className="font-weight-bold text-danger">Merchant has accepted payments without any web/app</p>
            }
          </label>

        </div>
      </div> */}

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
