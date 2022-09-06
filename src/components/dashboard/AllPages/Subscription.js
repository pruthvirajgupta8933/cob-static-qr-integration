import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
// import { subscriptionplan, subscriptionPlanDetail } from "../../../slices/dashboardSlice";
// import { Link } from 'react-router-dom';
import Emandate from "../AllPages/Mandate";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import API_URL from "../../../config";
import { Link } from "react-router-dom";
import CreateClientCode from "./Modals/CreateClientCode";
import BusinessCategory from "./Modals/BusinessCategory";
import NavBar from "../NavBar/NavBar";
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
    history.push("/dashboard/profile");
  }

  const {
    clientMerchantDetailsList,
    accountHolderName,
    accountNumber,
    bankName,
    clientEmail,
    clientMobileNo,
    ifscCode,
  } = user;
  // const { isLoading , subscribe } = dashboard;
  let clientAuthenticationType = "";
  if (clientMerchantDetailsList !== null) {
    // let {clientAuthenticationType,clientCode} = clientMerchantDetailsList[0];
  }

  const [isClientCodeCreated, setIsClientCodeCreated] = useState(false);

  useEffect(() => {
    if (user?.clientMerchantDetailsList[0]?.clientCode === null) {
      setIsClientCodeCreated(true);
    }
    console.log("is client code updated useEffect");
  }, []);

  // console.log("isClientCodeCreated", isClientCodeCreated)

  var authenticationMode = "";
  // console.log(clientAuthenticationType);
  if (clientAuthenticationType === "NetBank") {
    authenticationMode = "Netbanking";
  } else {
    authenticationMode = "Debitcard";
  }

  //  const dispatch = useDispatch();
  const tempData = [
    {
        applicationId: 10,
        applicationCode: "SABPAISA",
        applicationName: "Online and Offline Payment Gateway",
        applicationDescription: "SabPaisa is the World`s 1st API Driven Unified Payment Experience Platform having the Best Payment Gateway India. Collect, transfer &amp; refund your payments online &amp; offline. Get the best success rates with maximum payment modes available including Debit cards,Credit Card, Wallets, UPI, Bharat QR, etc. The Hybrid PG helps businesses collect payments from all the clients and consumers, urban or rural, young or old, online or offline, without worrying about consumer payment behaviour.",
        active: true,
        applicationUrl: "https://sabpaisa.in/payment-gateway/",
        epUrl: "https://sabpaisa.in/payment-gateway/",
        planMaster: [
          {
            planId: 1,
            planName:
              "Package 1/Monthly Basis(No of txn -100 and Max Txn Amt- 500)",
            planCode: "005",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 850.0,
            planValidityDays: 30,
          },
          {
            planId: 20,
            planName:
              "Package 2/Monthly Basis(No of txn -100 and Max Txn Amt- 1000)",
            planCode: "006",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 1700.0,
            planValidityDays: 30,
          },
          {
            planId: 26,
            planName:
              "Package Monthly Basis(No of txn -100 and Max Txn Amt- 500)",
            planCode: "012",
            planType: "trial",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 850.0,
            planValidityDays: 30,
          },
        ],
      },
      
      {
        applicationId: 11,
        applicationCode: "SABPAISA",
        applicationName: "Payment Links",
        applicationDescription: "SabPaisa Payment Link is the World’s first Unified link-based payment method, for payment collections with the help of links for a wide range of payment modes. Collect Payments even without a website via easy payment links. Payment Link offers protected and shortened payment links for payment collection.",
        active: true,
        applicationUrl: "https://sabpaisa.in/paylink/",
        epUrl: "https://sabpaisa.in/paylink/",
        planMaster: [
          {
            planId: 22,
            planName:
              "Package 2/Monthly Basis(Subscription Price – Rs. 1000 and No of payouts - 1000)",
            planCode: "008",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 1000.0,
            planValidityDays: 30,
          },
          {
            planId: 21,
            planName:
              "Package 1/Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "007",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
          {
            planId: 25,
            planName:
              "Package Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "011",
            planType: "trial",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
        ],
      },
    
      {
        applicationId: 12,
        applicationCode: "SABPAISA",
        applicationName: "Subscriptions",
        applicationDescription: "Subscriptions are a unique mandate processing and payment collection platform that offers recurring subscription payments through e-NACH/e-mandates for more than 50 banks to merchants. Single platform for processing all modes of payment mandates, viz. NACH, Net Banking, debit card, credit card, UPI.",
        active: true,
        applicationUrl: "https://sabpaisa.in/paylink/",
        epUrl: "https://sabpaisa.in/paylink/",
        planMaster: [
          {
            planId: 22,
            planName:
              "Package 2/Monthly Basis(Subscription Price – Rs. 1000 and No of payouts - 1000)",
            planCode: "008",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 1000.0,
            planValidityDays: 30,
          },
          {
            planId: 21,
            planName:
              "Package 1/Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "007",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
          {
            planId: 25,
            planName:
              "Package Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "011",
            planType: "trial",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
        ],
      },
    
      {
        applicationId: 13,
        applicationCode: "SABPAISA",
        applicationName: "Payouts",
        applicationDescription: "SabPaisa Payouts is India’s 1st Payout Aggregator for Businesses that seek to pay out to their Partners/Vendors/Customers with complete control over the transactions and a system with the easiest reconciliation and settlement. With SabPaisa Payouts Merchants do not need to deposit money in the aggregator’s account or a third-party wallet. Merchants can execute the payout from their accounts.",
        active: true,
        applicationUrl: "https://sabpaisa.in/paylink/",
        epUrl: "https://sabpaisa.in/paylink/",
        planMaster: [
          {
            planId: 22,
            planName:
              "Package 2/Monthly Basis(Subscription Price – Rs. 1000 and No of payouts - 1000)",
            planCode: "008",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 1000.0,
            planValidityDays: 30,
          },
          {
            planId: 21,
            planName:
              "Package 1/Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "007",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
          {
            planId: 25,
            planName:
              "Package Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "011",
            planType: "trial",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
        ],
      },
    
      {
        applicationId: 14,
        applicationCode: "SABPAISA",
        applicationName: "QwikForm",
        applicationDescription: "QwikForms is one of India’s most advanced dynamic online form builders which can be used to create workflows no matter how complex. In addition, when paired with Hybrid Gateway and LinkPaisa, QwikForms becomes India’s most powerful, robust, and secure payment platform capable of creating and deploying any online payment form within minutes and hours.",
        active: true,
        applicationUrl: "https://sabpaisa.in/paylink/",
        epUrl: "https://sabpaisa.in/paylink/",
        planMaster: [
          {
            planId: 22,
            planName:
              "Package 2/Monthly Basis(Subscription Price – Rs. 1000 and No of payouts - 1000)",
            planCode: "008",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 1000.0,
            planValidityDays: 30,
          },
          {
            planId: 21,
            planName:
              "Package 1/Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "007",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
          {
            planId: 25,
            planName:
              "Package Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "011",
            planType: "trial",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
        ],
      },
    
      {
        applicationId: 15,
        applicationCode: "SABPAISA",
        applicationName: "E-Challan",
        applicationDescription: "SabPaisa E-Challan is the World’s first e-offline payments platform, a unique innovation by SabPaisa consisting of e-offline modes like e-cash, e-NEFT, e-RTGS, and e-IMPS. It enables business houses to collect offline payments through more than 10 Lac cash counters across India.",
        active: true,
        applicationUrl: "https://sabpaisa.in/paylink/",
        epUrl: "https://sabpaisa.in/paylink/",
        planMaster: [
          {
            planId: 22,
            planName:
              "Package 2/Monthly Basis(Subscription Price – Rs. 1000 and No of payouts - 1000)",
            planCode: "008",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 1000.0,
            planValidityDays: 30,
          },
          {
            planId: 21,
            planName:
              "Package 1/Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "007",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
          {
            planId: 25,
            planName:
              "Package Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "011",
            planType: "trial",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
        ],
      },
    
      {
        applicationId: 16,
        applicationCode: "SABPAISA",
        applicationName: "E-POS App",
        applicationDescription: "The SabPaisa E-POS App is an all-in-one advance app that provides all the data regarding the user’s payments, settlements, refunds, collections, customer support and official communication with end-to-end control over everything.",
        active: true,
        applicationUrl: "https://sabpaisa.in/paylink/",
        epUrl: "https://sabpaisa.in/paylink/",
        planMaster: [
          {
            planId: 22,
            planName:
              "Package 2/Monthly Basis(Subscription Price – Rs. 1000 and No of payouts - 1000)",
            planCode: "008",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 1000.0,
            planValidityDays: 30,
          },
          {
            planId: 21,
            planName:
              "Package 1/Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "007",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
          {
            planId: 25,
            planName:
              "Package Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "011",
            planType: "trial",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
        ],
      },
    
      {
        applicationId: 17,
        applicationCode: "SABPAISA",
        applicationName: "LinkPaisa",
        applicationDescription: "LinkPaisa is a complete and reliable link management platform. LinkPaisa aggregates all modes of the messaging platform – Whatsapp, email, Facebook, SMS, Telegram etc. The Message Content can be customised.",
        active: true,
        applicationUrl: "https://sabpaisa.in/paylink/",
        epUrl: "https://sabpaisa.in/paylink/",
        planMaster: [
          {
            planId: 22,
            planName:
              "Package 2/Monthly Basis(Subscription Price – Rs. 1000 and No of payouts - 1000)",
            planCode: "008",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 1000.0,
            planValidityDays: 30,
          },
          {
            planId: 21,
            planName:
              "Package 1/Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "007",
            planType: "Monthly",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
          {
            planId: 25,
            planName:
              "Package Monthly Basis(Subscription Price – Rs. 500 and No of payouts - 500)",
            planCode: "011",
            planType: "trial",
            planDescription:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            active: true,
            planPrice: 500.0,
            planValidityDays: 30,
          },
        ],
      },
    
    ]
  const getSubscriptionService = async () => {
    await setSubscriptionData(tempData);
  };

  // const userDetails = JSON.parse(localStorage?.getItem("user"));

  // const subsData = JSON.parse(localStorage?.getItem("subscriptionData"));

  const d = new Date();
  let formattedDate = d.toISOString();

  const [planPrice, setPlanPrice] = useState("");
  // const [planType,setPlanType]=useState('');
  // const [planValidityDays,setPlanValidityDays]=useState('');
  const [mandateEndData, setMandateEndData] = useState("");
  const [subscribeData, setSubscribeData] = useState({});

  // console.log(mandateEndData);

  const handleChecked = (e, data = {}) => {
    if (e.target.checked) {
      setSubscribePlanData({
        ...subscribePlanData,
        planId: data.planId,
        planName: data.planName,
        planType: data.planType,
      });

      setPlanPrice(data.planPrice);
      // setPlanType(data.planType);
      // setPlanValidityDays(data.planValidityDays);

      const ed = new Date();
      var mandateEndDate = ed.setDate(ed.getDate() + data.planValidityDays);
      mandateEndDate = new Date(mandateEndDate).toISOString();
      setMandateEndData(mandateEndDate);
    } else {
      setPlanPrice("");
      // setPlanType('');
      // setPlanValidityDays('');
    }
  };

  useEffect(() => {
    // update body by realtime data
    const bodyFormData = {
      authenticationMode: authenticationMode,
      clientCode: 70,
      clientRegistrationId: Math.floor(Math.random() * 90000) + 10000,
      consumerReferenceNumber: Math.floor(Math.random() * 92000) + 10000,
      emiamount: "",
      frequency: "ADHO",
      mandateCategory: "U099",
      mandateEndDate: mandateEndData,
      mandateMaxAmount: planPrice + ".00",
      mandatePurpose: "Others",
      mandateStartDate: formattedDate,
      mandateType: "ONLINE",
      npciPaymentBankCode: bankName,
      panNo: "",
      payerAccountNumber: accountNumber,
      payerAccountType: "SAVINGS",
      payerBank: bankName,
      payerBankIfscCode: ifscCode,
      payerEmail: clientEmail,
      payerMobile: "+91-" + clientMobileNo,
      payerName: accountHolderName,
      payerUtilitityCode: "NACH00000000022341",
      requestType: "REGSTRN",
      schemeReferenceNumber: Math.floor(Math.random() * 94000) + 10000,
      telePhone: "",
      untilCancelled: false,
      userType: "merchant",
      termAndCnd: termAndCnd,
      planId: subscribePlanData.planId,
      planName: subscribePlanData.planName,
      planType: subscribePlanData.planType,
      applicationId: subscribePlanData.applicationId,
      applicationName: subscribePlanData.applicationName,
      isModelClosed: isModelClosed,
    };
    //,{mandateEndData:mandateEndData,mandateMaxAmount:planPrice+'.00'}

    setSubscribeData(bodyFormData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mandateEndData, planPrice, termAndCnd, subscribePlanData, isModelClosed]);

  useEffect(() => {
    getSubscriptionService();
  }, []);

  const modalHandler = () => {
    setIsModelClosed(false);
  };

  // console.log("Suscription Charges", subscriptionPlanData);

  const handleSubscribe = (data, applicationData) => {
    // console.log(applicationData);
    // console.log(applicationData)
    setSubscribePlanData({
      ...subscribePlanData,
      applicationId: applicationData.applicationId,
      applicationName: applicationData.applicationName,
    });

    setSubscriptionDetails(true);
    setPlans(data);
  };

  const fnClientCodeCreated = (val) => {
    setIsClientCodeCreated(val);
    if (val === false) {
      setSubscriptionDetails(true);
    }
  };
  console.log("isClientCodeCreated", isClientCodeCreated);
  console.log("subscriptionDetails", subscriptionDetails);

  // console.log("subscriptionPlanData",subscriptionPlanData);
  return (
    <section className="ant-layout">
      <div>
        <NavBar />
        {/*  <div className="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span className="btn">Upload Here</span></span></div>*/}
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Product Catalogue</h1>
          </div>
          <section
            className="features8 cid-sg6XYTl25a flleft"
            id="features08-3-"
          >
            <div className="container-fluid">
              <div className="row">
              
                {subscriptionPlanData.length <= 0 ? (
                  <h3>Loading...</h3>
                ) : (
                  subscriptionPlanData.map((s, i) => (
                    <div className="col col-lg-5 ">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title font-weight-bold h3">
                          {s.applicationName}
                          </h5>
                          <p className="card-text" />
                        </div>
                        <div className="card-footer">
                          
                            <p className="mb-0">
                              <a
                                className=" btn bttn bttnbackgroundkyc collapsed"
                                data-toggle="collapse"
                                href={`#collapseExample${s.applicationId}`}
                                role="button"
                                aria-expanded="false"
                                aria-controls={`collapseExample${s.applicationId}`}
                              >
                                Read More
                              </a>
                              <button
                               className=" btn bttn bttnbackgroundkyc collapsed"
                                type="button"
                              >
                                Subscribe
                              </button>
                            </p>
                            <div
                              className="collapse"
                              id={`collapseExample${s.applicationId}`}
                            >
                              <div className="card card-body m-0">
                                {s.applicationDescription}
                              </div>
                            </div>
                          
                        </div>
                        <div className="container" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
};

export default Subsciption;
