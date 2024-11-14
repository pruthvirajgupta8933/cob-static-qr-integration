import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect, { createFilter } from "react-select";
import Yup from "../../../_components/formik/Yup";
import { getCLientCodeByRoleSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
import OnboardMerchant from "./OnboardMerchant";

const SubMerchant = () => {
  const [clientLoginId, setClientLoginId] = useState();

  const clientCodeList =
    useSelector(
      (state) => state.approverDashboard?.clientCodeByRole?.["Merchant"]
    ) || [];
  const dispatch = useDispatch();
  useEffect(() => dispatch(getCLientCodeByRoleSlice({ role: "Merchant" })), []);

  const options = [
    { value: "", label: "Select Client Code" },
    ...clientCodeList?.map((data) => ({
      value: data.loginMasterId,
      label: `${data.clientCode} - ${data.name}`,
    })),
  ];
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validator = Yup.object().shape({
    fullname: Yup.string()
      .matches(
        /^[a-zA-Z\s.0-9]+$/,
        "Only alphabets, full stops, and numbers are allowed for this field"
      )
      .allowOneSpace(),
    mobilenumber: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .allowOneSpace()
      .min(10, "Phone number in not valid")
      .max(10, "too long"),
    emaill: Yup.string()
      .allowOneSpace()
      .email("Must be a valid email")
      .max(255),
    passwordd: Yup.string()
      .allowOneSpace()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special Character"
      ),
    confirmpasswordd: Yup.string()
      .allowOneSpace()
      .oneOf([Yup.ref("passwordd"), null], "Passwords must match")
      .allowOneSpace(),
  });
  const handleSelectChange = async (selectedOption) => {
    setClientLoginId(selectedOption ? selectedOption.value : null);
  };
  return (
    <>
      <span className="form-label font-weight-bold mt-2">
        Select Client Code
      </span>
      <ReactSelect
        className="zindexforDropdown mb-4 px-0 col-4"
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Client Code"
        filterOption={createFilter({ ignoreAccents: false })}
      />
      <OnboardMerchant
        heading={false}
        clientLoginId={clientLoginId}
        validator={validator}
      />
    </>
  );
};
export default SubMerchant;
