import React from 'react'

function BusinessOverview() {
  return (
    <div className="col-md-12 col-md-offset-4">   
    <form>
    <div className="form-row">
        <div class="form-group col-md-4">
        <label for="inputState">Business Type *</label>
        <select id="inputState" class="form-control">
            <option selected>Choose...</option>
            <option>...</option>
        </select>
        </div>

        <div class="form-group col-md-4">
        <label for="inputState">Business Category *</label>
        <select id="inputState" class="form-control">
            <option selected>Choose...</option>
            <option>...</option>
        </select>
        </div>

        <div className="form-group col-md-4">
            <label htmlFor="inputPassword4">Business Model *</label>
            <input type="password" className="form-control" id="inputPassword4" placeholder="Business Model" />
        </div>
    </div>

    
    <div className="form-row">
      <div className="form-group col-md-4">
        <label htmlFor="inputEmail4">Billing Label *</label>
        <input type="email" className="form-control" id="inputEmail4" placeholder="Billing Label *" />
      </div>
      
        <div class="form-group col-md-4">
        <label for="inputState">Do you have you own ERP *</label>
        <select id="inputState" class="form-control">
            <option selected>Choose...</option>
            <option>...</option>
        </select>
        </div>
      
        <div class="form-group col-md-4">
        <label for="inputState">Platform *</label>
        <select id="inputState" class="form-control">
            <option selected>Choose...</option>
            <option>...</option>
        </select>
        </div>

    </div>

    
    <div className="form-row">
    <div class="form-group col-md-4">
        <label for="inputState">Website/App url *</label>
        <select id="inputState" class="form-control">
            <option selected>Choose...</option>
            <option>...</option>
        </select>
        </div>

      <div className="form-group col-md-4">
        <label htmlFor="inputPassword4">Website/App url *</label>
        <input type="password" className="form-control" id="inputPassword4" placeholder="Enter Website/App url *" />
      </div>
      <div class="form-group col-md-4">
        <label for="inputState">Type Of Collection *</label>
        <select id="inputState" class="form-control">
            <option selected>Choose...</option>
            <option>...</option>
        </select>
        </div>
    </div>

    
    <div className="form-row">
    <div class="form-group col-md-4">
        <label for="inputState">Collection Frequency *</label>
        <select id="inputState" class="form-control">
            <option selected>Choose...</option>
            <option>...</option>
        </select>
        </div>
      <div className="form-group col-md-4">
        <label htmlFor="inputPassword4">Ticket size *</label>
        <input type="password" className="form-control" id="inputPassword4" placeholder="Password" />
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="inputPassword4">Expected Transactions *</label>
        <input type="password" className="form-control" id="inputPassword4" placeholder="Password" />
      </div>
    </div>

    <div className="form-row">
       <div class="form-group col-md-4">
        <label for="inputState">Do you need SabPaisa to built your form *</label>
        <select id="inputState" class="form-control">
            <option selected>Choose...</option>
            <option>...</option>
        </select>
        </div>
      </div>
    




    <button type="submit" className="btn btn-primary">Save</button>
  </form>
  </div>
  )
}

export default BusinessOverview