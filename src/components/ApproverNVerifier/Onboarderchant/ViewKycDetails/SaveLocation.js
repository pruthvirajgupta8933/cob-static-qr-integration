import { Form, Formik } from 'formik';
import React, { useState } from 'react'
import FormikController from '../../../../_components/formik/FormikController';
import Yup from '../../../../_components/formik/Yup';
import { useSelector } from 'react-redux';
import menulistService from '../../../../services/cob-dashboard/menulist.service';
import toastConfig from '../../../../utilities/toastTypes';


function SaveLocation({ role }) {

    const [loadingState, setLoadingState] = useState(false);

    const verifierApproverTab = useSelector((state) => state.verifierApproverTab);
    const currenTab = parseInt(verifierApproverTab?.currenTab);


    const { kyc, auth } = useSelector(state => state)
    const { user } = auth;

    const initialValues = {
        latitude: kyc?.kycUserList?.latitude,
        longitude: kyc?.kycUserList?.longitude
    }


    const validationSchema = Yup.object({
        latitude: Yup.string().nullable(),
        longitude: Yup.string().nullable()
    })

    const handleSubmit = (v) => {
        setLoadingState(true)
        const saveCord = {
            merchant_latitude: v.latitude,
            merchant_longitude: v.longitude,
            merchant_coordinate_capture_mode: "Manual",
            login_id: kyc?.kycUserList?.loginMasterId,
            coordinates_modified_by: user?.loginId
        };
        menulistService.saveGeoLocation(saveCord).then(resp => {
            if (resp.data.status) {
                toastConfig.successToast(resp.data.message)
            } else {
                toastConfig.errorToast(resp.data.message)
            }
            setLoadingState(false)
        }).catch(err => {
            setLoadingState(false)
            toastConfig.errorToast("Something went wrong")
        })
    }



    let allowChanges = role.approver || role.verifier
    if (allowChanges) {
        if (currenTab === 3) {
            allowChanges = true
        } else if (currenTab === 4) {
            allowChanges = true
        } else {
            allowChanges = false
        }
    }

    // console.log("allowChanges", allowChanges)
    // add loader

    return (
        <div className="row mb-4 border p-1">
            <h5>Merchant Location</h5>
            <div className="form-row g-3">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(v) => handleSubmit(v)}
                    enableReinitialize={true} >
                    {(formik) => (
                        <Form >
                            <div className='row'>
                                <div className="col-md-6">
                                    <FormikController
                                        control="input"
                                        name="latitude"
                                        className="form-control"
                                        label="Latitude"
                                        disabled={!allowChanges}

                                    />
                                </div>

                                <div className="col-md-6">
                                    <FormikController
                                        control="input"
                                        name="longitude"
                                        className="form-control"
                                        label="Longitude"
                                        disabled={!allowChanges}
                                    />
                                </div>
                                {allowChanges &&
                                    <div className="col-md-4 mt-4">

                                        <button className="btn cob-btn-primary btn-sm" type='submit' disabled={loadingState}>
                                            {loadingState && <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>}
                                            Update
                                        </button>
                                    </div>}

                            </div>
                        </Form>

                    )}
                </Formik>
            </div>
        </div>
    )
}

export default SaveLocation