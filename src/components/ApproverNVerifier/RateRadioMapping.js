import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import FormikController from "../../_components/formik/FormikController";

const initialStateForRadio = {
  isChecked: "",
};

const NewvalidationSchemaforRadio = Yup.object({
  isChecked: Yup.string()
    .required("Please choose Rate Template")
    .nullable(),
});

const RateRadioMapping = (props) => {
  const { user } = useSelector((state) => state.auth);
  const loginId = user.loginId;
  const username = user.clientContactPersonName;

  const radiobutton = [{ key: "", value: "true" }];

  const handleSubmitForRadio = (values) => {
    // console.log(values)
  };
  const onClick = (client_code) => {
    alert(
      `Parent ClientCode : ${client_code} \n Chield ClientCode: ${props.chiledCode.clientCode} \n UserName: ${username}`
    );
  };
  return (
    <div>
      <table class="table mt-5-">
        <thead>
          <tr>
            <th scope="col">Check</th>
            <th scope="col">ClientCode</th>
            <th scope="col">Template Name</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(props?.riskTemplate)
            ? props?.riskTemplate?.map((riskTemplate, i) => (
                <tr>
                  <td>
                    <div class="form-check">
                      <Formik
                        initialValues={initialStateForRadio}
                        validationSchema={NewvalidationSchemaforRadio}
                        // onSubmit={(values) => {
                        //     handleSubmitForRadio(values);
                        // }}
                        enableReinitialize={true}
                      >
                        {(formik) => (
                          <Form>
                            {/* {console.log("formik", formik)} */}
                            <FormikController
                              control="radio"
                              name="isChecked"
                              options={radiobutton}
                              className="form-control"
                            />
                            <button
                              type="button"
                              onClick={() => onClick(riskTemplate?.client_code)}
                              class="btn btn-primary"
                            >
                              Submit
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </td>
                  <td>{riskTemplate?.client_code}</td>
                  <td>{riskTemplate?.rate_template_name}</td>
                </tr>
              ))
            : []}
        </tbody>
      </table>
    </div>
  );
};

export default RateRadioMapping;
