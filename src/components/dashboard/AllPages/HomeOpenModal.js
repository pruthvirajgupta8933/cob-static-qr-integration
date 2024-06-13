import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import home_screen_img from "../../../assets/images/welcome-screen-img.png";
import congratsImg from "../../../assets/images/congImg.png";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import { Link } from "react-router-dom";
import {
    GetKycTabsStatus,
    // kycUserList,
    UpdateModalStatus,
} from "../../../slices/kycSlice";

const HomeOpenModal = () => {
    const roles = roleBasedAccess();
    const dispatch = useDispatch();
    const { kyc } = useSelector((state) => state);
    const { KycTabStatusStore, OpenModalForKycSubmit } = kyc;
    const [modalState, setModalState] = useState("Not-Filled");
    const [isRateMappingInProcess, setIsRateMappingInProcess] = useState(false);

    const handleClose = () => {
        dispatch(UpdateModalStatus(false));
    };
    useEffect(() => {
        // console.log(kyc?.kycUserList)
        setModalState(KycTabStatusStore?.status);
    }, [KycTabStatusStore]);
    return (
        <>
            {roles?.merchant === true && (
                <div
                    className={
                        "modal fade mymodals"
                        + (modalState === "Not-Filled" ? " show d-block" : " d-none")
                    }
                // role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered " role="document">
                        <div className="modal-content">
                            <div className="modal-header border-0 py-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModalState(!modalState);
                                    }}
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span ariaHidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {!isRateMappingInProcess && (
                                    <div className="text-center">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <h4 className="text-dark mb-3">
                                                    Welcome to SabPaisa!
                                                </h4>
                                                <h6 className="text-dark mb-3">
                                                    Complete the KYC to activate your account and start accepting payments. Fill in all the information to start your SabPaisa Payment services.
                                                </h6>
                                            </div>

                                            <div className="col-lg-12">
                                                <img
                                                    src={home_screen_img}
                                                    style={{ width: '60%' }}
                                                    alt="SabPaisa"
                                                    title="SabPaisa"
                                                />
                                            </div>
                                        </div>

                                        <div className="row mt-4">
                                            <div className="col-lg-6 text-align-end">
                                                <Link
                                                    to={`/dashboard/kyc`}
                                                >
                                                    <button className="ModalButtbtn btn-sm cob-btn-primary w-100 border-0 p-2">
                                                        Complete the KYC
                                                    </button>
                                                </Link>
                                            </div>
                                            <div className="col-lg-6">

                                                <button
                                                    className="btn btn-sm cob-btn-secondary text-white w-100 border-0 p-2"
                                                    onClick={() => {
                                                        setModalState(!modalState);
                                                    }}
                                                >
                                                    Try out our dashboard
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dashboard open pop up start here {IF KYC IS PENDING}*/}
            {/* Dashboard open pop up start here {IF KYC IS APPROVED}*/}
            {/* need to fix this modal on condition */}
            <div
                className={
                    "modal fade mymodals" +
                    (OpenModalForKycSubmit?.isOpen === true ? " show d-block" : "d-none")
                }
            // role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div
                        className="modal-content"
                        style={{ width: "709px", marginTop: "70px" }}
                    >

                        <div className="modal-body ">
                            <div className="container">
                                <div className="row justify-content-end"> <button
                                    type="button"
                                    onClick={() => {
                                        handleClose();
                                    }}
                                    className="cob-close-btn btn btn-default text-end"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                > X </button></div>
                                <div className="row justify-content-md-center">
                                    <div className="col-md-auto text-centre">
                                        <div className="p-0 m-0">
                                            <h5 style={{ color: "#4BB543" }} className="text-center">
                                                Congratulations!
                                            </h5>

                                            <p className="text-center">
                                                Your KYC is currently under review.
                                                You can accept payments upto INR 10,000.
                                            </p>

                                            <p className="text-center">
                                                The KYC review process usually takes 3-4 working days.  We will notify you in case we want any clarification
                                                on your KYC.
                                            </p>


                                        </div>
                                    </div>

                                    <div className="rounded mx-auto d-block text-center">
                                        <img
                                            src={congratsImg}
                                            alt="SabPaisa"
                                            title="SabPaisa"
                                            className="w-50"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="hrForCard"></div>
                            <div className="text-center">
                                <button
                                    className="btn cob-btn-primary text-white mt-2 text-center"
                                    onClick={() => handleClose()}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default HomeOpenModal;