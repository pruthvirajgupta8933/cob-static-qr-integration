import React,{useState,useEffect} from 'react'
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess';
import { verifyKycDocumentTab,kycDocumentUploadList} from '../../../../slices/kycSlice';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const MerchantDocument = (props) => {
    const{docList,docTypeList,role,merchantKycId}=props;
    // const roles = roleBasedAccess();
    const roleBasePermissions = roleBasedAccess()
  const roles = roleBasedAccess();
    const dispatch = useDispatch();
    const { auth,kyc } = useSelector((state) => state);
    const verifierApproverTab =  useSelector((state) => state.verifierApproverTab)
  const currenTab =  parseInt(verifierApproverTab?.currenTab)
  const Allow_To_Do_Verify_Kyc_details= roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_detailsppe
    
    const { allTabsValidate } = kyc;
    const BusinessOverviewStatus = allTabsValidate?.BusiOverviewwStatus?.submitStatus?.status;
    const KycList = kyc?.kycUserList;
    const kyc_status = KycList?.status;
    const businessType = KycList.businessType;
 
    const { user } = auth;
    const { loginId } = user;
    const { KycDocUpload } = kyc;
    console.log("now the current result",kyc)
   
    
  const status=KycDocUpload?.status;
  // console.log("now the current result",status)
    
   

   

    const [buttonText, setButtonText] = useState("Upload Document");
    const [savedData, setSavedData] = useState([]);
    
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
          kycDocumentUploadList({login_id:merchantKycId.loginMasterId})
            
        );
      };

      const verifyApproveDoc = (doc_id) => {
       const postData = {
            document_id: doc_id,
            verified_by: loginId,
          };
    
          dispatch(verifyKycDocumentTab(postData)).then((resp) => {
           if(resp?.payload?.status){
            getKycDocList(role);
               toast.success(resp?.payload?.message)
           }else{
              toast.error(resp?.payload?.message)
           }
    
            });

            
        
    
        // if (role?.approver) {
        //   const approverDocDetails = {
        //     approved_by: loginId,
        //     document_id: doc_id,
        //   };
        //   dispatch(approveDoc(approverDocDetails)).then((resp) => {
        //     resp?.payload?.status
        //       ? toast.success(resp?.payload?.message)
        //       : toast.error(resp?.payload?.message);
    
        //     getKycDocList(role);
        //   });
        // }
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

      
      const enableBtnByStatus = (imgStatus, role) => {
       
        const imageStatus = imgStatus?.toString()?.toLowerCase();
        const loggedInRole = role;
        let enableBtn = false;
    
        if (loggedInRole?.verifier) {
          if (imageStatus === "verified") {
            enableBtn = false;
          }
    
          if (imageStatus !== "verified") {
            enableBtn = true;
          }
    
          if (imageStatus === "approved") {
            enableBtn = false;
          }
        }
    
        if (loggedInRole?.approver) {
          if (imageStatus === "verified") {
            enableBtn = true;
          }
          if (imageStatus === "approved") {
            enableBtn = false;
          }
        }
    
        return enableBtn;
      };

      useEffect(() => {
        if (role.approver) {
          // setReadOnly(true);
          setButtonText("Approve");
        } else if (role.verifier) {
          // setReadOnly(true);
          setButtonText("Verify");
        }
      }, [role]);

      const enableBtn = () => {
        let enableBtn = false;
         if (currenTab===3 || currenTab===4) {
           if ((roles.verifier===true || Allow_To_Do_Verify_Kyc_details===true) || (roles.approver=true)) {
            enableBtn = true;
            
          }
        }
    return enableBtn;
      };
    let enableDisable=enableBtn();

    const btnByStatus = (status) => {
      let enableBtn = false;
    
      if (roles?.verifier===true ) {
        if ( status === "pending") {
          enableBtn = true;
          console.log("i am in if")
        }
    }
    return enableBtn;
    }
    let enableBtnStatus=enableBtnByStatus()
    console.log(enableBtnStatus,"this is status")


    
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
            { enableDisable  ? <th>Action</th> : <></>}
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
                                    {enableDisable && btnByStatus(doc?.status) ?
                                      <a 
                                        className = "text-success"
                                        href="false"
                                        // onClick={()=>alert("yes this is working")}
                                        onClick={() => {
                                            verifyApproveDoc(doc?.documentId);
                                        }}
                                      >
                                        <h4>Verify</h4>
                                      </a>
                                        : <></> 
                                      }
                                    
                                      &nbsp;
                                      &nbsp;
                                      &nbsp;
                                      &nbsp;
                                      
   
                                    
                                      <a
                                        className="text-danger"
                                        href="false"
                                        onClick={() => {
                                          // rejectDoc(doc?.documentId);
                                        }}
                                      >
                                        {/* <h4>Reject</h4> */}
                                      </a>
                                      </div>
                                  </td>
                                {/* ) : roles.verifier === true ||
                                  roles.approver === true ? ( */}
                                   { enableDisable && btnByStatus(doc?.status) ? 
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
                                  }
                                  
                                {/* ) : (
                                  <></>
                                )} */}

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
