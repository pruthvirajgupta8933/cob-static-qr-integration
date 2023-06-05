import React from 'react'
import { Link } from 'react-router-dom'

function AlertBox(props) {
  const { heading, text1, text2, text3, linkUrl, linkName, bgColor, cardData } = props
  // console.log("cardData", cardData)

  return (


    <div className="accordion" id="collapseParentId">
      <div className="card p-0">
        <div className={`card-header p-0 text-white ${bgColor}`} id="headingOne">
          <h5 className="mb-0">
            <button className="btn btn-link  font-size-16" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                {/* <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />
                <span className="sr-only">Loading...</span> */}
                <span className="ml-1 tooltip-custom" data-tip={text1}>{heading}</span>
              <i className="ml-1 fa fa-arrow-circle-o-right" aria-hidden="true"></i>
            </button>
          </h5>
        </div>
        <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#collapseParentId">
          <div className="card-body">
            <div className="row">
              {cardData?.map(data => (
                <div className="col-4 mb-1" key={data}>
                  <div className={`alert bg-light`} role="alert" >
                    <p>{`Kindly pay the amount of the subscribed product`}</p>
                    <p>{`Product : ${data?.applicationName}`} </p>
                    <p>{`Product Plan : ${data?.planName}`} </p>
                    <hr />
                    <Link className="btn cob-btn-primary  text-white btn-sm" to={`dashboard/sabpaisa-pg/${data?.clientSubscribedPlanDetailsId}`}>{linkName}</Link>
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

export default AlertBox