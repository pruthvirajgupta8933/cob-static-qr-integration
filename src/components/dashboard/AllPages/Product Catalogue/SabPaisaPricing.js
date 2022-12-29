/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import NavBar from "../../NavBar/NavBar";
import rafiki from "../../../../assets/images/rafiki.png";
import { productSubscribeState } from "../../../../slices/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import API_URL from "../../../../config";
import { axiosInstanceAuth, axiosInstance } from "../../../../utilities/axiosInstance";
import "./product.css";
import toastConfig from "../../../../utilities/toastTypes";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { stringDec } from "../../../../utilities/encodeDecode";
import { isCompositeComponent } from "react-dom/test-utils";
import SabpaisaPaymentGateway from "../../../sabpaisa-pg/SabpaisaPaymentGateway";
import { logout } from "../../../../slices/auth";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";

const SabPaisaPricing = () => {
  const history = useHistory();
  let roles = roleBasedAccess();

  const [productDetails, setProductDetails] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState({ planId: "" });
  const [tempPlanId, setTempPlanId] = useState("");
  const [rateCloneStatus, setRateCloneStatus] = useState("")
  const [TempSelectedData, setTempSelectedData] = useState({})

  const dispatch = useDispatch();
  const clickHandler = (value) => {
    history.push("/dashboard");
    dispatch(productSubscribeState(value));
  };
  const { user } = useSelector((state) => state.auth);
  const { clientId, business_cat_code } = user.clientMerchantDetailsList[0];

  useEffect(() => {
    if(roles?.merchant !== true) {
      dispatch(logout())
    }
  })


  const param = useParams();
  const getSubscribedPlan = (id) => {
    axiosInstanceAuth
      .post(API_URL.Get_Subscribed_Plan_Detail_By_ClientId, { "clientId": clientId, "applicationId": id })
      .then((resp) => {
        setSelectedPlan({ planId: resp?.data?.data?.planId === null ? "" : resp?.data?.data?.planId })
      })
  }


  useEffect(() => {
    const id = param?.id;
    let url = API_URL.PRODUCT_SUB_DETAILS + "/" + id;
    axiosInstanceAuth
      .get(url)
      .then((resp) => {
        const data = resp.data.ProductDetail;
        setSpinner(false);
        setProductDetails(data);
      })
    getSubscribedPlan(id);


  }, [param]);




  // check rate mapping status before rate mapping
  const checkRateMappingStatus = (clientCodeF, clientCodeT, loginId) => {
    axiosInstance.get(`${API_URL.RATE_MAPPING_CLONE}/${clientCodeF}/${clientCodeT}/${loginId}`)
      .then((resp) => {
        const data = resp.data;
        setRateCloneStatus(data[0].ID)
        localStorage.setItem('RATE_MAPPING_CLONE', data[0].ID);
      })
      .catch((err) => { console.log(err) })
  }


  useEffect(() => {

    // console.log("rateCloneStatus",rateCloneStatus)
    // console.log("tempPlanId",tempPlanId)
    // console.log("param?.id",param?.id)

    if ((rateCloneStatus === 3 || rateCloneStatus === 0) && (param?.id === "10" && tempPlanId!==1 && tempPlanId!=="") ) {
      console.log("cond true")
      if (user?.clientMerchantDetailsList !== null) {
        console.log("33")
        const clientMerchantDetailsList = user?.clientMerchantDetailsList;
        const clientCode = clientMerchantDetailsList[0]?.clientCode;
        const clientId = clientMerchantDetailsList[0]?.clientId;
        const clientContact = user?.clientMobileNo;
        const clientEmail = user?.userName;
        const clientName = clientMerchantDetailsList[0]?.clientName;
        const clientUserName = user?.userName;
        const passwrod = stringDec(sessionStorage.getItem('prog_id'));

        const inputData = {
          clientId: clientId,
          clientCode: clientCode,
          clientContact: clientContact,
          clientEmail: clientEmail,
          address: "Delhi",
          clientLogoPath: "client/logopath",
          clientName: clientName,
          clientLink: "cltLink",
          stateId: 9,
          bid: "19", // ask
          stateName: "DELHI",
          bankName: "SBI",
          client_username: clientUserName,
          client_password: passwrod,
          appId: "10", // ask
          status: "Activate", // ask
          client_type: "normal Client",
          successUrl: "https://sabpaisa.in/",
          failedUrl: "https://sabpaisa.in/",
          subscriptionstatus: "Subscribed",
          businessType: 2
        };

        // console.log("inputData",inputData);
        // 1 - run RATE_MAPPING_GenerateClientFormForCob 

        axiosInstance.post(API_URL.RATE_MAPPING_GenerateClientFormForCob, inputData).then(res => {

          console.log("run RATE_MAPPING_GenerateClientFormForCob");
          localStorage.setItem('RATE_MAPPING_GenerateClientFormForCob', "api trigger");
          localStorage.setItem('resp_RATE_MAPPING_GenerateClientFormForCob', res?.toString());
          //2 - rate map clone   // parent client code / new client code / login id
          axiosInstance.get(`${API_URL.RATE_MAPPING_CLONE}/'COBED'/${clientCode}/${user?.loginId}`).then(res => {
            console.log("run RATE_MAPPING_CLONE");
            localStorage.setItem('RATE_MAPPING_CLONE', "api trigger");
            localStorage.setItem('resp_RATE_MAPPING_CLONE', res?.toString());
            // 3- enable pay link
            //    axiosInstance.get(API_URL.RATE_ENABLE_PAYLINK + '/' + clientCode).then(res => {
            //       localStorage.setItem('enablePaylink', "api trigger");
            //       // console.log("3 api run")
            //       dispatch(checkPermissionSlice(clientCode));
            //   })
          }).catch(err => { console.log(err) })
        }).catch(err => { console.log(err) })


      }
    }


  }, [rateCloneStatus,tempPlanId])


  const handleClick = async (plan_id, plan_name) => {
    
    const postData = {
      clientId: clientId,
      applicationName: param?.name,
      planId: plan_id,
      planName: plan_name,
      applicationId: param?.id,
    };

    
    // console.log("postdata",postData)
    sessionStorage.setItem("tempProductPlanData",JSON.stringify(postData))
    setTempSelectedData(postData)
    history.push("/dashboard/sabpaisa-pg");


    setTempPlanId(plan_id)
    const res = await axiosInstanceAuth.post(
      API_URL.SUBSCRIBE_FETCHAPPAND_PLAN,
      postData
    );
   
    if (res?.status === 200) {
      console.log("1")
      // only PG product without subscription plan check rate mapping status
      if (param?.id === "10" && plan_id!==1) {
        console.log("2")
        // only for payment gateway we have to check rate mapping status
        checkRateMappingStatus("COBED", user?.clientMerchantDetailsList[0]?.clientCode, user?.loginId)
      }

      getSubscribedPlan(plan_id);
      toastConfig.successToast(res?.data?.message);
    } else {
      toastConfig.errorToast("Something went wrong");
    }

  };


  return (

    <section className="ant-layout">
      <div>
        <NavBar />
        {/* <SabpaisaPaymentGateway /> */}
      </div>
      <main className="gx-layout-content ant-layout-content Satoshi-Medium">
        <div>
          <h1 className="text-center headingpricing text-md-start">SabPaisa Pricing</h1>
          <h2 className="text-center headingpricing prdhead">{param?.name}</h2>
          <h3 className="forbasicparacss">
            We offer a very competitive pricing to match your business needs.
            Sign Up now to get started.
          </h3>
        </div>
        {/* <button type="button" onClick={clickHandler}>check</button> */}
        <div class="container mb-10">
          <div class="row">

            {spinner && <span className="spinner-border" role="status"></span>}
            {productDetails.map((Products) => (
              // if user business catagory is gamming
              (business_cat_code === "37" && Products.plan_code === "005") ? <></> :
                (param?.id === '14') ? <div class="card col-lg-8">
                  <div class="card-body">
                    <div className="col-lg-12">
                      <h2 className="pull-left- bold-font text-center mb-20 price d_block">
                        {(Products.plan_price === "Connect" && Products.plan_name === "Enterprise") ?
                          <></> :
                          <>
                            {Products?.plan_price?.split("*")[0]} <span className={`title2 ${param?.id === "14" ? 'fontn' : 'fontna'}`}> {Products?.plan_price?.split("*")[1]}</span>
                          </>
                        }
                      </h2>
                      <span class="blockquote mb-0 pull-left- text-center">
                        <span class="w-50 pxsolid text-center mt-40 min-heit">&nbsp;</span>
                        <h4 className="mb-20 featurespricing">FEATURES INCLUDING</h4>
                        <ul className="list-group list-group-flush">
                          {Products?.plan_description
                            .split(",")
                            .map((details) => (
                              <li className="list-group-item fnt-sz"><p className="firstli1 mb-1">{details}</p></li>
                            ))}
                        </ul>
                      </span>
                      <span className=" text-center">
                        <p className="mt-20">

                          <button
                            type="button"
                            className={`font-weight-bold btn choosePlan-1 btn-lg w-50 ${selectedPlan?.planId === Products?.plan_id ? "btn-bg-color" : ""}`}
                            data-toggle="modal"
                            data-target="#subscription"
                            disabled={selectedPlan?.planId !== "" ? true : false}
                            onClick={() => {
                              if (selectedPlan?.planId !== Products?.plan_id) {
                                handleClick(
                                  Products.plan_id,
                                  Products.plan_name
                                )
                              }
                            }
                            }
                          >

                            {(selectedPlan?.planId === Products.plan_id) ? "Selected Plan" : "Choose Plan"}
                          </button>
                        </p>
                        <div
                          className="modal fade"
                          id="subscription"
                          tabindex="-1"
                          role="dialog"
                          aria-labelledby="subscriptionModalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header modal-header-fignma">

                                <button
                                  type="button"
                                  className="close"
                                  data-dismiss="modal"
                                  aria-label="Close"
                                onClick={() => clickHandler(false)}
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>

                              </div>
                              <div className="modal-body">
                                <h2 className="subscribingproduct mb-0">
                                  Thank You For Subscribing
                                </h2>

                                <div className="text-center">
                                  <h2 className="manshacss">
                                    Our team will contact you and help you integrate your platform.
                                    Till then, please familiarize yourself with our Dashboard

                                  </h2>
                                </div>
                                <div className="row">
                                  <div className="col-lg-12 text-center">
                                    <img
                                      src={rafiki}
                                      className="modalsimageclass-1"
                                      alt="SabPaisa"
                                      title="SabPaisa"
                                      style={{ width: 250 }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="modal-footer m-0 p-2">
                                <div className="col-lg-12 text-center">

                                  <button
                                    type="button"
                                    className="ColrsforredirectProdct text-white m-0"
                                    onClick={() => clickHandler(true)}
                                    data-dismiss="modal"
                                  >
                                    Return to Dashboard
                                  </button>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </span>
                    </div>
                  </div>
                </div> :
                  <div className={`px-1 ${Products?.plan_id === 45 ? "col-lg-12" : ""} 
                    ${productDetails.length === 4 ? "col-lg-3" : "col-lg-4"}  `} >
                    <div className="card heightcards">
                      <div className="card-body">
                        <div className="row mb-5-">
                          <div className="col-lg-12 text-center">
                            <h1 className="card-title- cardoneheadingcss pb-3-">
                              {Products.plan_name}
                            </h1>
                            <span className={`text-center bold-font mb-1- price ${Products?.plan_price?.split("*")?.length == 2 ? 'fs-6' : ''}`}>
                              {Products.plan_price === "Connect" && Products.plan_name === "Enterprise" ? <></> :
                                <>{Products?.plan_price?.split("*")[0]} <span className="title2"> {Products?.plan_price?.split("*")[1]}</span></>
                              }
                            </span>
                            <h3 className="paragraphcsss text-center">

                              {Products?.plan_type}
                            </h3>
                            <button
                              type="button"
                              className={`font-weight-bold btn choosePlan-1 btn-lg ${selectedPlan?.planId === Products.plan_id ? "btn-bg-color" : ""}`}
                              data-toggle="modal"
                              data-target="#exampleModal"
                              // disabled={selectedPlan?.planId !== "" ? true : false}
                              onClick={() => {
                                if (selectedPlan?.planId !== Products.plan_id) {
                                  handleClick(
                                    Products.plan_id,
                                    Products.plan_name
                                  )
                                }
                              }
                              }
                            >
                              {(selectedPlan?.planId === Products.plan_id) ? "Selected Plan" : "Choose Plan"}
                            </button>

                          </div>
                        </div>



                        <div
                          className="modal fade"
                          id="exampleModal"
                          tabindex="-1"
                          role="dialog"
                          aria-labelledby="exampleModalLabel"
                          aria-hidden="true"
                        >
                          <div
                            className="modal-dialog"

                            role="document"
                          >
                            <div class="modal-content">
                              <div class="modal-header modal-header-fignma">

                                <button
                                  type="button"
                                  class="close"
                                  data-dismiss="modal"
                                  aria-label="Close"
                                onClick={() => clickHandler(false)}
                                >

                                  <span aria-hidden="true">&times;</span>
                                </button>

                              </div>
                              <div class="modal-body">
                                <h2 className="subscribingproduct mb-0">
                                  Thank You For Subscribing
                                </h2>

                                <div class="text-center">
                                  <h2 className="manshacss">
                                    Our team will contact you and help you integrate your platform.
                                    Till then, please familiarize yourself with our Dashboard

                                  </h2>
                                </div>
                                <div class="row">
                                  <div class="col-lg-12 text-center">
                                    <img
                                      src={rafiki}
                                      className="modalsimageclass-1"
                                      alt="SabPaisa"
                                      title="SabPaisa"
                                      style={{ width: 250 }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div class="modal-footer m-0 p-2">
                                <div className="col-lg-12 text-center">

                                  <button
                                    type="button"
                                    class="ColrsforredirectProdct text-white m-0"
                                    onClick={() => clickHandler(true)}
                                    data-dismiss="modal"
                                  >
                                    Return to Dashboard
                                  </button>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>




                        <span class="w-50 pxsolid text-center">&nbsp;</span>
                        <h2 className="featurespricing">FEATURES INCLUDING</h2>


                        <div className="text-center">
                          {Products?.plan_description
                            .split(",")
                            .map((details, i) => (
                              <p className="firstli1 mb-1">{details}</p>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
            ))}




          </div>
        </div>


        <div className="container-fluid">
          <div className="row">



          </div>
        </div>
      </main>
    </section>
  );
};

export default SabPaisaPricing;
