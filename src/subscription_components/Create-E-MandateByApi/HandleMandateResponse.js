import React, { useEffect, useState } from 'react'
import { useLocation, Link } from "react-router-dom"
import { createMandateHandleResponse } from '../../services/subscription-service/createEmandateByApi.service'



const HandleMandateResponse = ({ merchantType }) => {


    const location = useLocation();
    const [responseData, setResponseData] = useState({})
    const { search } = location;
    const consumerId = search.split("?consumerId=")[1];

    const handleResponseApi = () => {
        if (consumerId) {
            createMandateHandleResponse({
                consumer_id: consumerId,
            })
                .then((response) => {


                    if (response.status === 200) {
                        setResponseData(response?.data?.result)

                    }
                })
                .catch((error) => {


                });
        }
    };

    useEffect(() => {
        handleResponseApi()
    }, [consumerId])

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center  mb-4">
                <h5 >Create Mandate API Response</h5>
            </div>
            {merchantType !== "Public" && (
                <Link to="/dashboard/create-e-mandate" className="btn cob-btn-primary approve text-white mt-3">
                    Create Mandate
                </Link>
            )}



            <div className="row mt-5">

                <div className="scroll overflow-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="table table-bordered">
                        <thead>

                        </thead>
                        <tbody>
                            <tr>
                                <th>Registration Status</th>
                                <td>{responseData.registration_status}</td>
                            </tr>
                            <tr>
                                <th>Purpose</th>
                                <td>{responseData.purpose}</td>
                            </tr>
                            <tr>
                                <th>Mode</th>
                                <td>{responseData.mode}</td>
                            </tr>
                            <tr>
                                <th>Frequency</th>
                                <td>{responseData.frequency}</td>
                            </tr>
                            <tr>
                                <th>Registration ID</th>
                                <td>{responseData.registration_id}</td>
                            </tr>
                            <tr>
                                <th>Consumer ID</th>
                                <td>{responseData.consumer_id}</td>
                            </tr>
                            <tr>
                                <th>Customer Name</th>
                                <td>{responseData.customer_name}</td>
                            </tr>
                            <tr>
                                <th>Customer Mobile</th>
                                <td>{responseData.customer_mobile}</td>
                            </tr>
                            <tr>
                                <th>Customer Email ID</th>
                                <td>{responseData.customer_email_id}</td>
                            </tr>

                            <tr>
                                <th>Account Number</th>
                                <td>{responseData.account_number}</td>
                            </tr>
                            <tr>
                                <th>Account Type</th>
                                <td>{responseData.account_type}</td>
                            </tr>
                            <tr>
                                <th>Account Holder Name</th>
                                <td>{responseData.account_holder_name}</td>
                            </tr>

                            <tr>
                                <th>IFSC Code</th>
                                <td>{responseData.ifsc_code}</td>
                            </tr>
                            <tr>
                                <th>Start Date</th>
                                <td>{responseData.start_date}</td>
                            </tr>
                            <tr>
                                <th>End Date</th>
                                <td>{responseData.end_date}</td>
                            </tr>
                            <tr>
                                <th>Max Amount</th>
                                <td>{responseData.max_amount}</td>
                            </tr>
                            <tr>
                                <th>Amount Type</th>
                                <td>{responseData.amount_type}</td>
                            </tr>



                        </tbody>

                    </table>




                </div>


            </div>
        </div>
    )
}

export default HandleMandateResponse
