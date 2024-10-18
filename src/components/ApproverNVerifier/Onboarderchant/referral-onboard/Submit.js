import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { referralOnboardSlice } from "../../../../slices/approver-dashboard/referral-onboard-slice";
import { clearKycState, kycUserList } from "../../../../slices/kycSlice";
import { axiosInstanceJWT } from "../../../../utilities/axiosInstance";
import { generateWord } from "../../../../utilities/generateClientCode";
import API_URL from "../../../../config";
import authService from "../../../../services/auth.service";
import toastConfig from "../../../../utilities/toastTypes";

const Submit = () => {
  const [checked, setChecked] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const dispatch = useDispatch();
  let history = useHistory();
  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse
  );
  const kycData = useSelector((state) => state.kyc?.kycUserList);
  const createClientCode = async () => {
    const clientFullName = basicDetailsResponse?.data?.name ?? kycData?.name;
    const clientMobileNo =
      basicDetailsResponse?.data?.mobileNumber ?? kycData?.contactNumber;
    const arrayOfClientCode = generateWord(clientFullName, clientMobileNo);

    // check client code is existing
    let newClientCode;
    const checkClientCode = await authService.checkClintCode({
      client_code: arrayOfClientCode,
    });
    if (
      checkClientCode?.data?.clientCode !== "" &&
      checkClientCode?.data?.status === true
    ) {
      newClientCode = checkClientCode?.data?.clientCode;
    } else {
      newClientCode = Math.random().toString(36).slice(-6).toUpperCase();
    }

    const data = {
      loginId:
        basicDetailsResponse.data?.loginMasterId ?? kycData?.loginMasterId,
      clientName: clientFullName,
      clientCode: newClientCode,
    };

    try {
      const clientCreated = await axiosInstanceJWT.post(
        API_URL.AUTH_CLIENT_CREATE,
        data
      );
      if (clientCreated.status === 200) {
        setSubmitLoader(false);
        toastConfig.successToast("Client code created");
        dispatch(referralOnboardSlice.actions.resetBasicDetails());
      }
    } catch (error) {
      // console.log("console is here")
      setSubmitLoader(false);
      toastConfig.errorToast(
        error?.message?.details ||
          "An error occurred while creating the Client Code. Please try again."
      );
      return;
    }
  };
  const handleSubmit = () => {
    if (!basicDetailsResponse?.data?.clientCodeCreated && !kycData?.clientCode)
      createClientCode();
    else dispatch(referralOnboardSlice.actions.resetBasicDetails());
    dispatch(clearKycState());
    setTimeout(() => history.push("/dashboard/referral-onboarding"), 2000);
  };
  return (
    <div
      className="tab-pane fade show active"
      id="v-pills-link1"
      role="tabpanel"
      aria-labelledby="v-pills-link1-tab"
    >
      <div className="row">
        <div className="col-lg-12 checkboxstyle">
          <div className="para-style">
            <input
              type="checkbox"
              name="term_condition"
              className="mr-2 mt-1"
              onChange={() => setChecked(!checked)}
            />
            <span>
              I have submitted the details to the best of my knowledge.
            </span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <button
            className="btn btn-sm float-lg-center cob-btn-primary text-white"
            disabled={!checked || submitLoader}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Submit;
