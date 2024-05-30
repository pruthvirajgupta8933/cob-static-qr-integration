import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { gstValidation } from "../../../slices/kycSlice";

const GstinAdditionalKyc = ({ selectedDocType }) => {
    const [gstinData, setGstinData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [gstStatus, setGstStatus] = useState(false);
    const objArray = Object.entries(gstinData);
    const [initialValuesForGSTIN, setInitialValuesForGSTIN] = useState({
        gst_number: "",

    });
    const dispatch = useDispatch();

    const handleGstinSubmit = async (values) => {

        if (!values.gst_number) {
            toast.error("Enter GSTIN Number.");
            return;
        }
        setIsLoading(true);

        try {
            const res = await dispatch(
                gstValidation({
                    gst_number: values.gst_number,
                    fetchFilings: false,
                    fy: "2018-19",
                })
            );

            setIsLoading(false);
            setGstinData(res?.payload);

            if (
                res.meta.requestStatus === "fulfilled" &&
                res.payload.status === true &&
                res.payload.valid === true
            ) {
                setGstStatus(res.payload.status);
            } else {
                toast.error(res?.payload?.message);
            }
        } catch (error) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // setPanStatus(false);
        setGstStatus(false);
    }, [selectedDocType]);
    return (
        <div>
            <div className="form-inline">
                <div className="form-group">

                    <input
                        type="text"
                        name="gst_number"
                        className="form-control mr-4"
                        placeholder="Enter Your GSTIN Number"
                        value={initialValuesForGSTIN.gst_number}
                        onChange={(e) => {
                            setInitialValuesForGSTIN({ gst_number: e.target.value });

                        }}
                    />



                </div>
                <div className="form-group">
                    <button
                        type="button"
                        className="btn cob-btn-primary text-white btn-sm"
                        onClick={() => handleGstinSubmit(initialValuesForGSTIN)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                ariaHidden="true"
                            ></span>
                        ) : (
                            "Verify" ? "Verify" : ""
                        )}
                    </button>
                </div>
            </div>
            {gstStatus && selectedDocType === "2" && (
                <div className="container mt-5">
                    <h5 className="">GSTIN Information</h5>
                    <div className="row">
                        {objArray.map(([key, value]) => (
                            <div className="col-md-6 p-2 text-uppercase" key={key}>
                                <span className="font-weight-bold mb-1">
                                    {key.replace("_", " ")}:
                                </span>
                                {typeof value === "boolean" ? (
                                    <span>{value.toString()}</span>
                                ) : (
                                    <span>&nbsp;{value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default GstinAdditionalKyc
