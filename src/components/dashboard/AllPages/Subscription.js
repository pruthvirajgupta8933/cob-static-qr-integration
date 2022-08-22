import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from "axios";
// import { subscriptionplan, subscriptionPlanDetail } from "../../../slices/dashboardSlice";
// import { Link } from 'react-router-dom';
import Emandate from '../AllPages/Mandate';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import API_URL from '../../../config';
import { Link } from 'react-router-dom';
import CreateClientCode from './Modals/CreateClientCode';
import BusinessCategory from './Modals/BusinessCategory';
// import paymentGateWay from '../../../payment-gateway/'


const Subsciption = () => {
  const [subscriptionDetails, setSubscriptionDetails] = useState(false);
  // const { message } = useSelector((state) => state.message);

  // const subscriptionData = useSelector(state => state.subscribe);
  const [subscriptionPlanData, setSubscriptionData] = useState([]);
  // const [emandateDetails, setEmandateDetails] = useState(false);
  const [termAndCnd, setTermAndCnd] = useState(false);
  // const [subscriptionPlanChargesData,setSubscriptionPlanChargesData] = useState([]);
  const [subscribePlanData, setSubscribePlanData] = useState([]);
  const [isModelClosed, setIsModelClosed] = useState(false);
  // const [paymentGatewayUrl,setPaymentGatewayUrl] = useState([]);


  const [Plans, setPlans] = useState([]);
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  let history = useHistory();

  if (user && user.clientMerchantDetailsList === null) {
    // alert(`${path}/profile`);
    // return <Redirect to={`${path}/profile`} />
    history.push('/dashboard/profile');
  }

  const { clientMerchantDetailsList, accountHolderName, accountNumber, bankName, clientEmail, clientMobileNo, ifscCode } = user;
  // const { isLoading , subscribe } = dashboard;
  let clientAuthenticationType = '';
  if (clientMerchantDetailsList !== null) {

    // let {clientAuthenticationType,clientCode} = clientMerchantDetailsList[0];
  }
  let isClientCodeCreated = false;
  if (user?.clientMerchantDetailsList[0]?.clientCode === null) {
    isClientCodeCreated = true;
  }

  console.log("isClientCodeCreated", isClientCodeCreated)


  var authenticationMode = '';
  // console.log(clientAuthenticationType);
  if (clientAuthenticationType === 'NetBank') {
    authenticationMode = 'Netbanking';
  } else {
    authenticationMode = 'Debitcard';
  }


  //  const dispatch = useDispatch();
  const tempData = [
    {
      "applicationId": 10,
      "applicationCode": "SABPAISA",
      "applicationName": "Payment Gateway",
      "applicationDescription": "",
      "active": true,
      "applicationUrl": "https://sabpaisa.in/paylink/",
      "epUrl": "https://sabpaisa.in/paylink/",
      "planMaster": [
        {
          "planId": 1,
          "planName": "Package 1/Monthly Basis(No of txn -100 and Max Txn Amt- 500)",
          "planCode": "005",
          "planType": "Monthly",
          "planDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "active": true,
          "planPrice": 850.0,
          "planValidityDays": 30
        },
        {
          "planId": 20,
          "planName": "Package 2/Monthly Basis(No of txn -100 and Max Txn Amt- 1000)",
          "planCode": "006",
          "planType": "Monthly",
          "planDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "active": true,
          "planPrice": 1700.0,
          "planValidityDays": 30
        },
        {
          "planId": 26,
          "planName": "Package Monthly Basis(No of txn -100 and Max Txn Amt- 500)",
          "planCode": "012",
          "planType": "trial",
          "planDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "active": true,
          "planPrice": 850.0,
          "planValidityDays": 30
        }
      ]
    },
    {
      "applicationId": 11,
      "applicationCode": "SABPAISA",
      "applicationName": "Paylink",
      "applicationDescription": "",
      "active": true,
      "applicationUrl": "https://sabpaisa.in/payout/",
      "epUrl": "https://sabpaisa.in/payout/",
      "planMaster": [
        {
          "planId": 22,
          "planName": "Package 2/Monthly Basis(Subscription Price – Rs. 1000 and No of payouts - 1000)",
          "planCode": "008",
          "planType": "Monthly",
          "planDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "active": true,
          "planPrice": 1000.0,
          "planValidityDays": 30
        },
        {
          "planId": 21,
          "planName": "Package 1/Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
          "planCode": "007",
          "planType": "Monthly",
          "planDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "active": true,
          "planPrice": 500.0,
          "planValidityDays": 30
        },
        {
          "planId": 25,
          "planName": "Package Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
          "planCode": "011",
          "planType": "trial",
          "planDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "active": true,
          "planPrice": 500.0,
          "planValidityDays": 30
        }
      ]
    }
  ];
  const getSubscriptionService = async () => {
    await axios.get(API_URL.FETCH_APP_AND_PLAN)
      .then(res => {
        setSubscriptionData(tempData);
        localStorage.setItem("subscriptionData", JSON.stringify(res.data));
      })
      .catch(err => {
        console.log(err)
      });
  }

  // const userDetails = JSON.parse(localStorage?.getItem("user"));

  // const subsData = JSON.parse(localStorage?.getItem("subscriptionData"));

  const d = new Date();
  let formattedDate = d.toISOString();

  const [planPrice, setPlanPrice] = useState('');
  // const [planType,setPlanType]=useState('');
  // const [planValidityDays,setPlanValidityDays]=useState('');
  const [mandateEndData, setMandateEndData] = useState('');
  const [subscribeData, setSubscribeData] = useState({});

  // console.log(mandateEndData);

  const handleChecked = (e, data = {}) => {
    if (e.target.checked) {
      setSubscribePlanData({
        ...subscribePlanData,
        planId: data.planId,
        planName: data.planName,
        planType: data.planType
      });

      setPlanPrice(data.planPrice);
      // setPlanType(data.planType);
      // setPlanValidityDays(data.planValidityDays);

      const ed = new Date();
      var mandateEndDate = ed.setDate(ed.getDate() + data.planValidityDays);
      mandateEndDate = new Date(mandateEndDate).toISOString();
      setMandateEndData(mandateEndDate);

    } else {
      setPlanPrice('');
      // setPlanType('');
      // setPlanValidityDays('');

    }
  }

  useEffect(() => {

    // update body by realtime data
    const bodyFormData = {
      authenticationMode: authenticationMode,
      clientCode: 70,
      clientRegistrationId: Math.floor(Math.random() * 90000) + 10000,
      consumerReferenceNumber: Math.floor(Math.random() * 92000) + 10000,
      emiamount: '',
      frequency: 'ADHO',
      mandateCategory: 'U099',
      mandateEndDate: mandateEndData,
      mandateMaxAmount: planPrice + '.00',
      mandatePurpose: 'Others',
      mandateStartDate: formattedDate,
      mandateType: 'ONLINE',
      npciPaymentBankCode: bankName,
      panNo: '',
      payerAccountNumber: accountNumber,
      payerAccountType: 'SAVINGS',
      payerBank: bankName,
      payerBankIfscCode: ifscCode,
      payerEmail: clientEmail,
      payerMobile: '+91-' + clientMobileNo,
      payerName: accountHolderName,
      payerUtilitityCode: 'NACH00000000022341',
      requestType: 'REGSTRN',
      schemeReferenceNumber: Math.floor(Math.random() * 94000) + 10000,
      telePhone: '',
      untilCancelled: false,
      userType: 'merchant',
      termAndCnd: termAndCnd,
      planId: subscribePlanData.planId,
      planName: subscribePlanData.planName,
      planType: subscribePlanData.planType,
      applicationId: subscribePlanData.applicationId,
      applicationName: subscribePlanData.applicationName,
      isModelClosed: isModelClosed

    }
    //,{mandateEndData:mandateEndData,mandateMaxAmount:planPrice+'.00'}

    setSubscribeData(bodyFormData)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mandateEndData, planPrice, termAndCnd, subscribePlanData, isModelClosed]);


  useEffect(() => {
    getSubscriptionService();
  }, [])

  const modalHandler = () => {

    setIsModelClosed(false)
  }

  // console.log("Suscription Charges", subscriptionPlanData);    

  const handleSubscribe = (data, applicationData) => {

    // console.log(applicationData);
    // console.log(applicationData)
    setSubscribePlanData({
      ...subscribePlanData,
      applicationId: applicationData.applicationId,
      applicationName: applicationData.applicationName
    });

    setSubscriptionDetails(true);
    setPlans(data)
  }

  useEffect(() => {
    // console.log("termAndCnd",termAndCnd);
  }, [subscribePlanData, termAndCnd]);



  console.log(isClientCodeCreated)
  console.log(subscriptionDetails)

  // console.log("subscriptionPlanData",subscriptionPlanData);
  return (
    <section className="ant-layout">
      <div className="profileBarStatus">
        {/*  <div className="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span className="btn">Upload Here</span></span></div>*/}
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Product Catalogue</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a flleft" id="features08-3-">
            <div className="container-fluid">
              <div className="row">
                {/* {console.log(subscriptionPlanData.length)} */}
                {subscriptionPlanData.length <= 0 ? <h3>Loading...</h3> : subscriptionPlanData.map((s, i) =>
                  <div className="col-sm-12 col-md-6" key={i}>
                    <div className="col mb-4">
                      <div >
                        <div className="card" style={{ background: "aquamarine" }}>
                          <div className="card-body" >
                            <h5 className="card-title font-weight-bold h3">{s.applicationName}</h5>
                            <p className="card-text">{s.applicationDescription}</p>
                          </div>
                          <div className="card-footer">
                            <a href={s.applicationUrl} target="blank" className="btn btn-sm " style={{ backgroundColor: "#ffc107" }} role="button" aria-pressed="true"> Read More</a>
                            <button type="button"
                              //  style={{ top: "200px" }}
                              className="btn btn-primary btn-sm" data-toggle="modal" data-target="#exampleModal" onClick={() => handleSubscribe(s.planMaster, { applicationName: s.applicationName, applicationId: s.applicationId })}>Subscribe</button>
                          </div>
                          <div className="container">
                          </div>
            
                        </div>
                      </div>
                      {isClientCodeCreated ? <CreateClientCode /> : <></>}
                      {isClientCodeCreated === false && subscriptionDetails ===true ? <BusinessCategory /> : <></> }

                      {/* {isClientCodeCreated === false && subscriptionDetails ===true ?
                        <div className="modal fade" id="exampleModal" style={{ top: "25%" }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Welcome - {subscribePlanData.applicationName} !</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => modalHandler()}>
                                  <span aria-hidden="true" onClick={() => setIsModelClosed(false)}>&times;</span>
                                </button>
                              </div>
                              <div className="modal-body">
                                <p>Business Type</p>
                                <div class="input-group mb-3">

                                  <select class="custom-select" id="inputGroupSelect01">
                                    <option selected>Select Business Type</option>
                                    <option value="COBRD">COB Retail</option>
                                    <option value="COBED">COB E-Commerce</option>
                                    <option value="COBGV">COB Government</option>
                                    <option value="COBEN">COB Education</option>
                                  </select>
                                </div>
                              </div>
                              <div className="modal-footer">
                                <Link to={`/dashboard/thanks`} type="button" onClick={() => setIsModelClosed(false)} class="btn btn-success text-white" >Subscribe</Link>
                              </div>
                            </div>
                          </div>
                          )
                        </div> : <></>
                      } */}
                    </div>
                  </div>
                )
                }
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}

export default Subsciption