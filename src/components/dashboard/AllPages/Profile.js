import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { createClientProfile, updateClientProfile } from "../../../slices/auth";
import { Link } from "react-router-dom";

import profileService from "../../../services/profile.service";
import { toast, Zoom } from "react-toastify";
import { Regex, RegexMsg } from "../../../_components/formik/ValidationRegex";

export const Profile = () => {
  const [isCreateorUpdate, setIsCreateorUpdate] = useState(true);
  const { fetchDcBankList, fetchNbBankList, verifyClientCode, verifyIfcsCode } =
    profileService;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { dashboard } = useSelector((state) => state);

  // const {fetchDcBankList,fetchNbBankList} = profileService
  const {
    clientMerchantDetailsList,
    loginId,
    clientContactPersonName,
    clientEmail,
    clientMobileNo,
    accountHolderName,
    accountNumber,
    bankName,
    ifscCode,
    pan,
    clientAuthenticationType,
  } = user;

  var initNBlist,
    initDClist = [];

  if (localStorage.getItem("NB_bank_list") !== null) {
    initNBlist = JSON.parse(localStorage.getItem("NB_bank_list"));
  } else {
    initNBlist = [];
  }

  if (localStorage.getItem("DC_bank_list") !== null) {
    initDClist = JSON.parse(localStorage.getItem("DC_bank_list"));
  }
// console.log(clientMerchantDetailsList)
  // const clientMerchantDetailsList = user?.clientMerchantDetailsList;
  const clientId = user?.clientMerchantDetailsList[0]?.clientId;
  // console.log(clientId)

  // const clientId = user?.clientMerchantDetailsList[0]?.clientId;

  // const [createProfileResponse , setCreateProfileResponse]  = useState('');

  const [authenticationMode, setAuthenticationMode] = useState(
    clientAuthenticationType
  );
  const [listOfNetBank, setListOfNetBank] = useState(initNBlist);
  const [listOfDebitCardBank, setListOfDebitCardBank] = useState(initDClist);

  const [selectedListForOption, setSelectedListForOption] = useState(
    authenticationMode === "NetBank" ? listOfNetBank : listOfDebitCardBank
  );

  const [isClientCodeValid, setIsClientCodeValid] = useState(null);
  const [isIfcsValid, setIsIfscValid] = useState(true);

  const userIfscCode = ifscCode;

  useEffect(() => {
    // setCreateProfileResponse(dashboard.createClientProfile)
  }, [dashboard]);

  //temp variable
  // const temp1 = createProfileResponse

  // console.log(authenticationMode);

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  //   console.log(clientMerchantDetailsList && clientMerchantDetailsList[0]?.address)
  //  console.log(isCreateorUpdate);
  //   initial values
  const INITIAL_FORM_STATE = {
    loginId: loginId,
    clientName: clientContactPersonName,
    phone: clientMobileNo,
    email: clientEmail,
    ...(isCreateorUpdate && { clientCode: "" }),
    address: clientMerchantDetailsList && clientMerchantDetailsList[0]?.address,
    accountHolderName: accountHolderName,
    bankName: bankName,
    accountNumber: accountNumber,
    ifscCode: userIfscCode,
    pan: pan,
    clientAuthenticationType: clientAuthenticationType,
  };

  // form validation rules
  const validationSchema = Yup.object().shape({
    loginId: Yup.string().required("Required"),
    clientName: Yup.string()
      .required("Required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
    phone: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
    email: Yup.string().email("Invalid email").required("Required"),
    ...(isCreateorUpdate && {
      clientCode: Yup.string()
        .min(5, "Client Code should be 6 digit")
        .max(6, "Client Code maximum limit is 6")
        .required("Required")
        .nullable(),
    }),
    address: Yup.string().matches(Regex.address, RegexMsg.address).required("Required").nullable(),
    accountHolderName: Yup.string()
      .required("Required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
      .nullable(),
    bankName: Yup.string()
      .required("Required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
      .nullable(),
    accountNumber: Yup.string()
      .matches(Regex.digit, RegexMsg.digit)
      .required("Required")
      .max(20, "Bank Account number length under 20 digits")
      .nullable(),
    ifscCode: Yup.string()
      .required("Required")
      .matches(/^[a-zA-Z0-9\s]+$/, "IFCS Code not valid ")
      .nullable(),
    pan: Yup.string()
      .matches(/^[a-zA-Z0-9\s]+$/, "Pan Card not valid ")
      .nullable(),
    clientAuthenticationType: Yup.string().required(
      "Select Authentication Mode"
    ),
  });

  //   console.log(validationSchema);

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  // user state for form
  const [userData, setUserData] = useState(null);

  // effect runs on component mount
  useEffect(() => {
    // simulate async api call with set timeout
    setTimeout(() => {
      setUserData(INITIAL_FORM_STATE);
    }, 1000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // effect runs when user state is updated
  useEffect(() => {
    // reset form with user data
    reset(userData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  function onSubmit(data) {
    if (isCreateorUpdate) {
      dispatch(createClientProfile(data));
    } else {
      delete data.clientCode;
      dispatch(updateClientProfile({ data, clientId }));
    }
    // isCreateorUpdate ? dispatch(createClientProfile(data)) : delete data.clientCode; dispatch(updateClientProfile({data,clientId}))
    toast.success("Your Data is Update successfully", {
      autoClose: 2000,
      limit: 1,
      transition: Zoom,
    });
  }

  const verifyClientCodeFn = (getCode) => {
    getCode.length > 5 && getCode.length < 7
      ? verifyClientCode(getCode)
          .then((res) => {
            setIsClientCodeValid(res.data);
          })
          .catch((error) => {
            console.log(error);
            setIsClientCodeValid(false);
          })
      : setIsClientCodeValid(null);
  };

  const verifyIfcdCodeFn = (ifscCodeInput) => {
    // console.log(ifscCodeInput);
    ifscCodeInput.length > 5
      ? verifyIfcsCode(ifscCodeInput)
          .then((res) => {
            setIsIfscValid(res.data);
          })
          .catch((error) => {
            console.log(error);
            setIsIfscValid(false);
          })
      : setIsIfscValid(true);
  };

  useEffect(() => {
    // fetch bank list
    fetchDcBankList()
      .then((response) => {
        localStorage.setItem("DC_bank_list", JSON.stringify(response.data));
        setListOfNetBank(response.data);
      })
      .catch((error) => console.log(error));

    fetchNbBankList()
      .then((response) => {
        localStorage.setItem("NB_bank_list", JSON.stringify(response.data));
        setListOfDebitCardBank(response.data);
      })
      .catch((error) => console.log(error));
    setIsCreateorUpdate(
      clientMerchantDetailsList && clientMerchantDetailsList !== null
        ? false
        : true
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authenticationMode === "NetBank") {
      setSelectedListForOption(listOfNetBank);
    }
    if (authenticationMode === "Debitcard") {
      setSelectedListForOption(listOfDebitCardBank);
    }
  }, [authenticationMode, listOfNetBank, listOfDebitCardBank]);

  // console.log(authenticationMode);
  // console.log(bankName);
  // console.log(selectedListForOption);

  return (
    <section className="ant-layout">
      <div className="profileBarStatus"></div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper">
            <h1 className="right_side_heading">
              My Profile{" "}
              <Link to={`/dashboard/change-password`}>
               <button
                 type="button"
                 className="ant-btn change_password pull-right"
               >
                 <i className="fa fa-key" />
                 <span> Change Password</span>
               </button>
             </Link>
            </h1>
            <div className="ant-tabs ant-tabs-top ant-tabs-line">
              <div
                role="tablist"
                className="ant-tabs-bar ant-tabs-top-bar"
                tabIndex={0}
              >
                <div className="ant-tabs-nav-container">
                  <div className="ant-tabs-nav-wrap">
                    <div className="ant-tabs-nav-scroll">
                      <div className="ant-tabs-nav- ant-tabs-nav-animated">
                        <div>
                          {/* <h4 style={{background: "#ffa2a2",padding: "14px",margin:" auto",textAlign: "center"}}> */}
                          {/* {message} */}
                          {/* </h4> */}
                          {/* <div role="tab" aria-disabled="false" aria-selected="true" className="ant-tabs-tab-active ant-tabs-tab">Basic Details</div> */}
                        </div>
                        <div
                          className="ant-tabs-ink-bar ant-tabs-ink-bar-animated"
                          style={{
                            display: "block",
                            transform: "translate3d(0px, 0px, 0px)",
                            width: "116px",
                          }}
                        ></div>


                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                tabIndex={0}
                role="presentation"
                style={{
                  width: "0px",
                  height: "0px",
                  overflow: "hidden",
                  position: "absolute",
                }}
              />
              <div
                className="ant-tabs-content ant-tabs-content-animated ant-tabs-top-content"
                style={{ marginLeft: "0%" }}
              >
                <div
                  role="tabpanel"
                  aria-hidden="false"
                  className="ant-tabs-tabpane ant-tabs-tabpane-active"
                >
                  <div
                    tabIndex={0}
                    role="presentation"
                    style={{
                      width: "0px",
                      height: "0px",
                      overflow: "hidden",
                      position: "absolute",
                    }}
                  ></div>
                  <div className="panel" style={{ maxWidth: "100%" }}>
                    <div
                      className="container-"
                      style={{ margin: "0 !important" }}
                    >
                      {/* start form area */}
                      <div className="row- justify-content-center">
                        <div className="col-md-12-">

                        <Link to="/reset" className="float-right " style={{margin:"-23px"}}>Change Password</Link>
 
                          <div className="card">
                            <div className="card-header">Basic Details</div>
                            <div className="card-body-">
                              <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                  <label
                                    htmlFor="loginId"
                                    className="col-form-label text-md-right"
                                  >
                                    {" "}
                                    Login ID
                                  </label>

                                  <input
                                    className={`form-control ${
                                      errors.loginId ? "is-invalid" : ""
                                    }`}
                                    {...register("loginId")}
                                    type="text"
                                    id="loginId"
                                    name="loginId"
                                    onChange={(e) => e.target.value}
                                    disabled
                                  />
                                  <div className="invalid-feedback">
                                    {errors.loginId?.message}
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                  <label
                                    htmlFor="clientName"
                                    className=" col-form-label text-md-right"
                                  >
                                    Client Name
                                  </label>

                                  <input
                                    className={`form-control ${
                                      errors.clientName ? "is-invalid" : ""
                                    }`}
                                    {...register("clientName")}
                                    type="text"
                                    id="clientName"
                                    name="clientName"
                                    onChange={(e) => e.target.value}
                                  />
                                  <div className="invalid-feedback">
                                    {errors.clientName?.message}
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                  <label
                                    htmlFor="phone"
                                    className="col-form-label text-md-right"
                                  >
                                    Phone
                                  </label>

                                  <input
                                    className={`form-control ${
                                      errors.phone ? "is-invalid" : ""
                                    }`}
                                    {...register("phone")}
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    onChange={(e) => e.target.value}
                                  />
                                  <div className="invalid-feedback">
                                    {errors.phone?.message}
                                  </div>
                                </div>
                                {/* Client Code Hide if already client created */}
                                {isCreateorUpdate ? (
                                  <div className="col-md-4 col-md-6 col-sm-12">
                                    <label
                                      htmlFor="clientCode"
                                      className="col-form-label text-md-right"
                                    >
                                      Client Code
                                    </label>
                                    <input
                                      className={`form-control ${
                                        errors.clientCode ? "is-invalid" : ""
                                      }`}
                                      {...register("clientCode")}
                                      type="text"
                                      id="clientCode"
                                      name="clientCode"
                                      onChange={(e) =>
                                        verifyClientCodeFn(e.target.value)
                                      }
                                    />
                                    <div className="">
                                      {isClientCodeValid
                                        ? "Valid Client Code"
                                        : "Try another Client Code"}
                                    </div>
                                    <div className="invalid-feedback">
                                      {errors.clientCode?.message}
                                    </div>
                                  </div>
                                ) : (
                                  <></>
                                )}

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                  <label
                                    htmlFor="email"
                                    className="col-form-label text-md-right"
                                  >
                                    E-Mail Address
                                  </label>

                                  <input
                                    type="text"
                                    id="email"
                                    className="form-control"
                                    name="email"
                                    {...register("email")}
                                  />
                                  <p>{errors.email?.message}</p>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                  <label
                                    htmlFor="address"
                                    className="col-form-label text-md-right"
                                  >
                                    {" "}
                                    Address
                                  </label>

                                  <input
                                    className={`form-control ${
                                      errors.address ? "is-invalid" : ""
                                    }`}
                                    {...register("address")}
                                    type="text"
                                    id="address"
                                    name="address"
                                    onChange={(e) => e.target.value}
                                  />
                                  <div className="invalid-feedback">
                                    {errors.address?.message}
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                  <label
                                    htmlFor="accountHolderName"
                                    className="col-form-label text-md-right"
                                  >
                                    {" "}
                                    Name in Bank Account{" "}
                                  </label>

                                  <input
                                    type="text"
                                    id="accountHolderName"
                                    className="form-control"
                                    name="accountHolderName"
                                    {...register("accountHolderName")}
                                  />
                                  <p>{errors.accountHolderName?.message}</p>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                  <label
                                    htmlFor="clientAuthenticationType"
                                    className="col-form-label text-md-right"
                                  >
                                    Authentication Mode
                                  </label>
                                  <div className="col-md-12">
                                    <input
                                      className={`form-control- margn ${
                                        errors.clientAuthenticationType
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      {...register("clientAuthenticationType")}
                                      type="radio"
                                      name="clientAuthenticationType"
                                      onChange={(e) =>
                                        setAuthenticationMode(e.target.value)
                                      }
                                      defaultChecked={
                                        authenticationMode === "Netbank"
                                      }
                                      value="NetBank"
                                    />
                                    <label htmlFor="html">Net Banking</label>

                                    <div className="invalid-feedback">
                                      {errors.clientAuthenticationType?.message}
                                    </div>

                                    <input
                                      className={`form-control- margn ${
                                        errors.clientAuthenticationType
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      {...register("clientAuthenticationType")}
                                      type="radio"
                                      name="clientAuthenticationType"
                                      onChange={(e) =>
                                        setAuthenticationMode(e.target.value)
                                      }
                                      defaultChecked={
                                        authenticationMode === "Debitcard"
                                      }
                                      value="Debitcard"
                                    />
                                    <label htmlFor="html">Debit Card</label>

                                    <div className="invalid-feedback">
                                      {errors.clientAuthenticationType?.message}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                  <label
                                    htmlFor="bankName"
                                    className="col-form-label text-md-right"
                                  >
                                    Bank Name{" "}
                                  </label>

                                  <select
                                    name="bankName"
                                    {...register("bankName")}
                                    className={`form-control ${
                                      errors.bankName ? "is-invalid" : ""
                                    }`}
                                  >
                                    <option value="0">
                                      Please Select Bank
                                    </option>
                                    {selectedListForOption.map((option) => {
                                      return (
                                        <option
                                          key={option.id}
                                          value={option.code}
                                        >
                                          {option.description}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  <div className="invalid-feedback">
                                    {errors.bankName?.message}
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                  <label
                                    htmlFor="accountNumber"
                                    className="col-form-label text-md-right"
                                  >
                                    Bank Account Number
                                  </label>

                                  <input
                                    className={`form-control ${
                                      errors.accountNumber ? "is-invalid" : ""
                                    }`}
                                    {...register("accountNumber")}
                                    type="text"
                                    id="accountNumber"
                                    name="accountNumber"
                                    onChange={(e) => e.target.value}
                                  />
                                  <div className="invalid-feedback">
                                    {errors.accountNumber?.message}
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                  <label
                                    htmlFor="ifscCode"
                                    className="col-form-label text-md-right"
                                  >
                                    {" "}
                                    IFSC Code{" "}
                                  </label>

                                  <input
                                    className={`form-control ${
                                      errors.ifscCode ? "is-invalid" : ""
                                    }`}
                                    {...register("ifscCode")}
                                    type="text"
                                    id="ifscCode"
                                    name="ifscCode"
                                    onChange={(e) =>
                                      verifyIfcdCodeFn(e.target.value)
                                    }
                                  />
                                  <p>
                                    {isIfcsValid
                                      ? "IFSC is Valid"
                                      : "IFSC is Not Valid"}
                                  </p>
                                  <div className="invalid-feedback">
                                    {errors.ifscCode?.message}
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                  <label
                                    htmlFor="pan"
                                    className="col-form-label text-md-right"
                                  >
                                    Pan{" "}
                                  </label>

                                  <input
                                    className={`form-control ${
                                      errors.pan ? "is-invalid" : ""
                                    }`}
                                    {...register("pan")}
                                    type="text"
                                    id="pan"
                                    name="pan"
                                    onChange={(e) => e.target.value}
                                  />
                                  <div className="invalid-feedback">
                                    {errors.pan?.message}
                                  </div>
                                </div>

                                <div className="col-lg-4 offset-md-4- topmar">
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                  >
                                    {isCreateorUpdate
                                      ? "Create Profile"
                                      : "Update Profile"}
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* end form area */}
                    </div>
                  </div>
                </div>
                <div
                  tabIndex={0}
                  role="presentation"
                  style={{
                    width: "0px",
                    height: "0px",
                    overflow: "hidden",
                    position: "absolute",
                  }}
                ></div>
              </div>
            </div>
            <div
              tabIndex={0}
              role="presentation"
              style={{
                width: "0px",
                height: "0px",
                overflow: "hidden",
                position: "absolute",
              }}
            />
          </div>
        </div>
      </main>
    </section>
  );
};
