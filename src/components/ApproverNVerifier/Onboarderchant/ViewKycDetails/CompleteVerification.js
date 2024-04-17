import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  completeVerification,
  completeVerificationRejectKyc
} from "../../../../slices/kycOperationSlice"
import { approvekyc, clearApproveKyc, GetKycTabsStatus, kycUserList } from "../../../../slices/kycSlice"
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess'
import { ratemapping } from '../../../../slices/approver-dashboard/rateMappingSlice';
import toastConfig from '../../../../utilities/toastTypes';
import { KYC_STATUS_PENDING, KYC_STATUS_PROCESSING, KYC_STATUS_VERIFIED } from '../../../../utilities/enums';
import { axiosInstanceAuth } from '../../../../utilities/axiosInstance';
import API_URL from '../../../../config';
import { isEmpty } from 'lodash';


const CompleteVerification = (props) => {
  let closeVerificationModal = props?.closeVerification;
  let pendingApporvalTable = props?.renderApprovalTable
  let pendingVerfyTable = props?.renderPendingVerificationData
  let approvedTable = props?.renderApprovedTable

  const KycTabStatus = props.KycTabStatus;
  let isapproved = KycTabStatus.is_approved;
  let isverified = KycTabStatus.is_verified
  const { selectedUserData } = props;

  const dispatch = useDispatch()
  const [enableBtnApprover, setEnableBtnApprover] = useState(false)
  const [enableBtnVerifier, setEnableBtnVerifier] = useState(false)
  const [enableBtnApprovedTab, setEnableBtnApprovedTab] = useState(false)
  const [disable, setDisable] = useState(false)
  const [buttonClick, setButtonClick] = useState(false)
  const [buttonLoader, setButtonLoader] = useState(false)
  const [commetText, setCommetText] = useState()
  const [buttonText, setButtonText] = useState("Complete Verification");


  const { auth, approverDashboard, kyc, verifierApproverTab } = useSelector((state) => state);
  const { user } = auth;
  const { loginId } = user;
  const { approveKyc } = kyc
  const { generalFormData } = approverDashboard

  const roleBasePermissions = roleBasedAccess()
  const roles = roleBasedAccess();
  const currenTab = parseInt(verifierApproverTab?.currenTab)
  const Allow_To_Do_Verify_Kyc_details = roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details

  // save BAF data
  const saveBafData = async (data) => {

    const expectedTxn = data.expectedTransactions?.split("-");
    const numbers = expectedTxn && expectedTxn.map(part => parseInt(part));
    const maxValueTxn = numbers && Math.max(...numbers);
    const ticketSize = data.avg_ticket_size?.split("-");
    const avgTicket = ticketSize && ticketSize.map(part => parseInt(part))
    const maxTicketSize = avgTicket && Math.max(...avgTicket);
    const avgCount = maxValueTxn * maxTicketSize;


    const bafData = {
      merchant_business_name: data?.companyName ?? "NA",
      merchant_legal_name: data?.companyName ?? "NA",
      merchant_address: `${data?.merchant_address_details?.address}, ${data?.merchant_address_details?.city}, ${data?.merchant_address_details?.state_name}, , ${data?.merchant_address_details?.pin_code}`,
      product_name: "NA",
      types_of_entity: data?.business_type_name ?? "NA",
      year_of_establishment: 1,
      merchant_portal: isEmpty(data?.website_app_url) ? "NA" : data?.website_app_url,
      average_transaction_amount: data.avg_ticket_size ?? "NA",
      expected_transactions_numbers: data.expectedTransactions ?? "NA",
      annual_transaction_value: avgCount ?? "NA",
      account_details: `${data?.merchant_account_details?.account_number}/ ${data?.merchant_account_details?.ifsc_code}` ?? "NA",
      question: "NA",
      authorized_contact_person_name: data?.name ?? "NA",
      authorized_contact_person_contact_number: data?.contactNumber ?? "NA",
      authorized_contact_person_email_id: data?.emailId ?? "NA",
      technical_contact_person_contact_number: data?.contactNumber ?? "NA",
      technical_contact_person_email_id: data?.emailId ?? "NA",
      technical_contact_person_name: data?.name ?? "NA",
      gst_number: isEmpty(data?.gstNumber) ? "NA" : data?.gstNumber,
      entity_pan_card_number: data?.signatoryPAN ?? "NA",
      zone: data.zone_code ?? "NA",
      nature_of_business: data.business_category_name ?? "NA",
      mcc: "NA"
    }


    await axiosInstanceAuth.post(API_URL.BizzAPPForm, bafData)
      .then((response) => {
        if (response.status === 200) {
          toastConfig.successToast("BAF data saved");
        } else {
          toastConfig.errorToast("BAF data not saved");
        }
      }).catch((error) => {
        toastConfig.errorToast("Data not saved");
      })
  }




  useEffect(() => {
    return () => {
      // console.log("clear state approver")
      dispatch(clearApproveKyc())
    }
  }, [])


  useEffect(() => {
    if (kyc?.approveKyc.isApproved && !kyc?.approveKyc.isError) {
      dispatch(GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId }))
      dispatch(ratemapping({ merchantLoginId: selectedUserData?.loginMasterId }))
      pendingApporvalTable()
    }

    if (approveKyc.isError) {
      toastConfig.errorToast("Something went wrong, Please Try Again later")
    }


  }, [kyc])



  const submitHandler = async () => {
    if (selectedUserData?.roleId !== 13) {
      if (!generalFormData.isFinalSubmit && (generalFormData.parent_client_code === '' || generalFormData.parent_client_code === null || generalFormData.parent_client_code === undefined) && roles.approver && currenTab === 4) {
        alert("Please Select the parent client code for the rate mapping");
        return false
      }
    }

    setDisable(true)
    setButtonLoader(true)

    const veriferDetails = {
      login_id: selectedUserData?.loginMasterId,
      verified_by: loginId,
    };


    if (currenTab === 3 && !isverified) {
      if ((roles?.approver && Allow_To_Do_Verify_Kyc_details) || roles?.verifier) {
        if (window.confirm("Verify kyc")) {
          try {
            const resp = await dispatch(completeVerification(veriferDetails));

            if (resp?.payload?.status_code === 200) {
              toast.success(resp.payload.message);
              dispatch(kycUserList({ login_id: selectedUserData?.loginMasterId }));
              dispatch(GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId }));
              pendingVerfyTable();
              closeVerificationModal(false);
              setButtonLoader(false)
              setDisable(false);
            } else {
              toast.error(resp?.payload);
              setButtonLoader(false)
              setDisable(false);
            }

          } catch (error) {
            setDisable(false);
            setButtonLoader(false)

            toast.error("Something went wrong, Please Try Again later");
          }
        } else {
          setDisable(false);
        }
      }
    }





    if (currenTab === 4) {
      setButtonLoader(true)
      if (isverified === true && isapproved === false) {
        if (roles?.approver === true) {
          if (window.confirm("Approve kyc")) {
            let dataAppr = {
              login_id: selectedUserData.loginMasterId,
              approved_by: loginId,
              rolling_reserve: parseFloat(approverDashboard?.generalFormData?.rr_amount),
              refer_by: approverDashboard?.generalFormData?.refer_by,
              business_category_type: approverDashboard?.generalFormData?.business_cat_type,
              rolling_reserve_type: approverDashboard?.generalFormData?.rolling_reserve_type
            };

            if (selectedUserData?.roleId === 13) {
              dataAppr = {
                login_id: selectedUserData.loginMasterId,
                approved_by: loginId,
              }
            }



            // update the redux state - for the ratemapping

            GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId })
            dispatch(approvekyc(dataAppr)).then((resp) => {

              setDisable(false);

              // save baf data
              saveBafData(kyc.kycUserList)
              setButtonLoader(false)
              if (selectedUserData?.roleId === 13) {
                pendingApporvalTable()
                closeVerificationModal(false)
              }
            })
              .catch((e) => {
                console.log(e)
                setDisable(false);
                setButtonLoader(false)
                toast.error("Something went wrong, Please Try Again later")

              });
          } else {
            setButtonLoader(false)
            setDisable(false);
          }

        }
      }
    }



  }

  const handleRejectClick = async (commetText) => {
    const rejectDetails = {
      login_id: selectedUserData.loginMasterId,
      rejected_by: loginId,
      comments: commetText,
    };
    setButtonLoader(true)

    if (window.confirm("Reject kyc")) {
      try {
        const resp = await dispatch(completeVerificationRejectKyc(rejectDetails));

        if (resp?.payload?.status_code === 200) {
          toast.success(resp.payload.message);
          dispatch(GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId }));
          dispatch(kycUserList({ login_id: selectedUserData?.loginMasterId }));
          setButtonClick(false);
          setCommetText("");
          setButtonLoader(false)

          if (currenTab === 4) {

            pendingApporvalTable();

          } else if (currenTab === 3) {
            pendingVerfyTable();
          } else if (currenTab === 5) {
            approvedTable();
          }

          closeVerificationModal(false)
        } else {
          setButtonLoader(false)
          setDisable(false);
          toast.error(resp?.payload);
        }
      } catch (error) {
        setDisable(false);
        setButtonLoader(false)
        toast.error("Something went wrong, Please Try Again later");
      }
    } else {
      setDisable(false);
      setButtonLoader(false)
    }
  };


  useEffect(() => {
    //  Button enable for approver
    const approver = () => {
      let enableBtn = false;
      if (currenTab === 4) {
        if (roles.approver === true)
          if (isverified === true && isapproved === false) {
            enableBtn = true;
          }
      }

      setEnableBtnApprover(enableBtn);
    };

    // For current tab 5
    const approvedtab = () => {
      let enableBtn = false;
      if (currenTab === 5) {
        if (roles.approver === true)
          if (Allow_To_Do_Verify_Kyc_details === true) {
            enableBtn = true;

          }
      }
      setEnableBtnApprovedTab(enableBtn);
    };


    //////////////////////////////////////////////////// for verifier

    const verifier = () => {
      let enableBtn = false;
      if (currenTab === 3) {
        if (isverified === false) {
          if (Allow_To_Do_Verify_Kyc_details === true || roles.verifier) {
            enableBtn = true;
          }
        }
      }

      setEnableBtnVerifier(enableBtn);
    };
    approver();
    verifier();
    approvedtab();




    if (currenTab === 3) {
      setButtonText("Verify KYC")
      // console.log("The Button Name is verify kyc",buttonText)
    }

    // console.log("currenTab", currenTab)
    if (currenTab === 4) {
      setButtonText("Approve KYC")
      // console.log("The Button Name is Approve kyc",buttonText)

    }



    //  console.log("Allow_To_Do_Verify_Kyc_details",Allow_To_Do_Verify_Kyc_details)
    //  console.log("isverified",isverified)
    // return () => {
    //   setTriggerRateMapping(false)
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles, isverified, Allow_To_Do_Verify_Kyc_details]);





  // console.log("---------start final btn-----")
  //    console.log("currenTab",currenTab)
  //    console.log("roles",roles)
  //    console.log("isverified",isverified)
  //    console.log("isapproved",isapproved)
  //    console.log("enableBtnVerifier",enableBtnVerifier)
  //    console.log("enableBtnApprover",enableBtnApprover)
  //    console.log("The button name show is here",buttonText)
  // console.log("---------end final btn-----")

  // console.log("KycTabStatus", KycTabStatus.status)
  // console.log("disable", disable)

  return (
    <div className="row">

      <label className="font-weight-bold col-lg-12">Comments : <span>{KycTabStatus?.comments}</span></label>

      {/* verifier buttons  */}

      {(enableBtnVerifier) && (KycTabStatus.status === KYC_STATUS_PENDING || KycTabStatus.status === KYC_STATUS_PROCESSING || KycTabStatus.status === KYC_STATUS_VERIFIED) &&
        <div className="col-lg-3">
          <button type="button" disabled={disable} onClick={() => {
            submitHandler()
          }} className="btn  cob-btn-primary  btn-sm text-white m-2">
            {buttonLoader && <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              <span className="sr-only">Loading...</span>
            </>} {buttonText}</button>

        </div>
      }



      {/* approver buttons */}

      {(enableBtnApprover) && (KycTabStatus.status === KYC_STATUS_PENDING || KycTabStatus.status === KYC_STATUS_PROCESSING || KycTabStatus.status === KYC_STATUS_VERIFIED) &&
        <div className="col-lg-3">
          <button type="button" disabled={disable} onClick={() => { submitHandler() }} className="btn  cob-btn-primary  btn-sm text-white m-2">
            {buttonLoader && <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              <span className="sr-only">Loading...</span>
            </>} {buttonText}</button>

        </div>

        // Reject kyc for currentab 4(Approved) 
      }


      <div className="col-lg-3">
        {(roles.approver || roles.verifier) && (currenTab === 3 || currenTab === 4 || currenTab === 5) &&
          <button type="button"
            onClick={() => setButtonClick(true)} disabled={disable} className="btn btn-danger btn-sm text-white m-2">Reject KYC</button>}</div>


      <div className="col-lg-12">
        {buttonClick === true ?
          <>
            <label for="comments col-lg-12">Reject Comments</label>
            <textarea id="comments" className="col-lg-12" name="reject_commet" rows="4" cols="40" onChange={(e) => setCommetText(e.target.value)}>
            </textarea>
            <button type="button"
              disabled={disable}
              onClick={() => handleRejectClick(commetText)}
              className="btn btn-danger btn-sm text-white pull-left m-2"> {buttonLoader && <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                <span className="sr-only">Loading...</span>
              </>} Submit</button></> : <></>}
      </div>
    </div>
  )
}

export default CompleteVerification
