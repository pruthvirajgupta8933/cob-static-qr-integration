import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";

function UserDetails() {

    const roleBasedShowTab = roleBasedAccess()

    const { user } = useSelector((state) => state.auth);
    const loginId = user?.loginId;

    const {
        clientContactPersonName,
        clientEmail,
        clientMobileNo,
    } = user;

    const LoggedUser = Object.keys(roleBasedShowTab).find(key => roleBasedShowTab[key] === true);

    return (
        <div className="row">
            <div className="col-lg-12 p-0">
                <div className="card">
                    <div className="card-body">
                        <form>
                        <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Login Id</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" value={loginId} disabled={true} />
                                </div>
                            </div>
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
                            <div className="col-lg-3 text-right p-0 float-right">
                                {/* <label><strong>Change Password</strong></label> -<br/> */}
                                <Link to={`/dashboard/change-password`}>
                                    <button type="button" className="form-control btn  cob-btn-primary text-white" >
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