import React, { useState, useEffect } from 'react'
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess';
import { verifyKycDocumentTab, kycDocumentUploadList, approveDoc } from '../../../../slices/kycSlice';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify"
import Loader from './Loader';

const MerchantDocument = (props) => {
  const { docList, docTypeList, role, merchantKycId } = props;
  // const roles = roleBasedAccess();
  const roleBasePermissions = roleBasedAccess()
  const roles = roleBasedAccess();
  const dispatch = useDispatch();
  const { auth, kyc } = useSelector((state) => state);
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab)
  const currenTab = parseInt(verifierApproverTab?.currenTab)
  const Allow_To_Do_Verify_Kyc_details = roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details

  const { allTabsValidate } = kyc;
  const BusinessOverviewStatus = allTabsValidate?.BusiOverviewwStatus?.submitStatus?.status;
  const KycList = kyc?.kycUserList;
  const kyc_status = KycList?.status;
  const businessType = KycList.businessType;

  const { user } = auth;
  const { loginId } = user;
  const { KycDocUpload } = kyc;


  const status = KycDocUpload?.status;
  // console.log("now the current result",status)

  const [buttonText, setButtonText] = useState("");
  const [savedData, setSavedData] = useState([]);
  const [enableBtnApprover, setEnableBtnApprover] = useState(false)
  const [enableBtnVerifier, setEnableBtnVerifier] = useState(false)
  const [loader, setLoader] = useState(false)

  const getDocTypeName = (id) => {
    let data = docTypeList.filter((obj) => {
      if (obj?.key?.toString() === id?.toString()) {
        return obj;
      }
    });

    // console.log("data",data)
    return data[0]?.value;
  };

  useEffect(() => {
    setSavedData(KycDocUpload);
  }, [KycDocUpload]);

  const stringManulate = (str) => {
    let str1 = str.substring(0, 15)
    return `${str1}...`

  }

  const getKycDocList = (role) => {
    dispatch(
      kycDocumentUploadList({ login_id: merchantKycId?.loginMasterId })

    );
  };

  const verifyApproveDoc = (doc_id, status) => {
    const postData = {
      document_id: doc_id,
      verified_by: loginId,
    };
    setLoader(true)
   

    if (Allow_To_Do_Verify_Kyc_details === true || role?.verifier)
      if (currenTab === 3 && status === "Pending") {
        dispatch(verifyKycDocumentTab(postData)).then((resp) => {
          if (resp?.payload?.status) {
            getKycDocList(role);
            toast.success(resp?.payload?.message)
            setLoader(false)
          
          } else {
            toast.error(resp?.payload?.message)
            setLoader(false)
          }

        });
       
      }

    if (role?.approver && status === "Verified") {
      const approverDocDetails = {
        approved_by: loginId,
        document_id: doc_id,
      };

      if ((role.approver === true && Allow_To_Do_Verify_Kyc_details === true))
        if (currenTab === 4) {
          dispatch(approveDoc(approverDocDetails)).then((resp) => {
            resp?.payload?.status
              ? toast.success(resp?.payload?.message)
              : toast.error(resp?.payload?.message);

            getKycDocList(role);
          });
        }
    }


  };

  const rejectDoc = (doc_id) => {
    const rejectDetails = {
      document_id: doc_id,
      rejected_by: loginId,
      comment: "Document Rejected",
    };
    dispatch(verifyKycDocumentTab(rejectDetails))
      .then((resp) => {
        resp?.payload?.status && toast.success(resp?.payload?.message);
        if (typeof resp?.payload?.status === "undefined") {
          toast.error("Please Try After Sometimes");
        }

        getKycDocList(role);
      })
      .catch((e) => {
        toast.error("Try Again Network Error");
      });
  };




  useEffect(() => {

    role?.approver === true && Allow_To_Do_Verify_Kyc_details === true && currenTab === 3 ?
      setButtonText("Verify")

      : role?.approver === true && Allow_To_Do_Verify_Kyc_details === true && currenTab === 4 ?
        setButtonText("Approved")
        : role?.verifier === true ?
          setButtonText("Verify")
          : <></>

  });





  // const enableApproverTabwise = (status) => {
  //   let enableBtn = false;
  //   if (currenTab === 4) {
  //     if (roles.approver === true)
  //       if (status === "Verified") {
  //         enableBtn = true;

  //       }
  //   }
  //   return enableBtn;

  // }


  useEffect(() => {

    /////////////////////////////////////////////// button enable condition for verifier

    const v = () => {
      let enableBtn = false;
      if (currenTab === 3) {
        if (roles.verifier === true || Allow_To_Do_Verify_Kyc_details === true)
          enableBtn = true;
      }
      setEnableBtnVerifier(enableBtn);
    };
    v()




    /////////////////////////////////////////////// button enable condition  for approver

    const a = () => {
      let enableBtn = false;
      if (currenTab === 4) {
        if (roles.approver === true)
          // if (status === "Verified") {
          enableBtn = true;
      }
      setEnableBtnApprover(enableBtn);
    }
    a()



  }, [currenTab, roles])





  // console.log("=========merchant doc start==========")
  // console.log("enableBtnVerifier", enableBtnVerifier)
  // console.log("=========merchant doc end==========")

  return (
    <div className="row mb-4 border">
      <div class="col-lg-12">
        <h3 className="font-weight-bold">Merchant Docuemnts</h3>
      </div>

      <div className="col-lg-12 mt-4 m-2">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Document Type</th>
              <th>Document Name</th>
              <th>Document Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {KycDocUpload?.length > 0 ? (
              KycDocUpload?.map((doc, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{getDocTypeName(doc?.type)}</td>
                  <td>
                    <a
                      href={doc?.filePath}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary"
                    >
                      {stringManulate(doc?.name)}
                    </a>
                    <p className="text-danger"> {doc?.comment}</p>
                  </td>
                  <td>{doc?.status}</td>
                  {/* {enableBtnByStatus(doc?.status, role) ? ( */}
                  <td>
                    <div style={{ display: "flex" }}>
                      {/*  || (enableBtnApprover(doc?.status) && enableApproverTabwise) */}
                      {(enableBtnVerifier && doc?.status === "Pending") || (enableBtnApprover && doc?.status === "Verified") ?
                        <>
                      
                          <a className= "text-success"
                            href={() => false}
                            onClick={() => {
                              verifyApproveDoc(doc?.documentId, doc?.status);
                            }}
                        
                            
                          >
                            <h4>{buttonText}</h4>
                          </a>
                        

                          &nbsp;
                          &nbsp;
                          &nbsp;
                          &nbsp;
                          <a
                            href={() => false}
                            className="text-danger"
                            onClick={() => {
                              rejectDoc(doc?.documentId);
                            }}
                          >
                            Reject
                          </a>
                        </>
                        : <></>
                      }


                    </div>
                  </td>

                  {/* {enableBtnVerifier(doc?.status) || (enableBtnApprover(doc?.status) && enableApproverTabwise) ?
                    <td>

                      <a
                        href={() => false}
                        className="text-danger"
                        onClick={() => {
                          rejectDoc(doc?.documentId);
                        }}
                      >
                        Reject
                      </a>

                    </td>
                    : <></>
                  } */}
                </tr>
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default MerchantDocument
