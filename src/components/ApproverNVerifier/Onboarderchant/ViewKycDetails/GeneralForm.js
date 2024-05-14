import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { businessCategoryType, generalFormData, getAllCLientCodeSlice } from '../../../../slices/approver-dashboard/approverDashboardSlice'
import { convertToFormikSelectJson } from '../../../../_components/reuseable_components/convertToFormikSelectJson'
import { Form, Formik } from 'formik'
import FormikController from '../../../../_components/formik/FormikController'
import Yup from '../../../../_components/formik/Yup'
import { kycUserList } from '../../../../slices/kycSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import { axiosInstance } from '../../../../utilities/axiosInstance'
import API_URL from '../../../../config'
import toastConfig from '../../../../utilities/toastTypes'
import ReactSelect from 'react-select';

const GeneralForm = ({ selectedUserData, role }) => {


    const dispatch = useDispatch()
    const [parentClientCode, setParentClientCode] = useState([])
    const [referByValue, setReferByValue] = useState(null);
    const { approverDashboard, kyc, verifierApproverTab } = useSelector(state => state)
    const currenTab = parseInt(verifierApproverTab?.currenTab)
    // console.log("kyc.kycUserList",kyc.kycUserList);


    useEffect(() => {
        dispatch(businessCategoryType())
        dispatch(getAllCLientCodeSlice())
        axiosInstance.get(API_URL.fetchParentClientCodes).then((resp) => {
            setParentClientCode(resp.data)
        }).catch(err => toastConfig.errorToast("Parent Client Code not found. Please try again after some time"))
    }, [])



    const initialValues = {
        rr_amount: kyc.kycUserList?.rolling_reserve ?? 0,
        business_cat_type: kyc.kycUserList?.business_category_type,
        refer_by: kyc.kycUserList?.refer_by,
        rolling_reserve_type: "Percentage",
        parent_client_code: ""

    }




    const validationSchema = Yup.object({
        rr_amount: Yup.string().nullable(),
        business_cat_type: Yup.string().nullable(),
        parent_client_code: Yup.string().required("Required").nullable(),
        refer_by: Yup.string().nullable()
    })


    const handleSubmit = (val) => {
        // console.log("val", val)
        const saveGenData = {
            rr_amount: val.rr_amount === '' ? 0 : val.rr_amount,
            business_cat_type: val.business_cat_type,
            parent_client_code: val?.parent_client_code ?? 'COBED', // if not selected
            refer_by: val.refer_by,
            rolling_reserve_type: "Percentage",
            isFinalSubmit: true
        }
        // console.log("saveGenData", saveGenData)
        dispatch(generalFormData(saveGenData))
        toast.success("Successfully updated")
    }





    const businessCategoryOption = convertToFormikSelectJson("id", "category_name", approverDashboard?.businessCategoryType)
    const parentClientCodeOption = convertToFormikSelectJson("clientCode", "clientName", parentClientCode)
    const clientCodeOption = convertToFormikSelectJson("loginMasterId", "clientCode", approverDashboard?.clientCodeList, {}, false, false, true, "name")
    const options = clientCodeOption.map(option => ({ value: option.key, label: option.value }));



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
                        <Form className="">
                            <div className='row'>
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
                                    <FormikController
                                        control="select"
                                        name="parent_client_code"
                                        options={parentClientCodeOption}
                                        className="form-select"
                                        label="Rate Mapping Client Code"
                                        disabled={!role?.approver}
                                        onChange={(e) => {
                                            formik.setFieldValue("parent_client_code", e.target.value)
                                            formik.setStatus(false);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='row mt-2'>
                                <div className="col-md-4">
                                    {role?.approver && currenTab === 4 && (!formik.status && <button type="submit" className="btn cob-btn-primary btn-sm" >Save</button>)}
                                </div>
                            </div>
                        </Form>
                    </div>
                )}
            </Formik>
        </div>
    )
}

export default GeneralForm
