import React from 'react'
import onlineimg from "../../../assets/images/onlinePayment.png";
import subscriptin from "../../../assets/images/subscribe.png";
import Rupees from "../../../assets/images/payout.png";
import Quick from "../../../assets/images/qwikform.png";
import linkpssa from "../../../assets/images/linkPaisa.png";
import echlln from "../../../assets/images/echallan.png";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";

const HomeProduct =()=>{
    const roles = roleBasedAccess();

    return(
        <>
         {/* Display the products  */}
      <div className="row ">
        {roles?.merchant === true && (
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-6">
                <div className="">
                  <h4 className="card-title">
                    <img
                      className="card-img-left"
                      src={subscriptin}
                      alt="onlinepay"
                    />
                    &nbsp;Payment Links
                  </h4>
                  <p className="">
                    Payment Links is the world’s first Unified link-based
                    payment method, for payment collections with the help of
                    links for a wide range of payment modes. Collect payments
                    even without a website through easy payment links. Payment
                    Links offers password-protected and shortened payment links
                    for seamless payment collection.
                  </p>

                </div>
              </div>
              <div className="col-lg-6">
                <div className="row pt-2 m-0">
                  <div className="col-6 d-flex flex-wrap my-2 no-pad">
                    <img
                      className="card-img-left mr-2"
                      src={onlineimg}
                      alt="payLink"
                      width={"41px"}
                      height={"41px"}
                    />
                    <p
                      className="foralinkscsshere my-auto "
                      style={{ lineHeight: "25px" }}
                    >
                      Payment Gateway
                    </p>
                  </div>
                  <div className="col-6 d-flex flex-wrap my-2 no-pad pr-2">
                    <img
                      className="card-img-left mr-2"
                      src={Rupees}
                      alt="payLink"
                      width={"41px"}
                      height={"41px"}
                    />
                    <p
                      className="foralinkscsshere my-auto"
                      style={{ lineHeight: "25px" }}
                    >
                      Subscriptions
                    </p>
                  </div>

                  <div className="col-6 d-flex flex-wrap my-2 no-pad">
                    <img
                      className="card-img-left mr-2"
                      width={"41px"}
                      height={"41px"}
                      src={Quick}
                      alt="payLink"
                    />
                    <p
                      className="foralinkscsshere my-auto"
                      style={{ lineHeight: "25px" }}
                    >
                      QwikForm
                    </p>
                  </div>
                  <div className="col-6 d-flex flex-wrap my-2 no-pad">
                    <img
                      className="card-img-left mr-2"
                      width={"41px"}
                      height={"41px"}
                      src={subscriptin}
                      alt="payLink"
                    />
                    <p
                      className="foralinkscsshere my-auto"
                      style={{ lineHeight: "25px" }}
                    >
                      Payment Links
                    </p>
                  </div>
                  <div className="col-6 d-flex flex-wrap my-2 no-pad">
                    <img
                      className="card-img-left mr-2"
                      width={"41px"}
                      height={"41px"}
                      src={linkpssa}
                      alt="payLink"
                    />
                    <p
                      className="foralinkscsshere my-auto"
                      style={{ lineHeight: "25px" }}
                    >
                      LinkPaisa
                    </p>
                  </div>
                  <div className="col-6 d-flex flex-wrap my-2 no-pad">
                    <img
                      className="card-img-left mr-2"
                      width={"41px"}
                      height={"41px"}
                      src={echlln}
                      alt="payLink"
                    />
                    <p
                      className="foralinkscsshere my-auto"
                      style={{ lineHeight: "25px" }}
                    >
                      Offline payments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


        </>
    )

}

export default HomeProduct;