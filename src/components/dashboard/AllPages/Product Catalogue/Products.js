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

import API_URL from "../../../../config";
import { axiosInstanceJWT } from "../../../../utilities/axiosInstance";

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
    axiosInstanceJWT
      .get(API_URL.PRODUCT_DETAILS)
      .then((resp) => {
        const data = resp.data.ProductDetail;
        setSpinner(false);

        setProduct(data);
      })
      .catch((err) => console.log(err));
  }, []);
  

  return (
    <section className="ant-layout">
      <div>
        <NavBar />

      </div>
      <main className="gx-layout-content ant-layout-content NunitoSans-Regular">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-md-auto">
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
        <div className="container-fluid row">
          {spinner && <span className="spinner-border" role="status"></span>}

          {product.map((Products, i) => (
            <div className="col-sm-12 col-md-12 col-lg-6" key={i}>
              <div className="card mt-0">
                <div className="card-body-">
                  <h5 className="card-title prod-header">
                    <img
                      className="card-img-left"
                      src={iconImg[i]}
                      alt="onlinepay"
                      width={40}
                    />
                    &nbsp;
                    {Products.application_name}
                  </h5>
                  <p className="card-text prod-content truncate">
                    {" "}
                    {Products.application_description}
                  </p>
                  <div>
                    <p className="prod-read">
                      {" "}
                      <Link
                        to={`/dashboard/sabpaisa-pricing/${Products.application_id}/${Products.application_name}`}
                      >
                        Read More & Pricing &nbsp;{">"}
                        {">"}
                      </Link>
                    </p>
                  </div>
                
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </section>
  );
};

export default Products;
