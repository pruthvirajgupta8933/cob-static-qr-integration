import React, { useState } from 'react'
import CustomModal from '../../../_components/custom_modal'
import { updateSubmerchant } from '../../../slices/generateMidSlice'
import toastConfig from '../../../utilities/toastTypes'
import moment from 'moment'
import { fetchMidPayload } from '../../../services/generate-mid/generate-mid.service'
import { useDispatch } from 'react-redux'

const UpdateMidDetailsModal = ({ userDetails, setOpenUpdateModal, openUpdateModal, selectedMerchantId }) => {
    const [disable, setDisable] = useState(false)
    const [loading, setLoading] = useState(false)
    const [show, Setshow] = useState(false)
    const [showResponseDetail, setResponseDetail] = useState({})
    const [requestPayload, setRequestPayload] = useState(null);
    const dispatch = useDispatch()
    const [showFullJson, setShowFullJson] = useState(false);



    const MidPayloadUpdate = (payload) => {
        // clientOwnershipType
        let clientOwnershipType = ""
        if (payload?.clientOwnershipType?.toLowerCase() === "proprietorship") {
            clientOwnershipType = "PROPRIETARY"
        } else if (payload?.clientOwnershipType?.toLowerCase() === "private ltd") {
            clientOwnershipType = "PRIVATE"
        } else if (payload?.clientOwnershipType === "public limited") {
            clientOwnershipType = "PUBLIC"
        }

        let reqPayload = {
            ...payload,
            clientOwnershipType: clientOwnershipType,
            "clientVirtualAdd": payload.clientVirtualAdd?.replaceAll(/\s/g, ''),
            collectionModes: "UPI",
            fatherNameOnPan: "FatherName",
            clientDob: moment(payload.clientDob, "YYYY-MM-DD").format("DD/MM/YYYY"),
            clientDoi: moment(payload.clientDoi, "YYYY-MM-DD").format("DD/MM/YYYY")
        }
        return reqPayload
    }




    const handleSubmit = async () => {
        setDisable(true)
        setLoading(true)
        // setCreateMidData({})
        const midData = {
            "merchant_id": selectedMerchantId,
            "bank_name": userDetails?.bankName,
            "mode_name": userDetails?.paymentMode
        };

        try {
            let reqPayload = await fetchMidPayload(midData);

            reqPayload = MidPayloadUpdate(reqPayload?.data?.result)
            setRequestPayload(reqPayload)

            let createMidResp = dispatch(updateSubmerchant(reqPayload))
            createMidResp.then((resp) => {
                console.log(resp)
                if (resp?.meta?.requestStatus === "fulfilled") {
                    Setshow(true)
                    setResponseDetail(resp?.payload)
                    // setCreateMidData(resp?.payload)
                    setDisable(false)
                    setLoading(false)
                } else {
                    toastConfig.errorToast(resp?.payload ?? "Something went wrong");
                    setDisable(false)
                    setLoading(false)
                }
            })

        } catch (error) {
            console.log("err", error)
            toastConfig.errorToast(error);
            Setshow(false)
            setDisable(false)

        }

    };







    const modalBody = () => {

        return (
            <div className="container-fluid p-0">
                <div className="modal-body px-4 py-3">
                    <div className="container">


                        <div className="mb-4">
                            <h6> Payment Mode: {userDetails?.paymentMode}</h6>
                            <h6> Bank: {userDetails?.bankName}</h6>
                            <h6>ClientCode:{userDetails?.clientCode}</h6>
                        </div>



                        <div className="text-center">
                            <button
                                type="button"
                                // className="btn btn-primary px-4 py-2"
                                className="submit-btn cob-btn-primary text-white mt-3"
                                disabled={disable}
                                onClick={handleSubmit}
                            >
                                {disable && (
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                )}
                                Update
                            </button>
                        </div>
                        {requestPayload && (

                            <div>
                                <h6>Request payload</h6>
                                <pre className={`bg-light p-3 rounded ${showFullJson ? '' : 'overflow-auto'} mb-2`} style={{ maxHeight: showFullJson ? 'none' : '200px' }}>
                                    {JSON.stringify(requestPayload, null, 2)}
                                </pre>

                                <a
                                    className="text-primary text-decoration-underline"
                                    role="button"
                                    onClick={() => setShowFullJson(!showFullJson)}
                                >
                                    {showFullJson ? "Show Less" : "Show More"}
                                </a>
                            </div>
                        )}

                    </div>
                </div>


                {loading ? (
                    <div className="d-flex justify-content-center py-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    show && (
                        <div className="d-flex justify-content-center">
                            <div className="card shadow-sm w-100 my-4 mx-2">
                                <div className="card-body">


                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Description</th>
                                                    <th>Disbursement Registration Status</th>
                                                    <th>Onboard Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                <tr >
                                                    <td className="">{showResponseDetail?.date}</td>
                                                    <td>{showResponseDetail?.description}</td>
                                                    <td className="">{showResponseDetail?.disbursementRegistrationStatus}</td>
                                                    <td className="">{showResponseDetail?.onboardStatus}</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        );
    }
    return (
        <div>

            <CustomModal
                modalBody={modalBody}
                headerTitle="Update MID Details"
                modalToggle={openUpdateModal}
                fnSetModalToggle={setOpenUpdateModal}
                setRequestPayload={setRequestPayload}
                resetPayload={true}
                Setshow={Setshow}

            />

        </div>
    )
}

export default UpdateMidDetailsModal
