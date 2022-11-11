import React, { useState, useEffect } from "react";
import NavBar from "../../NavBar/NavBar";
import rafiki from "../../../../assets/images/rafiki.png";
import { productSubscribeState } from "../../../../slices/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import API_URL from "../../../../config";
import { axiosInstanceAuth } from "../../../../utilities/axiosInstance";
import "./product.css";
import toastConfig from "../../../../utilities/toastTypes";
import { useParams } from "react-router-dom";

const SabPaisaPricing = () => {
  // const { dashboard } = useSelector((state) => state);
  const [productDetails, setProductDetails] = useState([]);
  const [spinner, setSpinner] = useState(true);

  // console.log(spinner,"here is spinner")
  const productArr = [];

  // const [serviceId, setServiceId] = useState(null)
  const dispatch = useDispatch();
  const clickHandler = (value) => {
    dispatch(productSubscribeState(value));
  };
  const { user } = useSelector((state) => state.auth);
  // console.log("user", user);
  const { clientId, clientName } = user.clientMerchantDetailsList[0];

  const param = useParams();

  useEffect(() => {
    // console.log("parma",param);
    const id = param?.id;
    const name = param;
    // console.log("this is params : ", name?.name)
    let url = API_URL.PRODUCT_SUB_DETAILS + "/" + id;
    axiosInstanceAuth
      .get(url)
      .then((resp) => {
        const data = resp.data.ProductDetail;
        setSpinner(false);

        setProductDetails(data);
        // productDetails.map((product)=>const arr = product.plan_description.split(","))
        // console.log(">>>>>>>>>>>>", productDetails[0].plan_description)
        // console.log('array>>>>>>>>>', resp.data.ProductDetail[0].plan_description.split(','))
        //  productArr =  productDetails[0].plan_description.split(',');
        //  console.log("><<<<<<<<<<<", productArr)
      })
      .catch((err) =>{
        //  console.log(err)
        });
  }, [param]);

  const handleClick = async (plan_id, plan_name) => {
    const postData = {
      clientId: clientId,
      applicationName: param?.name,
      planId: plan_id,
      planName: plan_name,
      applicationId: param?.id,
    };
    // console.log("postData", postData);

    const res = await axiosInstanceAuth.post(
      API_URL.SUBSCRIBE_FETCHAPPAND_PLAN,
      postData
    );
    if (res.status === 200) {
      toastConfig.successToast(res.data.message);
    } else {
      toastConfig.errorToast("something went wrong");
    }
  };

  // const handleClick = (plan_id) => {
  //   const data = {
  //     clientId: clientId,
  //     clientName: clientName,
  //     plan_id: plan_id,
  //     application_id: param?.id,
  //   }

  //   console.log("the main data", data)
  // }
  return (
    <section className="ant-layout">
      <div>
        <NavBar />
        {/*  <div className="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span className="btn">Upload Here</span></span></div>*/}
      </div>
      <main className="gx-layout-content ant-layout-content Satoshi-Medium">
        <div>
          <h1 className="text-center headingpricing text-md-start">SabPaisa Pricing</h1>
          <h2 className="text-center headingpricing prdhead">Payment Gateway</h2>
          <h3 className="forbasicparacss">
            We offer a very competitive pricing to match your business needs.
            Sign Up now to get started.
          </h3>
        </div>
        {/* <button type="button" onClick={clickHandler}>check</button> */}
        <div class="container mb-10">
          <div class="row">
          {spinner && <span className="spinner-border" role="status"></span>}
          {productDetails.map((Products, i) => (
            <div class="col-lg-3 px-1">
              <div
                class="card heightcards"
              >
                  
                <div class="card-body">
                  <div class="row mb-5-">
                    <div className="col-lg-12 text-center">
                    
                      <h1 class="card-title- cardoneheadingcss pb-3-">
                        {Products.plan_name}
                      </h1>
                      <p className="text-center bold-font mb-1- price">
                      {/* {console.log(">>>>>>>>>>",Products.plan_price, Products.plan_type)} */}
                        {/* {Products?.plan_price} */}
                        {Products.plan_price=="Connect" && Products.plan_name == "Enterprise" ?null :Products?.plan_price }
                        
                      </p>
                      <h3 className="paragraphcsss text-center">
                      
                        {Products?.plan_type}
                      </h3>
                      <button
                        type="button"
                        className=" font-weight-bold btn choosePlan-1 btn-lg"
                        data-toggle="modal"
                        data-target="#exampleModal"
                        onClick={() =>
                          handleClick(
                            Products.plan_id,
                            Products.plan_name
                          )
                        }
                      >
                        Choose Plan
                      </button>
                      {/* <button type="button" className=" font-weight-bold btn choosePlan-1 btn-lg" data-toggle="modal" data-target="#exampleModal"><span style={{ color: "#1465FA" }} onClick={() => handleClick(productDetails[0].plan_id)}>Choose Plan</span></button> */}
                    </div>
                  </div>

                  {/* <button onClick={() => clickHandler(true)} type="button" className="figmacssforchooseplan mt-2" data-toggle="modal" data-target="#exampleModal">
                    <h5 className="chooseplanheadingcss">Choose Plan</h5>
                  </button> */}

                  <div
                    class="modal fade"
                    id="exampleModal"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div
                      class="modal-dialog"
                      style={{ maxWidth: 480 }}
                      role="document"
                    >
                      <div class="modal-content">
                        <div class="modal-header modal-header-fignma">
                          <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            // onClick={() => clickHandler(false)}
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
                              Mansha(bot) will now help you integrate your
                              website with our payment product.
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
                              // onClick={() => clickHandler(false)}
                              data-dismiss="modal"
                            >
                              Close
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
                        <p className="firstli1 mb-2">{details}</p>
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
