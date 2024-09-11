import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { voterCardValidation } from "../../../../slices/kycSlice";

const ValidateVoterCard = () => {
  const [voterId, setVoterId] = useState();
  const [isLoading, setIsLoading] = useState();
  const [voterData, setVoterData] = useState();
  const [buttonDisable, setButtonDisable] = useState(false);
  const dispatch = useDispatch();
  const handleVoterSubmit = async () => {
    if (!voterId.length > 0) {
      toast.error("Enter Transaction ID");
      return;
    }
    setButtonDisable(true);
    setIsLoading(true);
    let res;
    try {
      res = await dispatch(voterCardValidation({ voter: voterId }));
      setButtonDisable(false);
      setVoterData(res?.payload);
      setIsLoading(false);

      if (
        res.meta.requestStatus === "fulfilled" &&
        !res.payload.status &&
        !res.payload.valid
      ) {
        toast.error(res?.payload?.message);
      }
    } catch (error) {
      setButtonDisable(false);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="form-inline">
        <div className="form-group">
          <div className="input-container">
            <input
              type="text"
              name="txn_id"
              className="form-control mr-4"
              placeholder="Enter Your Voter ID"
              value={voterId}
              onChange={(e) => {
                setVoterId(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="form-group">
          <button
            type="button"
            className="btn cob-btn-primary text-white btn-sm"
            onClick={handleVoterSubmit}
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
      {voterData && (
        <div className="container mt-5">
          <h5 className="">Voter ID Validation Details</h5>
          <div className="row">
            {Object.entries(voterData)?.map(([key, value]) => (
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
  );
};
export default ValidateVoterCard;
