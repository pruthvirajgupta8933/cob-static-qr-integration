import React from 'react';
import classes from "./faq.module.css"

const Faq = () => {
  return (
    <section>
      <main>
        <div className="container-fluid">
          {/* <nav>
            <h5 className="mb-5 right_side_heading">FAQ</h5>
          </nav> */}
          <div className="row justify-content-center text-center mb-5">
            <h3 className="font-weight-bold">FAQs</h3>
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
            <div className="col-md-12">
              <p>
                <a data-bs-toggle="collapse" href="#collapseExample1" role="button" aria-expanded="false" aria-controls="collapseExample1" class="text-decoration-none">
                  <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
                    <h6 class="m-0">What are the benefits of using SabPaisa?</h6>
                  </span>
                </a>
              </p>
              <div className="collapse" id="collapseExample1">
                <h6 className="font-weight-bold">With SabPaisa, you get unmatched benefits that suit all your needs. Some benefits are listed below:</h6>
                <ul>
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
              <div className="collapse" id="collapseExample2">

                <ul>
                  <li>SabPaisa charges according to industry standards for its services. </li>
                  <li>For PG- It depends on the merchant’s industry and business volumes.</li>
                  <li>For Subscription- Nominal fee for mandates and transactions as per industry norms and as agreed with the merchant</li>
                  <li>For Paylink- Nominal fee, as agreed with the merchant.</li>
                  <li>For Payout- Nominal fee, as agreed with the merchant.</li>
                </ul>
              </div>

              <p>
              <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
                <a data-bs-toggle="collapse" href="#collapseExample3" role="button" aria-expanded="false" aria-controls="collapseExample3" className="text-decoration-none">
                  <h6 class="m-0" >How do I signup for SabPaisa?</h6>
                </a>
                </span>
              </p>
              <div className="collapse" id="collapseExample3">
                <h6>To sign up for SabPaisa, visit <a href="https://sabpaisa.in/sign-up/">https://sabpaisa.in/sign-up/</a>, fill in your details, and our team will get in touch with you at the earliest.</h6>
              </div>

            </div>
            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample4" role="button" aria-expanded="false" aria-controls="collapseExample4" className="text-decoration-none">
                <h6 class="m-0">What all card Information does SabPaisa store?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample4">
              <h6>SabPaisa stores only the last four digits of a card, which is the industry standard.</h6>

            </div>
            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample5" role="button" aria-expanded="false" aria-controls="collapseExample5" className="text-decoration-none">
                <h6 class="m-0">For what purposes can the end-customer use SabPaisa?</h6>
              </a>
              </span>
            </p>
            
            <div className="collapse" id="collapseExample5">
              <ul>
                <li>Payment collection through Payment Gateway.</li>
                <li>Auto payment collection through Payment Links even without a website.</li>
                <li>Collect recurring payments through the Subscription Platform.</li>

              </ul>
            </div>
            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample6" role="button" aria-expanded="false" aria-controls="collapseExample56" className="text-decoration-none">
                <h6 class="m-0">What payment options are available in SabPaisa?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample6">
              <h6>All the modes of payments are available with SabPaia, from Debit cards, Credit Card, Wallets, UPI, Bharat QR etc. We have almost 10 lac e-cash counters that make payments convenient.</h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample7" role="button" aria-expanded="false" aria-controls="collapseExample57" className="text-decoration-none">
                <h6 class="m-0">My customer mostly uses Net banking, what’s in for me?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample7">
              <h6>SabPaisa offers Netbanking services with all major banks for the convenience of the customers.</h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample8" role="button" aria-expanded="false" aria-controls="collapseExample58" className="text-decoration-none">
                <h6 class="m-0" >Do you support International Payments?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample8">
              <h6>SabPaisa is working on getting international payments.</h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample9" role="button" aria-expanded="false" aria-controls="collapseExample9" className="text-decoration-none">
                <h6 class="m-0">Do you support mobile payments?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample9">
              <h6>Yes, SabPaisa supports mobile payments.</h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample10" role="button" aria-expanded="false" aria-controls="collapseExample10" className="text-decoration-none">
                <h6 class="m-0">Do you support partial refunds?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample10">
              <h6>Yes, we support partial refunds.</h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample11" role="button" aria-expanded="false" aria-controls="collapseExample11" className="text-decoration-none">
                <h6 class="m-0">How long does it take to go live?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample11">
              <h6>SabPaisa offers you the fastest TAT after all formalities like KYC, agreement etc is done.</h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample12" role="button" aria-expanded="false" aria-controls="collapseExample12" className="text-decoration-none">
                <h6 class="m-0">Is the payment experience customisable as per my website’s look and feel?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample12">
              <h6>No, the payment experience is not customisable as per the merchant’s website’s look and feel at this point.</h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample13" role="button" aria-expanded="false" aria-controls="collapseExample13" className="text-decoration-none">
                <h6 class="m-0">How and when will I receive the money for payments made to us?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample13">
              <h6>SabPaisa Payment Gateway is governed by the Payment and Settlement Act of RBI and payments are done to merchants within RBI prescribed TATs.</h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample14" role="button" aria-expanded="false" aria-controls="collapseExample14" className="text-decoration-none">
                <h6 class="m-0">What kind Of MIS/Reports do you provide?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample14">
              <h6>We provide a dashboard to every merchant, wherein they can do the following:</h6>
              <ul>
                <li>View/download transactions with date range updated in real-time including offline modes like cash, NEFT, RTGS etc. </li>
                <li>View/download settlements daily</li>
                <li>Transaction-based enquiry</li>
                <li>Create payment links</li>
                <li>Can also see abPaisa’s updated product catalogue </li>
              </ul>
            </div>


            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample15" role="button" aria-expanded="false" aria-controls="collapseExample15" className="text-decoration-none">
                <h6 class="m-0">What kind of customer support can I expect from SabPaisa?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample15">
              <h6>To ensure that all our merchants/clients are given 100% attention, SabPaisa assigns every merchant an Account Manager to handle any issues.</h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample16" role="button" aria-expanded="false" aria-controls="collapseExample16" className="text-decoration-none">
                <h6 class="m-0">Are You PCI DSS Certified?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample16">
              <h6>Yes, we are PCI-DSS certified.</h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample17" role="button" aria-expanded="false" aria-controls="collapseExample17" className="text-decoration-none">
                <h6 class="m-0"> How will you guarantee my data privacy?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample17">
              <h6>SabPaisa uses the HTTPS extension that protects the integrity and confidentiality of data for secure connections. We are also PCI-DSS certified and adhere to RBI guidelines of data privacy.</h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample18" role="button" aria-expanded="false" aria-controls="collapseExample18" className="text-decoration-none">
                <h6 class="m-0" >What all documents are required for signing up with SabPaisa?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample18">
              <h6>It varies with the constitution of the firm. Broadly, documents for business proofs, signatory individual’s proofs, bank statements and cancelled cheques along with GST registration.

              </h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample19" role="button" aria-expanded="false" aria-controls="collapseExample19" className="text-decoration-none">
                <h6 class="m-0">Do you have Sandbox where I can test the integration before going live with SabPaisa?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample19">
              <h6>Yes, SabPaisa has a Sandbox where one can test the integration before going live with SabPaisa.

              </h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample20" role="button" aria-expanded="false" aria-controls="collapseExample20" className="text-decoration-none">
                <h6 class="m-0">Toggle TitleHow can I contact SabPaisa?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample20">
              <h6>For sales enquiries signup with your details at https://sabpaisa.in/sign-up/ and our Sales Team will get in touch with you.

              </h6>
            </div>

            <p>
            <span class="d-inline-flex align-items-center">
                    <i class="fa fa-caret-right me-2"></i>
              <a data-bs-toggle="collapse" href="#collapseExample21" role="button" aria-expanded="false" aria-controls="collapseExample21" className="text-decoration-none">
                <h6 class="m-0">Where do I seek support from SabPaisa?</h6>
              </a>
              </span>
            </p>
            <div className="collapse" id="collapseExample21">
              <h6>For support, write to us at support@sabpaisa.in or call us at 011-41733223

              </h6>
            </div>
</div>

        </div>
      </main>
    </section>

  );
};

export default Faq;
