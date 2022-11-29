import React from "react";
import NavBar from "../dashboard/NavBar/NavBar";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { useState } from "react";
import FormikController from "../../_components/formik/FormikController";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { authPanValidation } from "../../slices/kycSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const AdditionalKYC = () => {
  const dispatch = useDispatch();

  const datas = [
    { documentType: "PAN", value: "1" },
    { documentType: "GSTIN", value: "2" },
    { documentType: "BANK ACCOUNT", value: "3" },
  ];

  const initialValues = {
    pan_card: "",
  };

  const reqexPAN = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

  const validationSchema = Yup.object({
    pan_card: Yup.string()
      .trim()
      .matches(reqexPAN, "PAN number is Invalid")
      .required("Required")
      .nullable(),
  });

  const [selected, setSelected] = useState("");
  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  console.log(selected, " <============== Selected");

  const handleSubmit = (values) => {
    dispatch(
      authPanValidation({
        pan_number: values.pan_card,
      })
    ).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        toast.success(res.payload.message);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Additional KYC</h1>
            <div className="container">
              <div className="row">
                <div className="mr-5"></div>
              </div>
            </div>
          </div>
          <section
            className="features8 cid-sg6XYTl25a flleft-"
            id="features08-3-"
          >
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12 mb-4 bgcolor-">
                  <div className="form-group col-lg-3 col-md-12 mt-2">
                    <label>Document Type</label>
                    <select
                      className="ant-input"
                      documentType={selected}
                      onChange={handleChange}
                    >
                      <option value="Select a Document">
                        Select a Document
                      </option>
                      {datas.map((datas) => (
                        <option value={datas.value}>
                          {datas.documentType}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                <Form className="form">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-6">
                        <FormikController
                          control="input"
                          type="text"
                          name="pan_card"
                          className="form-control"
                          placeholder="Enter your PAN"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <button
                        type="submit"
                        className="btn float-lg-right btnbackground text-white"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </Form>
              </Formik>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdditionalKYC;

