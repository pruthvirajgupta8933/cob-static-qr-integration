/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess';
import { verifyKycDocumentTab, kycDocumentUploadList, approveDoc } from '../../../../slices/kycSlice';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify"
import classes from "./viewStatus.module.css"
import { v4 as uuidv4 } from 'uuid';
import CompleteVerifyAndRejectBtn from './CompleteVerifyAndRejectBtn';

const MerchantDocument = (props) => {
  const { docList, docTypeList, role, selectedUserData } = props;
  const roleBasePermissions = roleBasedAccess()
  const roles = roleBasedAccess();
  const dispatch = useDispatch();
  const { auth, kyc } = useSelector((state) => state);
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab)
  const currenTab = parseInt(verifierApproverTab?.currenTab)
  const Allow_To_Do_Verify_Kyc_details = roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details

  const { user } = auth;
  const { loginId } = user;
  const { KycDocUpload } = kyc;


  const dropDownDocList = docTypeList?.map((r) => r?.key?.toString()); // Array for documents that is got by business catory type
  const newDropDownDocList = dropDownDocList.filter(element => element !== ''); // remove blank string in array
  const uploadedDocList = Object.values(docList)?.map((r) => r?.type)

  const removeCommon = (newDropDownDocList, uploadedDocList) => {
    const spreaded = [...newDropDownDocList, ...uploadedDocList];
    return spreaded.filter(el => {
      return !(newDropDownDocList?.includes(el) && uploadedDocList?.includes(el));
    })
  };

  let unmatchedArray = removeCommon(newDropDownDocList, uploadedDocList)
  // console.log(unmatchedArray)



  //////////////////////////////////////////////////////////// function For rejeected document show
  const missMatchedId = (id) => {
    let data = docTypeList.filter((obj) => {
      if (obj?.key?.toString() === id?.toString()) {
        return obj;
      }
    });
    return data[0]


  }

  const getDocTypeNamee = (id) => {
    let data = id.map((item) => {
      return missMatchedId(item);

    })

    return data;
  };


  let pendingDocument = getDocTypeNamee(unmatchedArray)

  ///////////////////////////////////////////////////////////////////////
  const [buttonText, setButtonText] = useState("");
  const [enableBtnApprover, setEnableBtnApprover] = useState(false)
  const [enableBtnVerifier, setEnableBtnVerifier] = useState(false)
  const [closeModal, setCloseModal] = useState(false)
  const [commetText, setCommetText] = useState()
  const [documentsIdList, setdocumentsIdList] = useState([])

  const [checkedClicked, setCheckedClicked] = useState(false)
  // console.log("checkedClicked",checkedClicked)
  // const [enableeBtn, setEnableBtn] = useState(false)

  // console.log("this is the real statsus",staus)

  // const [loader, setLoader] = useState(false)
  const [buttonClick, setButtonClick] = useState(null)


  const getDocTypeName = (id) => {
    // eslint-disable-next-line array-callback-return
    let data = docTypeList.filter((obj) => {
      if (obj?.key?.toString() === id?.toString()) {
        return obj;
      }
    });

    // console.log("data",data)
    return data[0]?.value;
  };



  const getKycDocList = (role) => {
    dispatch(
      kycDocumentUploadList({ login_id: selectedUserData?.loginMasterId })

    );
  };

  const verifyApproveDoc = (doc_id, status) => {
    const postData = {
      document_id: [doc_id],
      verified_by: loginId,
    };
    // setLoader(true)
    setCloseModal(false)


    if (Allow_To_Do_Verify_Kyc_details === true || role?.verifier)
      if (currenTab === 3 && status === "Pending") {
        dispatch(verifyKycDocumentTab(postData)).then((resp) => {
          if (resp?.payload?.status) {
            getKycDocList(role);
            toast.success(resp?.payload?.message)
            // setLoader(false)

          } else {
            toast.error(resp?.payload?.message)
            // setLoader(false)
          }

        });

      }

    if (role?.approver && status === "Verified") {
      const approverDocDetails = {
        approved_by: loginId,
        document_id: [doc_id],
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
      comment: commetText === undefined || commetText === "" ? "Document Rejected" : commetText,
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

    if (role?.approver === true && Allow_To_Do_Verify_Kyc_details === true && currenTab === 3) {
      setButtonText("Verify")
    }
    if (role?.approver === true && currenTab === 4) {
      setButtonText("Approve")

    }
    if (role?.verifier === true) {
      setButtonText("Verify")

    } else {
      <></>
    }
  }, [role, Allow_To_Do_Verify_Kyc_details]);


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

          enableBtn = true;
      }
      setEnableBtnApprover(enableBtn);
    }
    approver()



  }, [currenTab, roles])

  //  console.log("this is single handle ", documentsIdList)////////////////// send it in api payload






  useEffect(() => {


  }, [documentsIdList])

  const handleCheckboxClick = (event) => {
    let data = documentsIdList
    // console.log("this is envent id ", event.target.value, data, data.indexOf(parseInt(event.target.value)))
    if (data.indexOf(parseInt(event.target.value)) === -1) {
      data.push(parseInt(event.target.value))
      setdocumentsIdList(prev => [...data])
      setCheckedClicked(true)
    }
    else {
      data.splice(data.indexOf(parseInt(event.target.value)), 1)
      setdocumentsIdList(prev => [...data])
      setCheckedClicked(true)
    }
    data?.length === 0 && setCheckedClicked(false)
  }



  // const handleCheckboxClick = (id) => {
  //   // if (event.target.checked) {
  //   // setdocumentsIdList(prev => ([...prev, parseInt(event.target.value)]))
  //   // setCheckedClicked(true)
  //   // }
  //   // else {
  //   let data = documentsIdList
  //   if (data.indexOf(id) === -1) {
  //     data.push(id)
  //   } else {
  //     data.splice(data.indexOf(id))  // use splice id changed if always exist and add in array if not exist
  //     // The Array.splice() method adds array elements
  //   }
  //   setdocumentsIdList(data)
  //   setCheckedClicked(false)
  // }

  const handleCheckChange = (e) => {
    let dataList = []
    if (e.target?.checked) {
      KycDocUpload.map((item) => {
        dataList.push(item.documentId)
        setdocumentsIdList(dataList)
        setCheckedClicked(true)
      })
    }
    else {
      setdocumentsIdList([])
      setCheckedClicked(false)
    }
  }



  // console.log("=========merchant doc start==========")
  // console.log("enableBtnVerifier", enableBtnVerifier)
  // console.log("=========merchant doc end==========")
  // console.log("Check boolean", checkedClicked)

  return (
    <div className="row mb-4 border p-1">
      <h5 className="">Merchant Documents</h5>
      {pendingDocument?.length === 0 ? null : <p className="font-weight-bold m-0">Not submitted document list:</p>}
      {pendingDocument?.map((item) => {
        return (<React.Fragment key={uuidv4()}> <span className="text-danger"> {item?.value}</span><br /></React.Fragment>)
      })}


      <div className="col-lg-12 mt-4 m-2 hoz-scroll">
        <table className="table table-bordered w-100">
          <thead>
            {checkedClicked === true && (roles.approver || roles.verifier) &&
              <th colSpan={6} style={{ textAlign: "right" }}>
                <CompleteVerifyAndRejectBtn
                  roles={roles}
                  roleBasePermissions={roleBasePermissions}
                  setdocumentsIdList={setdocumentsIdList}
                  selectedUserData={selectedUserData}
                  documentsIdList={documentsIdList}
                  docList={docList}
                  setCheckedClicked={setCheckedClicked}
                  checkedClicked={checkedClicked}
                />
              </th>
            }
            <tr>
              {(currenTab === 3 || currenTab === 4) && (roles.approver || roles.verifier) &&
                <th>
                  <input
                    type="checkbox"
                    checked={documentsIdList?.length === KycDocUpload?.length ? true : false}
                    onChange={(e) => handleCheckChange(e)} /></th>
              }
              <th>S.No.</th>
              <th>Merchant&nbsp;Document</th>
              <th>Document&nbsp;Comment</th>
              {/* <th>Document&nbsp;Status</th> */}
              <th>Action</th>

            </tr>
          </thead>

          <tbody>
            {KycDocUpload?.length > 0 ? (
              KycDocUpload?.map((doc, i) => {
                return (
                  <tr key={uuidv4()} >
                    {(currenTab === 3 || currenTab === 4) && (roles.approver || roles.verifier) ?
                      <td>

                        <input
                          type="checkbox"
                          value={doc?.documentId}
                          checked={documentsIdList?.indexOf(parseInt(doc.documentId)) !== -1 ? true : false}
                          // first check the index if greater then -1  then execute further process
                          onClick={handleCheckboxClick}
                        />
                      </td>
                      : <></>}
                    <td>{i + 1}</td>

                    <td><p className="text-wrap"><span className='font-weight-bold'>Doc.Type:</span> {getDocTypeName(doc?.type)}</p>
                      <p><span className='font-weight-bold'>Doc.Status:</span> {doc?.status}</p>
                      <a href={doc?.filePath}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary" >
                        View Document
                      </a>

                    </td>
                    <td>
                      <p className={`text-danger ${classes.cursor_pointer}`}> {doc?.comment === "Null" ? "" : doc?.comment}</p>
                    </td>
                    {/* <td>{doc?.status}</td> */}

                    {/* {enableBtnByStatus(doc?.status, role) ? ( */}
                    <td>
                      <div style={{ display: "flex" }}>
                        {/*  || (enableBtnApprover(doc?.status) && enableApproverTabwise) */}
                        {(enableBtnVerifier && doc?.status === "Pending") || (enableBtnApprover && doc?.status === "Verified") ?
                          <>
                            <a
                              href={() => false}
                              className={`${classes.cursor_pointer}`}
                              onClick={() => {
                                verifyApproveDoc(doc?.documentId, doc?.status);
                              }}
                            >
                              <h5 className="text-success fs-6">{buttonText}</h5>
                            </a>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <a
                              href={() => false}
                              className={`${classes.cursor_pointer}`}
                              onClick={() => {
                                setButtonClick(doc?.documentId)
                                setCloseModal(true)
                              }}
                            // onClick={() => {
                            //   rejectDoc(doc?.documentId);
                            // }}
                            >
                              <h5 className="text-danger fs-6">Reject</h5>
                            </a>
                          </>
                          : <></>
                        }
                      </div>
                      {buttonClick === doc?.documentId && closeModal === true ?
                        <div style={{ "display": "grid" }}>
                          <label for="comments">Reject Comments</label>

                          <textarea id="comments" name="reject_commet" rows="4" cols="20" onChange={(e) => setCommetText(e.target.value)}>
                          </textarea>
                          <button type="button" onClick={() => { rejectDoc(doc?.documentId, commetText) }} className="mt-1 btn btn-danger btn-sm text-white">Submit</button>
                        </div>
                        : <></>}
                    </td>
                  </tr>
                )
              }
              )
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