import React, { useState } from 'react';
import PayerDetails from './PayerDetails';
import PaymentLinkDetail from './PaymentLinkDetail';
import BulkPayer from './BulkPayer';
import Reports from './Reports';
import classes from './paylink.module.css'


function Paylinks() {
  const [tab, SetTab] = useState(1);
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
                  <ul className={`${classes.paylink_tabs} nav nav-tabs flex-nowrap`}>
                    <li className="nav-item" onClick={() => SetTab(1)}>
                      <a href={() => false} id="navpad" className={"nav-link btn rounded-1 border border-secondary m-1 " + (tab === 1 ? "active" : "inactive")}  >Payment Detail</a>
                    </li>
                    <li className="nav-item" onClick={() => SetTab(2)} >
                      <a href={() => false} id="navpad" className={"nav-link btn rounded-1 border border-secondary m-1 " + (tab === 2 ? "active" : "inactive")} >Payment Link Detail</a>
                    </li>
                    <li className="nav-item" onClick={() => SetTab(4)}>
                      <a href={() => false} id="navpad" className={"nav-link btn rounded-1 border border-secondary m-1 " + (tab === 4 ? "active" : "inactive")} >Reports</a>
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

      </main>
    </section>
  )
}

export default Paylinks;
