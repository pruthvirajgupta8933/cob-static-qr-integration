import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { udyamRegistration } from "../../../slices/kycValidatorSlice";
import { useDispatch } from "react-redux";

const UdyamRegistrationList = ({ selectedDocType }) => {
  const [udyamRegstatus, setUdyamRegstatus] = useState(false);
  const [intialValuesForRegistration, setIntialValuesForRegistration] =
    useState({
      reg_number: "",
    });
  const [udyamRegistrationData, setUdyamRegistrationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const nicCodes = udyamRegistrationData?.nic_codes ?? [];
  const classifications = udyamRegistrationData.classifications;
  const dispatch = useDispatch();

  const handleReginSubmit = async (values) => {
    if (!values.reg_number) {
      toast.error("Enter UDYAM Registration Number.");
      return;
    }
    setIsLoading(true);

    try {
      const res = await dispatch(
        udyamRegistration({
          reg_number: values.reg_number,
        })
      );

      setIsLoading(false);
      setUdyamRegistrationData(res?.payload);

      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        setUdyamRegstatus(res.payload.status);
      } else {
        toast.error(res?.payload?.message);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUdyamRegstatus(false);
  }, [selectedDocType]);

  return (
    <div className="container-fluid flleft">
      <div className="form-row">
        <div>
          <div className="form-inline">
            <div className="form-group">
              <input
                type="text"
                name="reg_number"
                className="form-control mr-4"
                placeholder="Enter Udyam Reg. Number"
                value={intialValuesForRegistration.reg_number}
                onChange={(e) => {
                  setIntialValuesForRegistration({
                    reg_number: e.target.value,
                  });
                }}
              />
            </div>
            <div className="form-group">
              <button
                type="button"
                className="btn cob-btn-primary text-white btn-sm"
                onClick={() => handleReginSubmit(intialValuesForRegistration)}
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
          {udyamRegstatus && selectedDocType === "4" && (
            <div className="container" style={{ marginTop: "32px" }}>
              <div className="row">
                <div className="col-md-12">
                  <table className="table table-bordered mt-3">
                    <thead>
                      <tr>
                        <th>Name of Enterprise</th>
                        <th>Organisation Type</th>
                        <th>Date of Incorporation</th>
                        <th>Udyam Registration Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{udyamRegistrationData?.entity}</td>
                        <td>{udyamRegistrationData?.type}</td>
                        <td>{udyamRegistrationData?.incorporated_date}</td>
                        <td>{udyamRegistrationData?.reg_number}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-md-12">
                  <h6 className="font-weight-bold">
                    Official address of Enterprise
                  </h6>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Block</th>
                        <th>Building</th>
                        <th>City</th>
                        <th>District</th>
                        <th>Masked Email</th>
                        <th>Masked Mobile</th>
                        <th>Road</th>
                        <th>State</th>
                        <th>Unit Number</th>
                        <th>Village Or Town</th>
                        <th>Zip</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {udyamRegistrationData?.official_address?.block}
                        </td>
                        <td>
                          {udyamRegistrationData?.official_address?.building}
                        </td>
                        <td>{udyamRegistrationData?.official_address?.city}</td>
                        <td>
                          {udyamRegistrationData?.official_address?.district}
                        </td>
                        <td>
                          {udyamRegistrationData?.official_address?.maskedEmail}
                        </td>
                        <td>
                          {
                            udyamRegistrationData?.official_address
                              ?.maskedMobile
                          }
                        </td>
                        <td>{udyamRegistrationData?.official_address?.road}</td>
                        <td>
                          {udyamRegistrationData?.official_address?.state}
                        </td>
                        <td>
                          {udyamRegistrationData?.official_address?.unitNumber}
                        </td>
                        <td>
                          {
                            udyamRegistrationData?.official_address
                              ?.villageOrTown
                          }
                        </td>
                        <td>{udyamRegistrationData?.official_address?.zip}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-12">
                  <h6 className="font-weight-bold mt-3">Enterprise Type</h6>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>S.NO</th>
                        <th>Classification Year</th>
                        <th>Enterprise Type</th>
                        <th>Classification Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classifications?.map((data, index) => (
                        <tr key={uuidv4()}>
                          <td>{index + 1}</td>
                          <td>{data?.year}</td>
                          <td>{data?.type}</td>
                          <td>{data?.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-12">
                  <h6 className="font-weight-bold mt-3">
                    National Industry Classification Code(S)
                  </h6>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>S.NO</th>
                        <th>Nic 2 Digit</th>
                        <th>Nic 4 Digit</th>
                        <th>Nic 5 Digit</th>
                        <th>Activity</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nicCodes?.map((data, index) => (
                        <tr key={uuidv4()}>
                          <td>{index + 1}</td>
                          <td>{data?.digit2}</td>
                          <td>{data?.digit4}</td>
                          <td>{data?.digit5}</td>
                          <td>{data?.activity}</td>
                          <td>{data?.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UdyamRegistrationList;
