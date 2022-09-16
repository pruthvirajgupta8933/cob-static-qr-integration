import React from 'react'
import NavBar from '../../NavBar/NavBar'
// import numbersimage from "../.../assets/images/numbersimage.png"
import numbersimage from "../../../../assets/images/numbersimage.png"
import Background from "../../../../assets/images/Background.png"
import EnterPrice from "../../../../assets/images/EnterPrice.png"
import Rectangle from "../../../../assets/images/Rectangle.png"
import enterPriceImages from "../../../../assets/images/enterPriceImages.png"
import ThankYouImages from "../../../../assets/images/congImg.png"
import { productSubscribeState } from '../../../../slices/dashboardSlice'
import { useDispatch, useSelector } from 'react-redux'
import "./product.css"
// import Line1 from "../../../../../assets/images/Line1.png"

const SabPaisaPricing = () => {
  const { dashboard } = useSelector((state) => state);

  const dispatch = useDispatch();
  const clickHandler = (value) => {
    dispatch(productSubscribeState(!dashboard?.productSubscribe))
    // console.log("value", value)
    // dispatch(productSubscribeState(value))
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
              <div class="card heightcards">

                <div class="card-body">
                  <div class="row mb-5">
                    <div className='col-lg-12 text-center'>
                      <h1 class="card-title cardoneheadingcss pb-3">Start-up/Freelancer</h1>
                      <p className='text-center bold-font mb-1'>9,999</p>
                      <h3 className='paragraphcsss text-center'>Per Year</h3>
                      <button type="button" className=" font-weight-bold btn choosePlan-1 btn-lg"  data-toggle="modal" data-target="#exampleModal">Choose Plan</button>
                    </div>
                  </div>


                  {/* <button onClick={() => clickHandler(true)} type="button" className="figmacssforchooseplan mt-2" data-toggle="modal" data-target="#exampleModal">
                    <h5 className="chooseplanheadingcss">Choose Plan</h5>
                  </button> */}

                  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog w-25" role="document">
                      <div class="modal-content">
                        <div class="modal-header" style={{backgroundColor:"#1465FA"}}>
                      
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => clickHandler(false)}>
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                        <h2 className="subscribingproduct">Thank You For Subscribing</h2>

                          <div class="text-center mt-5">
                            <h2 className="manshacss">Mansha(bot) will now help you integrate your website with your payment product.</h2>
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="ColrsforredirectProdct text-white" onClick={() => clickHandler(false)} data-dismiss="modal">Talk with Mansha</button>
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
                    <p className="firstli1 mb-2">AI Chat Support</p>
                    <p className=" firstli1 mb-2">Calendar View</p>
                    <p className="firstli1 mb-2">WhatsApp Integration</p>
                    <p className="firstli1 mb-2">Advanced Analytics</p>
                    <p className="firstli1 mb-2">Dashboard training</p>
                  </div>
                </div>


              </div>
            </div>
            <div class="col-sm">
              <div class="card heightcards" style={{ background: "#012167", border: "1px solid #DBDBDB", boxShadow: "0px 4px 5px 1px rgb(193 193 193 / 35%)", borderRadius: "4px" }}>


                <div class="card-body">
                  <div class="row mb-5">
                    <div className='col-lg-12 text-center text-white'>
                      <h1 class="card-title cardoneheadingcss2 pb-3">SME</h1>
                      <p className='text-center text-white bold-font mb-1'>2.0%</p>
                      <h3 className='paragraphcsss text-white text-center'>3 years and up</h3>
                      <button type="button" className="btn choosePlan-1 btn-primary btn-lg font-weight-bold"  data-toggle="modal" data-target="#exampleModal">Choose Plan</button>
                    </div>
                  </div>
                  {/* <div class="row">
                    <div class="col-sm">
                      <h1 class="card-title forsecondcardfigma text-white  pb-4">SME </h1>
                    </div>
                  </div> */}
                  {/* <img
                    src={EnterPrice}
                    className="forimagesEnterpricing mb-4"
                    alt="SabPaisa"
                    title="SabPaisa"
                  /> */}
                  {/* <p className='text-center bold-font text-white mb-1'>2.0%</p>
                  <h3 className='graphcssforenterprice text-white'>3 years and up</h3> */}
                  {/* <div class="container">
                    <img
                      src={Rectangle}
                      className="figmacssforEnterpricechooseplan"
                      alt="SabPaisa"
                      title="SabPaisa"

                    />
                    <div class="centered text-white">Choose Plan</div>
                  </div> */}
                  {/* <div><button onClick={() => clickHandler(true)} type="button" className="figmacssforEnterpricechooseplan text-white mt-2" data-toggle="modal" data-target="#exampleModal">
                    Choose Plan
                  </button></div> */}

                  {/* <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog w-50" role="document">
                      <div class="modal-content">
                        <div class="modal-header">

                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <div class="container">
                            <div class="row">
                              <div class="col-4">
                                <div class="text-center">
                                  <img
                                    src={ThankYouImages}
                                    width={250}
                                    className="Thankusubscribingcss"
                                    alt="SabPaisa"
                                    title="SabPaisa"
                                  />
                                </div>

                              </div>
                              <div class="col-5">
                                <div class="text-center mt-5">
                                  <h2 className="subscribingproduct">Thank You For Subscribing</h2>
                                </div>
                              </div>
                            </div>
                          </div>


                        </div>
                        <div class="modal-footer">
                          <button type="button" id="close1" class="btn btn-primary" data-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <h2 className='featurespricingforEnterpricing'>FEATURES INCLUDING</h2>
                  <div className='text-center text-white'>
                    <p className="secondli1 mb-2">Account Manager</p>
                    <p className="secondli1 mb-2">AI Chat Support</p>
                    <p className="secondli1 mb-2">Calendar View</p>
                    <p className="secondli1 mb-2">WhatsApp Integration</p>
                    <p className="secondli1 mb-2">Advanced Analytics</p>
                    <p className="secondli1 mb-2">Dashboard training</p>
                  </div>
                </div>

              </div>
            </div>
            <div class="col-sm">
              <div class="card heightcards">
                <div class="card-body">

                  <div class="row mb-5">
                    <div className='col-lg-12 text-center'>
                      <h1 class="card-title cardoneheadingcss pb-3">Enterprise</h1>
                      {/* <p className='text-center bold-font mb-1'></p> */}
                      <h3 className='bold-font text-center mb-1'>5 Yr</h3>
                      <h3 className='paragraphcsss text-center'>Minimum 5 years in buisness</h3>
                      <button type="button" className="btn choosePlan-1  btn-lg font-weight-bold"  data-toggle="modal" data-target="#exampleModal">Contact Sales</button>
                    </div>
                  </div>

                  {/* <div class="row">
                    <div class="col-sm">
                      <h1 class="card-title pb-4 forThirdscardfigma">Enterprise</h1>
                    </div>
                  </div> */}

                  {/* <h3 className='parabusinesscss'>Minimum 5 years in Biz</h3> */}
                  {/* <div class="container">
                    <img
                      src={Background}
                      className="figmacssforchooseplan"
                      alt="SabPaisa"
                      title="SabPaisa"

                    />
                    <div class="centered">Choose Plan</div>
                  </div> */}
                  {/* <button onClick={() => clickHandler(true)} type="button" className="figmacssforchooseplan mt-2" data-toggle="modal" data-target="#exampleModal">
                    <h5 className="chooseplanheadingcss">Contact Sales</h5>
                  </button> */}
                  {/* <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog w-50" role="document">
                      <div class="modal-content">
                        <div class="modal-header">

                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <div class="container">
                            <div class="row">
                              <div class="col-4">
                                <div class="text-center">
                                  <img
                                    src={ThankYouImages}
                                    width={250}
                                    className="Thankusubscribingcss"
                                    alt="SabPaisa"
                                    title="SabPaisa"
                                  />
                                </div>

                              </div>
                              <div class="col-5">
                                <div class="text-center mt-5">
                                  <h2 className="subscribingproduct">Thank You For Subscribing</h2>
                                </div>
                              </div>
                            </div>
                          </div>


                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <h2 className='featuresIncludingforbusiness'>FEATURES INCLUDING</h2>
                  <div className='text-center'>
                    <p className="thirdli1 mb-2">Account Manager</p>
                    <p className="thirdli1 mb-2">AI Chat Support</p>
                    <p className="thirdli1 mb-2">Calendar View</p>
                    <p className="thirdli1 mb-2">Advanced Analytics</p>
                    <p className="thirdli1 mb-2">Dashboard training</p>
                    <p className="thirdli1 mb-2">Regular catalog updates</p>
                    <p className="thirdli1 mb-2">WhatsApp Integration</p>
                    <p className="thirdli1 mb-2">Discount Coupons</p>
                    <p className="thirdli1 mb-2">Personalised feature recommendations</p>
                    <p className="thirdli1 mb-2">24/7 Customer Support</p>
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