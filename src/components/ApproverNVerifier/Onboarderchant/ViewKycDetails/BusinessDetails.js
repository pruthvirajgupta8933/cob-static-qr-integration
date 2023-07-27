import React from 'react'
import { verifyKycEachTab } from "../../../../slices/kycSlice"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { rejectKycOperation } from '../../../../slices/kycOperationSlice';
import VerifyRejectBtn from './VerifyRejectBtn';
import { GetKycTabsStatus } from '../../../../slices/kycSlice';
const BusinessDetails = (props) => {
  const { merchantKycId, KycTabStatus } = props;
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const { user } = auth;
  const { loginId } = user;


  const handleVerifyClick = () => {

    const veriferDetails = {
      login_id: merchantKycId.loginMasterId,
      merchant_info_verified_by: loginId,
    };
    dispatch(verifyKycEachTab(veriferDetails))
      .then((resp) => {
        resp?.payload?.merchant_info_status &&
          toast.success(resp?.payload?.merchant_info_status);
        resp?.payload?.detail && toast.error(resp?.payload?.detail);
      })
      .catch((e) => {
        toast.error("Try Again Network Error");
      });

  }

  const handleRejectClick = (merchant_info_reject_comments = "") => {
    const rejectDetails = {
      login_id: merchantKycId.loginMasterId,
      merchant_info_rejected_by: loginId,
      merchant_info_reject_comments: merchant_info_reject_comments


    };
    if (window.confirm("Reject Business Details")) {
      dispatch(rejectKycOperation(rejectDetails))
        .then((resp) => {
          resp?.payload?.merchant_info_status &&
            toast.success(resp?.payload?.merchant_info_status);
          resp?.payload && toast.error(resp?.payload);
          dispatch(GetKycTabsStatus({ login_id: merchantKycId?.loginMasterId })) // used to remove kyc button beacuse updated in redux store
        })
        .catch((e) => {
          toast.error("Try Again Network Error");
        });
    }

  }

  // console.log("merchantKycId",merchantKycId)

  return (
    <div className="row mb-4 border p-1">
      <h5 className="">Business Details</h5>

      <div className="form-row g-3">
        <div className="col-sm-12 col-md-6 col-lg-6">

          <label className="">
            GSTIN<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className={`form-control ${merchantKycId?.registerdWithGST ? "bg-default" : "bg-warning"}`}
            id="inputPassword3"
            disabled="true"
            value={
              merchantKycId?.registerdWithGST ? merchantKycId?.gstNumber : "Merchant does not have GSTIN"
            }
          />
          <span>
            {merchantKycId?.gstNumber === null || merchantKycId?.gstNumber === "" ? (
              <p className="text-danger"> Not Verified</p>
            ) : (
              <p className="text-success">Verified</p>
            )}
          </span>
        </div>
        <div className="col-sm-12 col-md-3 col-lg-3">
          <label className="">
            Business PAN<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={merchantKycId?.panCard}
          />
        </div>
        <div className="col-sm-12 col-md-3 col-lg-3">
          <label className="">
            Authorized Signatory PAN
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={
              merchantKycId?.signatoryPAN
            }
          />
          <span>
            {merchantKycId?.signatoryPAN === null || merchantKycId?.signatoryPAN === "" ? (
              <p className="text-danger"> Not Verified</p>
            ) : (
              <p className="text-success">Verified</p>
            )}
          </span>
        </div>
      </div>

      <div className="form-row g-3">
        <div className="col-sm-12 col-md-6 col-lg-6">

          <div className="accordion accordion-flush" id="accordionFlushExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="flush-headingOne">
                <button className="accordion-button collapsed p-0" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                  <p className="fs-6">Udyam Aadhar Details</p>
                </button>
              </h2>
              <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                <div className="accordion-body p-0">
                {merchantKycId?.is_udyam ? <ul className="list-group">
                    <li className="list-group-item">Reg. Number : {merchantKycId?.udyam_data?.reg_number}</li>
                    <li className="list-group-item">entity : {merchantKycId?.udyam_data?.entity}</li>
                    <li className="list-group-item">type : {merchantKycId?.udyam_data?.type}</li>
                    <li className="list-group-item">incorporated_date : {merchantKycId?.udyam_data?.incorporated_date}</li>
                    <li className="list-group-item">commenced_date : {merchantKycId?.udyam_data?.commenced_date}</li>
                    <li className="list-group-item">registered_date : {merchantKycId?.udyam_data?.registered_date}</li>
                  </ul> : <p>Udyam number not available</p>}
                  
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <label className="">
            Business Name<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={
              merchantKycId?.companyName ? merchantKycId?.companyName : ""
            }
          />
        </div>
      </div>

      <div className="form-row g-3">

        <div className="col-sm-12 col-md-6 col-lg-6">
          <label className="">
            PAN Owner's Name<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={
              merchantKycId?.nameOnPanCard
            }
          />
        </div>

        <div className="col-sm-12 col-md-6 col-lg-6">
          <label className="">
            Address<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={
              merchantKycId?.operationalAddress
            }
          />
        </div>
      </div>

      <div className="form-row g-3">

        <div className="col-sm-3 col-md-3 col-lg-3">
          <label className="">
            City<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={merchantKycId?.cityId}
          />
        </div>

        <div className="col-sm-3 col-md-3 col-lg-3">
          <label className="">
            State<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={
              merchantKycId?.state_name
            }
          />
        </div>

        <div className="col-sm-12 col-md-6 col-lg-6">
          <label className="">
            Pin Code<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={merchantKycId?.pinCode}
          />
        </div>
      </div>

      <div className="form-row g-3">
        <div className="col-lg-6 font-weight-bold">
          <p>Status : <span>{KycTabStatus?.merchant_info_status}</span></p>
          <p>Comments : <span>{KycTabStatus?.merchant_info_reject_comments}</span></p>
        </div>

        <div className="col-lg-6">
          <VerifyRejectBtn
            KycTabStatus={KycTabStatus?.merchant_info_status}
            KycVerifyStatus={{ handleVerifyClick }}
            KycRejectStatus={{ handleRejectClick }}
            btnText={{ verify: "Verify", Reject: "Reject" }}
          />
        </div>
      </div>



    </div>
  )
}

export default BusinessDetails
