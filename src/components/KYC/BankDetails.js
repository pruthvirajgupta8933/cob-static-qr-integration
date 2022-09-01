import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import API_URL from "../../config";
import axios from "axios";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { kycBankNames, saveMerchantBankDetais } from "../../slices/kycSlice";

function BankDetails() {
  const dispatch = useDispatch();

  const KycList = useSelector((state) => state.kyc.kycUserList);

  const VerifyKycStatus = useSelector(
    (state) => state.kyc.kycVerificationForAllTabs.settlement_info_status
  );

  // console.log(VerifyKycStatus,"<==STATUS==>")

  //  console.log(KycList ,"====================>")

  const [data, setData] = useState([]);

  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;

  const initialValues = {
    account_holder_name: KycList?.accountHolderName,
    account_number: KycList?.accountNumber,
    confirm_account_number: KycList?.accountNumber,
    ifsc_code: KycList?.ifscCode,
    bank_id:
      user?.roleId === 5 ? KycList?.merchant_account_details?.bankId : "",
    account_type: KycList?.bankName,
    branch: user?.roleId === 5 ? KycList?.merchant_account_details?.branch : "",
  };
  const validationSchema = Yup.object({
    account_holder_name: Yup.string().required("Required").nullable(),
    account_number: Yup.string().required("Required").nullable(),
    confirm_account_number: Yup.string()
      .oneOf([Yup.ref("account_number"), null], "Account Number  must match")
      .required("Confirm Account Number Required").nullable(),
    ifsc_code: Yup.string().required("Required").nullable(),
    account_type: Yup.string().required("Required").nullable(),
    branch: Yup.string().required("Required").nullable(),
    bank_id: Yup.string().required("Required").nullable(),
  });

  //---------------GET ALL BANK NAMES DROPDOWN--------------------

  useEffect(() => {
    dispatch(kycBankNames())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "bankId",
          "bankName",
          resp.payload
        );
        setData(data);
      })

      .catch((err) => console.log(err));
  }, []);

  // ------------------------------------------

  const onSubmit = (values) => {
    dispatch(
      saveMerchantBankDetais({
        account_holder_name: values.account_holder_name,
        account_number: values.account_number,
        ifsc_code: values.ifsc_code,
        bank_id: values.bank_id,
        account_type: values.account_type,
        branch: values.branch,
        login_id: loginId,
        modified_by: "270",
      })
    ).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true
      ) {
        // console.log("This is the response", res);
        toast.success(res.payload.message);
      } else {
        toast.error("Something Went Wrong! Please try again.");
      }
    });
  };

  return (
    <div className="col-md-12 col-md-offset-4">
      <div className="form-row ">
        <p>
          We will deposit a small amount of money in your account to verify the
          account.
        </p>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formik) => (
          <Form>
            <div className="form-row">
              <div className="form-group col-md-4">
                <FormikController
                  control="input"
                  type="text"
                  label="Account Name *"
                  name="account_holder_name"
                  placeholder="Account Holder Name"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
              </div>

              <div className="form-group col-md-4">
                <FormikController
                  control="input"
                  type="text"
                  label="Account Type *"
                  name="account_type"
                  placeholder="Account Type"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
              </div>

              <div className="form-group col-md-4">
                <FormikController
                  control="select"
                  label="Bank Name*"
                  name="bank_id"
                  className="form-control"
                  placeholder="Enter Bank Name"
                  options={data}
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-3">
                <FormikController
                  control="input"
                  type="text"
                  label="Branch *"
                  name="branch"
                  placeholder="Enter Branch Name"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
              </div>

              <div className="form-group col-md-3">
                <FormikController
                  control="input"
                  type="text"
                  label="Branch IFSC Code *"
                  name="ifsc_code"
                  placeholder="IFSC Code"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
              </div>

              <div className="form-group col-md-3">
                <FormikController
                  control="input"
                  type="text"
                  label="Account Number *"
                  name="account_number"
                  placeholder="Account Number"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
              </div>

              <div className="form-group col-md-3">
                <FormikController
                  control="input"
                  type="text"
                  label="Confirm Account Number  *"
                  name="confirm_account_number"
                  placeholder="Re-Enter Account Number"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
              </div>
            </div>

            {VerifyKycStatus === "Verified" ? null : (
              <button className="btn btn-primary" type="submit">
                Save and Next
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BankDetails;
