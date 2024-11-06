import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import { bankAccountVerification } from "../../../slices/kycValidatorSlice";

import FormikController from "../../../_components/formik/FormikController";

const BankAccountList = ({ selectedDocType }) => {
  const initialValuesForBankAccount = {
    ifsc_code: "",
    account_number: "",
  };
  const [bankStatus, setBankStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [bankAccount, setBankAccount] = useState([]);
  const bankAccountInfo = Object.entries(bankAccount);
  const dispatch = useDispatch();
  const handleBankAccountSubmit = async (values) => {
    setButtonDisable(true);
    setIsLoading(true);

    try {
      const res = await dispatch(
        bankAccountVerification({
          account_number: values.account_number,
          ifsc: values.ifsc_code,
        })
      );

      setButtonDisable(false);

      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === true &&
        res?.payload?.valid === true
      ) {
        setBankStatus(res?.payload?.status);
        setIsLoading(false);
        setBankAccount(res?.payload);
      } else {
        toast.error(
          res?.payload?.message ?? res?.payload?.data?.detail ?? res?.payload
        );
        setIsLoading(false);
      }
    } catch (error) {
      setButtonDisable(false);
    }
  };
  useEffect(() => {
    setBankStatus(false);
  }, [selectedDocType]);
  return (
    <div className="container-fluid flleft">
      <div className="form-row">
        <div>
          <div>
            {selectedDocType === "3" && (
              <Formik
                initialValues={initialValuesForBankAccount}
                onSubmit={handleBankAccountSubmit}
                enableReinitialize={true}
              >
                <Form className="form-inline">
                  <div className="form-group mr-3">
                    <div className="input-container">
                      <FormikController
                        control="input"
                        type="text"
                        name="ifsc_code"
                        className="form-control"
                        placeholder="Enter Your IFSC Code"
                      />
                    </div>
                  </div>
                  <div className="form-group mr-3">
                    <div className="input-container">
                      <FormikController
                        control="input"
                        type="text"
                        name="account_number"
                        className="form-control"
                        placeholder="Enter Account Number"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn cob-btn-primary text-white btn-sm"
                      disabled={buttonDisable}
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
                </Form>
              </Formik>
            )}

            {bankStatus && selectedDocType === "3" && (
              <div className="container" style={{ marginTop: "32px" }}>
                <h5 className="font-weight-bold">Bank Account Information</h5>
                <div className="row">
                  {bankAccountInfo.map(([key, value]) => (
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
        </div>
      </div>
    </div>
  );
};

export default BankAccountList;
