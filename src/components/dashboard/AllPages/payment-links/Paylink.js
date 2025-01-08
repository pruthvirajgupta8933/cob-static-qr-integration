import React, { useEffect, useState } from 'react';
import PayerDetails from './PayerDetails';
import PaymentLinkDetail from './PaymentLinkDetail';
import BulkPayer from './BulkPayer';
import Reports from './Reports';
import classes from './paylink.module.css'
import { useSelector } from 'react-redux';
import paymentLinkService from '../../../../services/create-payment-link/paymentLink.service';


function Paylinks() {

  const { user } = useSelector((state) => state.auth);

  let clientMerchantDetailsList = user.clientMerchantDetailsList;
  let clientCode = clientMerchantDetailsList[0].clientCode;

  useEffect(() => {
    async function getPaymentLinkApiKey() {
      try {
        const response = await paymentLinkService.getPaymentLinkApiKey({ client_code: clientCode });
        sessionStorage.setItem('paymentLinkApiKey', response.data.api_key);
      } catch (error) {
        console.log(error.response)
      }

    }
    getPaymentLinkApiKey();

    return () => {
      sessionStorage.removeItem('paymentLinkApiKey');
    }
  }, [])

  const sessionApiKeyData = sessionStorage.getItem('paymentLinkApiKey');

  const [tab, SetTab] = useState(1);

  // console.log("sessionApiKeyData", sessionApiKeyData)
  return (
    <section className="">
      <main className="">
        <div className="">
          <div className="">
            <h5 className="">Create Payment Link</h5>
          </div>
          <section className="">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12 my-4 pl-3">
                  {sessionApiKeyData && <ul className={`${classes.paylink_tabs} nav nav-tabs flex-nowrap`}>
                    <li className="nav-item" onClick={() => SetTab(1)}>
                      <a href={() => false} id="navpad" className={"nav-link btn rounded-1 border border-secondary m-1 " + (tab === 1 ? "active" : "inactive")}  >Payer Detail</a>
                    </li>
                    <li className="nav-item" onClick={() => SetTab(2)} >
                      <a href={() => false} id="navpad" className={"nav-link btn rounded-1 border border-secondary m-1 " + (tab === 2 ? "active" : "inactive")} >Payment Link Detail</a>
                    </li>
                  </ul>}
                </div>
              </div>
            </div>
          </section>

          <React.Fragment>
            {(tab === 1 &&
              <PayerDetails />)
              || (tab === 2 &&
                <PaymentLinkDetail />)
              || (tab === 3 &&
                <BulkPayer />)
              || (tab === 4 &&
                <Reports />)
              ||
              <PayerDetails />
            }
          </React.Fragment>
        </div>

      </main>
    </section>
  )
}

export default Paylinks;
