/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import NavBar from "../../NavBar/NavBar";
import rafiki from "../../../../assets/images/rafiki.png";
import { productSubscribeState } from "../../../../slices/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import API_URL from "../../../../config";
import { axiosInstanceJWT } from "../../../../utilities/axiosInstance";
import "./product.css";
import toastConfig from "../../../../utilities/toastTypes";
import { useParams, useHistory } from "react-router-dom";
import { logout } from "../../../../slices/auth";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import CustomModal from "../../../../_components/custom_modal";

const SabPaisaPricing = () => {
  const history = useHistory();
  let roles = roleBasedAccess();

  const [productDetails, setProductDetails] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [modalToggle, setModalToggle] = useState(false);


  console.log("selectedPlan", selectedPlan)
  const dispatch = useDispatch();
  const clickHandler = (value) => {
    history.push("/dashboard");
    dispatch(productSubscribeState(value));
  };
  const { user } = useSelector((state) => state.auth);
  const { clientId, business_cat_code } = user.clientMerchantDetailsList[0];

  useEffect(() => {
    if (roles?.merchant !== true) {
      dispatch(logout())
    }
  })


  const param = useParams();

  const getSubscribedPlan = (id) => {
    axiosInstanceJWT
      .post(API_URL.Get_Subscribed_Plan_Detail_By_ClientId, { "clientId": clientId, "applicationId": id })
      .then((resp) => {
        // console.log(resp?.data?.data[0]?.planId)
        setSelectedPlan(resp?.data?.data[0])
      })
  }


  useEffect(() => {
    const id = param?.id;
    let url = API_URL.PRODUCT_SUB_DETAILS + "/" + id;
    axiosInstanceJWT
      .get(url)
      .then((resp) => {
        const data = resp.data.ProductDetail;
        setSpinner(false);
        setProductDetails(data);
      })
    getSubscribedPlan(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);



  const handleClick = async (plan_id, plan_name, plan_code) => {

    const postData = {
      clientId: clientId,
      applicationName: param?.name,
      planId: plan_id,
      planName: plan_name,
      applicationId: param?.id,
    };

    axiosInstanceJWT.post(
      API_URL.SUBSCRIBE_FETCHAPPAND_PLAN,
      postData
    ).then(res => {
      if (res?.status === 200) {
        getSubscribedPlan(param?.id);
        setModalToggle(true)
      }

    }).catch(error => toastConfig.errorToast(error.response?.data?.detail))

  };


  const modalBody = () => {
    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  }
  const modalFooter = () => {
    return (
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
    )
  }




  return (

    <section className="ant-layout">


      {/* custom modal for thanks message after select the plan */}
      <CustomModal modalBody={modalBody} modalFooter={modalFooter} modalToggle={modalToggle} fnSetModalToggle={setModalToggle} />

      <main className="gx-layout-content ant-layout-content NunitoSans-Regular">

        <div className="text-center">
          <h1 >SabPaisa Pricing</h1>
          <h5 className="headingpricing prdhead">{param?.name}</h5>
          <h5 className="forbasicparacss">
            We offer a very competitive pricing to match your business needs.
            Sign Up now to get started.
          </h5>
        </div>
        <div className="container">
          <div className="d-flex justify-content-center">
            {spinner && <span className="spinner-border" role="status"></span>}
            {productDetails.map((Products) => (
              // if user select the business catagory gamming then hide the subscription plan
              (business_cat_code === "37" && Products.plan_code === "005") ? <></> :
                (param?.id === '14') ?
                  <div className="col-lg-4 card mx-3">
                    <div className="card-body">
                      <div className="col-lg-12">
                        <h2 className="pull-left- bold-font text-center mb-20 price d_block">
                          {(Products.plan_price === "Connect" && Products.plan_name === "Enterprise") ?
                            <></> :
                            <>
                              {Products?.plan_price?.split("*")[0]} <span className={`title2 ${param?.id === "14" ? 'fontn' : 'fontna'}`}> {Products?.plan_price?.split("*")[1]}</span>
                            </>
                          }
                        </h2>
                        <span className="blockquote mb-0 pull-left- text-center">
                          <span className="w-50 pxsolid text-center mt-40 min-heit">&nbsp;</span>
                          <h4 className="mb-20 featurespricing">FEATURES INCLUDING</h4>
                          <ul className="list-group list-group-flush">
                            {Products?.plan_description
                              .split(",")
                              .map((details) => (
                                <li className="list-group-item fnt-sz" key={details}><p className="firstli1 mb-1">{details}</p></li>
                              ))}
                          </ul>
                        </span>
                        <span className=" text-center">
                          <p className="mt-20">

                            <button
                              type="button"
                              className={`font-weight-bold btn choosePlan-1 btn-lg w-50 ${selectedPlan?.planId === Products?.plan_id ? "btn-bg-color" : ""}`}
                              disabled={selectedPlan?.mandateStatus === "success" ? true : false}
                              onClick={() => {
                                if (selectedPlan?.planId !== Products?.plan_id) {
                                  handleClick(
                                    Products.plan_id,
                                    Products.plan_name,
                                    Products?.plan_code
                                  )
                                }
                              }
                              }
                            >
                              {(selectedPlan?.planId === Products.plan_id) ? "Selected Plan" : "Choose Plan"}
                            </button>
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                  :
                  <div className="col-lg-4 card mx-3">
                      <div className="card-body">
                        <div className="">
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
                              disabled={selectedPlan?.mandateStatus === "success" ? true : false}
                              onClick={() => {
                                if (selectedPlan?.planId !== Products?.plan_id) {
                                  handleClick(
                                    Products.plan_id,
                                    Products.plan_name,
                                    Products?.plan_code
                                  )
                                }
                              }
                              }
                            >
                              {(selectedPlan?.planId === Products.plan_id) ? "Selected Plan" : "Choose Plan"}
                            </button>

                          </div>
                        </div>

                        <span className="w-50 pxsolid text-center">&nbsp;</span>
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
            ))}
          </div>
        </div>
      </main>
    </section>
  );
};

export default SabPaisaPricing;
