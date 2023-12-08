import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import VerifyRejectBtn from './VerifyRejectBtn';
import { rejectKycOperation } from '../../../../slices/kycOperationSlice';
import { verifyKycEachTab, GetKycTabsStatus } from "../../../../slices/kycSlice"


const BusinessDetails = (props) => {
  const { merchantKycId, KycTabStatus } = props;
  const { classifications, nic_codes: nicCodes } = merchantKycId?.udyam_data || {};
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const { user } = auth;
  const { loginId } = user;


  const handleVerifyClick = async () => {
    try {
      const verifierDetails = {
        login_id: merchantKycId.loginMasterId,
        merchant_info_verified_by: loginId,
      };

      const resp = await dispatch(verifyKycEachTab(verifierDetails));

      if (resp?.payload?.merchant_info_status) {
        toast.success(resp.payload.merchant_info_status);
      } else if (resp?.payload?.detail) {
        toast.error(resp.payload.detail);
      }
    } catch (error) {
      toast.error("Try Again Network Error");
    }
  };


  const handleRejectClick = async (merchant_info_reject_comments = "") => {
    const rejectDetails = {
      login_id: merchantKycId.loginMasterId,
      merchant_info_rejected_by: loginId,
      merchant_info_reject_comments: merchant_info_reject_comments,
    };

    if (window.confirm("Reject Business Details")) {
      try {
        const resp = await dispatch(rejectKycOperation(rejectDetails));

        if (resp?.payload?.merchant_info_status) {
          toast.success(resp.payload.merchant_info_status);
        } else if (resp?.payload) {
          toast.error(resp.payload);
        }
        dispatch(GetKycTabsStatus({ login_id: merchantKycId?.loginMasterId })); // Used to remove kyc button because it's updated in the redux store
      } catch (error) {
        toast.error("Try Again Network Error");
      }
    }
  };



  return (
    <div className="row mb-4 border p-1">
      <h5 className="">Business Details</h5>

      <div className="form-row g-3">
        <div className="col-sm-12 col-md-6 col-lg-6">

          <label className="">
            GSTIN<span className="text-danger">*</span>
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
        <div className="col-sm-12 col-md-6 col-lg-6">
          <label className="">
            Business PAN<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={merchantKycId?.panCard}
          />
          {merchantKycId?.panCard === null || merchantKycId?.panCard === "" ? (
            <p className="text-danger"> Not Verified</p>
          ) : (
            <p className="text-success">Verified</p>
          )}
        </div>

      </div>

      <div className="form-row g-3">
        <div className="col-sm-12 col-md-6 col-lg-6">
          <label className="">
            Authorized Signatory PAN
            <span className="text-danger">*</span>
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
        <div className="col-sm-12 col-md-6 col-lg-6">
          <label className="">
            Business Name<span className="text-danger">*</span>
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
            PAN Owner's Name<span className="text-danger">*</span>
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
            Address<span className="text-danger">*</span>
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
            City<span className="text-danger">*</span>
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
            State<span className="text-danger">*</span>
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
            Pin Code<span className="text-danger">*</span>
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
      {merchantKycId?.is_udyam === true ? <div className="accordion accordion-flush mt-3" id="accordionFlushExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingOne">
            <button className="collapsed btn btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
              <p className="fs-6 m-0 text-success" >Merchant Udyam Aadhar Details <i className="fa fa-arrow-circle-o-down" /></p>
              <p className="fs-6 m-0">{merchantKycId?.udyam_data?.reg_number}</p>
            </button>
          </h2>
          <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
            <div className="accordion-body p-0">

              <div className="container" style={{ marginTop: "32px" }}>
                <div className="row">
                  <div className="col-md-12">
                    <table className="table table-bordered mt-3">
                      <thead>
                        <tr>
                          <th>Name of Enterprise</th>
                          <th>Organisation Type</th>
                          <th>Date of Incorporation</th>
                          <th>Udyam Registration Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{merchantKycId?.udyam_data?.entity}</td>
                          <td>{merchantKycId?.udyam_data?.type}</td>
                          <td>{merchantKycId?.udyam_data?.incorporated_date}</td>
                          <td>{merchantKycId?.udyam_data?.reg_number}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-12">
                    <h6 className="font-weight-bold">Official Address Of Enterprise</h6>
                    <table className="table-responsive table table-bordered">
                      <thead>
                        <tr>
                          <th>Block</th>
                          <th>Building</th>
                          <th>City</th>
                          <th>District</th>
                          <th>Masked Email</th>
                          <th>Masked Mobile</th>
                          <th>Road</th>
                          <th>State</th>
                          <th>Unit Number</th>
                          <th>Village Or Town</th>
                          <th>Zip</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{merchantKycId?.udyam_data?.official_address?.block}</td>
                          <td>{merchantKycId?.udyam_data?.official_address?.building}</td>
                          <td>{merchantKycId?.udyam_data?.official_address?.city}</td>
                          <td>{merchantKycId?.udyam_data?.official_address?.district}</td>
                          <td>{merchantKycId?.udyam_data?.official_address?.maskedEmail}</td>
                          <td>{merchantKycId?.udyam_data?.official_address?.maskedMobile}</td>
                          <td>{merchantKycId?.udyam_data?.official_address?.road}</td>
                          <td>{merchantKycId?.udyam_data?.official_address?.state}</td>
                          <td>{merchantKycId?.udyam_data?.official_address?.unitNumber}</td>
                          <td>{merchantKycId?.udyam_data?.official_address?.villageOrTown}</td>
                          <td>{merchantKycId?.udyam_data?.official_address?.zip}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-12">
                    <h6 className="font-weight-bold mt-3">Enterprise Type</h6>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.NO</th>
                          <th>Classification Year</th>
                          <th>Enterprise Type</th>
                          <th>Classification Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classifications?.map((data, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data?.year}</td>
                            <td>{data?.type}</td>
                            <td>{data?.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-12">
                    <h6 className="font-weight-bold mt-3">National Industry Classification Code(S)</h6>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.NO</th>
                          <th>Nic 2 Digit</th>
                          <th>Nic 4 Digit</th>
                          <th>Nic 5 Digit</th>
                          <th>Activity</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nicCodes?.map((data, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data?.digit2}</td>
                            <td>{data?.digit4}</td>
                            <td>{data?.digit5}</td>
                            <td>{data?.activity}</td>
                            <td>{data?.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* {merchantKycId?.is_udyam ? <ul className="list-group">
                    <li className="list-group-item">Reg. Number : {merchantKycId?.udyam_data?.reg_number}</li>
                    <li className="list-group-item">entity : {merchantKycId?.udyam_data?.entity}</li>
                    <li className="list-group-item">type : {merchantKycId?.udyam_data?.type}</li>
                    <li className="list-group-item">incorporated_date : {merchantKycId?.udyam_data?.incorporated_date}</li>
                    <li className="list-group-item">commenced_date : {merchantKycId?.udyam_data?.commenced_date}</li>
                    <li className="list-group-item">registered_date : {merchantKycId?.udyam_data?.registered_date}</li>
                  </ul> : <p>Udyam number not available</p>} */}

            </div>
          </div>
        </div>
      </div> : <div><h5 className="text-danger mt-4 p-0">Udyam Details not available</h5></div>}


      <div className="form-row g-3">
        <div className="col-lg-6 font-weight-bold">
          <p className='m-0'>Status : <span>{KycTabStatus?.merchant_info_status}</span></p>
          <p className='m-0'>Comments : <span>{KycTabStatus?.merchant_info_reject_comments}</span></p>
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
