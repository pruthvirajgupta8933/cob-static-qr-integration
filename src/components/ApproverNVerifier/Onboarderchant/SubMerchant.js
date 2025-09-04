import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ReactSelect, { createFilter } from "react-select";
import { Regex, RegexMsg } from "../../../_components/formik/ValidationRegex";
import Yup from "../../../_components/formik/Yup";
import CustomLoader from "../../../_components/loader";
import {
  fetchSubMerchant,
  getCLientCodeByRoleSlice,
} from "../../../slices/approver-dashboard/approverDashboardSlice";
import { stringEnc } from "../../../utilities/encodeDecode";
import OnboardMerchant from "./OnboardMerchant";

const SubMerchant = ({ edit }) => {
  const [clientLoginId, setClientLoginId] = useState();
  const history = useHistory();

  const { clientCodeByRole, subMerchantList } = useSelector(
    (state) => state.approverDashboard
  );
  const merchantClientCodeList = clientCodeByRole?.["Merchant"] || [];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCLientCodeByRoleSlice({ role: "Merchant" }));
    return () => {};
  }, []);

  const options = [
    { value: "", label: "Select Client Code" },
    ...merchantClientCodeList?.map((data) => ({
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
      .matches(Regex.password, RegexMsg.password),
    confirmpasswordd: Yup.string()
      .allowOneSpace()
      .oneOf([Yup.ref("passwordd"), null], "Passwords must match")
      .allowOneSpace(),
  });
  const handleSelectChange = async (selectedOption) => {
    setClientLoginId(selectedOption ? selectedOption.value : null);
    if (edit) dispatch(fetchSubMerchant({ login_id: selectedOption.value }));
  };
  const renderSubMerchants = () => {
    if (subMerchantList?.[clientLoginId]?.length === 0)
      return <CustomLoader loadingState />;
    if (
      subMerchantList?.[clientLoginId]?.status_code === 404 ||
      subMerchantList?.[clientLoginId]?.message === "Data Not Found"
    )
      return (
        <h5>{subMerchantList?.[clientLoginId]?.detail ?? "Data Not Found"}</h5>
      );
    if (subMerchantList[clientLoginId]?.sub_merchants?.length > 0)
      return (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Mobile No.</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subMerchantList[clientLoginId]?.sub_merchants?.map(
              (subMerchant) => (
                <tr key={subMerchant.loginMasterId}>
                  <td className="align-middle">{subMerchant.name}</td>
                  <td className="align-middle">{subMerchant.email}</td>
                  <td className="align-middle">{subMerchant.username}</td>
                  <td className="align-middle">{subMerchant.mobileNumber}</td>
                  <td className="align-middle">{subMerchant.status}</td>
                  <td className="align-middle">
                    <button
                      type="button"
                      className="btn cob-btn-primary btn-primary text-white btn-sm"
                      onClick={(e) =>
                        history.push(
                          `kyc?kycid=${stringEnc(subMerchant?.loginMasterId)}`
                        )
                      }
                    >
                      Edit KYC
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      );
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
      {edit ? (
        renderSubMerchants()
      ) : (
        <OnboardMerchant
          heading={false}
          clientLoginId={clientLoginId}
          validator={validator}
        />
      )}
    </>
  );
};
export default SubMerchant;
