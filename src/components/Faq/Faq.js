import React, { useState } from 'react';
import classes from './faq.module.css'
import FaqCollapse from './FaqCollapse';
const Faq = () => {
  const [openCollapse, setOpenCollapse] = useState(0);

  const handleToggle = (index) => {
      setOpenCollapse(openCollapse === index ? null : index);
  };
  const faqData = [
    {
      title: "What are the benefits of using SabPaisa?",
      content: <>
        <p className="font-weight-bold m-3">With SabPaisa, you get unmatched benefits that suit all your needs. Some benefits are listed below:</p>
        <ul className={` ${classes.font_size}`}>
          <li>Maximum Online & Offline Modes</li>
          <li>Top Notch Security</li>
          <li>Advanced API</li>
          <li>Easy Integration</li>
          <li>One Integration for Online/Offline Payments</li>
          <li>Best in class Support</li>
          <li>One of the Highest Success Rates</li>
        </ul>
      </>
    },
    {
      title: "Is SabPaisa free or are there any charges? What are the charges taken by SabPaisa for various services?",
      content:
        <ul className={` ${classes.font_size} m-3`}>
          <li>SabPaisa charges according to industry standards for its services.</li>
          <li>For PG- It depends on the merchant’s industry and business volumes.</li>
          <li>For Subscription- Nominal fee for mandates and transactions as per industry norms and as agreed with the merchant.</li>
          <li>For Paylink- Nominal fee, as agreed with the merchant.</li>
          <li>For Payout- Nominal fee, as agreed with the merchant.</li>
        </ul>
      
    },
    {
      title: "How do I signup for SabPaisa?",
      content: 
        <p className={` ${classes.font_size} m-3`}>To sign up for SabPaisa, visit <a href="https://sabpaisa.in/sign-up/">https://sabpaisa.in/sign-up/</a>, fill in your details, and our team will get in touch with you at the earliest.</p>
      
    },
    {
      title: "What all card Information does SabPaisa store?",
      content: 
        <p className={` ${classes.font_size} m-3`}>SabPaisa stores only the last four digits of a card, which is the industry standard.</p>
     
    },
    {
      title: "For what purposes can the end-customer use SabPaisa?",
      content: 
        <ul className={` ${classes.font_size} m-3`}>
          <li>Payment collection through Payment Gateway.</li>
          <li>Auto payment collection through Payment Links even without a website.</li>
          <li>Collect recurring payments through the Subscription Platform.</li>
        </ul>
      
    },
    {
      title: "What payment options are available in SabPaisa?",
      content: 
        <p className={` ${classes.font_size} m-3`}>All the modes of payments are available with SabPaia, from Debit cards, Credit Card, Wallets, UPI, Bharat QR etc. We have almost 10 lac e-cash counters that make payments convenient.</p>
      
    },
    {
      title: "My customer mostly uses Net banking, what’s in for me?",
      content: 
        <p className={` ${classes.font_size} m-3`}>SabPaisa offers Netbanking services with all major banks for the convenience of the customers.</p>
      
    },
    {
      title: "Do you support International Payments?",
      content: 
        <p className={` ${classes.font_size} m-3`}>SabPaisa is working on getting international payments.</p>
      
    },
    {
      title: "Do you support mobile payments?",
      content: 
        <p className={` ${classes.font_size} m-3`}>Yes, SabPaisa supports mobile payments.</p>
      
    },
    {
      title: "Do you support partial refunds?",
      content: 
        <p className={` ${classes.font_size} m-3`}>Yes, we support partial refunds.</p>
      
    },
    {
      title: "How long does it take to go live?",
      content:
        <p className={` ${classes.font_size} m-3`}>SabPaisa offers you the fastest TAT after all formalities like KYC, agreement etc is done.</p>
      
    },
    {
      title: "Is the payment experience customisable as per my website’s look and feel?",
      content: 
        <p className={` ${classes.font_size} m-3`}>No, the payment experience is not customisable as per the merchant’s website’s look and feel at this point.</p>
     
    },
    {
      title: "How and when will I receive the money for payments made to us?",
      content: 
        <p className={` ${classes.font_size} m-3`}>SabPaisa Payment Gateway is governed by the Payment and Settlement Act of RBI and payments are done to merchants within RBI prescribed TATs.</p>
      
    },
    {
      title: "What kind Of MIS/Reports do you provide?",
      content: <>
        <p className='font-weight-bold m-3'>We provide a dashboard to every merchant, wherein they can do the following:</p>
        <ul className={` ${classes.font_size}`}>
          <li>View/download transactions with date range updated in real-time including offline modes like cash, NEFT, RTGS etc. </li>
          <li>View/download settlements daily</li>
          <li>Transaction-based enquiry</li>
          <li>Create payment links</li>
          <li>Can also see SabPaisa’s updated product catalogue </li>
        </ul>
      </>
    },
    {
      title: "What kind of customer support can I expect from SabPaisa?",
      content: 
        <p className={` ${classes.font_size} m-3`}>To ensure that all our merchants/clients are given 100% attention, SabPaisa assigns every merchant an Account Manager to handle any issues.</p>
      
    },
    {
      title: "Are You PCI DSS Certified?",
      content: 
        <p className={` ${classes.font_size} m-3`}>Yes, we are PCI-DSS certified.</p>
      
    },
    {
      title: "How will you guarantee my data privacy?",
      content: 
        <p className={` ${classes.font_size} m-3`}>SabPaisa uses the HTTPS extension that protects the integrity and confidentiality of data for secure connections. We are also PCI-DSS certified and adhere to RBI guidelines of data privacy.</p>
      
    },
    {
      title: "What all documents are required for signing up with SabPaisa?",
      content: 
        <p className={` ${classes.font_size} m-3`}>It varies with the constitution of the firm. Broadly, documents for business proofs, signatory individual’s proofs, bank statements and cancelled cheques along with GST registration.</p>
      
    },
    {
      title: "Do you have Sandbox where I can test the integration before going live with SabPaisa?",
      content: 
        <p className={` ${classes.font_size} m-3`}>Yes, SabPaisa has a Sandbox where one can test the integration before going live with SabPaisa. </p>
      
    },
    {
      title: "How can I contact SabPaisa?",
      content: 
        <p className={` ${classes.font_size} m-3`}>For sales enquiries, signup with your details at https://sabpaisa.in/sign-up/ and our Sales Team will get in touch with you.</p>
      
    },
    {
      title: "Where do I seek support from SabPaisa?",
      content: 
        <p className={` ${classes.font_size} m-3`}>For support, write to us at <a href="support@sabpaisa.in" target="_blank">support@sabpaisa.in</a> or call us at 011-41733223</p>
      
    },
    {
      title: "How to calculate TSR (Transaction Success Rate)?",
      content:
        <p className={` ${classes.font_size} m-3`}>Transaction success rate (TSR) is calculated by dividing the total number of processed (success+business declined) transactions by the total number of attempted transactions over a given time period. For example, if SabPaisa processed 100 transactions, and 82 were successful & 16 were failed due to business decline, then your TSR would be 98%.</p>
      
    },
  ];


 

  return (
   
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
              <div className="">
                {faqData.map((faq, index) => (
                  <FaqCollapse
                    key={index}
                    title={faq.title}
                    formContent={faq.content}
                    isOpen={openCollapse === index}
                    onToggle={() => handleToggle(index)}
                  />
                ))}
              </div>
            </div>
           
          </div>
        </main>
      </section>

   


  );
};

export default Faq;
