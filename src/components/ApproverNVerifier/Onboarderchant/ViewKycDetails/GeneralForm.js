import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { businessCategoryType, generalFormData, getAllCLientCodeSlice } from '../../../../slices/approver-dashboard/approverDashboardSlice'
import { convertToFormikSelectJson } from '../../../../_components/reuseable_components/convertToFormikSelectJson'
import { Form, Formik } from 'formik'
import FormikController from '../../../../_components/formik/FormikController'
import Yup from '../../../../_components/formik/Yup'
import { kycUserList } from '../../../../slices/kycSlice'
// import { Toast } from 'react-toastify/dist/components'
import { toast } from 'react-toastify'

const GeneralForm = ({merchantKycId, role}) => {

    const dispatch = useDispatch()
    const { approverDashboard , kyc } = useSelector(state => state)

    useEffect(() => {
        dispatch(businessCategoryType())
        dispatch(getAllCLientCodeSlice())
        dispatch(kycUserList({ login_id: merchantKycId?.loginMasterId,}))
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
        toast.success("Successfully updated")
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
                {(formik) => (

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
                            {role?.approver && (formik.dirty && <button type="submit" className="btn cob-btn-primary btn-sm" > Update</button>)}
                            </div>
                        </Form>
                    </div>
                )}
            </Formik>
        </div>
    )
}

export default GeneralForm
