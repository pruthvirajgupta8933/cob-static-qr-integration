import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import FormikController from "../../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import "../KYC/kyc-style.css";
import API_URL from "../../config";
import { approveDoc, documentsUpload, merchantInfo, verifyKycDocumentTab, verifyKycEachTab } from "../../slices/kycSlice";

function DocumentsUpload(props) {
  const { role, kycid } = props;
  const [docTypeList, setDocTypeList] = useState([]);
  const [fieldValue, setFieldValue] = useState(null);
  const [visibility, setVisibility] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Save and Next");

  const [photos, setPhotos] = useState([]);
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;
  const dispatch = useDispatch();

  const KycDocList = useSelector((state) => state.kyc.KycDocUpload);

  const VerifyKycStatus = useSelector(
    (state) => state.kyc.KycDocUpload[0]?.status
  );

console.log(KycDocList)

  const initialValues = {
    docType: KycDocList[0]?.type,
    docFile: KycDocList[0]?.filePath,
    isRejected: false,
  };

  const documentId = useSelector(
    (state) => state.kyc.KycDocUpload[0]?.documentId
  );

  const ImgUrl = `${API_URL.Image_Preview}/?document_id=${documentId}`;
  // console.log(ImgUrl,"<===========KYC DOC Id===========>")
  // console.log(KycDocList,"<===========KYC DOC List===========>")

  useEffect(() => {
    dispatch(documentsUpload())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "id",
          "name",
          resp.payload.results
        );
        setDocTypeList(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const validationSchema = Yup.object({
    docType: Yup.string().required("Required").nullable(),
    docFile: Yup.mixed()
      .nullable()
      .required("Required file format PNG/JPEG/JPG/PDF"),
  });

  const displayImages = () => {
    return photos.map((photo) => {
      return <img src={photo} alt="" />;
    });
  };

  //----------------------------------------------------------------------

  //-------------------------------------------------------------------------
  const onSubmit = (values, action) => {


    if (role.merchant) {

      const bodyFormData = new FormData();
      bodyFormData.append("files", fieldValue);
      bodyFormData.append("login_id", loginId);
      bodyFormData.append("modified_by", loginId);
      bodyFormData.append("type", values.docType);
      dispatch(merchantInfo(bodyFormData)).then((res) => {
        if (
          res.meta.requestStatus === "fulfilled" &&
          res.payload.status === true
        ) {
          toast.success(res.payload.message);
        } else {
          toast.error("Something Went Wrong! Please try again.");
        }
      });

    } else if (role.verifier) {

      if (action === "submit") {
        const veriferDetails = {
          "verified_by": loginId,
          "document_id": documentId
        }
        dispatch(verifyKycDocumentTab(veriferDetails)).then(resp => {

          resp?.payload?.status ? toast.success(resp?.payload?.message) : toast.error(resp?.payload?.message);

        }).catch((e) => { toast.error("Try Again Network Error") });

      }


      if (action === "reject") {
        const rejectDetails = {
          "document_id": documentId,
          "rejected_by": loginId,
        "comment": "Document Rejected"
      }
      dispatch(verifyKycDocumentTab(rejectDetails)).then(resp => {
     
        resp?.payload?.status ? toast.success(resp?.payload?.message) : toast.error(resp?.payload?.message);
  
      }).catch((e) => { toast.error("Try Again Network Error") });
  
  
      }

    }else if(role.approver){

      if (action === "approve") {

        const approverDocDetails = {
          "approved_by": loginId,
          "document_id": documentId
        }
        dispatch(approveDoc(approverDocDetails)).then(resp => {

          resp?.payload?.status ? toast.success(resp?.payload?.message) : toast.error(resp?.payload?.message);

        }).catch((e) => { toast.error("Try Again Network Error") });
      }

    }

    





  };

  useEffect(() => {
    if (role.approver) {
      setReadOnly(true)
      setButtonText("Approve Document")
    } else if (role.verifier) {
      setReadOnly(true)
      setButtonText("Verify and Next")
    }
  }, [role])

  let submitAction = undefined;

  return (
    <div className="col-md-12 col-md-offset-4">
      <div className="">
        <p>

          Note : Please complete Business Overview Section to view the list of
          applicable documents!
        </p>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values, submitAction)
        }}
      >
        {(formik) => (
          <Form>
            <ul className="list-inline  align-items-center ">
              <li className="list-inline-item align-middle  w-25">
                <div className="form-group col-md-12">
                  <FormikController
                    control="select"
                    label="Document Type"
                    name="docType"
                    className="form-control"
                    options={docTypeList}
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                    readOnly={readOnly}
                  />
                </div>
              </li>
              <li className="list-inline-item align-middle   w-25">

                {role.merchantInfo ? <div className="form-group col-md-12">
                  <FormikController
                    control="file"
                    type="file"
                    label="Select Document"
                    name="docFile"
                    className="form-control-file"
                    onChange={(event) => {
                      // setFieldValue(event.target.files[0]);
                      setFieldValue(
                        "docFile",
                        event.target.files[0].name
                      );
                    }}
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                    readOnly={readOnly}

                  // onChange={(event)=>{setFieldValue(event.target.files[0])}}
                  />
                </div> : <></>}

              </li>
              <li className="list-inline-item align-middle w-25">
                {VerifyKycStatus === "Verified" || VerifyKycStatus === "Approved"  ? 
                    <button className="btn btn-danger mb-0 text-white" type="button"
                      onClick={() => { submitAction = "reject"; formik.handleSubmit() }} >
                      Reject Document
                    </button>
 : (
                  <>
                    <button className="btn btn-primary mb-0" type="button" onClick={() => { submitAction = "submit"; formik.handleSubmit() }}>
                      {buttonText}
                    </button>

                  </>
                )}

                {(role.approver===true && VerifyKycStatus !== "Approved") &&  <button className="btn btn-primary mb-0" type="button" onClick={() => { submitAction = "approve"; formik.handleSubmit() }}>
                      {buttonText}
                    </button> }
              </li>
              {/* <li className="list-inline-item align-middle   w-25" > Download</li> */}
            </ul>
            {/* {console.log(formik)} */}
          </Form>
        )}
      </Formik>
      <div></div>
      {user?.roleId === 3 && user?.roleId === 13 ? (
        <></>
      ) : documentId === null ? (
        ""
      ) :
        documentId !== 'undefined' ? <div class="mt-md-4">
          <h4 class="font-weight-bold mt-xl-4">ImagePreview</h4>
          <a href={ImgUrl} target="_blank" rel="noreferrer">
            <img src={ImgUrl} alt="" width="150px" height="150px" />
          </a>
        </div> : <></>}


    </div>
  );
}

export default DocumentsUpload;
