import React, { useState, useEffect } from "react";
import NavBar from "../../NavBar/NavBar";
import { Link } from "react-router-dom";
import "./product.css";
import onlinePayment from "../../../../assets/images/onlinePayment.png";
import paymentLink from "../../../../assets/images/paymentLink.png";
import subscribe from "../../../../assets/images/subscribe.png";
import payout from "../../../../assets/images/payout.png";
import qwikform from "../../../../assets/images/qwikform.png";
import echallan from "../../../../assets/images/echallan.png";
import epos from "../../../../assets/images/epos.png";
import linkPaisa from "../../../../assets/images/linkPaisa.png";
import Spinner from "./Spinner";
import API_URL from "../../../../config";
import { axiosInstanceAuth } from "../../../../utilities/axiosInstance";

const Products = () => {
  const [product, setProduct] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const iconImg = [
    onlinePayment,
    paymentLink,
    subscribe,
    payout,
    qwikform,
    echallan,
    epos,
    linkPaisa,
  ];

  useEffect(() => {
    axiosInstanceAuth
      .get(API_URL.PRODUCT_DETAILS)
      .then((resp) => {
        const data = resp.data.ProductDetail;
        setSpinner(false);

        setProduct(data);
      })
      .catch((err) => console.log(err));
  }, []);
  const map1 = product.map((Singleproduct, i) =>
    localStorage.setItem(
      `application_Name ${i}`,
      Singleproduct.application_name
    )
  );

  return (
    <section className="ant-layout">
      <div>
        <NavBar />
        {/*  <div className="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span className="btn">Upload Here</span></span></div>*/}
      </div>
      <main className="gx-layout-content ant-layout-content Satoshi-Medium">
        <div class="container">
          <div class="row justify-content-md-center">
            <div class="col-md-auto">
              <h1
                className="text-centre prodHeader"
                style={{ fontSize: "xx-large" }}
              >
                Product Catalogue
              </h1>
              <p className="prodpara">
                We offer a very competitive pricing to match your business
                needs. Sign up now to get started.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          {spinner && <span className="spinner-border" role="status"></span>}

          {product.map((Products, i) => (
            <div class="col-sm-6 col-md-6 col-lg-6">
              <div class="card" style={{ width: "31rem", height: "17rem" }}>
                <div class="card-body">
                  <h5 class="card-title prod-header">
                    <img
                      class="card-img-left"
                      src={iconImg[i]}
                      alt="onlinepay"
                      width={40}
                    />
                    &nbsp;
                    {Products.application_name}
                  </h5>
                  <p class="card-text prod-content">
                    {" "}
                    {Products.application_description}
                  </p>
                  <div>
                    <p class="prod-read">
                      {" "}
                      <Link
                        to={`/dashboard/sabpaisa-pricing/${Products.application_id}/${Products.application_name}`}
                      >
                        Read More & Pricing &nbsp;{">"}
                        {">"}
                      </Link>
                    </p>
                  </div>
                  {/* <Link to={`/dashboard/sabpaisa-pricing/${Products.application_id}`} */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <p><Link to='/dashboard/sabpaisa-pricing'>Read More & Pricing</Link></p> */}
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

export default Products;
