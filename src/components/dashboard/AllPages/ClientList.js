import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import NavBar from '../NavBar/NavBar';
import {uniqueId} from 'lodash';
import CustomModal from "../../../_components/custom_modal";
import ReferralOnboardForm
    from "../../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/operation-kyc/ReferralOnboardForm/ReferralOnboardForm";
import BasicDetailsOps
    from "../../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/operation-kyc/bank-kyc-form/BasicDetailsOps";

function ClientList() {

    // const [isLoading,setIsLoading] = useState(false);
    const [search, SetSearch] = useState("");
    const [clientListData, SetClientList] = useState([]);
    const [modalToggle, setModalToggle] = useState(false)
    var {user} = useSelector((state) => state.auth);

    useEffect(() => {
        //ClientMerchantDetailList
        if (user.clientMerchantDetailsList?.length > 0) {
            var clientMerchantDetailsList = user.clientMerchantDetailsList;
            SetClientList(user.clientMerchantDetailsList);
        }
        if (search !== '') {
            SetClientList(clientMerchantDetailsList.filter((Itme) =>
                Object.values(Itme).join(" ").toLowerCase().includes(search.toLocaleLowerCase())));

        }
    }, [search, user]);

    const handleChange = (e) => {
        SetSearch(e);
    }

    // console.log(user?.roleId)
    const modalBody = () => {
        return (<ReferralOnboardForm referralChild={true}/>)}
    return (
        <section className="">

            <main className="">
                <div className="">
                    <div className="">
                        <h5 className="">Client List</h5>
                    </div>
                    <section className="">
                        <div className="container">
                            <div className="row mt-4">

                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="col-lg-4 p-0">
                                        <label>Search</label>
                                        <input type="text" className="form-control" onChange={(e) => {
                                            handleChange(e.currentTarget.value)
                                        }} placeholder="Search from here"/>
                                    </div>
                                </div>

                                <div className="col-lg-12 mt-5 mb-2 d-flex justify-content-between">
                                    <div><h6>Number of Record: {clientListData.length}</h6></div>

                                    <div>
                                        {user?.roleId === 13 && <button className="btn btn-sm cob-btn-primary"
                                                                        onClick={() => setModalToggle(true)}>Add Child
                                            Client</button>}
                                    </div>

                                </div>
                                <div className="overflow-scroll">
                                    <table cellspaccing={0} cellPadding={10} border={0} width="100%"
                                           className="tables border">
                                        <tbody>
                                        <tr>
                                            <th>Client Code</th>
                                            <th>Client Name</th>
                                            <th>Contact No.</th>
                                        </tr>
                                        {clientListData && clientListData.map((item, i) =>
                                            (
                                                <tr key={uniqueId()}>
                                                    <td className='border'>{item.clientCode}</td>
                                                    <td className='border'>{item.clientName}</td>
                                                    <td className='border'>{item.clientContact}</td>
                                                </tr>
                                            )
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <CustomModal headerTitle={"Add Child Client"} modalBody={modalBody} modalToggle={modalToggle} fnSetModalToggle={()=>setModalToggle()} />
        </section>
    )
}

export default ClientList
