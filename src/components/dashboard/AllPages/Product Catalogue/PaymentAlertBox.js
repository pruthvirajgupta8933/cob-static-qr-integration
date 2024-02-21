import React from 'react'
// import { Link } from 'react-router-dom'
import SelectProductPlan from './SelectProductPlan'
import { v4 as uuidv4 } from 'uuid';

function PaymentAlertBox(props) {
  const { heading, text1, linkName, bgColor, cardData } = props
  // console.log("cardData", cardData)



  return (
    <div className="accordion" id="collapseParentId">
      <div className="card p-0">
        <div className={`card-header p-0 text-white ${bgColor}`} id="headingOne">
          <h5 className="mb-0">
            <button className="btn btn-link  font-size-16" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              {/* <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />
                <span className="sr-only">Loading...</span> */}
              <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
              <span className="sr-only">Loading...</span>
              <span className="ml-1 tooltip-custom" data-tip={text1}>{heading} <i className="fa fa-exclamation-circle" ariaHidden="true"></i>
              </span>

            </button>
          </h5>
        </div>
        <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#collapseParentId">
          <div className="card-body">
            <div className="row">
              {cardData?.map(data => (
                <div className="col-12 mb-1" key={uuidv4()}>
                  <div className={`alert bg-light`} role="alert" >
                    <p>{`Kindly pay the amount of the subscribed product`}</p>
                    <p>{`Product : ${data?.applicationName}`} </p>
                    <p>{`Product Plan : ${data?.planName}`} </p>
                    <p>{data?.purchaseAmount && `Amount : ${Number.parseFloat(data?.purchaseAmount).toFixed(2)} INR`} </p>
                    <SelectProductPlan plans={data} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentAlertBox