import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { createClientProfile, updateClientProfile } from "../../../slices/auth";
import { Link } from "react-router-dom";

import profileService from "../../../services/profile.service";
import { Regex, RegexMsg } from "../../../_components/formik/ValidationRegex";
import NavBar from "../NavBar/NavBar";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";



export const Profile = () => {
  const [isCreateorUpdate, setIsCreateorUpdate] = useState(true);

  const roleBasedShowTab = roleBasedAccess()

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



  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  // console.log(roleBasedShowTab);

  const LoggedUser = Object.keys(roleBasedShowTab).find(key => roleBasedShowTab[key] === true);

  const INITIAL_FORM_STATE = {
    loginId: loginId,
    clientName: clientContactPersonName,
    phone: clientMobileNo,
    email: clientEmail,
    ...(isCreateorUpdate && { clientCode: "" }),
    address: clientMerchantDetailsList && clientMerchantDetailsList[0]?.address,
    accountHolderName: accountHolderName,
    accountType: LoggedUser,
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    pan: "",
    clientAuthenticationType: "",
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
    // accountHolderName: Yup.string()
    //   .required("Required")
    //   .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    //   .nullable(),
    // bankName: Yup.string()
    //   .required("Required")
    //   .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    //   .nullable(),
    // accountNumber: Yup.string()
    //   .matches(Regex.digit, RegexMsg.digit)
    //   .required("Required")
    //   .max(20, "Bank Account number length under 20 digits")
    //   .nullable(),
    // ifscCode: Yup.string()
    //   .required("Required")
    //   .matches(/^[a-zA-Z0-9\s]+$/, "IFCS Code not valid ")
    //   .nullable(),
    // pan: Yup.string()
    //   .matches(/^[a-zA-Z0-9\s]+$/, "Pan Card not valid ")
    //   .nullable(),
    // clientAuthenticationType: Yup.string().required(
    //   "Select Authentication Mode"
    // ),
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
      dispatch(updateClientProfile({ data }));
    }
    // isCreateorUpdate ? dispatch(createClientProfile(data)) : delete data.clientCode; dispatch(updateClientProfile({data,clientId}))

  }

  // const verifyClientCodeFn = (getCode) => {
  //   getCode.length > 5 && getCode.length < 7
  //     ? verifyClientCode(getCode)
  //       .then((res) => {
  //         setIsClientCodeValid(res.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         setIsClientCodeValid(false);
  //       })
  //     : setIsClientCodeValid(null);
  // };





  return (
    <section className="ant-layout">
      <div>
        <NavBar />
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper">

            <h1 className="right_side_heading">
              My Profile
            </h1>





            <div className="ant-tabs ant-tabs-top ant-tabs-line">
              <div role="tablist" className="ant-tabs-bar ant-tabs-top-bar" tabIndex={0}>
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
              <div tabIndex={0} role="presentation" style={{ width: '0px', height: '0px', overflow: 'hidden', position: 'absolute' }} />
              <div className="ant-tabs-content ant-tabs-content-animated ant-tabs-top-content" style={{ marginLeft: '0%' }}>
                <div role="tabpanel" aria-hidden="false" className="ant-tabs-tabpane ant-tabs-tabpane-active">
                  <div tabIndex={0} role="presentation" style={{ width: '0px', height: '0px', overflow: 'hidden', position: 'absolute' }}>
                  </div>
                  <div className="container col-sm-12 d-flex">

                    {/* start form area */}
                    <div className="container col-sm-8">
                      <div className="col-md-12 ">
                        {/* 
                        <Link to="/reset" className="float-right " style={{margin:"-23px"}}>Change Password</Link> */}
                        {/*  
                          <div className="card mt-0">
                            <div className="card-header">Basic Details</div>
                            <div className="card-body-"> */}
                        <form className="form-horizontal form_cmplt" onSubmit={handleSubmit(onSubmit)}>
                          <div class="card card-main">
                            {/* <div class="card-header text-center">
                My Profile
              </div> */}

                            <div class="form-group card-body no-pad">
                              <label htmlFor="clientName" className="control-label col-sm-4 for_Headingss">User Name</label>
                              <div class="col-sm-8">
                                <input className={`form-control ${errors.clientName ? "is-invalid" : ""}`}
                                  {...register("clientName")} type="text" id="clientName " name="clientName" className="form-control border-0"
                                  onChange={(e) => e.target.value} readonly />
                                <p className="invalid-feedback">
                                  {errors.clientName?.message}
                                </p>
                              </div>
                            </div>

                            <div class="form-group card-body no-pad">
                              <label htmlFor="email" className="control-label col-sm-4 for_Headingss">Email id</label>
                              <div class="col-sm-8">
                                <input type="text" id="email" className="form-control border-0" name="email" {...register("email")} readonly />
                                <p>{errors.email?.message}</p>
                              </div>
                            </div>

                            <div class="form-group card-body no-pad">
                              <label htmlFor="clientName" className="control-label col-sm-4 for_Headingss"> Change&nbsp;Password</label>
                              <div class="col-sm-8">
                                <Link to={`/dashboard/change-password`}>
                                  <button
                                    style={{ width: "176px", height: "40px", border: "1px solid #4285F8" }}
                                    type="button"

                                  >

                                    <span className="for_passwrd">Change Password</span>
                                  </button>
                                </Link>
                                <p className="invalid-feedback">{errors.clientName?.message}</p>
                              </div>
                            </div>

                            <div class="form-group card-body no-pad">
                              <label htmlFor="phone" className="control-label col-sm-4 for_Headingss"> Account Type</label>
                              <div class="col-sm-8">
                                <input className={`form-control text-uppercase border-0 ${errors.phone ? "is-invalid" : ""}`}
                                  {...register("accountType")} type="text" id="accountType" name="accountType" onChange={(e) => e.target.value} readonly />
                                <p className="invalid-feedback">
                                  {errors.phone?.message}
                                </p>
                              </div>
                            </div>

                            <div class="form-group card-body no-pad">
                              <label htmlFor="phone" className="control-label col-sm-4 for_Headingss">Phone No.</label>
                              <div class="col-sm-8">
                                <input className={`form-control border-0 ${errors.phone ? "is-invalid" : ""}`}
                                  {...register("phone")} type="text" id="phone" name="phone" onChange={(e) => e.target.value} readonly />
                                <p className="invalid-feedback">
                                  {errors.phone?.message}
                                </p>
                              </div>
                            </div>






                          </div>
                        </form>

                      </div>
                      {/* end form area */}
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
          {/* </div>
          </div>
        </div> */}
        </div>
      </main>
    </section>
  );
};
