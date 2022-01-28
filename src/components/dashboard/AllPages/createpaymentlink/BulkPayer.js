import React from 'react';

const BulkPayer = () => {
  return (
  <div> 
    

    <div className="col-lg-6 mrg-btm- bgcolor">
    <label class="form-label" for="customFile"><b>Import Bulk Payer</b></label>
<input type="file" class="  form-control" id="customFile" id='jjj' />
                </div>
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <div> &nbsp; &nbsp; </div>
                  {/* <button className="view_history test" style={{ marginTop: '8px' }}></button> */}
                  <button type="submit" style={{ marginTop: '17px' }} class="btn btn-primary" >Submit</button>
                  <div _ngcontent-mwq-c5 className="col-md-12 text-right mb-7" >
                    <button _ngcontent-mwq-c5 class="bhanu btn-link" value="Download">Download Import Format Excel</button>

                  </div>
                </div>
  
  </div>
  )}


export default BulkPayer;
