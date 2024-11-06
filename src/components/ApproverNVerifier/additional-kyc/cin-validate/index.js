import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cinValidation } from "../../../../slices/kycValidatorSlice";

const ValidateCIN = ({ selectedDocType }) => {
  const [cin, setCin] = useState("");
  const [cinData, setCinData] = useState();
  const [cinStatus, setCinStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const handleCinSubmit = async () => {
    if (!cin.length > 0) {
      toast.error("Enter Company ID");
      return;
    }
    setIsLoading(true);
    let res;
    try {
      res = await dispatch(cinValidation({ cin_number: cin }));
      setIsLoading(false);

      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        setCinData(res?.payload);
        setCinStatus(res.payload.status);
      } else {
        toast.error(
          res?.payload?.message ?? res?.payload?.data?.detail ?? res?.payload
        );
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setCinStatus(false);
  }, [selectedDocType]);

  return (
    <div>
      <div className="form-inline">
        <div className="form-group">
          <div className="input-container">
            <input
              type="text"
              name="cin"
              className="form-control w-100 mr-1"
              placeholder="Enter Your CIN"
              value={cin}
              onChange={(e) => {
                setCin(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="form-group">
          <button
            type="button"
            className="btn cob-btn-primary text-white btn-sm ml-1"
            onClick={handleCinSubmit}
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
      {cinStatus && selectedDocType === "11" && (
        <div className="container mt-5">
          <h5 className="">CIN Validation Details</h5>
          <div className="row">
            {cinData &&
              Object.keys(cinData).map((key) =>
                typeof cinData[key] !== "object" ? (
                  <div className="col-md-6 p-2 text-uppercase" key={key}>
                    <span className="font-weight-bold mb-1">
                      {key.replaceAll("_", " ")}:
                    </span>
                    {/* {Array.isArray(cinData[key]) ? (
                    <span>&nbsp; {cinData[key]?.length}</span>
                  ) : ( */}
                    <span>&nbsp; {cinData[key].toString()}</span>
                    {/* // )} */}
                  </div>
                ) : (
                  <div className="col-md-12 p-2 text-uppercase" key={key}>
                    <span className="font-weight-bold mb-1">
                      {key.replaceAll("_", " ")}:
                    </span>
                    {Array.isArray(cinData[key]) ? (
                      cinData[key].map((data) => (
                        <div className="row border rounded p-1 m-1">
                          {Object.keys(data).map(
                            (subkey) =>
                              typeof data[subkey] !== "object" && (
                                <div className="col-md-4">
                                  <span className="font-weight-bold mb-1">
                                    {subkey.replace(/([a-z])([A-Z])/g, "$1 $2")}
                                    :
                                  </span>
                                  <span>&nbsp; {data[subkey].toString()}</span>
                                </div>
                              )
                          )}
                        </div>
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                )
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidateCIN;
