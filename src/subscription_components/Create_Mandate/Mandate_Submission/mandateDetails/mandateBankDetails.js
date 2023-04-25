import React from 'react'

const MandateBankDetails = ({ updatedData }) => {
  return (
    <div>
      <div class="container">
        <div class="row">
          <div class="col-sm">
            <h4>Bank Name</h4>
            <span>
              <p className="text-secondary">{updatedData?.payerBank}</p>
            </span>
          </div>
          <div class="col-sm">
            <h4>Account Number</h4>
            <p className="text-secondary">{updatedData?.payerAccountNumber}</p>
          </div>
          <div className="col-sm">
            <h4>Account Type</h4>
            <p className="text-secondary">{updatedData?.payerAccountType}</p>
          </div>
        </div>
        <div className="row">
          <div class="col-sm">
            <h4>IFSC Code</h4>
            <span>
              <p className="text-secondary">{updatedData?.payerBankIfscCode}</p>
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <h4>Authentication Mode</h4>
            <span>
              <p className="text-secondary">{updatedData?.authenticationMode}</p>
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