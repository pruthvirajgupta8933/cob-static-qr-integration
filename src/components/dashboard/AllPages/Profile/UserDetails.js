import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import { editProfilOtp, updateProfile } from "../../../../services/profile-service/profile.service";
import { emailVerify } from "../../../../services/forgotPassword-service/forgotPassword.service";
import toastConfig from "../../../../utilities/toastTypes";
import CustomModal from '../../../../_components/custom_modal';
import { updateUserProfile } from "../../../../slices/auth";

function UserDetails() {
    const roleBasedShowTab = roleBasedAccess();
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editType, setEditType] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [isApiLoading, setIsApiLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otpValue, setOtpValue] = useState("");
    const [verificationToken, setVerificationToken] = useState(null);

    const {
        loginId,
        clientContactPersonName,
        clientEmail,
        clientMobileNo,
    } = user || {};

    const LoggedUser = Object.keys(roleBasedShowTab).find(key => roleBasedShowTab[key] === true);

    const handleEditClick = (type) => {
        setEditType(type);
        setInputValue(type === "email" ? (clientEmail || "") : (clientMobileNo || ""));
        setIsModalOpen(true);
        setIsOtpSent(false);
        setOtpValue("");
        setVerificationToken(null);
        setApiResponse(null);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleVerify = async () => {

        setIsApiLoading(true);
        setApiResponse(null);
        try {
            let payload = {};
            if (editType === "email") {
                payload = { email: inputValue, otp_type: "Email" };
            } else {
                payload = { phone_number: inputValue, otp_type: "Phone" };
            }
            const response = await editProfilOtp(payload);
            toastConfig.successToast(response.data.message);
            setVerificationToken(response.data.verification_token);
            setIsOtpSent(true);
        } catch (error) {
            setApiResponse(error.response?.data?.message || "Something went wrong.");
            toastConfig.errorToast(error.response?.data?.message || "Something went wrong.");
        } finally {
            setIsApiLoading(false);
        }
    };

    const handleUpdate = async () => {

        setIsApiLoading(true);
        setApiResponse(null);
        try {
            const updatePayload = {
                otp: otpValue,
                verification_token: verificationToken,
            };
            const emailRes = await emailVerify(updatePayload);
            const profileRes = await updateProfile({ verification_token: verificationToken });


            const successMessage =
                // emailRes?.data?.message ||
                profileRes?.data?.message ||
                "Something went wrong";


            const updatedUser = {
                ...user,
                [editType === "email" ? "clientEmail" : "clientMobileNo"]: inputValue,
            };


            dispatch(updateUserProfile(updatedUser));
            toastConfig.successToast(successMessage);
            setIsModalOpen(false);
        } catch (error) {

            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong";
            toastConfig.errorToast(errorMessage);
        } finally {
            setIsApiLoading(false);
        }
    };

    const modalBody = () => (
        <>
            <div>
                {!isOtpSent ? (
                    <div className="form-group">
                        <label htmlFor="modalInput">
                            {editType === "email" ? "Email Address" : "Phone Number"}
                        </label>
                        <input
                            type={editType === "email" ? "email" : "tel"}
                            className="form-control"
                            id="modalInput"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="form-group mb-0">
                        <label htmlFor="otpInput">Enter OTP</label>
                        <input
                            type="text"
                            className="form-control"
                            id="otpInput"
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value)}
                            placeholder="Enter the OTP received"
                        />
                    </div>
                )}

            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleModalClose}>
                    Cancel
                </button>
                {!isOtpSent ? (
                    <button
                        type="button"
                        className="btn cob-btn-primary approve text-white"
                        onClick={handleVerify}
                        disabled={isApiLoading}
                    >
                        {isApiLoading ? "Verifying..." : "Verify"}
                    </button>
                ) : (
                    <button
                        type="button"
                        className="btn cob-btn-primary approve btn-sm text-white"
                        onClick={handleUpdate}
                        disabled={isApiLoading}
                    >
                        {isApiLoading ? "Updating..." : "Update"}
                    </button>
                )}
            </div>
        </>
    );

    return (
        <div className="row">
            <div className="col-lg-12 p-0">
                <div className="card">
                    <div className="card-body">
                        <form>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Merchant Id</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" value={loginId || ""} disabled />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Name</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" value={clientContactPersonName || ""} disabled />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Email Id</label>
                                <div className="col-sm-10">
                                    <div className="input-group">
                                        <input type="text" className="form-control" value={clientEmail || ""} disabled />
                                        <button className="btn btn-outline-secondary" type="button" onClick={() => handleEditClick("email")}>
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Contact Number</label>
                                <div className="col-sm-10">
                                    <div className="input-group">
                                        <input type="text" className="form-control" value={clientMobileNo || ""} disabled />
                                        <button className="btn btn-outline-secondary" type="button" onClick={() => handleEditClick("phone")}>
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Account Type</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" value={LoggedUser || ""} disabled />
                                </div>
                            </div>
                        </form>

                        <div className="col-lg-3 text-right p-0 float-right">
                            <Link to={`/dashboard/change-password`}>
                                <button type="button" className="form-control btn cob-btn-primary text-white">
                                    Change Password
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <CustomModal
                modalBody={modalBody}
                headerTitle={`Edit ${editType === "email" ? "Email" : "Phone Number"}`}
                modalToggle={isModalOpen}
                fnSetModalToggle={setIsModalOpen}
                modalSize="md modal-dialog-centered"

            />
        </div>
    );
}

export default UserDetails;
