import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  completeVerification,
  completeVerificationRejectKyc,
} from "../../../../slices/kycOperationSlice"
import { approvekyc, GetKycTabsStatus } from "../../../../slices/kycSlice"
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess'
import { DefaultRateMapping } from '../../../../utilities/DefaultRateMapping';


const CompleteVerification = (props) => {
  let closeVerificationModal = props?.closeVerification;
  let pendingApporvalTable = props?.renderApprovalTable
  let pendingVerfyTable = props?.renderPendingVerificationData
  let approvedTable = props?.renderApprovedTable
  const [isRateMappingInProcess, setIsRateMappingInProcess] = useState(false);

  // let renderToPendingKyc = props?.renderToPendingKyc

  const KycTabStatus = props.KycTabStatus;
  let isapproved = KycTabStatus.is_approved;
  let isverified = KycTabStatus.is_verified
  // let is_verified=KycTabStatus.is_verified

  const { merchantKycId } = props;


  const dispatch = useDispatch()
  const [enableBtnApprover, setEnableBtnApprover] = useState(false)
  const [enableBtnVerifier, setEnableBtnVerifier] = useState(false)
  const [enableBtnApprovedTab, setEnableBtnApprovedTab] = useState(false)
  const [disable, setDisable] = useState(false)
  const [buttonClick, setButtonClick] = useState(false)
  const [commetText, setCommetText] = useState()


  const { auth } = useSelector((state) => state);

  const { user } = auth;
  const { loginId } = user;

  const roleBasePermissions = roleBasedAccess()
  const roles = roleBasedAccess();
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab)
  const currenTab = parseInt(verifierApproverTab?.currenTab)
  const Allow_To_Do_Verify_Kyc_details = roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details
  const [buttonText, setButtonText] = useState("Complete Verification");
  // const [pushedButton, setPushedButton] = useState("")
  // const [pushButtonClick, setPushButtonClick] = useState()
  const handleVerifyClick = () => {

    const veriferDetails = {
      login_id: merchantKycId?.loginMasterId,
      verified_by: loginId,

    };


    if (currenTab === 3) {
      if (isverified === false) {
        if ((roles?.approver === true && Allow_To_Do_Verify_Kyc_details === true) || roles?.verifier === true) {
          if (window.confirm("Verify kyc")) {
            dispatch(completeVerification(veriferDetails))
              .then((resp) => {

                resp?.payload?.status_code === 200 ? toast.success(resp?.payload?.message) : toast.error(resp?.payload)
                if (resp?.payload?.status_code === 200) {
                  dispatch(GetKycTabsStatus({ login_id: merchantKycId?.loginMasterId }))
                  pendingVerfyTable()
                  closeVerificationModal(false)

                }
                setDisable(false)

              })
              .catch((e) => {
                setDisable(false)
                toast.error("Something went wrong, Please Try Again later")
              });
          }

        }
      }
    }


    const dataAppr = {
      login_id: merchantKycId.loginMasterId,
      approved_by: loginId,
    };



    if (currenTab === 4) {
      if (isverified === true && isapproved === false) {
        if (roles?.approver === true) {
          if (window.confirm("Approve kyc")) {
            dispatch(approvekyc(dataAppr))
              .then((resp) => {
                resp?.payload?.status_code === 200 ? toast.success(resp?.payload?.message) : toast.error(resp?.payload?.message)
                dispatch(GetKycTabsStatus({ login_id: merchantKycId?.loginMasterId }))
                pendingApporvalTable()
                closeVerificationModal(false)
              })
              .catch((e) => {
                toast.error("Something went wrong, Please Try Again later")
              });
          }

        }
      }
    }

  }

  const handleRejectClick = (commetText) => {
    
    const rejectDetails = {
      login_id: merchantKycId.loginMasterId,
      rejected_by: loginId,
      comments: commetText
    };
    if (window.confirm("Reject kyc")) {
      dispatch(completeVerificationRejectKyc(rejectDetails))
        .then((resp) => {
          resp?.payload?.status_code === 200 ? toast.success(resp?.payload?.message) : toast.error(resp?.payload)
          dispatch(GetKycTabsStatus({ login_id: merchantKycId?.loginMasterId }))
          setButtonClick(false)
          setCommetText("");
          if(currenTab === 4){
            return pendingApporvalTable()
          }else if(currenTab === 3){
            return pendingVerfyTable()
          }else if (currenTab===5){
            return approvedTable()
          }
         
        })
        .catch((e) => {
          toast.error("Something went wrong, Please Try Again later")
        });
    }
}


 

  useEffect(() => {

////////////////////////////////////////////////////// Button enable for approver
    const approver = () => {
      let enableBtn = false;
      if (currenTab === 4) {
        if (roles.approver === true)
          //  if ( status === "Verified")
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
    if (currenTab === 4) {
      setButtonText("Approve KYC")
      // console.log("The Button Name is Approve kyc",buttonText)

    }



    //  console.log("Allow_To_Do_Verify_Kyc_details",Allow_To_Do_Verify_Kyc_details)
    //  console.log("isverified",isverified)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles, isverified, Allow_To_Do_Verify_Kyc_details]);



  useEffect(() => {
    // if (currenTab === 4 && roles?.approver) {
    //   setPushedButton("Back to Pending Verification")

    // }
    // if (currenTab === 5 && roles?.approver) {
    //   setPushedButton("Back to Pending Approval")


    // }
    // if (currenTab === 6 && roles?.approver)
    //   setPushedButton("Back to Pending kyc")



    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles])


  // console.log("---------start final btn-----")
  //    console.log("currenTab",currenTab)
  //    console.log("roles",roles)
  //    console.log("isverified",isverified)
  //    console.log("isapproved",isapproved)
  //    console.log("enableBtnVerifier",enableBtnVerifier)
  //    console.log("enableBtnApprover",enableBtnApprover)
  //    console.log("The button name show is here",buttonText)
  // console.log("---------end final btn-----")


  return (
    <div className="row">

      <label className="font-weight-bold col-lg-12">Comments : <span>{KycTabStatus?.comments}</span></label>
      <div className="col-lg-12">

        {enableBtnVerifier || enableBtnApprover ?
          <><button type="button" disabled={disable} onClick={() => {
            handleVerifyClick()
          }} className="btn  cob-btn-primary  btn-sm text-white m-2">{buttonText} </button>



            <button type="button" onClick={() => setButtonClick(true)} className="btn btn-danger btn-sm text-white m-2">Reject KYC</button></>
          : enableBtnApprovedTab === true ? <button type="button"
            onClick={() => setButtonClick(true)} className="btn btn-danger btn-sm text-white m-2">Reject KYC</button> : <> </> // Reject kyc for currentab 4(Approved) 
        }

        {/* ratemapping loader  */}
                <DefaultRateMapping setFlag={setIsRateMappingInProcess} />

        {/* {(currenTab === 4 || currenTab === 5 || currenTab === 6) && (roles?.approver) ?

          <button type="button" onClick={() => setPushButtonClick(true)} className="btn btn-success btn-sm text-white ml-2">{pushedButton}</button> : <></>} */}

        {/* <div className="col-lg-12">
          {pushButtonClick === true ?
            <>
              <label for="comments col-lg-12">Reject Comments For Pushing Back</label>
              <textarea id="comments" className="col-lg-12" name="reject_commet" rows="4" cols="40" onChange={(e) => setCommetText(e.target.value)}>
              </textarea>
              <button type="button"
                // onClick={() => handlePushBack(commetText)}
                className="btn btn-danger btn-sm text-white pull-left mt-20">Submit</button></> : <></>
          }
        </div> */}

      </div>
      <div className="col-lg-12">
        {buttonClick === true ?

          <>
            <label for="comments col-lg-12">Reject Comments</label>

            <textarea id="comments" className="col-lg-12" name="reject_commet" rows="4" cols="40" onChange={(e) => setCommetText(e.target.value)}>
            </textarea>
            <button type="button"
              onClick={() => handleRejectClick(commetText)}
              className="btn btn-danger btn-sm text-white pull-left m-2">Submit</button></> : <></>}


      </div>
    </div>
  )
}

export default CompleteVerification
