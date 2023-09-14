import React from 'react'

function BankDetailsOps() {
    return (
        // create html bootstrap from with for the bank details eg: account number / ifce / account holder name/ bank name/ account type
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel" aria-labelledby="v-pills-link1-tab">
            <form className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="accountNumber">Account Number:</label>
                    <input type="text" className="form-control" id="accountNumber" placeholder="Enter Account Number" required />
                </div>
                <div className="col-md-6">
                    <label htmlFor="ifsc">IFSC Code:</label>
                    <input type="text" className="form-control" id="ifsc" placeholder="Enter IFSC Code" required />
                </div>
                <div className="col-md-6">
                    <label htmlFor="accountHolderName">Account Holder Name:</label>
                    <input type="text" className="form-control" id="accountHolderName" placeholder="Enter Account Holder Name" required />
                </div>
                <div className="col-md-6">
                    <label htmlFor="bankName">Bank Name:</label>
                    <input type="text" className="form-control" id="bankName" placeholder="Enter Bank Name" required />
                </div>
                <div className="col-md-6">
                    <label htmlFor="bankName">Branch:</label>
                    <input type="text" className="form-control" id="bankName" placeholder="Enter Bank Name" required />
                </div>
                <div className="col-md-6">
                    <label htmlFor="accountType">Account Type:</label>
                    <select className="form-control" id="accountType">
                        <option value="savings">Savings</option>
                        <option value="current">Current</option>
                        {/* Add other account types if needed */}
                    </select>
                </div>
                <div className="col-12">
                    <button type="submit" className="btn cob-btn-primary btn-sm">Save</button>
                </div>
            </form>
        </div>

    )
}

export default BankDetailsOps