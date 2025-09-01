import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { dlValidation } from "../../../../slices/kycValidatorSlice";

const ValidateDrivingLicense = () => {
  const [drivingLicense, setDrivingLicense] = useState({
    number: "",
    dob: "",
  });
  const [isLoading, setIsLoading] = useState();
  const [dlData, setDlData] = useState();
  const [buttonDisable, setButtonDisable] = useState(false);
  const dispatch = useDispatch();
  const handleDlSubmit = async () => {
    if (!drivingLicense.number.length > 0) {
      toast.error("Enter Driving License number");
      return;
    }
    setButtonDisable(true);
    setIsLoading(true);
    let res;
    try {
      const dob = drivingLicense.dob.split("-").reverse().join("-");
      res = await dispatch(
        dlValidation({
          dl_number: drivingLicense.number,
          date_of_birth: dob,
        })
      );
      setButtonDisable(false);
      setIsLoading(false);
      if (res.meta.requestStatus === "fulfilled") setDlData(res?.payload);
      if (!res.payload.status && !res.payload.valid) {
        toast.error(res?.payload?.message || res.payload);
      }
    } catch (error) {
      setButtonDisable(false);
      setIsLoading(false);
      toast.error(res?.payload?.detail);
    }
  };

  return (
    <div>
      <div className="form-inline">
        <div className="form-group">
          <div className="input-container">
            <label
              className="form-label justify-content-start"
              htmlFor="dl_number"
            >
              Driving License Number
            </label>
            <input
              type="text"
              name="dl_number"
              className="form-control mr-4"
              placeholder="Enter Your Driving License Number"
              value={drivingLicense.number}
              onChange={(e) => {
                setDrivingLicense({
                  ...drivingLicense,
                  number: e.target.value,
                });
              }}
            />
          </div>
          <div className="input-container mt-3 mt-md-0">
            <label className="form-label justify-content-start" htmlFor="dob">
              Date Of Birth
            </label>
            <input
              type="date"
              name="dob"
              className="form-control mr-4"
              placeholder="Enter Your Date Of Birth"
              value={drivingLicense.dob}
              onChange={(e) => {
                setDrivingLicense({ ...drivingLicense, dob: e.target.value });
              }}
            />
          </div>
          <button
            type="button"
            className="btn cob-btn-primary text-white btn-sm mt-3"
            onClick={handleDlSubmit}
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
      {dlData && (
        <div className="container mt-5">
          <h5>Driving License Validation Details</h5>
          <div className="row">
            {Object.entries(dlData)?.map(([key, value]) => (
              <div className="col-md-6 p-2 text-uppercase" key={key}>
                <span className="font-weight-bold mb-1">
                  {key.replace("_", " ")}:
                </span>
                {typeof value === "boolean" ? (
                  <span>&nbsp;{value?.toString()}</span>
                ) : (
                  <span>&nbsp;{value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ValidateDrivingLicense;
