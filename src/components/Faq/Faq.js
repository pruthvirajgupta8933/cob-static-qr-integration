import React from 'react';
import classes from './faq.module.css'
const Faq = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const collapseElements = [];
    const linkElements = [];

    for (let i = 1; i <= 22; i++) {
      const collapseElement = document.getElementById(`collapseExample${i}`);
      const linkElement = document.querySelector(`[href="#collapseExample${i}"]`);
      
      collapseElements.push(collapseElement);
      linkElements.push(linkElement);
    }
    
   linkElements.forEach((link, index) => {
      link.addEventListener('click', () => {
        collapseElements[index].classList.toggle('show');
        collapseElements.forEach((collapse, idx) => {
          if (idx !== index) {
            collapse.classList.remove('show');
          }
        });
      });
    });
    
  });
 

  
  
  return (
    <>
    <section>
      <main>
        <div className="container-fluid mb-5">
          <div className="row justify-content-center text-center mb-5">
            <h3 className="font-weight-bold">FAQs/Help</h3>
            <div className="col-lg-10">
              <p>
                SabPaisa is a rapidly growing FinTech company that has developed the World’s First API
                Driven Unified Payment Platform. SabPaisa has its headquarters in New Delhi, with one
                corporate office in Kolkata and seven other regional offices. SabPaisa’s payments and
                collection application suite – white labelled to multiple public and private banks, including
                BOI, BOB, IDFC First & Indian Bank – has already processed more than INR 46.3 Billion, a
                figure that will grow exponentially over the next several months.
              </p>
            </div>

          </div>
          <div className="my-4"></div>
          <div className="row">
            <div className="col-md-12 border p-2 ">
              <p>
                <a data-bs-toggle="collapse" href="#collapseExample1" role="button" aria-expanded="false" aria-controls="collapseExample1" class="text-decoration-none">
                  <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
                    <h6 class="m-0">What are the benefits of using SabPaisa?</h6>
                  </span>
                </a>
              </p>
              <div
               className="collapse ml-3" 
             
               id="collapseExample1">
                <p
                 className="font-weight-bold"
                // className={`font-weight-bold ${classes.font_size}`}
                 >With SabPaisa, you get unmatched benefits that suit all your needs. Some benefits are listed below:</p>
                <ul  className={` ${classes.font_size}`}>
                  <li>Maximum Online & Offline Modes</li>
                  <li>Top Notch Security</li>
                  <li>Advanced API</li>
                  <li>Easy Integration</li>
                  <li>One Integration for Online/Offline Payments</li>
                  <li>Best in class Support</li>
                  <li>One of the Highest Success Rates</li>
                </ul>
              </div>

              <p>
                <a data-bs-toggle="collapse" href="#collapseExample2" role="button" aria-expanded="false" aria-controls="collapseExample2" className="text-decoration-none">
                  <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
                    <h6 class="m-0">Is SabPaisa free or are there any charges? What are the charges taken by SabPaisa for various services?</h6>
                  </span>
                </a>
              </p>
              <div className="collapse ml-3" id="collapseExample2">

                <ul className={`${classes.font_size}`}>
                  <li>SabPaisa charges according to industry standards for its services. </li>
                  <li>For PG- It depends on the merchant’s industry and business volumes.</li>
                  <li>For Subscription- Nominal fee for mandates and transactions as per industry norms and as agreed with the merchant</li>
                  <li>For Paylink- Nominal fee, as agreed with the merchant.</li>
                  <li>For Payout- Nominal fee, as agreed with the merchant.</li>
                </ul>
              </div>

              <p>
              <a data-bs-toggle="collapse" href="#collapseExample3" role="button" aria-expanded="false" aria-controls="collapseExample3" className="text-decoration-none">
                <span class="d-inline-flex align-items-center">
                  <i class="fa fa-caret-right me-2"></i>
                  
                    <h6 class="m-0" >How do I signup for SabPaisa?</h6>
                  
                </span>
                </a>
              </p>
              <div className="collapse ml-3" id="collapseExample3">
                <p className={` ${classes.font_size}`}>To sign up for SabPaisa, visit <a href="https://sabpaisa.in/sign-up/">https://sabpaisa.in/sign-up/</a>, fill in your details, and our team will get in touch with you at the earliest.</p>
              </div>

           

            <p >
            <a data-bs-toggle="collapse" href="#collapseExample4" role="button" aria-expanded="false" aria-controls="collapseExample4" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0">What all card Information does SabPaisa store?</h6>
                
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample4">
              <p className={` ${classes.font_size}`}>SabPaisa stores only the last four digits of a card, which is the industry standard.</p>
            </div>
         <p>
         <a data-bs-toggle="collapse" href="#collapseExample5" role="button" aria-expanded="false" aria-controls="collapseExample5" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0">For what purposes can the end-customer use SabPaisa?</h6>
                
              </span>
              </a>
            </p>

            <div className="collapse ml-3" id="collapseExample5">
              <ul className={` ${classes.font_size}`}>
                <li>Payment collection through Payment Gateway.</li>
                <li >Auto payment collection through Payment Links even without a website.</li>
                <li>Collect recurring payments through the Subscription Platform.</li>

              </ul>
            </div>
            <p>
            <a data-bs-toggle="collapse" href="#collapseExample6" role="button" aria-expanded="false" aria-controls="collapseExample56" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0">What payment options are available in SabPaisa?</h6>
                
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample6">
              <p className={` ${classes.font_size}`}>All the modes of payments are available with SabPaia, from Debit cards, Credit Card, Wallets, UPI, Bharat QR etc. We have almost 10 lac e-cash counters that make payments convenient.</p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample7" role="button" aria-expanded="false" aria-controls="collapseExample57" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0">My customer mostly uses Net banking, what’s in for me?</h6>
               
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample7">
              <p className={` ${classes.font_size}`}>SabPaisa offers Netbanking services with all major banks for the convenience of the customers.</p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample8" role="button" aria-expanded="false" aria-controls="collapseExample58" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
               
                  <h6 class="m-0" >Do you support International Payments?</h6>
                
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample8">
              <p className={` ${classes.font_size}`}>SabPaisa is working on getting international payments.</p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample9" role="button" aria-expanded="false" aria-controls="collapseExample9" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0">Do you support mobile payments?</h6>
                
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample9">
              <p className={` ${classes.font_size}`}>Yes, SabPaisa supports mobile payments.</p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample10" role="button" aria-expanded="false" aria-controls="collapseExample10" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0">Do you support partial refunds?</h6>
               
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample10">
              <p className={` ${classes.font_size}`}>Yes, we support partial refunds.</p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample11" role="button" aria-expanded="false" aria-controls="collapseExample11" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
               
                  <h6 class="m-0">How long does it take to go live?</h6>
               
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample11">
              <p className={` ${classes.font_size}`}>SabPaisa offers you the fastest TAT after all formalities like KYC, agreement etc is done.</p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample12" role="button" aria-expanded="false" aria-controls="collapseExample12" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0">Is the payment experience customisable as per my website’s look and feel?</h6>
               
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample12">
              <p className={` ${classes.font_size}`}>No, the payment experience is not customisable as per the merchant’s website’s look and feel at this point.</p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample13" role="button" aria-expanded="false" aria-controls="collapseExample13" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0">How and when will I receive the money for payments made to us?</h6>
                
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample13">
              <p className={` ${classes.font_size}`}>SabPaisa Payment Gateway is governed by the Payment and Settlement Act of RBI and payments are done to merchants within RBI prescribed TATs.</p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample14" role="button" aria-expanded="false" aria-controls="collapseExample14" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0">What kind Of MIS/Reports do you provide?</h6>
                
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample14">
              <p className='font-weight-bold'>We provide a dashboard to every merchant, wherein they can do the following:</p>
              <ul className={` ${classes.font_size}`}>
                <li>View/download transactions with date range updated in real-time including offline modes like cash, NEFT, RTGS etc. </li>
                <li>View/download settlements daily</li>
                <li>Transaction-based enquiry</li>
                <li>Create payment links</li>
                <li>Can also see abPaisa’s updated product catalogue </li>
              </ul>
            </div>


            <p>
            <a data-bs-toggle="collapse" href="#collapseExample15" role="button" aria-expanded="false" aria-controls="collapseExample15" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
               
                  <h6 class="m-0">What kind of customer support can I expect from SabPaisa?</h6>
               
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample15">
              <p className={` ${classes.font_size}`}>To ensure that all our merchants/clients are given 100% attention, SabPaisa assigns every merchant an Account Manager to handle any issues.</p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample16" role="button" aria-expanded="false" aria-controls="collapseExample16" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0">Are You PCI DSS Certified?</h6>
               
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample16">
              <p className={` ${classes.font_size}`}>Yes, we are PCI-DSS certified.</p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample17" role="button" aria-expanded="false" aria-controls="collapseExample17" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0"> How will you guarantee my data privacy?</h6>
               
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample17">
              <p className={` ${classes.font_size}`}>SabPaisa uses the HTTPS extension that protects the integrity and confidentiality of data for secure connections. We are also PCI-DSS certified and adhere to RBI guidelines of data privacy.</p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample18" role="button" aria-expanded="false" aria-controls="collapseExample18" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0" >What all documents are required for signing up with SabPaisa?</h6>
                
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample18">
              <p className={` ${classes.font_size}`}>It varies with the constitution of the firm. Broadly, documents for business proofs, signatory individual’s proofs, bank statements and cancelled cheques along with GST registration.

              </p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample19" role="button" aria-expanded="false" aria-controls="collapseExample19" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0">Do you have Sandbox where I can test the integration before going live with SabPaisa?</h6>
               
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample19">
              <p className={` ${classes.font_size}`}>Yes, SabPaisa has a Sandbox where one can test the integration before going live with SabPaisa.

              </p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample20" role="button" aria-expanded="false" aria-controls="collapseExample20" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
               
                  <h6 class="m-0">How can I contact SabPaisa?</h6>
                
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample20">
              <p className={` ${classes.font_size}`}>For sales enquiries signup with your details at https://sabpaisa.in/sign-up/ and our Sales Team will get in touch with you.

              </p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample21" role="button" aria-expanded="false" aria-controls="collapseExample21" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
               
                  <h6 class="m-0">Where do I seek support from SabPaisa?</h6>
               
              </span>
              </a>
            </p>
            <div className="collapse mb-5" id="collapseExample21">
              <p className={` ${classes.font_size}`}>For support, write to us at <a href="support@sabpaisa.in" target="_blank">support@sabpaisa.in</a> or call us at 011-41733223</p>
            </div>

            <p>
            <a data-bs-toggle="collapse" href="#collapseExample22" role="button" aria-expanded="false" aria-controls="collapseExample22" className="text-decoration-none">
              <span class="d-inline-flex align-items-center">
                <i class="fa fa-caret-right me-2"></i>
                
                  <h6 class="m-0">How to calculate TSR (Transaction Success Rate)?</h6>
               
              </span>
              </a>
            </p>
            <div className="collapse ml-3" id="collapseExample22">
              <p className={` ${classes.font_size}`}>TSR = (Total Success Transactions + Total Failed Transactions)/ Total Transactions

              </p>
            </div>
          </div>

        
         

          
          </div>
        </div>
      </main>
    </section></>
    

  );
};

export default Faq;
