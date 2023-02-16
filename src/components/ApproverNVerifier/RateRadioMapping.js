import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
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
  // const loginId = user.loginId;
  const username = user.clientContactPersonName;

  const radiobutton = [{ key: "", value: "true" }];

  // const handleSubmitForRadio = (values) => {
  //   // console.log(values)
  // };
  const onClick = (client_code) => {
    alert(
      `Chield ClientCode: ${props.chiledCode.clientCode} \n UserName: ${username}`
    );
  };
  return (
    <div>
      <table className="table mt-5-">
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
                <tr key={i}> 
                  {/* <td>
                    <div className="form-check">
                      <Formik
                        initialValues={initialStateForRadio}
                        validationSchema={NewvalidationSchemaforRadio}
                       
                        enableReinitialize={true}
                      >
                        {(formik) => (
                          <Form>
                           
                            <FormikController
                              control="radio"
                              name="isChecked"
                              options={radiobutton}
                              className="form-control"
                            />
                            <button
                              type="button"
                              onClick={() => onClick(riskTemplate?.client_code)}
                              className="btn btn-primary"
                            >
                              Submit
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </td> */}
                  <td>
                  <div class="form-check">
                 <input class="form-check-input" type="radio"  name="isChecked" id="flexRadioDefault1"/>
  
                  </div>

                  </td>

                  <td>{riskTemplate?.client_code}</td>
                  <td>{riskTemplate?.rate_template_name}</td>
                </tr>
               ))
               : []} 
             
                    <tr>
                      <td colSpan={3}>
                        <button type="button"  onClick={() => onClick()} className="btn btn-primary pull-right" >Submit</button>
                      </td>
                    </tr>
             
        </tbody>
      </table>
    </div>
  );
};

export default RateRadioMapping;
