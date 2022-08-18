import React,{useState} from 'react'

function SubmitKyc() {

  const [check,setCheck] = useState(false);
  
  return (
    <div className="col-md-12 col-md-offset-4">   
    <form>
    <div className="form-row" >
      <p class="font-weight-bold" style={{"max-width": "900px"}}>
      <input class="form-check-input" type="checkbox" value={check} id="flexCheckDefault" />
       By accepting this Agreement, through one of the following means: (i) executing the Order Form that references this Agreement; or (ii) paying the Fees set out in the relevant Order Form, the Customer agrees to the terms of this Agreement.</p>
    </div>
    <div className="form-row"  class="font-weight-bold mt-xl-4" style={{"max-width": "900px"}} >
      <p>1.2  If the individual accepting this Agreement is accepting on behalf of a company or other legal entity, such individual represents that they have the authority to bind such entity and its Affiliates to these terms and conditions, in which case 
      the term “Customer” shall refer to such entity and its Affiliates. If the individual accepting this Agreement does not have such authority, or does not agree with these terms and conditions, such individual must not accept this Agreement and may not
      use the Solution or the Services.</p>
    </div>
    <button type="submit" className="btn btn-primary">Submit KYC</button>
  </form>
  </div>
  )
}

export default SubmitKyc