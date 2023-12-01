import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { checkedDocumentReject, kycDocumentUploadList, verifyKycDocumentTab, approveDoc } from '../../../../slices/kycSlice';
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess';
const CompleteVerifyAndRejectBtn = (props) => {


  const dispatch = useDispatch();
  const { roleBasePermissions, merchantKycId, documentsIdList, setCheckedClicked, docList, setdocumentsIdList, checkedClicked } = props;
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab)
  const currenTab = parseInt(verifierApproverTab?.currenTab)
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const { loginId } = user;
  const roles = roleBasedAccess();


  const dropDownDocList = docList?.map((r) => r?.status?.toString());
  const hasPendingItem = dropDownDocList.some(item => item.includes("Pending"))
  const hasVerifiedItem = dropDownDocList.some(item => item.includes("Verified")) // tab 4
  


  const [buttonText, setButtonText] = useState("Verify");
  const [buttonClick, setButtonClick] = useState(false)
  const [commetText, setCommetText] = useState()

  const [disable, setDisable] = useState(false)
  const [enableButtonForVerifier, setEnableButtonForVerifier] = useState(false)
  const [enableButtonForApprover, setEnableButtonForApprover] = useState(false)
  const [enableRejectButton, setEnableRejectButton] = useState(false)
  const Allow_To_Do_Verify_Kyc_details = roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details



  // console.log(roles)

  const getKycDocList = (role) => {
    dispatch(
      kycDocumentUploadList({ login_id: merchantKycId?.loginMasterId })

    );
  };


  // enable btn when verifier is logged in
  const enableVerifyBtn = () => {
    // console.log("hasPendingItem", hasPendingItem)
    // console.log("roles?.verifier", roles?.verifier)
    // console.log("currenTab", currenTab)
    // console.log("runing...........");
    let enableBtn = false;
    if (hasPendingItem && (roles?.verifier && currenTab === 3)) {
      enableBtn = true; // when verifier logged in
    }


    // for tab 3 if approver logged in
    if (hasPendingItem && currenTab === 3 && (roles?.approver && roles.permission.Allow_To_Do_Verify_Kyc_details)) {
      enableBtn = true; // when approver logged in and has permisson to verify the pendign verification tab 
    }


    // for tab 4 if approver logged in
    if (hasVerifiedItem && currenTab === 4 && roles?.approver) {
      enableBtn = true; // when approver logged in and has permisson to verify the pendign verification tab 
    }



    return enableBtn;
  };


  const enableRejectBtn = () => {

    // console.log("runing...........");
    let enableBtn = false;
    // if ( (hasPendingItem || hasVerifiedItem) && (roles?.verifier || roles?.approver) && (currenTab === 3 || currenTab === 4) ) {
    //   enableBtn = true;
    // }

    if (roles?.verifier) {
      if (hasPendingItem && currenTab === 3) {
        enableBtn = true; // if logged by verifier and doc status is pending then  enable reject btn
      }
    }


    if (roles?.approver) {
      if ( hasVerifiedItem  &&  currenTab === 4) {
        enableBtn = true; // if logged by approver and doc status is verified  then  enable reject btn
      }
     
      if ( hasPendingItem &&  (currenTab === 3 && roles.permission.Allow_To_Do_Verify_Kyc_details)) {
        enableBtn = true; // if logged by approver and doc status is verified  then  enable reject btn
      }
     
    }

    return enableBtn;
  };



  useEffect(() => {
    setEnableButtonForVerifier(enableVerifyBtn())
    setEnableButtonForApprover(enableVerifyBtn())
    setEnableRejectButton(enableRejectBtn())

  }, [checkedClicked])



useEffect(() => {
    if (currenTab === 3) {
      setButtonText("Verify All Selected")
     
    }
    if (currenTab === 4) {
      setButtonText("Approve All Selected")
      

    }

    

  }, [roles, Allow_To_Do_Verify_Kyc_details]);


  const rejectDoc = () => {
    const rejectDetails = {
      document_id: documentsIdList,
      rejected_by: loginId,
      comment: commetText === undefined || commetText === "" ? "Document Rejected" : commetText,
    };
    setDisable(true)
    dispatch(checkedDocumentReject(rejectDetails))
      .then((resp) => {
        resp?.payload?.status && toast.success(resp?.payload?.message);
        setButtonClick(null)
        // setCloseModal(false)
        setCheckedClicked(false)
        setCommetText("")
        setDisable(false)
        if (typeof resp?.payload?.status === "undefined") {
          toast.error("Please Try After Sometimes");
        }

        getKycDocList(roles);
      })
      .catch((e) => {
        toast.error("Try Again Network Error");
      });
  };


  const verifyApproveDoc = (doc_id, status) => {
    const postData = {
      document_id: documentsIdList,
      verified_by: loginId,
      comment: "Document Verified"
    };


    if ((roles?.verifier || roles?.approver) && currenTab === 3) {
      dispatch(verifyKycDocumentTab(postData)).then((resp) => {
        if (resp?.payload?.status) {

          setEnableButtonForVerifier(false)
          setdocumentsIdList([])
          setCheckedClicked(false)
          getKycDocList(roles);
          toast.success(resp?.payload?.message)


        } else {
          toast.error(resp?.payload?.message)
        }

      })
    }

    if (roles?.approver) {
      const approverDocDetails = {
        approved_by: loginId,
        document_id: documentsIdList,
      };

      if ((roles?.approver === true && currenTab === 4))
        if (currenTab === 4) {
          dispatch(approveDoc(approverDocDetails)).then((resp) => {
            resp?.payload?.status
              ? toast.success(resp?.payload?.message)
              : toast.error(resp?.payload?.message);
            setdocumentsIdList([])
            setCheckedClicked(false)

            getKycDocList(roles);
          });
        }
    }
  };


  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3-">
          {(enableButtonForVerifier || enableButtonForApprover) &&
            <button type="button"
              onClick={() => { verifyApproveDoc() }}
              className="btn  cob-btn-primary  btn-sm text-white m-2">{buttonText}
            </button>
          }

          {enableRejectButton &&
            <button type="button"
              onClick={() => setButtonClick(true)}
              className="btn btn-danger btn-sm text-white m-2">
              Reject Selected
            </button>}
        </div>
      </div>


      {buttonClick === true ?
        <div style={{ float: "left" }}>
          <textarea id="comments" name="reject_commet" placeholder="Reason for rejection" rows="4" cols="40" onChange={(e) => setCommetText(e.target.value)}>
          </textarea>
          <div>
            <button type="button"
              onClick={() => rejectDoc()}
              disabled={disable}
              className="btn btn-danger btn-sm text-white m-2">Submit</button></div></div> : <></>}


    </div>


  )
}

export default CompleteVerifyAndRejectBtn
