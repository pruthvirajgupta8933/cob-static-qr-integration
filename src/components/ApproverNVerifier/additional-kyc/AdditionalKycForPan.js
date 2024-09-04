import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { authPanValidation } from "../../../slices/kycSlice";

const AdditionalKycForPan = ({ selectedDocType }) => {
    const [initialValuesForPAN, setInitialValuesForPAN] = useState({
        pan_card: "",
    });
    const [showPanInfo, setShowPanInfo] = useState([]);
    const [panStatus, setPanStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);
    const panInfoData = Object.entries(showPanInfo);
    const dispatch = useDispatch();
    const handlePanSubmit = async (values) => {
        if (!values.pan_card) {
            toast.error("Enter PAN Card Number.");
            return;
        }
        setButtonDisable(true);
        setIsLoading(true);
        try {
            const res = await dispatch(authPanValidation({ pan_number: values.pan_card }));
            setButtonDisable(false);
            setShowPanInfo(res?.payload);
            setIsLoading(false);

            if (
                res.meta.requestStatus === 'fulfilled' &&
                res.payload.status === true &&
                res.payload.valid === true
            ) {
                setPanStatus(res.payload.status);
            } else {
                toast.error(res?.payload?.message);
            }
        } catch (error) {
            setButtonDisable(false);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        setPanStatus(false);
    }, [selectedDocType]);


    return (
        
        <div className="container-fluid flleft">
        <div className="form-row">
        <div>
            <div className="form-inline">
                <div className="form-group">
                    <div className="input-container">
                        <input
                            type="text"
                            name="pan_card"
                            className="form-control mr-4"
                            placeholder="Enter Your PAN"
                            value={initialValuesForPAN.pan_card}
                            onChange={(e) => {
                                setInitialValuesForPAN({ pan_card: e.target.value });
                            }}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <button
                        type="button"
                        className="btn cob-btn-primary text-white btn-sm"
                        onClick={() => handlePanSubmit(initialValuesForPAN)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                ariaHidden="true"
                            ></span>
                        ) : (
                            "Verify"
                        )}
                    </button>
                </div>
            </div>
            {panStatus && selectedDocType === "1" && (
                <div className="container mt-5">
                    <h5 className="">PAN Details</h5>
                    <div className="row">
                        {panInfoData.map(([key, value]) => (
                            <div className="col-md-6 p-2 text-uppercase" key={key}>
                                <span className="font-weight-bold mb-1">
                                    {key.replace("_", " ")}:
                                </span>
                                {typeof value === "boolean" ? (
                                    <span>{value.toString()}</span>
                                ) : (
                                    <span>&nbsp; {value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        </div>
      </div>

    )
}

export default AdditionalKycForPan 
