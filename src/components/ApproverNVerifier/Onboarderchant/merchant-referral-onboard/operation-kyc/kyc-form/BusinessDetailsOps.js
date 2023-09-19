import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from "formik";
import Yup from '../../../../../../_components/formik/Yup';
import FormikController from '../../../../../../_components/formik/FormikController';
import { Regex, RegexMsg } from '../../../../../../_components/formik/ValidationRegex';
import { convertToFormikSelectJson } from '../../../../../../_components/reuseable_components/convertToFormikSelectJson';
import { useDispatch, useSelector } from 'react-redux';
import { businessDetails } from '../../../../../../slices/approver-dashboard/merchantReferralOnboardSlice';

function BusinessDetailsOps() {
    const dispatch = useDispatch()
    const {auth, merchantReferralOnboardReducer} = useSelector(state=>state)
    const merchantLoginId = merchantReferralOnboardReducer?.merchantOnboardingProcess?.merchantLoginId


    const initialValues = {
        pan_number: "",
        website: ""

    }
    const validationSchema = Yup.object({
        pan_number: Yup.string().required(),
        website: Yup.string().required()
    })
    const handleSubmit = (value) => {
        console.log(value)
        const postData = {
            website_app_url: value.website,
            pan_card: value.pan_number,
            login_id: merchantLoginId,
            updated_by: auth?.user?.loginId
        
        }
        dispatch(businessDetails(postData))
    }



    return (
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel" aria-labelledby="v-pills-link1-tab">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
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
                                    control="input"
                                    type="text"
                                    name="pan_number"
                                    className="form-control"
                                    label="PAN"
                                    placeholder="Enter PAN"
                                />
                            </div>
                            <div className="col-md-6">
                                <FormikController
                                    control="input"
                                    type="text"
                                    name="website"
                                    className="form-control"
                                    label="Website"
                                    placeholder="Enter Website URL"
                                />
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn cob-btn-primary btn-sm">Save</button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default BusinessDetailsOps