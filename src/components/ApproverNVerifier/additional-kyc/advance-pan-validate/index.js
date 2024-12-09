import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import toastConfig from "../../../../utilities/toastTypes";
import { advancePanValidation } from "../../../../slices/kycValidatorSlice";

const AdvancePanValidate = ({ selectedDocType }) => {
  const [initialValuesForPAN, setInitialValuesForPAN] = useState({
    pan_card: "",
  });
  const [panInfo, setPanInfo] = useState([]);
  const [panStatus, setPanStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const dispatch = useDispatch();
  const handlePanSubmit = async (values) => {
    if (!values.pan_card) {
      toast.error("Enter PAN Card Number.");
      return;
    }
    setButtonDisable(true);
    setIsLoading(true);
    try {
      const res = await dispatch(
        advancePanValidation({ pan_number: values.pan_card })
      );
      setButtonDisable(false);
      setPanInfo(res?.payload);
      setIsLoading(false);
      // console.log("res", res)
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        setPanStatus(res.payload.status);
      } else {
        toastConfig.errorToast(res?.payload);
      }
    } catch (error) {
      toastConfig.errorToast("Something went wrong");
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
        </div>
      </div>
      {panStatus && selectedDocType === "12" && (
        <div className="mt-5">
          <h5 className="">PAN Details</h5>
          <div className="row">
            <div className="col-md-6 p-2">
              <span className="font-weight-bold mb-1">First Name : </span>
              <span>{panInfo?.first_name}</span>
            </div>
            <div className="col-md-6 p-2">
              <span className="font-weight-bold mb-1">Last Name : </span>
              <span>{panInfo?.last_name}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 p-2">
              <span className="font-weight-bold mb-1">DOB : </span>
              <span>{panInfo?.dob}</span>
            </div>
            <div className="col-md-6 p-2">
              <span className="font-weight-bold mb-1">Aadhaar Linked : </span>
              <span>{panInfo?.aadhaar_linked?.toString()}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 p-2">
              <span className="font-weight-bold mb-1">PAN Category : </span>
              <span>{panInfo?.pan_category}</span>
            </div>
            <div className="col-md-6 p-2">
              <span className="font-weight-bold mb-1">Valid : </span>
              <span>{panInfo?.valid?.toString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancePanValidate;
