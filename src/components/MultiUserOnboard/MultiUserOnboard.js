import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Prompt, useLocation } from "react-router-dom";
import FormikController from "../../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { useDispatch, useSelector } from "react-redux";
import OnboardMerchant from "../ApproverNVerifier/Onboarderchant/OnboardMerchant";
import ReferralOnboardForm from "../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/operation-kyc/ReferralOnboardForm/ReferralOnboardForm";
import {
  fetchParentTypeData,
  getAllZoneName,
} from "../../slices/approver-dashboard/merchantReferralOnboardSlice";
import { clearKycState, kycUserList } from "../../slices/kycSlice";
// import * as Yup from 'yup';

import BankMerchantOnboard from "../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/BankMerchantOnboard";
import classes from "./multi-user-onboard.module.css";
import Yup from "../../_components/formik/Yup";
import Referral from "../ApproverNVerifier/Onboarderchant/referral-onboard";
import { referralOnboardSlice } from "../../slices/approver-dashboard/referral-onboard-slice";
import { stringDec } from "../../utilities/encodeDecode";
import toastConfig from "../../utilities/toastTypes";
import SubMerchant from "../ApproverNVerifier/Onboarderchant/SubMerchant";

const MultiUserOnboard = () => {
  const [refferalList, setRefferalList] = useState([]);
  const [selectedChildName, setSelectedChildName] = useState("");
  const [selectedValue, setSelectedvalue] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");
  const [onboardTypeName, setOnboardTypeName] = useState("");
  const [childList, setChiledList] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [showForm, setShowForm] = useState(false);
  // const [showSecondDropdown, setShowSecondDropdown] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);

  const kycData = useSelector((state) => state.kyc?.kycUserList);
  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse
  );
  const { user } = useSelector((state) => state.auth);
  const loginId = user?.loginId;

  const param = new URLSearchParams(useLocation().search);
  const merchantId = param.get("merchantId")
    ? stringDec(param.get("merchantId"))
    : null;
  const dispatch = useDispatch();

  const selectOnboardType = [
    {
      key: "normal_merchant",
      value: "Direct Merchant",
      displayValue: "Direct Merchant",
    },
    {
      key: "individual_referral",
      value: "Referrer (Individual)",
      displayValue: "Referral (Individual)",
    },
    {
      key: "company_referral",
      value: "Referrer (Company)",
      displayValue: "Referral (Company)",
    },
    {
      key: "referrer",
      value: "Referral Merchant ",
      displayValue: "Referral Merchant",
    },
    { key: "bank", value: "Bank Merchant", displayValue: "Bank Merchant " },
    {
      key: "sub_merchant",
      value: "Sub Merchant",
      displayValue: "Sub-Merchant ",
    },
  ];
  const initialValues = {
    zone: kycData?.zone_code ?? "",
    onboardType:
      selectOnboardType.find((type) => type.value === kycData?.onboard_type)
        ?.key ?? "",
    parentType: "",
    addMerchant: "",
  };
  const validationSchema = Yup.object().shape({
    zone: Yup.string().when("onboardType", {
      is: (onboardType) => !onboardType,
      then: Yup.string().required("Required"),
    }),
    onboardType: Yup.string().required("Onboard type is required"),
  });

  const handleChange = (event) => {
    if (event.target.value) {
      if (onboardTypeName === "referrer") {
        setShowForm(true);
        setShowBankForm(false);
      } else {
        setShowBankForm(true);
        setShowForm(false);
      }
    } else {
      setShowBankForm(false);
      setShowForm(false);
    }

    setSelectedUserType(event.target.value);
    const selectedName = event.target.options[event.target.selectedIndex].text;
    setSelectedChildName(selectedName);
  };

  useEffect(() => {
    if (kycData) {
      setSelectedvalue(kycData?.zone_code);
      setSelectedName(
        refferalList?.find((i) => i.key === kycData.zone_code)?.value
      );
      setOnboardTypeName(
        initialValues.onboardType ??
          selectOnboardType.find((type) => type.value === kycData?.onboard_type)
            ?.key
      );
      if (
        merchantId &&
        kycData?.onboard_type &&
        kycData.onboard_type != "Sub Merchant" &&
        kycData.onboard_type != "Referrer (Company)" &&
        kycData.onboard_type != "Referrer (Individual)"
      ) {
        toastConfig.infoToast(
          "Please log in using your merchant credentials and complete the KYC process at your earliest convenience."
        );
      }
    }
  }, [kycData]);

  useEffect(() => {
    if (merchantId)
      dispatch(kycUserList({ login_id: merchantId, password_required: true }));
  }, [merchantId]);
  useEffect(() => {
    dispatch(getAllZoneName()).then((res) => {
      let data = convertToFormikSelectJson(
        "zoneCode",
        "zoneName",
        res?.payload?.data
      );

      data.sort((a, b) => {
        if (a.value === "Select") {
          return -1;
        } else if (b.value === "Select") {
          return 1;
        }
        return a.value.localeCompare(b.value);
      });

      setRefferalList(data);
    });
    return () => {
      // dispatch(referralOnboardSlice.actions.resetBasicDetails());
    };
  }, []);

  useEffect(() => {
    const validParentTypes = ["bank", "referrer"]; //here we compare validParentTypes bank or referrer
    if (validParentTypes.includes(onboardTypeName)) {
      const postData = {
        parent_type: onboardTypeName,
        created_by: loginId,
      };
      dispatch(fetchParentTypeData(postData)).then((res) => {
        setChiledList(res?.payload?.data);
      });
    }
  }, [onboardTypeName]);

  const isEnable = (label) => onboardTypeName === label && selectedValue; //condition for showing component

  return (
    <section>
      <main className="">
        <div className="">
          <h5 className="">Clientegration</h5>
        </div>
        {(basicDetailsResponse.data?.business_cat_code ?? merchantId) && (
          <Prompt
            message={() => {
              if (
                window.confirm(
                  "You might have unsaved changes. Are you sure you want to leave?"
                )
              ) {
                dispatch(referralOnboardSlice.actions.resetBasicDetails());
                dispatch(clearKycState());
                return true; // Allow navigation
              }
              return false;
            }}
          />
        )}
        <div className="container-fluid p-0">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {(formik) => (
              <Form className="row mt-5">
                <div className="form-group col-md-3 ">
                  <FormikController
                    control="select"
                    label="Onboard Type"
                    name="onboardType"
                    options={convertToFormikSelectJson(
                      "key",
                      "displayValue",
                      selectOnboardType
                    )} //for dependent first dropdown
                    className="form-select"
                    onChange={(e) => {
                      setSelectedName(
                        e.target.options[e.target.selectedIndex].text
                      );
                      setSelectedvalue("");
                      formik.resetForm();
                      setOnboardTypeName(e.target.value);
                      setShowForm(false);
                      setShowBankForm(false);
                      formik.setFieldValue("onboardType", e.target.value);
                      setSelectedUserType("");
                    }}
                  />
                </div>
                {onboardTypeName !== "" &&
                  onboardTypeName !== "sub_merchant" && (
                    <div className="form-group col-md-3">
                      <FormikController
                        control="select"
                        label="Select Zone"
                        name="zone"
                        options={refferalList}
                        className="form-select"
                        onChange={(e) => {
                          setSelectedvalue(e.target.value);
                          setShowForm(false);
                          setShowBankForm(false);
                          // setOnboardTypeName("");
                          setSelectedUserType("");
                          formik.setFieldValue("zone", e.target.value);
                        }}
                      />
                    </div>
                  )}
                {onboardTypeName === "referrer" ||
                onboardTypeName === "bank" ? (
                  <div className="form-group col-md-3">
                    <label className="form-label">
                      {onboardTypeName === "referrer"
                        ? "Select Referral"
                        : onboardTypeName === "bank"
                        ? "Select Bank"
                        : null}
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={selectedUserType}
                    >
                      <option value="">
                        {onboardTypeName === "referrer"
                          ? "Select"
                          : onboardTypeName === "bank"
                          ? "Select"
                          : ""}
                      </option>
                      {childList?.map((data) => (
                        <option value={data?.loginMasterId} key={data?.value}>
                          {data?.client_code
                            ? `${data?.client_code?.toUpperCase()} - ${data?.name?.toUpperCase()}`
                            : data?.name?.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <></>
                )}
              </Form>
            )}
          </Formik>
          <div className="text-primary mb-3 d-flex">
            {selectedValue && (
              <React.Fragment>
                {onboardTypeName !== "Select" && onboardTypeName && (
                  <p className={classes.cb_nav}>{`${
                    onboardTypeName === "Select"
                      ? ""
                      : ` ${
                          selectOnboardType.find(
                            (option) => option.key === onboardTypeName
                          )?.value
                        }`
                  }`}</p>
                )}
                <p className={classes.cb_nav}>{`${
                  selectedName
                    ? refferalList.find((i) => i.key === selectedValue)?.value
                    : ""
                }`}</p>
                {selectedUserType && (
                  <p className={classes.cb_nav}>{selectedChildName}</p>
                )}
              </React.Fragment>
            )}
          </div>

          {isEnable("normal_merchant") && (
            <div className="card py-2 px-2 mt-5">
              <OnboardMerchant zoneCode={selectedValue} heading={false} />
            </div>
          )}
          {isEnable("individual_referral") && (
            <div className="card py-2 px-2 mt-5">
              <Referral
                type="individual"
                zoneCode={selectedValue}
                edit={Boolean(merchantId)}
              />
            </div>
          )}
          {isEnable("company_referral") && (
            <div className="card py-2 px-2 mt-5">
              <Referral
                type="company"
                zoneCode={selectedValue}
                edit={Boolean(merchantId)}
              />
            </div>
          )}
          {isEnable("referrer") && showForm && (
            <div className="card py-2 px-2 mt-5">
              <ReferralOnboardForm
                zoneCode={selectedValue}
                referralChild={true}
                fetchData={() => {}}
                referrerLoginId={selectedUserType}
                marginTopCss={false}
              />
            </div>
          )}
          {isEnable("bank") && showBankForm && (
            <div className="card py-2 px-2 mt-5">
              <BankMerchantOnboard
                zoneCode={selectedValue}
                referrerLoginId={selectedUserType}
                heading={false}
              />
            </div>
          )}
          {onboardTypeName === "sub_merchant" && (
            <div className="card py-2 px-2 mt-5">
              <SubMerchant edit={Boolean(merchantId)} />
            </div>
          )}
        </div>
      </main>
    </section>
  );
};
export default MultiUserOnboard;
