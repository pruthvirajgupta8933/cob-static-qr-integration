
import React, { useState,useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {createClientProfile, updateClientProfile} from '../../../slices/dashboardSlice' 
import profileService from '../../../services/profile.service'
import { toast, Zoom } from 'react-toastify';
import { Redirect } from 'react-router-dom';
import { logout } from '../../../slices/auth';


export const FormikApp = () => {
    const [isCreateorUpdate, setIsCreateorUpdate] = useState(true);
    const {fetchDcBankList,fetchNbBankList,verifyClientCode, verifyIfcsCode} = profileService
    const dispatch= useDispatch();
    const { user } = useSelector((state) => state.auth);
    // const {fetchDcBankList,fetchNbBankList} = profileService
    const { clientSuperMasterList ,
            loginId,
            clientContactPersonName,
            clientEmail,
            clientMobileNo,
            accountHolderName,
            accountNumber,
            bankName,
            ifscCode,
  
            pan,
          } = user;
    
    const [message,setMessage]  = useState('');
  
    const [clientId,setClientId] = useState(clientSuperMasterList!==null && clientSuperMasterList[0]?.clientId)
    const [createProfileResponse , setCreateProfileResponse]  = useState('');
    const [retrievedProfileResponse , setRetrivedProfileResponse] = useState('');
  
    const [authenticationMode,setAuthenticationMode] = useState('NetBank');
    const [listOfNetBank,setListOfNetBank] = useState([]);
    const [listOfDebitCardBank,setListOfDebitCardBank] = useState([]);
    const [selectedListForOption,setSelectedListForOption]=useState([]);
    const [userIfscCode,setUserIfscCOde]=useState(ifscCode)
    const [isClientCodeValid,setIsClientCodeValid]=useState(null)
    const [isIfcsValid,setIsIfscValid]=useState(null)
  
  
    
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
//   console.log(clientSuperMasterList && clientSuperMasterList[0]?.address)
//  console.log(isCreateorUpdate);
//   initial values
  const INITIAL_FORM_STATE = {
    loginId:loginId,
    clientName:clientContactPersonName,
    phone:clientMobileNo,
    email:clientEmail,
    ...(isCreateorUpdate && {clientCode:''}),
    address:clientSuperMasterList &&  clientSuperMasterList[0]?.address,
    accountHolderName:accountHolderName,
    bankName:bankName,
    accountNumber:accountNumber,
    ifscCode:userIfscCode,
    pan:pan,
    clientAuthenticationType: clientSuperMasterList &&  clientSuperMasterList[0]?.clientAuthenticationType,
  };

  
    // form validation rules
const validationSchema = Yup.object().shape({
    loginId:Yup.string().required("Required"),
    clientName: Yup.string().required("Required"),
    phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
    email: Yup.string().email("Invalid email").required("Required"),
    ...(isCreateorUpdate && {clientCode: Yup.string().min(5,"Client Code should be 6 digit").max(6,"Client Code maximum limit is 6").required("Required").nullable()}),
    address: Yup.string().required("Required").nullable(),
    accountHolderName: Yup.string().required("Required").nullable(),
    bankName: Yup.string().required("Required").nullable(),
    accountNumber: Yup.string().required("Required").nullable(),
    ifscCode: Yup.string().required("Required").nullable(),
    pan: Yup.string().nullable(),
    clientAuthenticationType:Yup.string().required("Select Authentication Mode")
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
    setTimeout(() =>{
        setUserData(INITIAL_FORM_STATE);
        
    }  , 1000);

    }, []);

    // effect runs when user state is updated
    useEffect(() => {
    // reset form with user data
    reset(userData);
    }, [userData]);

    function onSubmit(data) {

    console.log("send data",data);
    const userLocalData = JSON.parse(localStorage?.getItem("user"));
      
    if(isCreateorUpdate)
    {
      dispatch(createClientProfile(data));
    
    }
    else
    {
      delete data.clientCode; 
      dispatch(updateClientProfile({data,clientId}))
    }
    // isCreateorUpdate ? dispatch(createClientProfile(data)) : delete data.clientCode; dispatch(updateClientProfile({data,clientId}))
    toast.success("Your Data is Update successfully",{
      autoClose:2000,
      limit :1,
      transition:Zoom
    });

    // setTimeout(() => {
    //   dispatch(logout());
    //   return <Redirect to="/login-page" />;
    // }, 2510);
     
    }

    const verifyClientCodeFn = (getCode) => {
        getCode.length>5 && getCode.length<7 
        ?
            verifyClientCode(getCode).then(
                (res)=>{
                    setIsClientCodeValid(res.data)
                }
            ).catch((error)=>{console.log(error)
                setIsClientCodeValid(false)
            })
        :
            setIsClientCodeValid(null);
    }

    const verifyIfcdCodeFn = (ifscCodeInput) =>{
        // console.log(ifscCodeInput);
        ifscCodeInput.length>5 
        ?
        verifyIfcsCode(ifscCodeInput).then(
                (res)=>{
                    setIsIfscValid(res.data)
                }
            ).catch((error)=>{console.log(error)
                setIsIfscValid(false)
            })
        :
        setIsIfscValid(null);

    }

    

  useEffect(() => {
    // fetch bank list
     fetchDcBankList()
      .then((response)=>{setListOfDebitCardBank(response.data); setAuthenticationMode(authenticationMode);})
      .catch((error)=> console.log(error));

    fetchNbBankList()
      .then(response => {setListOfNetBank(response.data); setAuthenticationMode(authenticationMode);})
      .catch(error=>console.log(error))                          

    setIsCreateorUpdate(clientSuperMasterList && clientSuperMasterList!==null ? false : true);
  }, [])

  useEffect(() => {
    if(authenticationMode==='NetBank'){
      setSelectedListForOption(listOfNetBank);
    }
    
    if(authenticationMode==='Debitcard'){
      setSelectedListForOption(listOfDebitCardBank);
    }
  }, [authenticationMode]);

    // console.log(authenticationMode);
    // console.log(bankName);
    // console.log(selectedListForOption);
 
 return (
    <section className="ant-layout">
    <div className="profileBarStatus">
    </div>
    <main className="gx-layout-content ant-layout-content">
      <div className="gx-main-content-wrapper">
        <div className="right_layout my_account_wrapper">
          <h1 className="right_side_heading">My Profile<button type="button" className="ant-btn change_password pull-right"><i className="icon icon-reset-password" /><span>Change Password</span></button></h1>
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
                      <div className="ant-tabs-ink-bar ant-tabs-ink-bar-animated" style={{display: 'block', transform: 'translate3d(0px, 0px, 0px)', width: '116px'}}>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div tabIndex={0} role="presentation" style={{width: '0px', height: '0px', overflow: 'hidden', position: 'absolute'}} />
            <div className="ant-tabs-content ant-tabs-content-animated ant-tabs-top-content" style={{marginLeft: '0%'}}>
              <div role="tabpanel" aria-hidden="false" className="ant-tabs-tabpane ant-tabs-tabpane-active">
                <div tabIndex={0} role="presentation" style={{width: '0px', height: '0px', overflow: 'hidden', position: 'absolute'}}>
                </div>
                <div className="panel" style={{maxWidth: "100%"}}>
                    <div className="container" style={{margin:"0 !important"}}>
                        {/* start form area */}
                        <div className="row justify-content-center">
                            <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">Basic Details</div>
                                <div className="card-body">
                                <form  onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-group row">
                                    <label htmlFor="loginId" className="col-md-4 col-form-label text-md-right"> Login ID </label>
                                    <div className="col-md-6">
                                        <input className={`form-control ${errors.loginId ? 'is-invalid' : ''}`}  {...register('loginId')} type="text" id="loginId" name="loginId" onChange={(e)=>console.log(e.target.value)} disabled  />
                                        <div className="invalid-feedback">{errors.loginId?.message}</div>
                                    </div>
                                    </div>

                                    <div className="form-group row">
                                    <label htmlFor="clientName" className="col-md-4 col-form-label text-md-right">Client Name</label>
                                    <div className="col-md-6">
                                        <input className={`form-control ${errors.clientName ? 'is-invalid' : ''}`}  {...register('clientName')} type="text" id="clientName" name="clientName" onChange={(e)=>console.log(e.target.value)}  />
                                        <div className="invalid-feedback">{errors.clientName?.message}</div>
                                    </div>
                                    </div>

                                    <div className="form-group row">
                                    <label htmlFor="phone" className="col-md-4 col-form-label text-md-right"> Phone </label>
                                    <div className="col-md-6">
                                        <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`}  {...register('phone')} type="text" id="phone" name="phone" onChange={(e)=>console.log(e.target.value)}  />
                                        <div className="invalid-feedback">{errors.phone?.message}</div>
                                    </div>
                                    </div>
                                    {/* Client Code Hide if already client created */}
                                    {isCreateorUpdate?<div className="form-group row">
                                    <label htmlFor="clientCode" className="col-md-4 col-form-label text-md-right"> Client Code </label>
                                    <div className="col-md-6">
                                        <input className={`form-control ${errors.clientCode ? 'is-invalid' : ''}`} 
                                         {...register('clientCode')} 
                                         type="text" 
                                         id="clientCode" 
                                         name="clientCode" 
                                         onChange={(e)=>verifyClientCodeFn(e.target.value)} 
                                         
                                          />
                                        <div className="">{isClientCodeValid ?'Valid Client Code':'Try another Client Code'}</div>
                                        <div className="invalid-feedback">{errors.clientCode?.message}</div>
                                    </div>
                                    </div>:<></>}


                                    <div className="form-group row">
                                    <label htmlFor="email" className="col-md-4 col-form-label text-md-right">E-Mail Address</label>
                                    <div className="col-md-6">
                                        <input type="text" id="email" className="form-control" name="email" {...register('email')}/>
                                        <p>{errors.email?.message}</p>
                                    </div>
                                    </div>


                                    <div className="form-group row">
                                    <label htmlFor="address" className="col-md-4 col-form-label text-md-right"> Address</label>
                                    <div className="col-md-6">
                                        <input className={`form-control ${errors.address ? 'is-invalid' : ''}`}  {...register('address')} type="text" id="address" name="address" onChange={(e)=>console.log(e.target.value)}  />
                                        <div className="invalid-feedback">{errors.address?.message}</div>
                                    </div>
                                    </div>


                                    <div className="form-group row">
                                    <label htmlFor="accountHolderName" className="col-md-4 col-form-label text-md-right"> Name in Bank Account </label>
                                    <div className="col-md-6">
                                        <input type="text" id="accountHolderName" className="form-control" name="accountHolderName" {...register('accountHolderName')}/>
                                        <p>{errors.accountHolderName?.message}</p>
                                    </div>
                                    </div>

                                    


                                    <div className="form-group row">
                                    <label htmlFor="clientAuthenticationType" className="col-md-4 col-form-label text-md-right">Authentication Mode</label>
                                    <div className="col-md-3">
                                        <p>Net Bank</p>
                                        <input className={`form-control ${errors.clientAuthenticationType ? 'is-invalid' : ''}`}  {...register('clientAuthenticationType')}  type="radio" name="clientAuthenticationType" onChange={(e)=>setAuthenticationMode(e.target.value)} 
                                        defaultChecked={authenticationMode==="Netbank"}
                                        value="NetBank"
                                         />
                                        <div className="invalid-feedback">{errors.clientAuthenticationType?.message}</div>
                                    </div>

                                    <div className="col-md-3">
                                        <p>Debit Card</p>
                                        <input className={`form-control ${errors.clientAuthenticationType ? 'is-invalid' : ''}`}  {...register('clientAuthenticationType')} type="radio"  name="clientAuthenticationType" onChange={(e)=>setAuthenticationMode(e.target.value)} 
                                         defaultChecked={authenticationMode==="Debitcard"}
                                         value="Debitcard"
                                         />
                                        <div className="invalid-feedback">{errors.clientAuthenticationType?.message}</div>
                                    </div>
                                    </div>
                                    <div className="form-group row">
                                    <label htmlFor="bankName" className="col-md-4 col-form-label text-md-right">Bank Name </label>
                                    <div className="col-md-6">
                                        <select name="bankName" {...register('bankName')} className={`form-control ${errors.bankName ? 'is-invalid' : ''}`}>
                                        <option defailtValue="">Please Select Bank</option>
                                            {selectedListForOption.map((option)=>{
                                            return (
                                                <option key={option.id} value={option.code}>
                                                {option.description}
                                                </option>
                                            )
                                            })}
                                        </select>
                                        <div className="invalid-feedback">{errors.bankName?.message}</div>
                                    </div>
                                    </div>






                                    <div className="form-group row">
                                    <label htmlFor="accountNumber" className="col-md-4 col-form-label text-md-right">Bank Account Number</label>
                                    <div className="col-md-6">
                                        <input className={`form-control ${errors.accountNumber ? 'is-invalid' : ''}`}  {...register('accountNumber')} type="text" id="accountNumber" name="accountNumber" onChange={(e)=>console.log(e.target.value)}  />
                                        <div className="invalid-feedback">{errors.accountNumber?.message}</div>
                                    </div>
                                    </div>



                                    <div className="form-group row">
                                    <label htmlFor="ifscCode" className="col-md-4 col-form-label text-md-right"> IFSC Code </label>
                                    <div className="col-md-6">
                                        <input 
                                        className={`form-control ${errors.ifscCode ? 'is-invalid' : ''}`}  
                                        {...register('ifscCode')} 
                                        type="text"
                                        id="ifscCode"
                                        name="ifscCode"
                                        onChange={(e)=>verifyIfcdCodeFn(e.target.value)}  
                                        />
                                        <p>{isIfcsValid?"IFSC is Valid":"IFSC is Not Valid"}</p>
                                        <div className="invalid-feedback">{errors.ifscCode?.message}</div>
                                    </div>
                                    </div>



                                    <div className="form-group row">
                                    <label htmlFor="pan" className="col-md-4 col-form-label text-md-right">Pan </label>
                                    <div className="col-md-6">
                                        <input className={`form-control ${errors.pan ? 'is-invalid' : ''}`}  {...register('pan')} type="text" id="pan" name="pan" onChange={(e)=>console.log(e.target.value)}  />
                                        <div className="invalid-feedback">{errors.pan?.message}</div>
                                    </div>
                                    </div>

                                    <div className="col-md-6 offset-md-4">
                                    <button type="submit" className="btn btn-primary">
                                    {isCreateorUpdate? "Create Profile" : "Update Profile"}
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
                <div tabIndex={0} role="presentation" style={{width: '0px', height: '0px', overflow: 'hidden', position: 'absolute'}}>
                </div>
              </div>
            </div>
            <div tabIndex={0} role="presentation" style={{width: '0px', height: '0px', overflow: 'hidden', position: 'absolute'}} />
          </div>
        </div>
      <footer className="ant-layout-footer">
        <div className="gx-layout-footer-content">© 2021 Ippopay. All Rights Reserved. <span className="pull-right">Ippopay's GST Number : 33AADCF9175D1ZP</span></div>
      </footer>
    </main>
  </section>
  );
};




