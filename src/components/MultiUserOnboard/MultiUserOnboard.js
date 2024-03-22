import React, { useState, useEffect } from "react"
import { Formik, Form } from "formik";
import FormikController from "../../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { useDispatch, useSelector } from "react-redux";
import OnboardMerchant from "../ApproverNVerifier/Onboarderchant/OnboardMerchant";
import ReferralOnboardForm from "../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/operation-kyc/ReferralOnboardForm/ReferralOnboardForm";
import { fetchParentTypeData } from "../../slices/approver-dashboard/merchantReferralOnboardSlice";
import * as Yup from 'yup';
import BankMerchantOnboard from "../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/BankMerchantOnboard";
import { getAllZoneName } from "../../slices/approver-dashboard/merchantReferralOnboardSlice";
import classes from "./multi-user-onboard.module.css"

const MultiUserOnboard = () => {
  const [refferalList, setRefferalList] = useState([])
  const [selectedValue, setSelectedvalue] = useState("")
  const [selectedDocType, setSelectedDocType] = useState("");
  const [onboardTypeName, setOnboardTypeName] = useState("")
  const [childList, setChiledList] = useState([])
  const [selectedName, setSelectedName] = useState("")
  const [showForm, setShowForm] = useState(false);
  // const [showSecondDropdown, setShowSecondDropdown] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false)
  const { user } = useSelector((state) => state.auth);
  const loginId = user?.loginId;

  const dispatch = useDispatch();
  const initialValues = {
    zone: "",
    onboardType: "",
    parentType: "",
    addMerchant: "",

  };

  const validationSchema = Yup.object().shape({
    zone: Yup.string().when('onboardType', {
      is: (onboardType) => !onboardType,
      then: Yup.string().required('Required')
    }),
    onboardType: Yup.string().required('Onboard type is required'),

  });

  const handleChange = (event) => {
    if (onboardTypeName === "referrer") {
      setShowForm(true)
      setShowBankForm(false)
    } else {
      setShowBankForm(true)
      setShowForm(false)
    }
    setSelectedDocType(event.target.value);
  };


  const selectOnboardType = [
    { key: "", value: "Select" },
    { key: "normal_merchant", value: "Direct Merchant" },
    { key: "normal_referral", value: "Referral" },
    { key: "referrer", value: "Referral Merchant " },
    { key: "bank", value: "Bank Merchant" }
  ];


  useEffect(() => {
    dispatch(getAllZoneName()).then(res => {
      const data = convertToFormikSelectJson(
        "zoneCode",
        "zoneName",
        res?.payload?.data
      )
      setRefferalList(data)
    })
  }, []);



  useEffect(() => {
    const validParentTypes = ["bank", "referrer"]  //here we compare validParentTypes bank or referrer
    if (validParentTypes.includes(onboardTypeName)) {
      const postData = {
        "parent_type": onboardTypeName,
        "created_by": loginId
      }
      dispatch(fetchParentTypeData(postData)).then((res) => {
        setChiledList(res?.payload?.data)

      })
    }
  }, [onboardTypeName]);

  const isEnable = (label) => onboardTypeName === label && selectedValue //condition for showing component


  return (
    <section>
      <main className="">
        <div className="">
          <h5 className="ml-4">Multi User Onboard</h5>
        </div>
        <div className="container-fluid mt-5">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {(formik) => (
              <Form className="row mt-5">
                <div className="form-group col-md-3 ">
                  <FormikController
                    control="select"
                    label="Select Zone"
                    name="zone"
                    options={refferalList}
                    className="form-select"
                    onChange={(e) => {
                      formik.resetForm();
                      setSelectedvalue(e.target.value);
                      setSelectedName(e.target.options[e.target.selectedIndex].text);
                      setShowForm(false);
                      setShowBankForm(false);
                      setOnboardTypeName('');
                      setSelectedDocType('');
                      formik.setFieldValue("zone", e.target.value);
                    }}
                  />
                </div>
                {selectedValue &&
                  <div className="form-group col-md-3">
                    <FormikController
                      control="select"
                      label="Onboard Type"
                      name="onboardType"
                      options={selectedValue ? selectOnboardType : []}  //for dependent first dropdown
                      className="form-select"
                      onChange={(e) => {
                        setOnboardTypeName(e.target.value);
                        setShowForm(false);
                        setShowBankForm(false)
                        formik.setFieldValue("onboardType", e.target.value);
                        setSelectedDocType("");
                      }}
                    />
                  </div>
                }
                {onboardTypeName === "referrer" || onboardTypeName === "bank" ? (
                  <div className="form-group col-md-3">
                    <label className="form-label">{onboardTypeName === "referrer" ? "Add Child" : onboardTypeName === "bank" ? "Bank Child" : null}</label>
                    <select
                      className="form-select"
                      onChange={handleChange}
                      value={selectedDocType}
                    >
                      <option value="">
                        {onboardTypeName === "referrer" ? "Select the merchant" : onboardTypeName === "bank" ? "Select the bank" : ""}
                      </option>
                      {childList?.map((data) => (
                        <option value={data?.loginMasterId} key={data.value}>
                          {data?.client_code} - {data?.name}
                        </option>
                      ))}
                    </select>

                  </div>) : null}
              </Form>
            )}
          </Formik>
          <div className="text-primary mb-3">

            {selectedValue && (
              <React.Fragment>
                <span className={classes.cb_nav}>{`${selectedName ? selectedName : ""}`}</span>
                {onboardTypeName !== "Select" && onboardTypeName && <span className={classes.cb_nav}>{`${onboardTypeName === "Select" ? "" : ` ${selectOnboardType.find(option => option.key === onboardTypeName)?.value}`}`}</span>}
              </React.Fragment>
            )}
          </div>

          {isEnable("normal_merchant") && <div className="card py-2 px-2 mt-5">
            <OnboardMerchant zoneCode={selectedValue} heading={false} />
          </div>}
          {isEnable("normal_referral") && <div className="card py-2 px-2 mt-5">
            <ReferralOnboardForm zoneCode={selectedValue} marginTopCss={false} />
          </div>}
          {isEnable("referrer") && <div className="card py-2 px-2 mt-5">
            <ReferralOnboardForm zoneCode={selectedValue} referralChild={true} fetchData={() => { }} referrerLoginId={selectedDocType} marginTopCss={false} />
          </div>}
          {isEnable("bank") && <div className="card py-2 px-2 mt-5">
            <BankMerchantOnboard zoneCode={selectedValue} referrerLoginId={selectedDocType} heading={false} />
          </div>}
        </div>

      </main>
    </section>
  )
}
export default MultiUserOnboard;