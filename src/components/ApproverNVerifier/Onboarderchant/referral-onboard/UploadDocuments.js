import { Formik, Form, Field } from "formik";

const UploadDocuments = () => {
  const docTypeList = ["Aadhar", "PAN", "Cancelled Cheque"];
  const handleChange = (e) => {};
  const onSubmit = () => {};
  return (
    <Formik
      initialValues={{
        option: "A",
        dropdown: "",
        inputs: [{ description: "", file: null }],
      }}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form>
          <div className="mt-4">
            <div className="" style={{ maxHeight: "250px" }}>
              {docTypeList.map((doc, index) => (
                <div
                  className="row mb-3 align-items-center font-weight-bold"
                  key={index}
                >
                  <div className="col-4">
                    <label>{doc}</label>
                  </div>
                  <div className="col-3">
                    <Field name={`files[${index}]`}>
                      {({ field, form, meta }) => (
                        <input
                          type="file"
                          className={`form-control ${
                            meta.error && meta.touched ? "is-invalid" : ""
                          }`}
                          id="3"
                          onChange={(e) => handleChange(e)}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="col-3">
                    <button
                      type="submit"
                      className="btn btn-sm cob-btn-primary text-white ml-5"
                      onClick={() => {}}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {docTypeList.some((doc) =>
              doc?.name?.toLowerCase().split(" ").includes("others")
            ) && (
              <div className="row mb-3 align-items-center font-weight-bold mt-3">
                <div
                  onClick={() => {
                    setFieldValue("option", "B");
                    // const otherDoc = docTypeList.find((doc) =>
                    //   doc?.name?.toLowerCase().split(" ").includes("others")
                    // );
                    // setOtherDocTypeId(otherDoc?.id);
                  }}
                >
                  <label className="text-primary btn cob-btn-primary">
                    Click here to upload other documents
                  </label>
                </div>
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default UploadDocuments;
