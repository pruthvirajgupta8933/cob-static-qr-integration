/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess';
import { verifyKycDocumentTab, kycDocumentUploadList, approveDoc } from '../../../../slices/kycSlice';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify"
import classes from "./viewStatus.module.css"
import { v4 as uuidv4 } from 'uuid';
import CompleteVerifyAndRejectBtn from './CompleteVerifyAndRejectBtn';
import { useRef } from 'react';
import { trimValue } from '../../../../utilities/trim';
import CustomModal from '../../../../_components/custom_modal';
import DocViewerComponent from '../../../../utilities/DocViewerComponent';
import { forGettingCommentList } from '../../../../slices/merchantZoneMappingSlice';
import DateFormatter from '../../../../utilities/DateConvert';
// import DocViewerComponent from '../../../../utilities/DocViewerComponent';

const MerchantDocument = (props) => {
  const { docList, docTypeList, role, selectedUserData } = props;
  const roleBasePermissions = roleBasedAccess()
  const roles = roleBasedAccess();
  const dispatch = useDispatch();
  const commentRef = useRef({})
  const [commentBtnLoader, setCommentBtnLoader] = useState(false)

  const { auth, kyc, zone } = useSelector((state) => state);
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab)

  const currenTab = parseInt(verifierApproverTab?.currenTab)
  const Allow_To_Do_Verify_Kyc_details = roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details

  const { user } = auth;
  const { loginId } = user;
  const { KycDocUpload } = kyc;
  const { commentData } = zone


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
  const [commetText, setCommetText] = useState("")
  const [documentsIdList, setdocumentsIdList] = useState([])
  const [checkedClicked, setCheckedClicked] = useState(false)
  const [buttonClick, setButtonClick] = useState(null)

  const [docPreviewToggle, setDocPreviewToggle] = useState(false)
  const [selectViewDoc, setSelectedViewDoc] = useState("#")



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

  const getKycDocList = () => {
    const loginId = selectedUserData?.loginMasterId
    if (loginId != undefined && loginId != "") {
      const postData = {
        login_id: loginId
      }

      dispatch(kycDocumentUploadList(postData));

    }
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
    setCommentBtnLoader(true)
    const commentTxt = trimValue(commentRef?.current?.[doc_id]?.value)

    const rejectDetails = {
      document_id: doc_id,
      rejected_by: loginId,
      comment: commentTxt === undefined || commentTxt === "" ? "Document Rejected" : commentTxt,
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
        setCommentBtnLoader(false)

        getKycDocList(role);
      })
      .catch((e) => {
        setCommentBtnLoader(false)
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
    }
  }, [role, Allow_To_Do_Verify_Kyc_details]);


  useEffect(() => {
    if (currenTab === 3) {
      if (roles.verifier === true || Allow_To_Do_Verify_Kyc_details === true)
        setEnableBtnVerifier(true);
    }

    if (currenTab === 4) {
      if (roles.approver === true)
        setEnableBtnApprover(true);
    }
    // dispatch(forGettingCommentList({ client_code: selectedUserData?.clientCode }))

  }, [currenTab, roles, Allow_To_Do_Verify_Kyc_details])




  const handleCheckboxClick = (event) => {
    let data = documentsIdList
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

  const fetchCommentDocCB = useCallback(() => {
    if (selectedUserData?.clientCode) {
      return dispatch(forGettingCommentList({ client_code: selectedUserData?.clientCode }))
    }
  }, [selectedUserData?.clientCode])


  useEffect(() => {
    fetchCommentDocCB()
  }, [selectedUserData?.clientCode])

  // document viewer 



  // const getFileType = (url) => {

  //   const extension = url?.split('.')?.pop()?.toLowerCase(); // Get the file extension

  //   if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension)) {
  //     return 'image';
  //   } else if (extension === 'pdf') {
  //     return 'pdf';
  //   } else {
  //     return 'unsupported';
  //   }
  // };



  // console.log("=========merchant doc start==========")
  // console.log("enableBtnVerifier", enableBtnVerifier)
  // console.log("=========merchant doc end==========")
  // console.log("Check boolean", checkedClicked)



  const docModalToggle = (docData) => {
    setDocPreviewToggle(true)
    setSelectedViewDoc(docData)
  }

  return (
    <div className="row mb-4 border p-1">
      <h6>Merchant Documents</h6>
      {pendingDocument?.length === 0 ? null : <p className="font-weight-bold m-0">Not submitted document list:</p>}
      {pendingDocument?.map((item) => {
        return (<React.Fragment key={uuidv4()}> <span className="text-danger"> {item?.value}</span><br /></React.Fragment>)
      })}

      {docPreviewToggle && <DocViewerComponent modalToggle={docPreviewToggle} fnSetModalToggle={setDocPreviewToggle} selectViewDoc={{ documentUrl: selectViewDoc?.filePath, documentName: selectViewDoc?.doc_type_name }} />}
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
              <th>Merchant Document</th>
              <th>Document Comment</th>
              <th>Action</th>

            </tr>
          </thead>

          <tbody>
            {KycDocUpload?.length > 0 ? (
              KycDocUpload?.map((doc, i) => {
                return (
                  <tr key={uuidv4()}  >
                    {(currenTab === 3 || currenTab === 4) && (roles.approver || roles.verifier) &&
                      <td>
                        <input
                          type="checkbox"
                          value={doc?.documentId}
                          checked={documentsIdList?.indexOf(parseInt(doc.documentId)) !== -1 ? true : false}
                          // first check the index if greater then -1  then execute further process
                          defaultChecked={false}
                          onClick={handleCheckboxClick}
                        />
                      </td>
                    }

                    <td>{i + 1}</td>

                    <td>
                      <p className="text-wrap mb-1"><span className='font-weight-bold'>Doc.Type:</span> {getDocTypeName(doc?.type)}</p>
                      <p><span className='font-weight-bold'>Doc.Status:</span> {doc?.status}</p>
                      <p
                        className="text-primary cursor_pointer text-decoration-underline"
                        rel="noreferrer"
                        onClick={() => docModalToggle(doc)}
                      >
                        View Document
                      </p>

                    </td>

                    <td>
                      <p className={`text-danger ${classes.cursor_pointer}`}> {doc?.comment === "Null" ? "" : doc?.comment} </p>
                    </td>

                    <td>
                      <div className="d-flex">
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
                            >
                              <h5 className="text-danger fs-6">Reject</h5>
                            </a>
                          </> : <></>
                        }
                      </div>
                      {buttonClick === doc?.documentId && closeModal === true &&
                        <div style={{ "display": "grid" }}>
                          <label for="comments">Reject Comments</label>


                          {commentBtnLoader ? <div className="col-lg-12 col-md-12">
                            <div className="text-center">
                              <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                              </div>
                            </div>
                          </div> :
                            <>
                              <input ref={ref => commentRef.current[doc?.documentId] = ref} type="text" name="reject_commet" />
                              <button type="button" onClick={() => { rejectDoc(doc?.documentId) }} className="mt-1 btn btn-danger btn-sm text-white">Submit</button>
                            </>
                          }

                        </div>
                      }
                    </td>
                  </tr>
                )
              }
              )
            ) : (
              <></>
            )}
            {commentData?.data?.length > 0 && <tr>
              <td colspan="4" className="text-center fw-bold">Comment Section Document</td>
            </tr>}

            {(commentData?.data?.length !== undefined || commentData?.data?.length > 0) && commentData?.data?.map((commentData, i) => (
              commentData?.file_path && <tr key={uuidv4()} >
                <td> {i + 1} </td>
                <td>
                  <p className="text-wrap mb-1"><span className='font-weight-bold'>Comment By:</span> {commentData?.comment_by_user_name.toUpperCase()}</p>
                  <p className="text-wrap mb-1"><span className='font-weight-bold'>Comment Tab:</span> {commentData?.merchant_tab ?? commentData?.comment_type}</p>
                  <p
                    className="text-primary cursor_pointer text-decoration-underline"
                    rel="noreferrer"
                    onClick={() => docModalToggle({ filePath: commentData?.file_path, doc_type_name: commentData?.file_name })}>
                    View Document
                  </p>
                </td>

                <td style={{ overflowWrap: "anywhere" }} colspan="3">
                  <p>{commentData?.comments}</p>
                </td>
              </tr>
            ))}

          </tbody>
        </table>

      </div>
    </div>
  )
}

export default MerchantDocument