import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { referralOnboardSlice } from "../../../../slices/approver-dashboard/referral-onboard-slice";
import { clearKycState } from "../../../../slices/kycSlice";

const Submit = () => {
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  let history = useHistory();
  const handleSubmit = () => {
    dispatch(referralOnboardSlice.actions.resetBasicDetails());
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
            disabled={!checked}
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
