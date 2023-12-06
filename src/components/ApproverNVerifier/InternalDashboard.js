import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { axiosInstanceJWT } from '../../utilities/axiosInstance';
import API_URL from '../../config';



function InternalDashboard() {

    const [newSignUp, setNewSignUp] = useState(0)
    const [verified, setVerified] = useState(0)
    const [approved, setApproved] = useState(0)

    useEffect(() => {
        const todayDate = new Date()
        const from_date = moment(todayDate).startOf('day').format('YYYY-MM-DD')
        const to_date = moment(todayDate).startOf('day').format('YYYY-MM-DD')

        const postDataSignUp = {
            from_date: from_date,
            to_date: to_date,
        };

        // signup data
        axiosInstanceJWT.post(`${API_URL.GET_SIGNUP_DATA_INFO}?page=1&page_size=10`, postDataSignUp).then(resp => {
            setNewSignUp(resp?.data?.count)
        })

        // verified data
        axiosInstanceJWT.get(`${API_URL.KYC_FOR_ONBOARDED}?search=Verified&order_by=-verified_date&search_map=verified_date&page=1&page_size=10&from_date=${from_date}&to_date=${to_date}`).then(resp => {
            setVerified(resp?.data?.count)
        })

        // approved data 
        axiosInstanceJWT.get(`${API_URL.KYC_FOR_ONBOARDED}?search=Approved&order_by=-approved_date&search_map=approved_date&page=1&page_size=10&from_date=${from_date}&to_date=${to_date}`).then(resp => {
            setApproved(resp?.data?.count)
        })





    }, [])



    return (
        <div className='row'>
            <div className="col-lg-4">
                <div className="card webColorBg1">
                    <div className="card-body">
                        <h5>New Sign-up </h5>
                    </div>
                    <div className="card-footer d-flex justify-content-between">
                        <h6>Today</h6>
                        <h6>{newSignUp}</h6>
                    </div>
                </div>
            </div>

            {/* <div className="col-lg-4">
                <div className="card webColorBg1">
                    <div className="card-body">
                        <h5>Verified Merchant's</h5>
                    </div>

                    <div className="card-footer d-flex justify-content-between">
                        <h6>Today</h6>
                        <h6>{verified}</h6>
                    </div>
                </div>
            </div> */}

            <div className="col-lg-4">
                <div className="card webColorBg1">
                    <div className="card-body">
                        <h5>Approved Merhant's</h5>
                    </div>

                    <div className="card-footer d-flex justify-content-between">
                        <h6>Total</h6>
                        <h6>{approved}</h6>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default InternalDashboard