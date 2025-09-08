import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./product.css";
import onlinePayment from "../../../../assets/images/onlinePayment.png";
import paymentLink from "../../../../assets/images/paymentLink.png";
import subscribe from "../../../../assets/images/subscribe.png";
import payout from "../../../../assets/images/payout.png";
import qwikform from "../../../../assets/images/qwikform.png";
import echallan from "../../../../assets/images/echallan.png";
import epos from "../../../../assets/images/epos.png";
import linkPaisa from "../../../../assets/images/linkPaisa.png";
import { productDetails } from "../../../../slices/persist-slice/persistSlice";

import { uniqueId } from "lodash";
import { Link } from "react-router-dom/cjs/react-router-dom.min";



const Products = () => {

  const dispatch = useDispatch()
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
  const { productDetailsData: products } = useSelector(state => state.commonPersistReducer);
  const { isLoading } = useSelector((state) => state.commonPersistReducer)


  useEffect(() => {
    dispatch(productDetails())
      .catch((err) => console.log(err));
  }, []);


  return (
    <section className="ant-layout">
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
        <div className="container-fluid row justify-content-md-center">
          {isLoading && <div className="row justify-content-md-center"><span className="spinner-border" role="status"></span></div>}

          {products?.map((Products, i) => (
            <div className="col-sm-12 col-md-12 col-lg-6" key={uniqueId()}>
              <div className="card p-3 mt-2">
                <div className="card-body">
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
                  <p className="card-text">

                    {Products.application_description}
                  </p>
                  <div>
                    <p className="prod-read">

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
