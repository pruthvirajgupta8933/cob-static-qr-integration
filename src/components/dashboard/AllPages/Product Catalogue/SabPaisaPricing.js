import React, { useState, useEffect } from 'react'
import NavBar from '../../NavBar/NavBar'
import rafiki from "../../../../assets/images/rafiki.png"
import { productSubscribeState } from '../../../../slices/dashboardSlice'
import { useDispatch, useSelector } from 'react-redux'
import API_URL from '../../../../config';
import { axiosInstanceAuth } from '../../../../utilities/axiosInstance';
import "./product.css"
import { useParams } from 'react-router-dom'

const SabPaisaPricing = () => {
  // const { dashboard } = useSelector((state) => state);
  const [productDetails, setProductDetails] = useState([]);
  const productArr = [];

  // const [serviceId, setServiceId] = useState(null)
  const dispatch = useDispatch();
  const clickHandler = (value) => {
    dispatch(productSubscribeState(value))
  }
  const { user } = useSelector((state) => state.auth);
  const { clientId, clientName } = user.clientMerchantDetailsList[0];

  const param = useParams()


  useEffect(() => {
    // console.log("parma",param);
    const id = param?.id;
    let url = API_URL.PRODUCT_SUB_DETAILS + "/" + id
    axiosInstanceAuth
      .get(url
      )
      .then((resp) => {
        const data = resp.data.ProductDetail;

        setProductDetails(data);
        // productDetails.map((product)=>const arr = product.plan_description.split(","))
        // console.log(">>>>>>>>>>>>", productDetails[0].plan_description)
        // console.log('array>>>>>>>>>', resp.data.ProductDetail[0].plan_description.split(','))
        //  productArr =  productDetails[0].plan_description.split(',');
        //  console.log("><<<<<<<<<<<", productArr)
      })
      .catch((err) => console.log(err));
  }, [param]);


  const handleClick = (plan_id) => {
    const data = {
      clientId: clientId,
      clientName: clientName,
      plan_id: plan_id,
      application_id: param?.id,
    }

    console.log("the main data", data)
  }
  return (
    <section className="ant-layout">
      <div>
        <NavBar />
        {/*  <div className="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span className="btn">Upload Here</span></span></div>*/}
      </div>
      <main className="gx-layout-content ant-layout-content">

        <div>
          <h1 className="text-center headingpricing">SabPaisa Pricing</h1>
          <h3 className="forbasicparacss">We offer a very competitive pricing to match your business needs. Sign Up now to get started.</h3>
        </div>
        {/* <button type="button" onClick={clickHandler}>check</button> */}
        <div class="container mb-10">
          <div class="row">
            <div class="col-sm">
              <div class="card heightcards" style={{ height: "620px", width: "300px" }}>

                <div class="card-body">
                  <div class="row mb-5">
                    <div className='col-lg-12 text-center'>
                      <h1 class="card-title cardoneheadingcss pb-3">{productDetails[0]?.plan_name}</h1>
                      <p className='text-center bold-font mb-1'>{productDetails[0]?.plan_price}</p>
                      <h3 className='paragraphcsss text-center'>{productDetails[0]?.plan_type}</h3>
                      <button type="button" className=" font-weight-bold btn choosePlan-1 btn-lg" data-toggle="modal" data-target="#exampleModal"><span style={{ color: "#1465FA" }} onClick={() => handleClick(productDetails[0].plan_id)}>Choose Plan</span></button>
                    </div>


                  </div>



                  {/* <button onClick={() => clickHandler(true)} type="button" className="figmacssforchooseplan mt-2" data-toggle="modal" data-target="#exampleModal">
                    <h5 className="chooseplanheadingcss">Choose Plan</h5>
                  </button> */}

                  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" style={{ maxWidth: 480 }} role="document">
                      <div class="modal-content">
                        <div class="modal-header modal-header-fignma" >
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                          // onClick={() => clickHandler(false)}
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <h2 className="subscribingproduct mb-0" >Thank You For Subscribing</h2>

                          <div class="text-center">
                            <h2 className="manshacss">Mansha(bot) will now help you integrate your website with our payment product.
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
                            <button type="button" class="ColrsforredirectProdct text-white m-0"
                              // onClick={() => clickHandler(false)}
                              data-dismiss="modal">Talk with Mansha</button>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  <h2 className='featurespricing'>FEATURES INCLUDING</h2>

                  {/* <ul className="forparacss">
  <li className="firstli">AI Chat Support</li>
  <li className="secondli">Calendar View</li>
  <li className="thirdli">WhatsApp Integration</li>
  <li className="forthli">Advanced Analytics</li>
  <li className="fifthli">Dashboard training</li>
</ul> */}
                  <div className='text-center'>
                    {productDetails[0]?.plan_description.split(',').map((details, i) => <p className="firstli1 mb-2">{details}</p>)}
                  </div>
                </div>


              </div>
            </div>
            <div class="col-sm">
              <div class="card heightcards" style={{ background: "#012167", border: "1px solid #DBDBDB", boxShadow: "0px 4px 5px 1px rgb(193 193 193 / 35%)", borderRadius: "4px", height: "620px", width: "300px" }}>
                <div class="card-body">
                  <div class="row mb-5">
                    <div className='col-lg-12 text-center text-white'>
                      <h1 class="card-title cardoneheadingcss2 pb-3">{productDetails[1]?.plan_name}</h1>
                      <p className='text-center text-white bold-font mb-1'>{productDetails[1]?.plan_price}</p>
                      <h3 className='paragraphcsss text-white text-center'>{productDetails[1]?.plan_type}</h3>
                      <button type="button" className="btn choosePlan-2 btn-primary btn-lg font-weight-bold" data-toggle="modal" data-target="#exampleModal" onClick={() => handleClick(productDetails[1].plan_id)}  >Choose Plan</button>
                    </div>
                  </div>

                  <h2 className='featurespricingforEnterpricing'>FEATURES INCLUDING</h2>
                  <div className='text-center text-white'>
                  {productDetails[1]?.plan_description.split(',').map((details, i) => <p className="firstli1 mb-2 text-white">{details}</p>)}
                  </div>
                </div>

              </div>
            </div>
            <div class="col-sm">
              <div class="card heightcards" style={{ height: "620px", width: "300px" }}>
                <div class="card-body">

                  <div class="row mb-5">
                    <div className='col-lg-12 text-center'>
                      <h1 class="card-title cardoneheadingcss pb-3">{productDetails[2]?.plan_name}</h1>
                      {/* <p className='text-center bold-font mb-1'></p> */}
                      <h3 className='bold-font text-center mb-1'>{productDetails[2]?.plan_price}</h3>
                      <h3 className='paragraphcsss text-center'>{productDetails[2]?.plan_type}</h3>
                      <button type="button" className="btn choosePlan-1  btn-lg font-weight-bold" data-toggle="modal" data-target="#exampleModal" onClick={() => handleClick(productDetails[2].plan_id)}  >Contact Sales</button>
                    </div>
                  </div>
                  <h2 className='featuresIncludingforbusiness'>FEATURES INCLUDING</h2>
                  <div className='text-center'>
                  {productDetails[2]?.plan_description.split(',').map((details, i) => <p className="firstli1 mb-2">{details}</p>)}
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>

































































        {/*  <=========== Old Product Catalogue ===========> */}



        {/* <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Product Catalogue</h1>
          </div>
          <section
            className="features8 cid-sg6XYTl25a flleft"
            id="features08-3-"
          > */}
        <div className="container-fluid">
          <div className="row">

            {/* {subscriptionPlanData.length <= 0 ? (
                  <h3>Loading...</h3>
                ) : ( */}
            {/* subscriptionPlanData.map((s, i) => ( */}
            {/* <div className="col col-lg-5 ">
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
                              style={{ backgroundColor: "rgb(1, 86, 179)" }}
                            >
                              Read More
                            </a>
                            <button type="button" className=" btn bttn bttnbackgroundkyc collapsed"
                              data-toggle="modal" data-target="#exampleModal"
                              onClick={() => console.log('this is mapped data for modal : ', s)}
                            >
                              Subscribe
                            </button>
                            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                              <div class="modal-dialog" role="document">
                                <div class="modal-content">

                                  <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                  <div class="modal-body">
                                    <h2 classname="pull-center"><b>Thank You For Subscribing. We will come back to you Shortly</b></h2>

                                  </div>
                                  <div class="modal-footer">
                                    <button type="button" class="btn bttn bttnbackgroundkyc collapsed" data-dismiss="modal">Close</button>
                                  </div>
                                </div>
                              </div>
                            </div> */}



            {/* <button
                               className=" btn bttn bttnbackgroundkyc collapsed"
                                type="button"
                              >
                                Subscribe
                              </button> */}

            {/* </p>
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
                    </div> */}
            {/* )) */}
            {/* )} */}
            {/* </div>
            </div>
          </section> */}
            {/*  <=========== Old Product Catalogue ===========> */}
          </div>
        </div>

      </main>
    </section>
  );
};



export default SabPaisaPricing