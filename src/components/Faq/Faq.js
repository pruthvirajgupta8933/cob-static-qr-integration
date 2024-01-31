import React, { useState } from 'react';
import classes from './faq.module.css'
import FaqCollapse from './FaqCollapse';
const Faq = () => {
  const [openCollapse, setOpenCollapse] = useState(1);

  const handleToggle = (index) => {
    setOpenCollapse(index === openCollapse ? 0 : index);
  };
  
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
              <div className="">
                <FaqCollapse
                  title="What are the benefits of using SabPaisa?"
                  formContent={
                    <>
                      <p
                        className="font-weight-bold"
                      // className={`font-weight-bold ${classes.font_size}`}
                      >With SabPaisa, you get unmatched benefits that suit all your needs. Some benefits are listed below:</p>
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
                  }
                  isOpen={openCollapse === 1}
                  onToggle={() => handleToggle(1)}

                />

                <FaqCollapse
                  title="Is SabPaisa free or are there any charges? What are the charges taken by SabPaisa for various services?"
                  formContent={
                    <>
                      <ul className={`${classes.font_size}`}>
                        <li>SabPaisa charges according to industry standards for its services. </li>
                        <li>For PG- It depends on the merchant’s industry and business volumes.</li>
                        <li>For Subscription- Nominal fee for mandates and transactions as per industry norms and as agreed with the merchant.</li>
                        <li>For Paylink- Nominal fee, as agreed with the merchant.</li>
                        <li>For Payout- Nominal fee, as agreed with the merchant.</li>
                      </ul>
                    </>
                  }
                  isOpen={openCollapse === 2}
                  onToggle={() => handleToggle(2)}
                />

                <FaqCollapse
                  title="How do I signup for SabPaisa?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>To sign up for SabPaisa, visit <a href="https://sabpaisa.in/sign-up/">https://sabpaisa.in/sign-up/</a>, fill in your details, and our team will get in touch with you at the earliest.</p>

                  </>}
                  isOpen={openCollapse === 3}
                  onToggle={() => handleToggle(3)}

                />

                <FaqCollapse
                  title="What all card Information does SabPaisa store?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>SabPaisa stores only the last four digits of a card, which is the industry standard.</p>
                  </>}
                  isOpen={openCollapse === 4}
                  onToggle={() => handleToggle(4)}
                />

                <FaqCollapse
                  title="For what purposes can the end-customer use SabPaisa?"
                  formContent={<>
                    <ul className={` ${classes.font_size}`}>
                      <li>Payment collection through Payment Gateway.</li>
                      <li >Auto payment collection through Payment Links even without a website.</li>
                      <li>Collect recurring payments through the Subscription Platform.</li>

                    </ul>

                  </>}
                  isOpen={openCollapse === 5}
                  onToggle={() => handleToggle(5)}
                />
                <FaqCollapse
                  title="What payment options are available in SabPaisa?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>All the modes of payments are available with SabPaia, from Debit cards, Credit Card, Wallets, UPI, Bharat QR etc. We have almost 10 lac e-cash counters that make payments convenient.</p>
                  </>}
                  isOpen={openCollapse === 6}
                  onToggle={() => handleToggle(6)}
                />
                <FaqCollapse
                  title="My customer mostly uses Net banking, what’s in for me?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>SabPaisa offers Netbanking services with all major banks for the convenience of the customers.</p>
                  </>}
                  isOpen={openCollapse === 7}
                  onToggle={() => handleToggle(7)}
                />
                <FaqCollapse
                  title="Do you support International Payments?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>SabPaisa is working on getting international payments.</p>
                  </>}
                  isOpen={openCollapse === 8}
                  onToggle={() => handleToggle(8)}
                />
                <FaqCollapse
                  title="Do you support mobile payments?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>Yes, SabPaisa supports mobile payments.</p>
                  </>
                  }
                  isOpen={openCollapse === 9}
                  onToggle={() => handleToggle(9)}

                />
                <FaqCollapse
                  title="Do you support partial refunds?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>Yes, we support partial refunds.</p>
                  </>}
                  isOpen={openCollapse === 10}
                  onToggle={() => handleToggle(10)}
                />
                <FaqCollapse
                  title="How long does it take to go live?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>SabPaisa offers you the fastest TAT after all formalities like KYC, agreement etc is done.</p>
                  </>}
                  isOpen={openCollapse === 11}
                  onToggle={() => handleToggle(11)}
                />
                <FaqCollapse
                  title="Is the payment experience customisable as per my website’s look and feel?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>No, the payment experience is not customisable as per the merchant’s website’s look and feel at this point.</p>
                  </>}
                  isOpen={openCollapse === 12}
                  onToggle={() => handleToggle(12)}
                />

                <FaqCollapse
                  title="How and when will I receive the money for payments made to us?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>SabPaisa Payment Gateway is governed by the Payment and Settlement Act of RBI and payments are done to merchants within RBI prescribed TATs.</p>
                  </>}
                  isOpen={openCollapse === 13}
                  onToggle={() => handleToggle(13)}
                />
                <FaqCollapse
                  title="What kind Of MIS/Reports do you provide?"
                  formContent={<>
                    <p className='font-weight-bold'>We provide a dashboard to every merchant, wherein they can do the following:</p>
                    <ul className={` ${classes.font_size}`}>
                      <li>View/download transactions with date range updated in real-time including offline modes like cash, NEFT, RTGS etc. </li>
                      <li>View/download settlements daily</li>
                      <li>Transaction-based enquiry</li>
                      <li>Create payment links</li>
                      <li>Can also see SabPaisa’s updated product catalogue </li>
                    </ul></>}
                  isOpen={openCollapse === 14}
                  onToggle={() => handleToggle(14)}
                />

                <FaqCollapse
                  title="What kind of customer support can I expect from SabPaisa?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>To ensure that all our merchants/clients are given 100% attention, SabPaisa assigns every merchant an Account Manager to handle any issues.</p>
                  </>}
                  isOpen={openCollapse === 15}
                  onToggle={() => handleToggle(15)}
                />

                <FaqCollapse
                  title="Are You PCI DSS Certified?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>Yes, we are PCI-DSS certified.</p>
                  </>}
                  isOpen={openCollapse === 16}
                  onToggle={() => handleToggle(16)}
                />
                <FaqCollapse
                  title="How will you guarantee my data privacy?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>SabPaisa uses the HTTPS extension that protects the integrity and confidentiality of data for secure connections. We are also PCI-DSS certified and adhere to RBI guidelines of data privacy.</p>
                  </>}
                  isOpen={openCollapse === 17}
                  onToggle={() => handleToggle(17)}

                />

                <FaqCollapse
                  title="What all documents are required for signing up with SabPaisa?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>It varies with the constitution of the firm. Broadly, documents for business proofs, signatory individual’s proofs, bank statements and cancelled cheques along with GST registration.</p>

                  </>}
                  isOpen={openCollapse === 18}
                  onToggle={() => handleToggle(18)}
                />
                <FaqCollapse
                  title="Do you have Sandbox where I can test the integration before going live with SabPaisa?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>Yes, SabPaisa has a Sandbox where one can test the integration before going live with SabPaisa. </p>

                  </>}
                  isOpen={openCollapse === 19}
                  onToggle={() => handleToggle(19)} />

                <FaqCollapse
                  title="How can I contact SabPaisa?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>For sales enquiries, signup with your details at https://sabpaisa.in/sign-up/ and our Sales Team will get in touch with you.
                    </p>
                  </>}
                  isOpen={openCollapse === 20}
                  onToggle={() => handleToggle(20)}
                />
                <FaqCollapse
                  title="Where do I seek support from SabPaisa?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>For support, write to us at <a href="support@sabpaisa.in" target="_blank">support@sabpaisa.in</a> or call us at 011-41733223

                    </p>
                  </>}
                  isOpen={openCollapse === 21}
                  onToggle={() => handleToggle(21)} />
                <FaqCollapse
                  title="How to calculate TSR (Transaction Success Rate)?"
                  formContent={<>
                    <p className={` ${classes.font_size}`}>Transaction success rate (TSR) is calculated by dividing the total number of processed (success+busines declined) transactions by the total number of attempted transactions over a given time period. For example, if SabPaisa processed 100 transactions, and 82 were successful & 16 were failed due business declined, then your TSR would be 98%.
                    </p>
                  </>}
                  isOpen={openCollapse === 22}
                  onToggle={() => handleToggle(22)}
                />
              </div>
            </div>
          </div>
        </main>
      </section>
      
      </>


  );
};

export default Faq;
