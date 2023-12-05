import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
// import { createClientProfile, updateClientProfile } from "../../../slices/auth";
import { Link } from "react-router-dom";
import { Regex, RegexMsg } from "../../../../_components/formik/ValidationRegex";
// import NavBar from "../NavBar/NavBar";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import profileIllustration from "../../../../assets/images/profile-illustration.png"
import classes from "./profile.module.css"

function UserDetails() {
    const [isCreateorUpdate, setIsCreateorUpdate] = useState(true);
    const [currentTab, setCurrentTab] = useState(1)
    const roleBasedShowTab = roleBasedAccess()

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { dashboard } = useSelector((state) => state);

    const {
        clientMerchantDetailsList,
        loginId,
        clientContactPersonName,
        clientEmail,
        clientMobileNo,
        accountHolderName,

    } = user;





    const LoggedUser = Object.keys(roleBasedShowTab).find(key => roleBasedShowTab[key] === true);










    return (
        <div className="row">
            <div className="col-lg-12 ">

                <div className="card">
                    {/* <h5 className="card-header">{clientContactPersonName}</h5> */}
                    <div className="card-body">

                        <form>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Name</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" value={clientContactPersonName} disabled={true} />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Email Id</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" value={clientEmail} disabled={true} />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Contact Number</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" value={clientMobileNo} disabled={true} />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Account Type</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" value={LoggedUser} disabled={true} />
                                </div>
                            </div>



                        </form>
                        {roleBasedShowTab.merchant ?
                            <div className="col-lg-12 text-right">
                                {/* <label><strong>Change Password</strong></label> -<br/> */}
                                <Link to={`/dashboard/change-password`}>
                                    <button type="button" className="form-control btn  cob-btn-primary w-25  text-white" >
                                        Change Password
                                    </button>
                                </Link>
                            </div>
                            : <></>}


                    </div>

                </div>
            </div>

        </div>

    );
}

export default UserDetails