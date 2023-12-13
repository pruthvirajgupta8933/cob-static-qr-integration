import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { businessCategoryType, generalFormData, getAllCLientCodeSlice } from '../../../../slices/approver-dashboard/approverDashboardSlice'
import { convertToFormikSelectJson } from '../../../../_components/reuseable_components/convertToFormikSelectJson'
import { Form, Formik } from 'formik'
import FormikController from '../../../../_components/formik/FormikController'
import Yup from '../../../../_components/formik/Yup'
import { kycUserList } from '../../../../slices/kycSlice'
import { toast } from 'react-toastify'

const GeneralForm = ({ selectedUserData, role }) => {

    const dispatch = useDispatch()
    const { approverDashboard, kyc, verifierApproverTab } = useSelector(state => state)
    const currenTab = parseInt(verifierApproverTab?.currenTab)

    useEffect(() => {
        dispatch(businessCategoryType())
        dispatch(getAllCLientCodeSlice())
        // dispatch(kycUserList({ login_id: selectedUserData?.loginMasterId, }))
    }, [])


    const initialValues = {
        rr_amount: kyc.kycUserList?.rolling_reserve ?? 0,
        business_cat_type: kyc.kycUserList?.business_category_type,
        refer_by: kyc.kycUserList?.refer_by,
        rolling_reserve_type: "Percentage"

    }



    const validationSchema = Yup.object({
        rr_amount: Yup.string().nullable(),
        business_cat_type: Yup.string().nullable(),
        refer_by: Yup.string().nullable()
    })


    const handleSubmit = (val) => {
        // console.log("val", val)
        const saveGenData = {
            rr_amount: val.rr_amount === '' ? 0 : val.rr_amount,
            business_cat_type: val.business_cat_type,
            refer_by: val.refer_by,
            rolling_reserve_type: val.rolling_reserve_type
        }
        // console.log("saveGenData", saveGenData)
        dispatch(generalFormData(saveGenData))
        toast.success("Successfully updated")
    }



    const businessCategoryOption = convertToFormikSelectJson("id", "category_name", approverDashboard?.businessCategoryType)
    const clientCodeOption = convertToFormikSelectJson("loginMasterId", "clientCode", approverDashboard?.clientCodeList, {}, false, false, true, "name")


    return (
        <div className="row mb-4 border p-1">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setStatus }) => {
                    setStatus(true)
                    handleSubmit(values)
                }}
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
                                    label="Rolling Reserve (%)"
                                    disabled={!role?.approver}
                                    onChange={(e) => {
                                        formik.setFieldValue("rr_amount", e.target.value)
                                        formik.setStatus(false);
                                    }}
                                />
                            </div>

                            <div className="col-md-4">
                                <FormikController
                                    control="select"
                                    name="business_cat_type"
                                    options={businessCategoryOption}
                                    className="form-select"
                                    label="Business Category"
                                    disabled={!role?.approver}
                                    onChange={(e) => {
                                        formik.setFieldValue("business_cat_type", e.target.value)
                                        formik.setStatus(false);
                                    }}
                                />
                            </div>

                            <div className="col-md-4">
                                <FormikController
                                    control="select"
                                    name="refer_by"
                                    options={clientCodeOption}
                                    className="form-select"
                                    label="Referred By (if any)"
                                    disabled={!role?.approver}
                                    onChange={(e) => {
                                        formik.setFieldValue("refer_by", e.target.value)
                                        formik.setStatus(false);
                                    }}
                                />
                            </div>

                            <div className="col-md-4">
                                {role?.approver && currenTab === 4 && (!formik.status && <button type="submit" className="btn cob-btn-primary btn-sm" >Save</button>)}
                            </div>
                        </Form>
                    </div>
                )}
            </Formik>
        </div>
    )
}

export default GeneralForm
