import React from 'react'

const MandateBankDetails = ({updatedData}) => {
  return (
    <div>
    <div class="container">
      <div class="row">
        <div class="col-sm">
          <h4>Bank Name</h4>
          <span>
            <p className="text-secondary">Mandate</p>
          </span>
        </div>
        <div class="col-sm">
          <h4>Account Number</h4>
          <p className="text-secondary"></p>
        </div>
        <div class="col-sm">
          <h4>Account Type</h4>
          <p className="text-secondary"></p>
        </div>
      </div>
      <div class="row">
        <div class="col-sm">
          <h4>IFSC Code</h4>
          <span>
            <p className="text-secondary">Mandate</p>
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-sm">
          <h4>Authentication Mode</h4>
          <span>
            <p className="text-secondary">Mandate</p>
          </span>
        </div>
      </div>
      <div>
      </div>
    </div>
  </div>
  )
}

export default MandateBankDetails