import React, { useEffect, useState } from 'react';
import PayerDetails from './PayerDetails';
import PaymentLinkDetail from './PaymentLinkDetail';
import BulkPayer from './BulkPayer';
import Reports from './Reports';
import classes from './paylink.module.css'
import { useSelector } from 'react-redux';
import paymentLinkService from '../../../../services/create-payment-link/paymentLink.service';
import toastConfig from '../../../../utilities/toastTypes';
import CustomLoader from '../../../../_components/loader';


function Paylinks() {

  const { user } = useSelector((state) => state.auth);
  const [isApiLoad, setIsApiLoad] = useState(false)

  let clientMerchantDetailsList = user.clientMerchantDetailsList;
  let clientCode = clientMerchantDetailsList[0].clientCode;

  const [tab, SetTab] = useState(1);
  useEffect(() => {
    if (!sessionStorage.getItem('paymentLinkApiKey')) {
      async function getPaymentLinkApiKey() {
        try {
          const response = await paymentLinkService.getPaymentLinkApiKey({ client_code: clientCode });
          sessionStorage.setItem('paymentLinkApiKey', response.data.api_key);
          setIsApiLoad(true)
        } catch (error) {
          toastConfig.errorToast("Something went wrong");
        }

      }
      getPaymentLinkApiKey();
    }


    return () => {
      sessionStorage.removeItem('paymentLinkApiKey');
    }
  }, [])






  return (
    <section className="">
      <main className="">
        {!isApiLoad ? <CustomLoader isApiLoad={isApiLoad} /> : <div className="">
          <div >
            <h5 >Payments Link</h5>
          </div>
          <section className="">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12 my-4 pl-3">
                  <ul className={`${classes.paylink_tabs} nav nav-tabs flex-nowrap`}>
                    <li className="nav-item" onClick={() => SetTab(1)}>
                      <a href={() => false} id="navpad" className={"nav-link btn rounded-1 border border-secondary m-1 " + (tab === 1 ? "active" : "inactive")}  >Payer Detail</a>
                    </li>
                    <li className="nav-item" onClick={() => SetTab(2)} >
                      <a href={() => false} id="navpad" className={"nav-link btn rounded-1 border border-secondary m-1 " + (tab === 2 ? "active" : "inactive")} >Payment Link Detail</a>
                    </li>
                  </ul>
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
        }


      </main>
    </section>
  )
}

export default Paylinks;
