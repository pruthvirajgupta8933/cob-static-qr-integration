import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import CreateEMandateByApi from "./CreateEMandateByApi";
import CreateMandateByHtml from "./CreateMandateByHtml";

const EnachForm = () => {
    const [selectedOption, setSelectedOption] = useState("customer");

    return (


        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center  mb-4">
                <h5 className="ml-3" >Create Mandate</h5>
            </div>
            <Formik
                initialValues={{ userType: "customer" }}

            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <div className="ml-3">
                            <label>
                                <Field
                                    type="radio"
                                    name="userType"
                                    value="customer"
                                    checked={values.userType === "customer"}
                                    onChange={() => {
                                        setFieldValue("userType", "customer");
                                        setSelectedOption("customer");
                                    }}
                                />
                                <span className="ms-1">Customer</span>
                            </label>

                            <label style={{ marginLeft: "15px" }}>
                                <Field
                                    type="radio"
                                    name="userType"
                                    value="merchant"
                                    checked={values.userType === "merchant"}
                                    onChange={() => {
                                        setFieldValue("userType", "merchant");
                                        setSelectedOption("merchant");
                                    }}
                                />
                                <span className="ms-1">Merchant</span>
                            </label>
                        </div>
                    </Form>
                )}
            </Formik>


            <CreateEMandateByApi selectedOption={selectedOption} />
        </div>
    );
};

export default EnachForm;
