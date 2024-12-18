import { useSelector } from "react-redux";
import CustomNotification from "./CustomNotification";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const PasswordExpiry = () => {
  const { user } = useSelector((state) => state.auth);
  const history = useHistory()
  const pswUpdatedDuration =
    (new Date() - new Date(user?.password_updated_at)) / (24 * 3600 * 1000);

  let remainingDay = 90 - Math.round(pswUpdatedDuration);
  if (remainingDay < 1) {
    remainingDay = 'today'
  } else {
    remainingDay = `today or within the next ${remainingDay} days`
  }


  const displayMessage = `Your password is set to expire soon. Please update it ${remainingDay} to maintain uninterrupted access.`
  const ctaName = "Change Password"

  const ctaHandler = () => {
    history.push("/dashboard/change-password");
  }
  return (
    <>
      {pswUpdatedDuration > 80 ? <CustomNotification message={displayMessage} ctaName={ctaName} ctaHandler={ctaHandler} /> : <></>}
    </>

  );
};

export default PasswordExpiry;
