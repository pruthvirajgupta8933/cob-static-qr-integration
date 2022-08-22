import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import API_URL from '../../../../config';

function BusinessCategory() {
    const { auth } = useSelector((state) => state);
    const [rateCloneStatus, setRateCloneStatus] = useState("")
    const [businessType, setBusniessType] = useState("")
    console.log(auth)
    const { user } = auth;
    const { clientMerchantDetailsList } = user;



const checkRateMappingStatus = (clientCodeF,clientCodeT,loginId) => {
    

    axios.get(`${API_URL.RATE_MAPPING_CLONE}/${clientCodeF}/${clientCodeT}/${loginId}`)
    .then((resp) => {
        const data = resp.data;
        setRateCloneStatus(data[0].ID)
        localStorage.setItem('RATE_MAPPING_CLONE', data[0].ID);
    })
    .catch((err) => { console.log(err) })



}
    

    const changeHandler = (buesin) => {
        setBusniessType(buesin)
        const clientCode = clientMerchantDetailsList[0]?.clientCode;

        const loginId = user?.loginId;

        checkRateMappingStatus(buesin,clientCode,loginId);

    }

    useEffect(() => {
        if(rateCloneStatus===3 || rateCloneStatus===0) {
            const clientCode = clientMerchantDetailsList[0]?.clientCode;
            const clientId = clientMerchantDetailsList[0]?.clientId;
            const clientContact = clientMerchantDetailsList[0]?.clientContact;
            const clientEmail = clientMerchantDetailsList[0]?.userName;
            const address = clientMerchantDetailsList[0]?.address;
            const clientName = clientMerchantDetailsList[0]?.clientName;
            const stateId = clientMerchantDetailsList[0]?.stateId;
            const stateName = clientMerchantDetailsList[0]?.stateName;
            const clientType = clientMerchantDetailsList[0]?.clientType;
    
            const bankName = user?.bankName;
            const loginId = user?.loginId;
            const clientUserName = clientMerchantDetailsList[0]?.clientUserName;
    
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
                stateId: stateId,
                bid: "19", // ask
                stateName: stateName,
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

            axios.post(API_URL.RATE_MAPPING_GenerateClientFormForCob,inputData).then(res=>{
            
                localStorage.setItem('RATE_MAPPING_GenerateClientFormForCob',"api trigger");

                axios.get(API_URL.RATE_ENABLE_PAYLINK+'/'+clientCode).then(res=>{
                    localStorage.setItem('enablePaylink',"api trigger");
                })
            }).catch(err=>{console.log(err)})



        }
       

    }, [rateCloneStatus])


    return (
        <div className="modal fade" id="exampleModal" style={{ top: "25%" }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            {/* Welcome - {subscribePlanData.applicationName} ! */}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                        //   onClick={() => modalHandler()}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Business Type</p>
                        <div class="input-group mb-3">
                            <select class="custom-select" id="inputGroupSelect01" onChange={(e) => changeHandler(e.target.value)}>
                                <option selected>Select Business Type</option>
                                <option value="COBRD">COB Retail</option>
                                <option value="COBED">COB E-Commerce</option>
                                <option value="COBGV">COB Government</option>
                                <option value="COBEN">COB Education</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <Link to={`/dashboard/thanks`} type="button"  class="btn btn-success text-white" >Subscribe</Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default BusinessCategory