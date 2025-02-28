import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { bulkCreateEmandate } from '../../slices/subscription-slice/createEmandateSlice'
import toast from 'react-hot-toast'
import { bulkCreateEmandateApi } from '../../services/subscription-service/createEmandateByApi.service'

// Yup validation schema
const validationSchema = Yup.object({
    file: Yup.mixed()
        .required('File is required')
        .test('fileSize', 'File too large', value => !value || (value && value.size <= 5000000))
        .test('fileType', 'Invalid file format', value => !value || (value && ['text/csv', 'application/vnd.ms-excel'].includes(value.type)))
})

const CreateBulkEmandate = () => {
    const dispatch = useDispatch()
    const [response, setResponse] = useState([])

    const handleSubmit = async (values, setSubmitting) => {
        setSubmitting(true)
        const formData = new FormData()
        formData.append('file', values.file)
        setResponse([])
        try {
            // await dispatch(bulkCreateEmandate(formData)).then((res) => {
            await bulkCreateEmandateApi(formData).then((res) => {
                console.log(res.data.message)
                toast.success(res.data.message || "Something went wrong!");
                setResponse(res?.data?.bank_details_urls)
                setSubmitting(false)
            })
        } catch (error) {
            // console.log(error.response?.data?.detail)
            toast.error(error.response?.data?.detail || "Something went wrong!");
            setSubmitting(false)
        }
    }

    console.log(response)
    return (
        <div className='container-fluid mt-4'>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center border-bottom mb-4">
                <h5>Create Bulk Mandate</h5>
            </div>

            <Formik
                initialValues={{ file: null }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    handleSubmit(values, setSubmitting);
                }}
            >
                {({ setFieldValue, errors, touched, isSubmitting }) => (
                    <Form>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label htmlFor="file" className="form-label">Upload CSV File</label>
                                <input
                                    id="file"
                                    name="file"
                                    type="file"
                                    className={`form-control ${touched.file && errors.file ? 'is-invalid' : ''}`}
                                    onChange={(e) => setFieldValue('file', e.currentTarget.files[0])}
                                />
                                {touched.file && errors.file && (
                                    <div className="invalid-feedback">{errors.file}</div>
                                )}
                            </div>
                            <div className="col-md-4 d-flex align-items-end">
                                <button type="submit" className="btn btn-sm cob-btn-primary approve text-white" disabled={isSubmitting}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>

            {/*  list  */}
            {response && response.length > 0 && (
                <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <h6 >Mandate URLs</h6>
                                <ul className="list-group">
                                    {response?.map((item, key) => (
                                        <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>{item?.consumer_id}</span>
                                            <span>{item?.customer_name}</span>
                                            <a href={item?.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm cob-btn-primary approve text-white">View</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default CreateBulkEmandate
