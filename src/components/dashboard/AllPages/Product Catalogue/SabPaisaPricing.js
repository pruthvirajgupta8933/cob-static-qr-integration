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
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

const SabPaisaPricing = () => {
  const history = useHistory();
  const [productDetails, setProductDetails] = useState([]);
  const [spinner, setSpinner] = useState(true);
  
  const dispatch = useDispatch();
  const clickHandler = (value) => {
    history.push("/dashboard");
    dispatch(productSubscribeState(value));
  };
  const { user } = useSelector((state) => state.auth);
  const { clientId,business_cat_code } = user.clientMerchantDetailsList[0];
  

  const param = useParams();

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
  return (
    <section className="ant-layout">
      <div>
        <NavBar />
        
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
          {productDetails.map((Products, i) => (
            // if user business catagory is gamming
            (business_cat_code==="37" && Products.plan_code ==="005") ?<></>:
            (param?.id==='14') ? <div class="card col-lg-8">
            <div class="card-body">
              <div className="col-lg-12">
                <h2 className="pull-left- bold-font text-center mb-20 price d_block">
                  {Products.plan_price==="Connect" && Products.plan_name === "Enterprise" ? <></> :  <>{Products?.plan_price?.split("*")[0]} <span className={`title2 ${param?.id==="14" ? 'fontn' : 'fontna'}`}> {Products?.plan_price?.split("*")[1]}</span></>}
                </h2>
                <span class="blockquote mb-0 pull-left- text-center">
                  <span class="w-50 pxsolid text-center mt-40 min-heit">&nbsp;</span>
                  <h4 className="mb-20 featurespricing">FEATURES INCLUDING</h4>
                  <ul className="list-group list-group-flush">
                  {Products?.plan_description
                      .split(",")
                      .map((details, i) => (
                        <li className="list-group-item fnt-sz"><p className="firstli1 mb-1">{details}</p></li>
                      ))}
                   
                  </ul>
                </span>
                <span className=" text-center">
                  {/* <p className="mt-20">Per year</p> */}
                  
                  <p className="mt-20"><button
                        type="button"
                        className=" font-weight-bold btn choosePlan-1 btn-lg w-50"
                        data-toggle="modal"
                        data-target="#subscription"
                        onClick={() =>
                          handleClick(
                            Products.plan_id,
                            Products.plan_name
                          )
                        }
                      >
                        Choose Plan
                      </button>
                  </p>
                  
                  
                  <div
                    class="modal fade"
                    id="subscription"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="subscriptionModalLabel"
                    aria-hidden="true"
                  >
                    <div
                      class="modal-dialog"
                      
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
                </span>
              </div>
            </div>
            </div> : 
            <div className={`px-1 ${Products?.plan_id===45? "col-lg-12":""} 
            ${productDetails.length === 4 ? "col-lg-3":"col-lg-4"}  `}
            >
              <div class="card heightcards">
                <div class="card-body">
                  <div class="row mb-5-">
                    <div className="col-lg-12 text-center">
                      <h1 class="card-title- cardoneheadingcss pb-3-">
                        {Products.plan_name}
                      </h1>
                      {/* {console.log(Products?.plan_price?.split("*").length)} */}
                      <span className={`text-center bold-font mb-1- price ${Products?.plan_price?.split("*")?.length==2 ? 'fs-6':'' }`}>
                        {Products.plan_price==="Connect" && Products.plan_name === "Enterprise" ? <></> :  
                        <>{Products?.plan_price?.split("*")[0]} <span className="title2"> {Products?.plan_price?.split("*")[1]}</span></>
                          }
                      </span>
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
                    
                    </div>
                  </div>

            

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
