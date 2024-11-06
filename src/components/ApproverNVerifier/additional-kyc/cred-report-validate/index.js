import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { credReportValidation } from "../../../../slices/kycValidatorSlice";

const ValidateCredReport = ({ selectedDocType }) => {
  const [txn, setTxn] = useState({
    id: "",
  });
  const [credReportData, setCredReporData] = useState();
  const [credStatus, setCredStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const dispatch = useDispatch();
  const handleTxnIdSubmit = async () => {
    if (!txn.id.length > 0) {
      toast.error("Enter Transaction ID");
      return;
    }
    setButtonDisable(true);
    setIsLoading(true);
    let res;
    try {
      res = await dispatch(credReportValidation({ txn_id: txn.id }));
      setButtonDisable(false);
      setIsLoading(false);

      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        setCredStatus(res.payload.status);
        setCredReporData(res?.payload);
      } else {
        toast.error(
          res?.payload?.message ?? res?.payload?.data?.detail ?? res?.payload
        );
      }
    } catch (error) {
      setButtonDisable(false);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setCredStatus(false);
  }, [selectedDocType]);

  return (
    <div>
      <div className="form-inline">
        <div className="form-group">
          <div className="input-container">
            <input
              type="text"
              name="txn_id"
              className="form-control mr-4"
              placeholder="Enter Your Transaction ID"
              value={txn.id}
              onChange={(e) => {
                setTxn({ id: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="form-group">
          <button
            type="button"
            className="btn cob-btn-primary text-white btn-sm"
            onClick={handleTxnIdSubmit}
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
      {credStatus && selectedDocType === "8" && (
        <div className="container mt-5">
          <h5 className="">CRED Report Validation Details</h5>
          <div className="row">
            {credReportData?.map(([key, value]) => (
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

export default ValidateCredReport;
