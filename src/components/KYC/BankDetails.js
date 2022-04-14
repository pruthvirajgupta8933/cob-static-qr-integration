import React from 'react'

function BankDetails() {
  return (
    <div className="col-md-12 col-md-offset-4">   
    <form>
    <div className="form-row ">
        <p>We will deposit a small amount of money in your account to verify the account.</p>
    </div>
    <div className="form-row">
        <div className="form-group col-md-4">
            <label htmlFor="inputPassword4">Account Name *</label>
            <input type="password" className="form-control" id="inputPassword4" placeholder="Enter Your Business Name" />
        </div>

        <div className="form-group col-md-4">
            <label htmlFor="inputPassword4">Account Type *</label>
            <input type="text" className="form-control" id="inputPassword4" placeholder="Enter Your Business Name" />
        </div>

        <div class="form-group col-md-4">
        <label for="inputState">Bank Name *</label>
        <select id="inputState" class="form-control">
            <option selected>Choose...</option>
            <option>...</option>
        </select>
        </div>
    </div>

    
    <div className="form-row">
      <div className="form-group col-md-4">
        <label htmlFor="inputEmail4">Branch *</label>
        <input type="email" className="form-control" id="inputEmail4" placeholder="Enter GST No." />
      </div>
      
       
      <div className="form-group col-md-4">
        <label htmlFor="inputEmail4">Branch IFSC Code</label>
        <input type="email" className="form-control" id="inputEmail4" placeholder="Business Pan " />
      </div>
    </div>

    
    <div className="form-row">
  

      <div className="form-group col-md-4">
        <label htmlFor="inputPassword4">Account Number</label>
        <input type="password" className="form-control" id="inputPassword4" placeholder="PAN Owner's Name " />
      </div>

      <div className="form-group col-md-4">
        <label htmlFor="inputPassword4">Re-Enter Account Number</label>
        <input type="password" className="form-control" id="inputPassword4" placeholder="PAN Owner's Name " />
      </div>
    
    </div>
    <button type="submit" className="btn btn-primary">Save</button>
  </form>
  </div>
  )
}

export default BankDetails