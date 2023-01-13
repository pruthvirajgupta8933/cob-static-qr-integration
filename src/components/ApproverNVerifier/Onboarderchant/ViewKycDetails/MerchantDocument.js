import React, { useState, useEffect } from 'react'
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess';
import { verifyKycDocumentTab, kycDocumentUploadList, approveDoc } from '../../../../slices/kycSlice';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify"


const MerchantDocument = (props) => {
  const { docList,setDocList, docTypeList, role, merchantKycId } = props;
  // const roles = roleBasedAccess();
  const roleBasePermissions = roleBasedAccess()
  const roles = roleBasedAccess();
  const dispatch = useDispatch();
  const { auth, kyc } = useSelector((state) => state);
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab)
  const currenTab = parseInt(verifierApproverTab?.currenTab)
  const Allow_To_Do_Verify_Kyc_details = roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details

  // const { allTabsValidate } = kyc;
  // const BusinessOverviewStatus = allTabsValidate?.BusiOverviewwStatus?.submitStatus?.status;
  // const KycList = kyc?.kycUserList;
  // const kyc_status = KycList?.status;
  // const businessType = KycList?.businessType;

  const { user } = auth;
  const { loginId } = user;
  const { KycDocUpload } = kyc;


  const dropDownDocList = docTypeList?.map((r) => r?.key?.toString()); // Array for documents that is got by business catory type
  const newDropDownDocList = dropDownDocList.filter(element => element !== ''); // remove blank string in array
  // var dropDownList = arr.map(function(e){return e.toString()});
  //  console.log("Array 1 ====>",newDropDownDocList)

  const uploadedDocList = docList?.map((r) => r?.type);

  //  console.log("Array 2",uploadedDocList)
 
  
  const removeCommon = (newDropDownDocList, uploadedDocList) => {
   const spreaded = [...newDropDownDocList, ...uploadedDocList];
   return spreaded.filter(el => {
      return !(newDropDownDocList?.includes(el) && uploadedDocList?.includes(el));
   })
};

let unmatchedArray = removeCommon(newDropDownDocList, uploadedDocList)
// console.log(unmatchedArray)



//////////////////////////////////////////////////////////// function For rejeected document show
const missMatchedId = (id)=>{
  let data = docTypeList.filter((obj) => {
    if (obj?.key?.toString() === id?.toString()) {
      return obj;
    }
  });
  return data[0]
  

}

const getDocTypeNamee = (id) => {
let data= id.map((item)=>{
  return missMatchedId(item);

})

return data;
  };


let pendingDocument=getDocTypeNamee(unmatchedArray)

///////////////////////////////////////////////////////////////////////







  // const leftElements =dropDownDocList.filter(element => !uploadedDocList.includes(element));
  // const differentElements = dropDownDocList.filter(element => !uploadedDocList.includes(element));

  
  // const [array1, setArray1] = useState(newDropDownDocList);
  // const [array2, setArray2] = useState(uploadedDocList);
  // const [mismatch, setMismatch] = useState([]);
  



  // const compareArrays = () => {
  //   const mismatchedValues = [];
  //   for (let i = 0; i < array2.length; i++) {
  //     if (array2[i] !== array1[i]) {
  //       mismatchedValues.push(array2[i]);
  //     }
  //   }
  //   console.log(mismatchedValues,"Mismatched Values")
  //   return mismatchedValues;
  // }


  // console.log("Mismatched values: ",compareArrays().join(', '))
  // const status = KycDocUpload?.status;

  const [buttonText, setButtonText] = useState("");
  const [savedData, setSavedData] = useState([]);
  const [enableBtnApprover, setEnableBtnApprover] = useState(false)
  const [enableBtnVerifier, setEnableBtnVerifier] = useState(false)
  const [closeModal,setCloseModal] = useState(false)
  const[commetText,setCommetText]=useState()

  const [loader, setLoader] = useState(false)
  const[buttonClick,setButtonClick]=useState(null)
  const [selectAll, setSelectAll] = useState(false);

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

  ////////////////////////////////////////////////////

 


 

  const rejectDoc = (doc_id) => {
    const rejectDetails = {
      document_id: doc_id,
      rejected_by: loginId,
      comment:  commetText === undefined || commetText === "" ? "Document Rejected" : commetText,
    };
    dispatch(verifyKycDocumentTab(rejectDetails))
      .then((resp) => {
        resp?.payload?.status && toast.success(resp?.payload?.message);
        setButtonClick(null)
        setCloseModal(false)
        setCommetText("")
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

      : role?.approver === true && currenTab === 4 ?
        setButtonText("Approve")
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

    const verifier = () => {
      let enableBtn = false;
      if (currenTab === 3) {
        if (roles.verifier === true || Allow_To_Do_Verify_Kyc_details === true)
          enableBtn = true;
      }
      setEnableBtnVerifier(enableBtn);
    };
    verifier()




    /////////////////////////////////////////////// button enable condition  for approver

    const approver = () => {
      let enableBtn = false;
      if (currenTab === 4) {
        if (roles.approver === true)
          // if (status === "Verified") {
          enableBtn = true;
      }
      setEnableBtnApprover(enableBtn);
    }
    approver()



  }, [currenTab, roles])

  const handleCheckboxClick = (event) => {
    const newData = [...docList];
    newData.forEach((item) => {
      if (item.id === parseInt(event.target.value)) {
        item.checked = event.target.checked;
      }
    });
    setDocList(newData);
  }

  const handleSelectAll = (event) => {
    const newData = [...docList];
    newData.forEach((item) => {
      console.log("This is the item",item)
      item.checked = event.target.checked;
    });
    setDocList(newData);
    setSelectAll(event.target.checked);
  }
  






  // console.log("=========merchant doc start==========")
  // console.log("enableBtnVerifier", enableBtnVerifier)
  // console.log("=========merchant doc end==========")

  return (
    <div className="row mb-4 border">
      <div className="col-lg-12">
        <h3 className="font-weight-bold">Merchant Documents</h3>
       {pendingDocument?.length === 0 ? null : <p className="font-weight-bold">Not Submitted:</p>}
        {pendingDocument?.map((item)=>{
          return(<> <span className="text-danger"> {item?.value}</span><br/></> )
        })}

              {/* <input
                type="checkbox"
                 checked={selectAll}
                 onClick={handleSelectAll}
              /> */}

       
      </div>

      <div className="col-lg-12 mt-4 m-2">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Check</th>
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
                  {/* <td>
                <input
                  type="checkbox"
                  value={doc?.documentId}
                  checked={doc?.checked}
                  onClick={handleCheckboxClick}
                />
              </td> */}
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

                          <a className="text-success"
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
                            onClick={()=>{setButtonClick(doc?.documentId)
                              setCloseModal(true)}} 
                          // onClick={() => {
                          //   rejectDoc(doc?.documentId);
                          // }}
                          >
                            Reject
                          </a>
                        </>
                        : <></>
                      }


                    </div>
                    {buttonClick===doc?.documentId && closeModal === true ?
          
                    <div>
                      <label for="comments">Reject Comments</label>

                      <textarea id="comments" name="reject_commet" rows="4" cols="20" onChange={(e)=>setCommetText(e.target.value)}>
                      </textarea>
                      <button type="button" onClick={() => { rejectDoc(doc?.documentId,commetText); }} className="btn btn-danger btn-sm text-white">Submit</button>
                    </div>
                    : <></>}

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