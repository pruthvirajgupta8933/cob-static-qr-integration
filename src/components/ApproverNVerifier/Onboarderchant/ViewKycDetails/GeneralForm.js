import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { businessCategoryType, generalFormData, getAllCLientCodeSlice } from '../../../../slices/approver-dashboard/approverDashboardSlice'
import { convertToFormikSelectJson } from '../../../../_components/reuseable_components/convertToFormikSelectJson'
import { Form, Formik } from 'formik'
import FormikController from '../../../../_components/formik/FormikController'
import { generateWord } from '../../../../utilities/generateClientCode'
import Yup from '../../../../_components/formik/Yup'
import { kycUserList } from '../../../../slices/kycSlice'

const GeneralForm = ({merchantKycId}) => {

    const dispatch = useDispatch()
    const { approverDashboard , kyc } = useSelector(state => state)

    // console.log(approverDashboard)
    useEffect(() => {
        dispatch(businessCategoryType())
        dispatch(getAllCLientCodeSlice())
        dispatch(kycUserList({ login_id: merchantKycId?.loginMasterId,}))
        // dispatch(generalFormData({
        //     rr_amount: kyc.kycUserList?.rolling_reserve,
        //     business_cat_type: kyc.kycUserList?.business_category_type,
        //     refer_by: kyc.kycUserList?.refer_by
    
        // }))
    }, [])


    const initialValues = {
        rr_amount: kyc.kycUserList?.rolling_reserve,
        business_cat_type: kyc.kycUserList?.business_category_type,
        refer_by: kyc.kycUserList?.refer_by

    }

    // console.log("initialValues",initialValues)

    const validationSchema = Yup.object({
        rr_amount: Yup.string().required("Required").nullable(),
        business_cat_type: Yup.string().nullable(),
        refer_by: Yup.string().nullable()
    })


    const handleSubmit = (val) => {
      
        dispatch(generalFormData(val))
    }

    // useEffect(() => {

    // }, [approverDashboard])
    // console.log("approverDashboard",approverDashboard)

    const businessCategoryOption = convertToFormikSelectJson("id", "category_name", approverDashboard?.businessCategoryType)
    const clientCodeOption = convertToFormikSelectJson("loginMasterId", "clientCode", approverDashboard?.clientCodeList)
    // console.log("businessCategoryOption", businessCategoryOption)

    return (
        <div className="row mb-4 border p-1">

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true} >
                {({
                    values,
                    setFieldValue,
                    errors,
                    setFieldError,
                    dirty

                }) => (
                    <div className="">

                        <Form className="row g-3">
                            <div className="col-md-4">
                                <FormikController
                                    control="input"
                                    type="number"
                                    name="rr_amount"
                                    className="form-control"
                                    label="Rolling Reserve Amount"
                                />
                            </div>

                            <div className="col-md-4">
                                <FormikController
                                    control="select"
                                    name="business_cat_type"
                                    options={businessCategoryOption}
                                    className="form-select"
                                    label="Business Category"
                                />
                            </div>

                            <div className="col-md-4">
                                <FormikController
                                    control="select"
                                    name="refer_by"
                                    options={clientCodeOption}
                                    className="form-select"
                                    label="Refer By (if any)"
                                />
                            </div>

                            <div className="col-md-4 ">
                            {/* {console.log("dirty",dirty)} */}
                            {dirty &&  <button type="submit" className="btn cob-btn-primary btn-sm" > Submit</button>}
                            </div>
                        </Form>

                    </div>
                )}
            </Formik>
            {/*             
                <div className="col-sm-12 col-md-12 col-lg-4 ">
                    <label className>Rolling Reserve Amount<span className="text-danger" >*</span></label>
                    <input type="text" className="form-control" id="inputPassword3" disabled defaultValue="UBIN0916684" />
                </div>

                <div className="col-sm-12 col-md-12 col-lg-4">
                    <label className>Business category<span style={{ color: 'red' }}>*</span></label>
                    <input type="text" className="form-control" id="inputPassword3" disabled defaultValue={520101234655697} />
                </div>

                <div className="col-sm-12 col-md-12 col-lg-4">
                    <label className>Refer by(if any)<span style={{ color: 'red' }}>*</span></label>
                    <input type="text" className="form-control" id="inputPassword3" disabled defaultValue={520101234655697} />
                </div> */}

        </div>
    )
}

export default GeneralForm
