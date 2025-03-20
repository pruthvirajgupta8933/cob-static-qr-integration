import { Formik, Form, Field } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import toastConfig from "../../../../utilities/toastTypes";
import { documentsUpload, merchantInfo } from "../../../../slices/kycSlice";

const UploadDocuments = ({ disableForm, setInfoModal }) => {
  const { user } = useSelector((state) => state.auth);
  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse?.data
  );
  const kycData = useSelector((state) => state.kyc?.kycUserList);
  const docList = useSelector((state) => state.kyc.documentsUpload);
  const [docTypeList, setDocTypeList] = useState(docList ?? []);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!docList?.length > 0)
      dispatch(
        documentsUpload({
          businessType:
            kycData?.businessType ?? basicDetailsResponse?.business_cat_code,
          is_udyam: false,
        })
      )
        .then((resp) => {
          setDocTypeList(resp?.payload);
        })
        .catch((err) => {
          toastConfig.errorToast(
            err?.message ?? "Error fetching the list of required documents"
          );
        });
  }, []);

  useEffect(() => {
    if (basicDetailsResponse && !kycData?.isEmailVerified) setInfoModal(true);
  }, []);

  const initialValues = {
    docType: "",
    document_img: "",
  };

  const handleUpload = (doc_id, file, setFieldValue) => {
    setFieldValue(`${doc_id}_loading`, true);
    const bodyFormData = new FormData();
    bodyFormData.append("files", file);
    bodyFormData.append(
      "login_id",
      kycData?.loginMasterId ?? basicDetailsResponse?.loginMasterId
    );
    bodyFormData.append("modified_by", user?.loginId);
    bodyFormData.append("type", doc_id);

    const data = { bodyFormData, doc_id };

    dispatch(merchantInfo(data))
      .then((res) => {
        if (res?.payload?.status) {
          setFieldValue(`${doc_id}_uploaded`, 1);
          toastConfig.successToast(res?.payload?.message);
        } else {
          const message =
            res?.payload?.message || res?.payload?.message?.toString();
          toast.error(message);
        }
        setFieldValue(`${doc_id}_loading`, false);
      })
      .catch(function (error) {
        toast.error("Something went wrong while saving the document");
        setFieldValue(`${doc_id}_loading`, false);
      });
  };
  return docTypeList?.length > 0 ? (
    <Formik initialValues={initialValues}>
      {({ values, setFieldValue, resetForm }) => (
        <Form>
          <div className="mt-4">
            <div className="overflow-auto" style={{ maxHeight: "250px" }}>
              {docTypeList.map(
                (doc, index) =>
                  Boolean(doc.status) && (
                    <div
                      className="row mb-3 align-items-center font-weight-bold"
                      key={index}
                    >
                      <div className="col-4">
                        <label>{doc.name}</label>
                      </div>
                      <div className="col-4">
                        <Field name={`files[${index}]`}>
                          {({ field, form, meta }) => (
                            <input
                              type="file"
                              className={`form-control ${meta.error && meta.touched ? "is-invalid" : ""
                                }`}
                              onChange={(e) => {
                                setFieldValue(
                                  `files[${index}]`,
                                  e.target.files[0]
                                );
                                setFieldValue(`${doc.id}_uploaded`, "");
                              }}
                              key={values[`files[${index}]`]}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="col-3">
                        <button
                          type="submit"
                          className="btn btn-sm cob-btn-primary text-white"
                          disabled={
                            values[`${doc.id}_loading`] ||
                            !values.files?.[index] ||
                            values[`${doc.id}_uploaded`] ||
                            disableForm
                          }
                          onClick={() => {
                            handleUpload(
                              doc.id,
                              values.files?.[index],
                              setFieldValue
                            );
                          }}
                        >
                          {values[`${doc.id}_uploaded`]
                            ? "Uploaded Successfully"
                            : "Upload"}
                        </button>
                      </div>
                      <div className="col-1">
                        {/* {values[`${doc.id}_uploaded`] && (
                          <a
                            href={null}
                            role="button"
                            className="link-primary"
                            onClick={() => {
                              setFieldValue(`files[${index}]`, "");
                              resetForm();
                              console.log(values);
                            }}
                          >
                            Reset
                          </a>
                        )} */}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  ) : (
    <p>Document List not found</p>
  );
};
export default UploadDocuments;
