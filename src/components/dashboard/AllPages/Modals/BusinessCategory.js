import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import API_URL from '../../../../config';
import { checkPermissionSlice } from '../../../../slices/auth';
import "../../css/abhishek.css"




function BusinessCategory(props) {

    const { subscribePlanData } = props;

    console.log(subscribePlanData)
    const dispatch = useDispatch();

    const { auth } = useSelector((state) => state);
    const [rateCloneStatus, setRateCloneStatus] = useState("")
    const [businessType, setBusniessType] = useState("")
    const [modalClose, setModalClose] = useState(true)
    // console.log(auth)
    const { user } = auth;
    const { clientMerchantDetailsList } = user;



    const checkRateMappingStatus = (clientCodeF, clientCodeT, loginId) => {
        axios.get(`${API_URL.RATE_MAPPING_CLONE}/${clientCodeF}/${clientCodeT}/${loginId}`)
            .then((resp) => {
                const data = resp.data;
                setRateCloneStatus(data[0].ID)
                localStorage.setItem('RATE_MAPPING_CLONE', data[0].ID);
            })
            .catch((err) => { console.log(err) })



    }


    const changeHandler = (buesin) => {
        console.log(buesin);
        // setBusniessType(buesin)
        // const clientCode = clientMerchantDetailsList[0]?.clientCode;

        // const loginId = user?.loginId;

        // checkRateMappingStatus(buesin, clientCode, loginId);

    }

    useEffect(() => {
        if (rateCloneStatus === 3 || rateCloneStatus === 0) {
            const clientCode = clientMerchantDetailsList[0]?.clientCode;
            const clientId = clientMerchantDetailsList[0]?.clientId;
            const clientContact = clientMerchantDetailsList[0]?.clientContact;
            const clientEmail = user?.userName;
            const address = clientMerchantDetailsList[0]?.address;
            const clientName = clientMerchantDetailsList[0]?.clientName;
            const stateId = clientMerchantDetailsList[0]?.stateId;
            const stateName = clientMerchantDetailsList[0]?.stateName;
            const clientType = clientMerchantDetailsList[0]?.clientType;

            const bankName = user?.bankName;
            const loginId = user?.loginId;
            const clientUserName = user?.userName;
            // console.log(user);
            const passwrod = localStorage.getItem('p');

            const inputData = {
                clientId: clientId,
                clientCode: clientCode,
                clientContact: clientContact,
                clientEmail: clientEmail,
                address: address,
                clientLogoPath: "client/logopath",
                clientName: clientName,
                clientLink: "cltLink",
                stateId: 9,
                bid: "19", // ask
                stateName: "DELHI",
                bankName: bankName,
                client_username: clientUserName,
                client_password: passwrod,
                appId: "4", // ask
                status: "Activate", // ask
                client_type: "normal Client",
                successUrl: "https://sabpaisa.in/",
                failedUrl: "https://sabpaisa.in/",
                subscriptionstatus: "Subscribed",
                businessType: businessType
            };

            console.log(inputData);
            // 1 - run RATE_MAPPING_GenerateClientFormForCob 
            axios.post(API_URL.RATE_MAPPING_GenerateClientFormForCob, inputData).then(res => {
                console.log("1 api run")


                localStorage.setItem('RATE_MAPPING_GenerateClientFormForCob', "api trigger");
                //2 - rate map clone 
                axios.get(`${API_URL.RATE_MAPPING_CLONE}/${businessType}/${clientCode}/${loginId}`).then(res => {
                    console.log("2 api run")

                    localStorage.setItem('enablePaylink', "api trigger");
                    // 3- enable pay link
                    axios.get(API_URL.RATE_ENABLE_PAYLINK + '/' + clientCode).then(res => {
                        localStorage.setItem('enablePaylink', "api trigger");
                        console.log("3 api run")
                        dispatch(checkPermissionSlice(clientCode));
                    })
                })




            }).catch(err => { console.log(err) })



        }


    }, [rateCloneStatus])



    const modalHandler = (val) => {
        setModalClose(val)

    }

    const showTooltip = () => {
        console.log('showTooltip')
    }


    const hideTooltip = () => {
        console.log('hideTooltip')
    }

    return (
        <div className="modal" id="bussiness" style={{ top: "25%", display: `${modalClose ? 'block' : 'none'}` }} tabIndex="-1" role="dialog" aria-labelledby="bussinessLable" aria-hidden="true" >


            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="bussinessLable">
                            Welcome - {subscribePlanData.applicationName} !
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            onClick={() => modalHandler(false)}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Business Type</p>
                        <div class="input-group mb-3">

                            <select className="custom-select" id="inputGroupSelect01" onChange={(e) => changeHandler(e)}>
                                <option selected>Select Business Type</option>
                                <option value="COBRD" title="Department store, Real Estate, Healthcare, Food and beverage, Grocery store, Fashion">COBRD Retail</option>
                                <option value="COBED" title="Online store, Financial Product, Media and entertainment, Tech product and services, Travel">COB E-Commerce</option>
                                <option value="COBGV" title="PSU, Govt Education, Govt Utility, Govt Healthcare">COB Government</option>
                                <option value="COBEN" title="School, College, Test Prep centre">COB Education</option>
                            </select>
                        </div>

                    </div>
                    <div className="modal-footer">


                        <Link to={`/dashboard/thanks/?planid=${subscribePlanData.applicationId}`} type="button" onClick={() => modalHandler(false)} class="btn btn-success text-white" >Subscribe</Link>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default BusinessCategory


