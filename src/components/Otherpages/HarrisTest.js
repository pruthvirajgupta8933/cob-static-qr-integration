import React from "react";
import { Formik, Form, Field } from "formik";
import FormikController from "../../_components/formik/FormikController";
import * as Yup from "yup";
import { OtherHouses } from "@mui/icons-material";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const initialValues = {
  first_name:"",
  last_name:"",
  age:""
}

const validationschema = Yup.object().shape({
  first_name: Yup.string().when(['last_name', 'age'], {
    is: (last_name, age) => !last_name && !age,
    then: Yup.string().required("Required 1"),
  otherwise:Yup.string().required("Required"),
  }),
  last_name: Yup.string().when(['first_name', 'age'], {
    is: (first_name, age) => !first_name && !age,
    then: Yup.string().required("Required 2"),
    otherwise:Yup.string().required("Required")
  }),
  age: Yup.number().when(['first_name', 'last_name'], {
    is: (first_name, last_name) => !first_name && !last_name,
    then: Yup.number().required("Required 3"),
    otherwise:Yup.string().required("Required")
  })
}, [
  ['first_name', 'last_name'], // <--- adding your fields which need validation
  ['first_name', 'age'],
  ['last_name', 'age']
])
const handleSubmit = () => {
  // console.log('Form Submitted')
}

const HarrisTest = () => (
  <div style={styles}>
    <Formik
      initialValues={{ email: "", showEmail: false,  firstName:"",lastName:"" }}
      validationSchema={validationschema}
      onSubmit={handleSubmit}
      render={({ errors }) => (
        <Form>
          {/* {console.log(errors,"Eroro =>")} */}
            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2 mt-0">
                <h4 class="text-kyc-label text-nowrap">
                  First Name<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="first_name"
                  className="form-control"
                />
                </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2 mt-0">
               <h4 class="text-kyc-label text-nowrap">
                  Last Name<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="last_name"
                  className="form-control"
                />
                </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2 mt-0">
               <h4 class="text-kyc-label text-nowrap">
                  Age<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="age"
                  className="form-control"
                />
                </div>
            </div>
                       <button
                        type="submit"
                        className="btn float-lg-right"
                        style={{ backgroundColor: "#0156B3" }}
                      >
                        <h4 className="text-white text-kyc-sumit">
                         Submit
                        </h4>
                      </button>
        </Form>
      )}
    />
  </div>
);

export default HarrisTest
