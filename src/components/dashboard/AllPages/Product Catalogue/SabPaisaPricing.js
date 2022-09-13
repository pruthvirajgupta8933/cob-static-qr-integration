import React from 'react'
import NavBar from '../../NavBar/NavBar'
// import numbersimage from "../.../assets/images/numbersimage.png"
import numbersimage from "../../../../assets/images/numbersimage.png"
import Background from "../../../../assets/images/Background.png"
import EnterPrice from "../../../../assets/images/EnterPrice.png"
import Rectangle from "../../../../assets/images/Rectangle.png"
import enterPriceImages from "../../../../assets/images/enterPriceImages.png"
import ThankYouImages from "../../../../assets/images/congImg.png"
// import Line1 from "../../../../../assets/images/Line1.png"

const SabPaisaPricing = () => {
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

        <div class="container mb-10">
          <div class="row">
            <div class="col-sm">
              <div class="card heightcards">

                <div class="card-body">
                  <div class="row">
                    <div class="col-sm">
                      <h1 class="card-title cardoneheadingcss pb-3">Freelancer</h1>
                    </div>
                  </div>

                  <img
                    src={numbersimage}
                    className="forimagespricing pb-5"

                  />
                  <h3 className='paragraphcsss'>per user, per month</h3>
                  {/* <div class="container">
                    <img
                      src={Background}
                      className="figmacssforchooseplan"

                    />
                    <div class="centered">Choose Plan</div>
                  </div> */}
                  <button type="button" className="figmacssforchooseplan mt-2" data-toggle="modal" data-target="#exampleModal">
                    <h5 className="chooseplanheadingcss">Choose Plan</h5>
                  </button>
                  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                  </div>
                </div>


                <h2 className='featurespricing'>FEATURES INCLUDING</h2>

                <ul className="forparacss">
                  <li className="firstli">Chat Support</li>
                  <li className="secondli">Complete online</li>
                  <li className="thirdli">400+ Templates</li>
                  <li className="forthli">Calendar View</li>
                  <li className="fifthli">24/7 Support</li>
                </ul>


              </div>
            </div>
            <div class="col-sm">
              <div class="card heightcards" style={{ background: "#012167", border: "1px solid #DBDBDB", boxShadow: "0px 4px 5px 1px rgb(193 193 193 / 35%)", borderRadius: "4px" }}>


                <div class="card-body">
                  <div class="row">
                    <div class="col-sm">
                      <h1 class="card-title forsecondcardfigma text-white  pb-4">Enterprise</h1>
                    </div>
                  </div>
                  <img
                    src={EnterPrice}
                    className="forimagesEnterpricing mb-4"
                    alt="SabPaisa"
                    title="SabPaisa"
                  />
                  <h3 className='graphcssforenterprice'>per user, per month</h3>
                  {/* <div class="container">
                    <img
                      src={Rectangle}
                      className="figmacssforEnterpricechooseplan"
                      alt="SabPaisa"
                      title="SabPaisa"

                    />
                    <div class="centered text-white">Choose Plan</div>
                  </div> */}
                  <button type="button" className="figmacssforEnterpricechooseplan text-white mt-2" data-toggle="modal" data-target="#exampleModal">
                    Choose Plan
                  </button>
                  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                  </div>
                </div>
                <h2 className='featurespricingforEnterpricing'>FEATURES INCLUDING</h2>
                <ul className="forEnterPriceparaGcss">
                  <li className="firstli">Chat Support</li>
                  <li className="secondli">Complete online</li>
                  <li className="thirdli">400+ Templates</li>
                  <li className="forthli">Calendar View</li>
                  <li className="fifthli">24/7 Support</li>
                </ul>
              </div>
            </div>
            <div class="col-sm">
              <div class="card heightcards">
                <div class="card-body">
                  <div class="row">
                    <div class="col-sm">
                      <h1 class="card-title pb-4 forThirdscardfigma">Business</h1>
                    </div>
                  </div>
                  <img
                    src={enterPriceImages}
                    className="cssforbusinesscard mb-4"
                    alt="SabPaisa"
                    title="SabPaisa"
                  />
                  <h3 className='parabusinesscss'>per user, per month</h3>
                  {/* <div class="container">
                    <img
                      src={Background}
                      className="figmacssforchooseplan"
                      alt="SabPaisa"
                      title="SabPaisa"

                    />
                    <div class="centered">Choose Plan</div>
                  </div> */}
                  <button type="button" className="figmacssforchooseplan mt-2" data-toggle="modal" data-target="#exampleModal">
                    <h5 className="chooseplanheadingcss">Choose Plan</h5>
                  </button>
                  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                  </div>
                </div>
                <h2 className='featuresIncludingforbusiness'>FEATURES INCLUDING</h2>
                <ul className="Businessoredrcssforcard">
                  <li className="firstli">Chat Support</li>
                  <li className="secondli">Complete online</li>
                  <li className="thirdli">400+ Templates</li>
                  <li className="forthli">Calendar View</li>
                  <li className="fifthli">24/7 Support</li>
                </ul>


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