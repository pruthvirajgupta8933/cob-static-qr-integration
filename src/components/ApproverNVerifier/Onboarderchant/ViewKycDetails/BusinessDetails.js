import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import VerifyRejectBtn from './VerifyRejectBtn';
import { rejectKycOperation } from '../../../../slices/kycOperationSlice';
import { verifyKycEachTab, GetKycTabsStatus, getMerchantpanData } from "../../../../slices/kycSlice"
import { v4 as uuidv4 } from 'uuid';
import Collapse from 'react-collapse';
import { clearMessage } from '../../../../slices/message';
import ViewKycCollapse from './ViewKycCollapse';
import CustomLoader from '../../../../_components/loader';

const BusinessDetails = (props) => {
  const { merchantKycId, KycTabStatus, selectedUserData } = props;
  const { classifications, nic_codes: nicCodes } = selectedUserData?.udyam_data || {};
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);


  const panListData = useSelector(
    (state) => state.kyc.panDetailsData.result
  );
  const count = useSelector((state) =>
    isCollapseOpen ? state.kyc.panDetailsData.result ? state.kyc.panDetailsData.result.length : "" : "");


  const loadingState = useSelector(
    (state) => state.kyc.isLoadingForpanDetails
  );


const { user } = auth;
  const { loginId } = user;

  const handleVerifyClick = async () => {
    try {
      const verifierDetails = {
        login_id: selectedUserData.loginMasterId,
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
      login_id: selectedUserData.loginMasterId,
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
        dispatch(GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId })); // Used to remove kyc button because it's updated in the redux store
      } catch (error) {
        toast.error("Try Again Network Error");
      }
    }
  };

  useEffect(()=>{
    // console.log(selectedUserData?.panCard)
    if(selectedUserData?.panCard || selectedUserData?.signatoryPAN){
      displayPanData(selectedUserData);
    }

  },[selectedUserData])

  const displayPanData = async (data) => {
    try {
      const panDetails = {
        "pan": data?.panCard,
        "signatory_pan": data?.signatoryPAN
      };

      const resp = await dispatch(getMerchantpanData(panDetails));

    } catch (error) {
      
      toast.error("Try Again Network Error");
    }
  };




  const toggleCollapse = (index) => {
    // Check if the collapse is being opened or closed
    const isOpening = isCollapseOpen !== index;
    setIsCollapseOpen(isOpening ? index : null);
// Check if the collapse with the specified index is open
    // if (isOpening && index === 2) {
        
    // }
};




  return (
    <div className="row mb-4 border p-1">
      <h5 className="">Business Details</h5>

      <div className="form-row g-3">
        <div className="col-sm-12 col-md-6 col-lg-6">

          <label className="">
            GSTIN
          </label>
          <input
            type="text"
            className={`form-control ${selectedUserData?.registerdWithGST ? "bg-default" : "bg-warning"}`}
            id="inputPassword3"
            disabled="true"
            value={
              selectedUserData?.registerdWithGST ? selectedUserData?.gstNumber : "Merchant does not have GSTIN"
            }
          />
          <span>
            {selectedUserData?.gstNumber === null || selectedUserData?.gstNumber === "" ? (
              <p className="text-danger"> Not Verified</p>
            ) : (
              <p className="text-success">Verified</p>
            )}
          </span>
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <label className="">
            Business PAN
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={selectedUserData?.panCard}
          />
          {selectedUserData?.panCard === null || selectedUserData?.panCard === "" ? (
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

          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={selectedUserData?.signatoryPAN}
          />
          <span>
            {selectedUserData?.signatoryPAN === null || selectedUserData?.signatoryPAN === "" ? (
              <p className="text-danger"> Not Verified</p>
            ) : (
              <p className="text-success">Verified</p>
            )}
          </span>
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6">
          <label className="">
            Business Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={
              selectedUserData?.companyName ? selectedUserData?.companyName : ""
            }
          />
        </div>
      </div>

      <div className="form-row g-3">

        <div className="col-sm-12 col-md-6 col-lg-6">
          <label className="">
            PAN Owner's Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={
              selectedUserData?.nameOnPanCard
            }
          />
        </div>

        <div className="col-sm-12 col-md-6 col-lg-6">
          <label className="">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={selectedUserData?.operationalAddress}
          />
        </div>
      </div>

      <div className="form-row g-3">

        <div className="col-sm-3 col-md-3 col-lg-3">
          <label className="">
            City
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={selectedUserData?.merchant_address_details?.city}
          />
        </div>

        <div className="col-sm-3 col-md-3 col-lg-3">
          <label className="">
            State
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={
              selectedUserData?.merchant_address_details?.state_name
            }
          />
        </div>

        <div className="col-sm-12 col-md-6 col-lg-6">
          <label className="">
            Pin Code
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={selectedUserData?.pinCode}
          />
        </div>


      </div>
      {selectedUserData?.is_udyam === true ?
        <ViewKycCollapse
          title={`Merchant Udyam Aadhar Details : ${selectedUserData?.udyam_data?.reg_number}`}
          formContent={<>
            <div className="container">
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
                        <td>{selectedUserData?.udyam_data?.entity}</td>
                        <td>{selectedUserData?.udyam_data?.type}</td>
                        <td>{selectedUserData?.udyam_data?.incorporated_date}</td>
                        <td>{selectedUserData?.udyam_data?.reg_number}</td>
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
                        <td>{selectedUserData?.udyam_data?.official_address?.block}</td>
                        <td>{selectedUserData?.udyam_data?.official_address?.building}</td>
                        <td>{selectedUserData?.udyam_data?.official_address?.city}</td>
                        <td>{selectedUserData?.udyam_data?.official_address?.district}</td>
                        <td>{selectedUserData?.udyam_data?.official_address?.maskedEmail}</td>
                        <td>{selectedUserData?.udyam_data?.official_address?.maskedMobile}</td>
                        <td>{selectedUserData?.udyam_data?.official_address?.road}</td>
                        <td>{selectedUserData?.udyam_data?.official_address?.state}</td>
                        <td>{selectedUserData?.udyam_data?.official_address?.unitNumber}</td>
                        <td>{selectedUserData?.udyam_data?.official_address?.villageOrTown}</td>
                        <td>{selectedUserData?.udyam_data?.official_address?.zip}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-12">
                  <h6 className="font-weight-bold mt-3">Enterprise Type</h6>
                  <table className="table-responsive table table-bordered">

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
                        <tr key={uuidv4()}>
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
                        <tr key={uuidv4()}>
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


          </>}
          isOpen={isCollapseOpen === 1}
          onToggle={() => toggleCollapse(1)} /> : <div><h6 className="text-danger mt-4 p-0">Udyam Details not available</h6></div>}

      <>
        <ViewKycCollapse
          title={isCollapseOpen===2 ? `Total account linked with Business PAN / Authorized Signatory PAN : ${count}` : "Total account linked with Business PAN / Authorized Signatory PAN"}
          formContent={
            <>
              <div className="table-responsive table_maxheight">
                {loadingState ? (
                  <CustomLoader loadingState={loadingState} />
                ) : (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Serial No</th>
                        <th>Merchant Name</th>
                        <th>Email ID</th>
                        <th>Phone Number</th>
                        <th>Client Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {panListData &&
                        panListData.map((merchant, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{merchant?.name}</td>
                            <td>{merchant?.emailId}</td>
                            <td>{merchant?.contactNumber}</td>
                            <td>{merchant?.clientCode}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>




            </>
          }

          isOpen={isCollapseOpen === 2}
          onToggle={() => toggleCollapse(2)}
        />

      </>

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
