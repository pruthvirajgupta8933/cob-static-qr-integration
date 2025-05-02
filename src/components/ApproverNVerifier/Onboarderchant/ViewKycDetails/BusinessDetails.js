import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import VerifyRejectBtn from "./VerifyRejectBtn";
import { rejectKycOperation } from "../../../../slices/kycOperationSlice";
import {
  verifyKycEachTab,
  GetKycTabsStatus,
  getMerchantpanData,
} from "../../../../slices/kycSlice";
import { v4 as uuidv4 } from "uuid";

import ViewKycCollapse from "./ViewKycCollapse";
import CustomLoader from "../../../../_components/loader";
import CinDisplay from "../../additional-kyc/cin-validate/CinDisplay";
import { cinDataByLoginSlice } from "../../../../slices/kycValidatorSlice";

const BusinessDetails = (props) => {
  const { KycTabStatus, selectedUserData } = props;

  const { classifications, nic_codes: nicCodes } =
    selectedUserData?.udyam_data || {};

  const dispatch = useDispatch();
  const { auth, kycValidatorReducer } = useSelector((state) => state);
  const { cinData } = kycValidatorReducer

  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const { kycUserList } = useSelector((state) => state?.kyc || {});
  const factumData = kycUserList?.factum_data;

  const panListData = useSelector((state) => state.kyc.panDetailsData.result);
  const count = useSelector((state) =>
    isCollapseOpen
      ? state.kyc.panDetailsData.result
        ? state.kyc.panDetailsData.result.length
        : ""
      : ""
  );

  const loadingState = useSelector((state) => state.kyc.isLoadingForpanDetails);

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
        dispatch(
          GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId })
        ); // Used to remove kyc button because it's updated in the redux store
      } catch (error) {
        toast.error("Try Again Network Error");
      }
    }
  };

  const displayPanData = async (data) => {
    try {
      const panDetails = {
        login_id: selectedUserData?.loginMasterId
      };

      await dispatch(getMerchantpanData(panDetails));
    } catch (error) { }
  };

  const toggleCollapse = (index) => {
    // Check if the collapse is being opened or closed
    const isOpening = isCollapseOpen !== index;
    setIsCollapseOpen(isOpening ? index : null);
  };

  const formFields = [
    {
      label: "GSTIN",
      value: selectedUserData?.gstNumber
        ? selectedUserData.gstNumber
        : "Merchant does not have GSTIN",
      verificationMessage: selectedUserData?.gstNumber
        ? "Verified"
        : "Not Verified",
      gridClasses: "col-sm-12 col-md-6 col-lg-6",
      inputClasses: `form-control ${selectedUserData?.registerdWithGST ? "bg-default" : "bg-warning"
        }`,
    },
    {
      label: "Business PAN",
      value: selectedUserData?.panCard,
      verificationMessage: selectedUserData?.panCard
        ? "Verified"
        : "Not Verified",
      gridClasses: "col-sm-12 col-md-6 col-lg-3",
      inputClasses: "form-control",
    },
    {
      label: "Business PAN DOB/DOI",
      value: selectedUserData?.pan_dob_or_doi,
      gridClasses: "col-sm-12 col-md-6 col-lg-3",
      inputClasses: "form-control",
    },
    {
      label: "Authorized Signatory PAN",
      value: selectedUserData?.signatoryPAN,
      verificationMessage: selectedUserData?.signatoryPAN
        ? "Verified"
        : "Not Verified",
      gridClasses: "col-sm-12 col-md-6 col-lg-3",
      inputClasses: "form-control",
    },

    {
      label: "Auth Signatory  DOB/DOI",
      value: selectedUserData?.authorized_person_dob,

      gridClasses: "col-sm-12 col-md-6 col-lg-3",
      inputClasses: "form-control",
    },


    {
      label: "Business Name",
      value: selectedUserData?.companyName ? selectedUserData.companyName : "",
      gridClasses: "col-sm-12 col-md-6 col-lg-6",
      inputClasses: "form-control",
    },
    {
      label: "PAN Owner's Name",
      value: selectedUserData?.nameOnPanCard,
      gridClasses: "col-sm-12 col-md-6 col-lg-6",
      inputClasses: "form-control",
    },
    {
      label: "Address",
      value: selectedUserData?.merchant_address_details?.address,
      gridClasses: "col-sm-12 col-md-6 col-lg-6",
      inputClasses: "form-control",
    },
    {
      label: "City",
      value: selectedUserData?.merchant_address_details?.city,
      gridClasses: "col-sm-3 col-md-3 col-lg-3",
      inputClasses: "form-control",
    },
    {
      label: "State",
      value: selectedUserData?.merchant_address_details?.state_name,
      gridClasses: "col-sm-3 col-md-3 col-lg-3",
      inputClasses: "form-control",
    },
    {
      label: "Pin Code",
      value: selectedUserData?.merchant_address_details?.pin_code,
      gridClasses: "col-sm-12 col-md-6 col-lg-6",
      inputClasses: "form-control",
    },
    {
      label: "CIN",
      value: selectedUserData?.cin ?? "",
      gridClasses: "col-sm-12 col-md-6 col-lg-6",
      inputClasses: "form-control",
      verificationMessage: selectedUserData?.cin
        ? "Verified" : "",
    }
  ];


  // const factumData = {
  //   "apiStatus": 200,
  //   "message": "Success",
  //   "data": [
  //     {
  //       "NISPRIT SERVICES PRIVATE LIMITED": [
  //         {
  //           "status": true,
  //           "entityId": "string",
  //           "entitysource": "string",
  //           "sanctionreferencename": "string",
  //           "matchedNationalId": "string",
  //           "macthedDob": "string",
  //           "matchedName": "string",
  //           "matchedAddress": "string",
  //           "RiskScore": 1073741824,
  //           "messge": "string"
  //         }
  //       ]
  //     },
  //     {
  //       "AMAN ANAND": [{
  //         "status": true,
  //         "entityId": "string",
  //         "entitysource": "string",
  //         "sanctionreferencename": "string",
  //         "matchedNationalId": "string",
  //         "macthedDob": "string",
  //         "matchedName": "string",
  //         "matchedAddress": "string",
  //         "RiskScore": 1073741824,
  //         "messge": "string"
  //       }]
  //     },
  //     {
  //       "OM PRAKASH PASWAN": [{
  //         "status": true,
  //         "entityId": "string",
  //         "entitysource": "string",
  //         "sanctionreferencename": "string",
  //         "matchedNationalId": "string",
  //         "macthedDob": "string",
  //         "matchedName": "string",
  //         "matchedAddress": "string",
  //         "RiskScore": 1073741824,
  //         "messge": "string"
  //       }]
  //     }
  //   ],
  //   "timestamp": "2025-05-02T12:34:30.266323874",
  //   "traceId": "6641469a-6e40-4554-b0cd-fb831d25ef02"
  // }

  return (
    <div className="row mb-4 border p-1">
      <h6>Business Details</h6>
      {formFields.map((field, index) => (
        <div key={uuidv4()} className={`${field.gridClasses}`}>
          <div className="form-group">
            <label>{field.label}</label>
            {field.value !== undefined ? (
              <>
                <input
                  type="text"
                  className={field.inputClasses}
                  id="inputPassword3"
                  disabled="true"
                  value={field.value}
                />
                {field.verificationMessage && (
                  <span>
                    <p
                      className={
                        field.verificationMessage === "Not Verified"
                          ? "text-danger"
                          : "text-success"
                      }
                    >
                      {field.verificationMessage}
                    </p>
                  </span>
                )}
              </>
            ) : (
              <p className="font-weight-bold">Loading...</p>
            )}
          </div>
        </div>
      ))}

      {selectedUserData?.is_udyam === true ? (
        <ViewKycCollapse
          title={`Merchant Udyam Aadhar Details : ${selectedUserData?.udyam_data?.reg_number}`}
          formContent={
            <>
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
                          <td>
                            {selectedUserData?.udyam_data?.incorporated_date}
                          </td>
                          <td>{selectedUserData?.udyam_data?.reg_number}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-12">
                    <h6 className="font-weight-bold">
                      Official Address Of Enterprise
                    </h6>
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
                          <td>
                            {
                              selectedUserData?.udyam_data?.official_address
                                ?.block
                            }
                          </td>
                          <td>
                            {
                              selectedUserData?.udyam_data?.official_address
                                ?.building
                            }
                          </td>
                          <td>
                            {
                              selectedUserData?.udyam_data?.official_address
                                ?.city
                            }
                          </td>
                          <td>
                            {
                              selectedUserData?.udyam_data?.official_address
                                ?.district
                            }
                          </td>
                          <td>
                            {
                              selectedUserData?.udyam_data?.official_address
                                ?.maskedEmail
                            }
                          </td>
                          <td>
                            {
                              selectedUserData?.udyam_data?.official_address
                                ?.maskedMobile
                            }
                          </td>
                          <td>
                            {
                              selectedUserData?.udyam_data?.official_address
                                ?.road
                            }
                          </td>
                          <td>
                            {
                              selectedUserData?.udyam_data?.official_address
                                ?.state
                            }
                          </td>
                          <td>
                            {
                              selectedUserData?.udyam_data?.official_address
                                ?.unitNumber
                            }
                          </td>
                          <td>
                            {
                              selectedUserData?.udyam_data?.official_address
                                ?.villageOrTown
                            }
                          </td>
                          <td>
                            {
                              selectedUserData?.udyam_data?.official_address
                                ?.zip
                            }
                          </td>
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
                    <h6 className="font-weight-bold mt-3">
                      National Industry Classification Code(S)
                    </h6>
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
            </>
          }
          isOpen={isCollapseOpen === 1}
          onToggle={() => toggleCollapse(1)}
        />
      ) : (
        <div>
          <h6 className="text-danger mt-4 p-0">Udyam Details not available</h6>
        </div>
      )}

      <>
        <ViewKycCollapse
          title={
            isCollapseOpen === 2
              ? `Total account linked with Business PAN / Authorized Signatory PAN : ${count}`
              : "Total account linked with Business PAN / Authorized Signatory PAN"
          }
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
          onToggle={() => {
            toggleCollapse(2);
            if (!isCollapseOpen) {
              displayPanData(); // Call displayPanData() only when the toggle is being opened
            }
          }}
        />
      </>



      <>
        {factumData && (
          <ViewKycCollapse
            title={isCollapseOpen === 3 ? "Factum Data" : "Factum Data"}
            formContent={
              <>
                <div className="table-responsive table_maxheight m-3">
                  <table className="table ">
                    <tbody>
                      {Object.entries(factumData).map(([key, value], index) => (
                        <tr key={index}>
                          <th>{key}</th>
                          <td>
                            {Array.isArray(value) ? (
                              <table className="table ">
                                <tbody>
                                  {value.map((item, itemIndex) => (
                                    <tr key={itemIndex}>
                                      <td colSpan="2">
                                        <table className="table">
                                          <tbody>
                                            {Object.entries(item).map(([subKey, subValue], subIndex) => (
                                              <tr key={subIndex}>
                                                <th>{subKey}</th>
                                                <td>
                                                  {Array.isArray(subValue) ? (
                                                    <table className="table ">
                                                      <tbody>
                                                        {subValue.map((nestedItem, nestedIndex) => (
                                                          <tr key={nestedIndex}>
                                                            {Object.entries(nestedItem).map(
                                                              ([nestedKey, nestedValue], nestedInnerIndex) => (
                                                                <tr key={nestedInnerIndex}>
                                                                  <th>{nestedKey}</th>
                                                                  <td>{nestedValue}</td>
                                                                </tr>
                                                              )
                                                            )}
                                                          </tr>
                                                        ))}
                                                      </tbody>
                                                    </table>
                                                  ) : (
                                                    subValue
                                                  )}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              value
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            }
            isOpen={isCollapseOpen === 3}
            onToggle={() => {
              toggleCollapse(3);
            }}
          />
        )}
      </>

      <>
        {selectedUserData?.cin && <ViewKycCollapse
          title={`CIN : ${selectedUserData?.cin}`}
          formContent={
            cinData?.loading ? <CustomLoader loadingState={cinData?.loading} /> : <CinDisplay cinData={cinData?.data} />
          }

          isOpen={isCollapseOpen === 4}
          onToggle={() => {
            toggleCollapse(4);
            if (!isCollapseOpen) {
              dispatch(cinDataByLoginSlice({ "login_id": selectedUserData?.loginMasterId }))
            }
          }}
        />}

      </>
      <div className="form-row g-3">
        <div className="col-lg-6 font-weight-bold">
          <p className="m-0">
            Status : <span>{KycTabStatus?.merchant_info_status}</span>
          </p>
          <p className="m-0">
            Comments :{" "}
            <span>{KycTabStatus?.merchant_info_reject_comments}</span>
          </p>
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
  );
};

export default BusinessDetails;
