import React from 'react'
import { History } from '@mui/icons-material';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import SabPaisaPricing from './SabPaisaPricing';
import NavBar from '../../NavBar/NavBar';
import { Link } from 'react-router-dom'
import './product.css'
import onlinePayment from "../../../../assets/images/onlinePayment.png"
import paymentLink from "../../../../assets/images/paymentLink.png"
import subscribe from "../../../../assets/images/subscribe.png"
import payout from "../../../../assets/images/payout.png"
import qwikform from "../../../../assets/images/qwikform.png"
import echallan from "../../../../assets/images/echallan.png"
import epos from "../../../../assets/images/epos.png"
import linkPaisa from "../../../../assets/images/linkPaisa.png"


const Products = () => {

    const history = useHistory();

    
  return (
    <section className="ant-layout">
    <div>
      <NavBar />
      {/*  <div className="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span className="btn">Upload Here</span></span></div>*/}
    </div>
    <main className="gx-layout-content ant-layout-content">

    <div class="container">
  <div class="row justify-content-md-center">
    
    <div class="col-md-auto">
    
   
    <h1 className="text-centre prodHeader" style={{fontSize:"xx-large"}}>Explore wide range of our Products</h1>
    <p className="prodpara">
    We offer a very competitive pricing to match your business needs. Sign up now to get started  </p>           
    </div>
    </div>
    </div>
    <div class="row">
  <div class="col-sm-6 col-md-6 col-lg-6">
    <div class="card" style={{width:"31rem",height:"17rem"}} >
      <div class="card-body">
        <h5 class="card-title prod-header">  <img class="card-img-left" src={onlinePayment} alt="onlinepay" width={40}/> &nbsp;Online and Offline Payment Gateway</h5>
        <p class="card-text prod-content">SabPaisa is the World’s 1st API Driven Unified Payment Experience Platform having the Best Payment Gateway in India. Collect, transfer & refund your payments online & offline. Get the best success rates with maximum payment modes available including Debit cards, Credit Card, Wallets, UPI, Bharat QR, etc. The Hybrid PG helps businesses collect payments from all the clients and consumers, urban or rural, young or old, online or offline, without worrying about consumer payment behaviour.</p>
    
    <div >
     <p class="prod-read"><Link to='/dashboard/sabpaisa-pricing'>Read More & Pricing  &nbsp;{'>'}{'>'}</Link></p> 
    </div>

      </div>
    </div>
  </div>
  <div class="col-sm-6 col-md-6 col-lg-6">
    <div class="card" style={{width:"32rem"}}>
      <div class="card-body">
        <h5 class="card-title prod-header"><img class="card-img-left" src={paymentLink} alt="payLink" width={40}/>&nbsp;Payment Links</h5>
        <p class="card-text prod-content">Payment Links is the world’s first Unified link-based payment method, for payment collections with the help of links for a wide range of payment modes. Collect payments even without a website through easy payment links. Payment Links offers password-protected and shortened payment links for seamless payment collection.</p>
       <div>
     <p class="prod-read"><Link to='/dashboard/sabpaisa-pricing'>Read More & Pricing  &nbsp;{'>'}{'>'}</Link></p> 
     </div>
   
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-sm-6 col-md-6 col-lg-6">
    <div class="card" style={{width:"31rem"}}>
      <div class="card-body">
        <h5 class="card-title prod-header"><img class="card-img-left" src={subscribe} alt="payLink" width={40}/>&nbsp;Subscriptions</h5>
        <p class="card-text prod-content">Subscriptions is a unique mandate processing and payment collection platform that offers recurring subscription payments through e-NACH/e-mandates for more than 50 banks to merchants. It is a single platform for processing all modes of payment mandates, viz. NACH, Net Banking, Debit Card, Credit Card, UPI.</p>
<div>
     <p class="prod-read"><Link to='/dashboard/sabpaisa-pricing'>Read More & Pricing  &nbsp;{'>'}{'>'}</Link></p> 
     </div>
   
      </div>
    </div>
  </div>
  <div class="col-sm-6 col-md-6 col-lg-6">
    <div class="card" style={{width:"32rem"}}>
      <div class="card-body">
      <h5 class="card-title prod-header"><img class="card-img-left" src={payout} alt="payLink" width={40}/>&nbsp;Payouts</h5>
        <p class="card-text prod-content">Payouts is  India’s first Payout Aggregator for businesses that seek to pay out to their Partners/Vendors/Customers with complete control over the transactions and a system with the easiest reconciliation and settlement. With Payouts, merchants do not need to deposit money in the aggregator’s account or a third-party wallet. Merchants can execute the payout from their accounts.</p>
        <div>
     <p class="prod-read"><Link to='/dashboard/sabpaisa-pricing'>Read More & Pricing  &nbsp;{'>'}{'>'}</Link></p> 
     </div>
    
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-sm-6 col-md-6 col-lg-6">
    <div class="card" style={{width:"31rem",height:"16rem"}}>
      <div class="card-body">
      <h5 class="card-title prod-header"><img class="card-img-left" src={qwikform} alt="myform" width={40}/>&nbsp;QwikForm</h5>
        <p class="card-text prod-content">QwikForms is one of India’s most advanced dynamic online form builders which can be used to create workflows no matter how complex. In addition, when paired with Hybrid Payment Gateway and LinkPaisa, QwikForms becomes India’s most powerful, robust, and secure payment platform capable of creating and deploying any online payment form within minutes and hours.</p>
        <div>
     <p class="prod-read"><Link to='/dashboard/sabpaisa-pricing'>Read More & Pricing  &nbsp;{'>'}{'>'}</Link></p> 
     </div>
      </div>
    </div>
  </div>
  <div class="col-sm-6 col-md-6 col-lg-6">
    <div class="card" style={{width:"32rem"}}>
      <div class="card-body">
      <h5 class="card-title prod-header"><img class="card-img-left" src={echallan} alt="echallan" width={40}/>&nbsp;E-Challan</h5>
        <p class="card-text prod-content">E-Challan is the world’s first e-offline payments platform, a unique innovation by SabPaisa consisting of e-offline modes like e-cash, e-NEFT, e-RTGS, and e-IMPS. It enables business houses to collect offline payments through more than 10 Lac cash counters across India.</p>
        <div>
     <p class="prod-read"><Link to='/dashboard/sabpaisa-pricing'>Read More & Pricing  &nbsp;{'>'}{'>'}</Link></p> 
    </div>

      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-sm-6 col-md-6 col-lg-6">
    <div class="card" style={{width:"31rem",height:"16rem"}} >
      <div class="card-body">
      <h5 class="card-title prod-header"><img class="card-img-left" src={epos} alt="epos" width={40}/>&nbsp;E-POS App</h5>
        <p class="card-text prod-content">The E-POS App is an all-in-one advanced app that provides all the data regarding the user’s payments, settlements, refunds, collections, customer support and official communication with end-to-end control over everything.es of payment mandates, viz. NACH, Net Banking, Debit Card, Credit Card, UPI.</p>
     <div>
     <p class="prod-read"><Link to='/dashboard/sabpaisa-pricing'>Read More & Pricing  &nbsp;{'>'}{'>'}</Link></p> 
    </div>
   
      </div>
    </div>
  </div>
  <div class="col-sm-6 col-md-6 col-lg-6">
    <div class="card" style={{width:"32rem"}}>
      <div class="card-body">
      <h5 class="card-title prod-header"><img class="card-img-left" src={linkPaisa} alt="linkPaisa" width={40}/>&nbsp;LinkPaisa</h5>
        <p class="card-text prod-content">LinkPaisa is a complete and reliable link management platform. LinkPaisa aggregates all modes of the messaging platform – Whatsapp, e-Mail, Facebook, SMS, Telegram etc. You can also customise the content of the message.</p>
       <div>
     <p class="prod-read"><Link to='/dashboard/sabpaisa-pricing'>Read More & Pricing  &nbsp;{'>'}{'>'}</Link></p> 
    </div>
  
      </div>
    </div>
  </div>
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


export default Products