import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { createClientProfile, updateClientProfile } from "../../../slices/auth";
import { Link } from "react-router-dom";
import { Regex, RegexMsg } from "../../../_components/formik/ValidationRegex";
import NavBar from "../NavBar/NavBar";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import profileIllustration from "../../../assets/images/profile-illustration.png"
import classes from "./Profile/profile.module.css"

export const Profile = () => {
  const [isCreateorUpdate, setIsCreateorUpdate] = useState(true);

  const roleBasedShowTab = roleBasedAccess()

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { dashboard } = useSelector((state) => state);

  const {
    clientMerchantDetailsList,
    loginId,
    clientContactPersonName,
    clientEmail,
    clientMobileNo,
    accountHolderName,
    ifscCode,
    clientAuthenticationType,
  } = user;

  var initNBlist,
    initDClist = [];

  if (sessionStorage.getItem("NB_bank_list") !== null) {
    initNBlist = JSON.parse(sessionStorage.getItem("NB_bank_list"));
  } else {
    initNBlist = [];
  }

  if (sessionStorage.getItem("DC_bank_list") !== null) {
    initDClist = JSON.parse(sessionStorage.getItem("DC_bank_list"));
  }
  // const clientMerchantDetailsList = user?.clientMerchantDetailsList;
  const clientId = user?.clientMerchantDetailsList[0]?.clientId;


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

  }






  return (
    <section>
      <main>
        <div className="container-fluid">
          <nav>
            <h5 className="right_side_heading">
              My Profile
            </h5>
          </nav>

          <div className="row">


            <div className="col-lg-7 ">

              <div className="card">
                {/* <h5 className="card-header">{clientContactPersonName}</h5> */}
                <div className="card-body">

                  <form>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Name</label>
                      <div className="col-sm-10">
                        <input type="text" className="form-control" value={clientContactPersonName} disabled={true} />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Email Id</label>
                      <div className="col-sm-10">
                        <input type="text" className="form-control" value={clientEmail} disabled={true} />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Contact Nubmer</label>
                      <div className="col-sm-10">
                        <input type="text" className="form-control" value={clientMobileNo} disabled={true} />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Account Type</label>
                      <div className="col-sm-10">
                        <input type="text" className="form-control" value={LoggedUser} disabled={true} />
                      </div>
                    </div>

                    {/* <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">KYC Status</label>
                      <div className="col-sm-10">
                        <input type="text" className="form-control" value={clientEmail} disabled={true} />
                      </div>
                    </div> */}

                  </form>
                  {roleBasedShowTab.merchant ?
                    <div className="col-lg-6">
                      {/* <label><strong>Change Password</strong></label> -<br/> */}
                      <Link to={`/dashboard/change-password`}>
                        <button type="button" className="form-control btn btn-primary  text-white" >
                          Change Password
                        </button>
                      </Link>
                      <p className="invalid-feedback">{errors.clientName?.message}</p>
                    </div>
                    : <></>}


                </div>

              </div>
            </div>

            <div className="col-lg-5">
              <img src={profileIllustration} alt="profile" className={`${classes.image}`} />
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};
