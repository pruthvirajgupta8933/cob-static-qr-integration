import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { bulkCreateEmandate } from '../../slices/subscription-slice/createEmandateSlice'
import toast from 'react-hot-toast'

// Yup validation schema
const validationSchema = Yup.object({
    file: Yup.mixed()
        .required('File is required')
        .test('fileSize', 'File too large', value => !value || (value && value.size <= 5000000))
        .test('fileType', 'Invalid file format', value => !value || (value && ['text/csv', 'application/vnd.ms-excel'].includes(value.type)))
})

const CreateBulkEmandate = () => {
    const dispatch = useDispatch()

    const handleSubmit = async (values) => {

        const formData = new FormData()
        formData.append('file', values.file)

        try {
            await dispatch(bulkCreateEmandate(formData)).then((res) => {
                console.log("res", res)

                if (res.meta.requestStatus === 'fulfilled') {
                    toast.success(res.payload.message)
                }
            })
        } catch (error) {
            console.error('Error uploading file:', error)
        }
    }

    return (
        <div className='container-fluid mt-4'>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center border-bottom mb-4">
                <h5>Create Bulk Mandate</h5>
            </div>

            <Formik
                initialValues={{ file: null }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, errors, touched }) => (
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
                                <button type="submit" className="btn btn-sm cob-btn-primary approve text-white ">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default CreateBulkEmandate
