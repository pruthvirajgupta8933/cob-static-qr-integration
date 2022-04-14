import React from 'react'

function BusinessDetails() {
  return (
    <div className="col-md-12 col-md-offset-4">   
    <form>
    <div className="form-row">
        <div className="form-group col-md-4">
            <label htmlFor="inputPassword4">Business Name *</label>
            <input type="password" className="form-control" id="inputPassword4" placeholder="Enter Your Business Name" />
        </div>

        <div className="form-group col-md-4">
            <label htmlFor="inputPassword4">Company Logo *</label>
            <input type="file" className="form-control" id="inputPassword4" placeholder="Enter Your Business Name" />
        </div>

        <div class="form-group col-md-4">
        <label for="inputState">GSTIN *</label>
        <select id="inputState" class="form-control">
            <option selected>Choose...</option>
            <option>...</option>
        </select>
        </div>
    </div>

    
    <div className="form-row">
      <div className="form-group col-md-4">
        <label htmlFor="inputEmail4">GST No *</label>
        <input type="email" className="form-control" id="inputEmail4" placeholder="Enter GST No." />
      </div>
      
       
      <div className="form-group col-md-4">
        <label htmlFor="inputEmail4">Business Pan *</label>
        <input type="email" className="form-control" id="inputEmail4" placeholder="Business Pan " />
      </div>
      
       
      <div className="form-group col-md-4">
        <label htmlFor="inputEmail4">Authorised Signatory PAN *</label>
        <input type="email" className="form-control" id="inputEmail4" placeholder="Authorised Signatory PAN" />
      </div>
      
       

    </div>

    
    <div className="form-row">
  

      <div className="form-group col-md-3">
        <label htmlFor="inputPassword4">PAN Owner's Name *</label>
        <input type="password" className="form-control" id="inputPassword4" placeholder="PAN Owner's Name " />
      </div>

      <div className="form-group col-md-3">
        <label htmlFor="inputPassword4">Pincode *</label>
        <input type="password" className="form-control" id="inputPassword4" placeholder="PAN Owner's Name " />
      </div>

      <div className="form-group col-md-3">
        <label htmlFor="inputPassword4">City *</label>
        <input type="password" className="form-control" id="inputPassword4" placeholder="PAN Owner's Name " />
      </div>

      <div class="form-group col-md-3">
        <label for="inputState">State *</label>
        <select id="inputState" class="form-control">
            <option selected>Choose...</option>
            <option>...</option>
        </select>
        </div>
    
    </div>

    
    <div className="form-row">
      <div className="form-group col-md-4">
        <label htmlFor="inputPassword4">Registered Address *</label>
        <input type="password" className="form-control" id="inputPassword4" placeholder="Password" />
      </div>
    </div>
    <div className="form-row">
  
    <div class="form-group">
        <div class="form-check">
        <input class="form-check-input" type="checkbox" id="gridCheck" />
        <label class="form-check-label" for="gridCheck">
        Operational Address*
        </label>
        </div>
        </div>
     
    </div>
    <div className="form-row">
  
      <div className="form-group col-md-4">
        <label htmlFor="inputPassword4">Same As Registered Address</label>
        <input type="password" className="form-control" id="inputPassword4" placeholder="Password" />
      </div>
     
    </div>

    <button type="submit" className="btn btn-primary">Save</button>
  </form>
  </div>
  )
}

export default BusinessDetails