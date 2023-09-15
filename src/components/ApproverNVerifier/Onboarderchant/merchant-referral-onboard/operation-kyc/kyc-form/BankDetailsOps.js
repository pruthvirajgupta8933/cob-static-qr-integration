import React from 'react'
import { Formik, Field, Form, ErrorMessage } from "formik";
import Yup from '../../../../../../_components/formik/Yup';
import FormikController from '../../../../../../_components/formik/FormikController';
import { Regex, RegexMsg } from '../../../../../../_components/formik/ValidationRegex';
// import gotVerified from "../../assets/images/verified.png";
import gotVerified from "../../../../../../assets/images/verified.png";


function BankDetailsOps() {

    const initialValues = {
        ifscCode: "",
        // contact_number: KycList?.contactNumber,
        // email_id: KycList?.emailId,
        // oldEmailId: KycList?.emailId,
        // oldContactNumber: KycList?.contactNumber,
        // aadhar_number: KycList?.aadharNumber,
    };


    const validationSchema = Yup.object({
        ifscCode: Yup.string()
            .trim()
            .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
            .required("Required")
            .wordLength("Word character length exceeded")
            .max(100, "Maximum 100 characters are allowed")
            .nullable(),
        contact_number: Yup.string()
            .trim()
            .required("Required")
            .matches(Regex.phoneNumber, RegexMsg.phoneNumber)
            .min(10, "Phone number is not valid")
            .max(10, "Only 10 digits are allowed ")
            .nullable(),
        mail_id: Yup.string()
            .trim()
            .email("Invalid email")
            .required("Required")
            .nullable()
    });

    const handleSubmitContact = (value) => {
        console.log(value)
    }

    const button = {
        component: <button class="btn cob-btn-primary btn-sm" type="button" id="button-addon2" onClick={(vdd)=>{console.log(vdd)}}>verify</button>,
        icon: <span className="success input-group-append">
            <img
                src={gotVerified}
                alt=""
                title=""
                width={"20px"}
                height={"20px"}
                className="btn-outline-secondary"
            />
        </span>,
        isVerified: false,
        inputVerification:(vdd)=>{console.log(vdd)}
    }

    return (
        // create html bootstrap from with for the bank details eg: account number / ifce / account holder name/ bank name/ account type
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel" aria-labelledby="v-pills-link1-tab">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmitContact}
                enableReinitialize={true}
            >
                {({
                    values,
                    setFieldValue,
                    errors,
                    setFieldError
                }) => (
                    <Form>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <FormikController
                                    control="inputButton"
                                    type="text"
                                    name="ifscCode"
                                    className="form-control"
                                    label="IFSC Code"
                                    
                                    onChange={(e)=>setFieldValue("ifscCode",e.target.value)}
                                    
                                    button={button}
                                    inputValue={values?.ifscCode}

                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="ifsc">IFSC Code:</label>
                                <input type="text" className="form-control" id="ifsc" placeholder="Enter IFSC Code" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="accountHolderName">Account Holder Name:</label>
                                <input type="text" className="form-control" id="accountHolderName" placeholder="Enter Account Holder Name" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="bankName">Bank Name:</label>
                                <input type="text" className="form-control" id="bankName" placeholder="Enter Bank Name" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="bankName">Branch:</label>
                                <input type="text" className="form-control" id="bankName" placeholder="Enter Bank Name" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="accountType">Account Type:</label>
                                <select className="form-control" id="accountType">
                                    <option value="savings">Savings</option>
                                    <option value="current">Current</option>
                                    {/* Add other account types if needed */}
                                </select>
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn cob-btn-primary btn-sm">Save</button>
                            </div>
                        </div>
                    </Form>)
                }
            </Formik>
        </div>

    )
}

export default BankDetailsOps