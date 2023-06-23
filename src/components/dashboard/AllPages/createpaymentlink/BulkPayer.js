import React from "react";


const BulkPayer = () => {
 
const changeHandler = (event) => {
    
  };

  

  return (

    <section className="features8 cid-sg6XYTl25a " id="features08-3-1">
                <div className="container-fluid">
                    <div className="row">  
                    <div className="col-lg-4 mrg-btm- bgcolor">
                    <label>Upload Bulk Payer</label>
                    <input
                      type="file"
                      className="form-control"
                      id="customFile"
                      onChange={changeHandler}
                      
                    />
                    </div>
                    <div className="col-lg-4 mrg-btm- bgcolor">
                    <button
                      type="submit"
                      className="btn  cob-btn-primary  martop">
                      Submit
                    </button>
                    </div>
                    </div>
                </div>
            </section>
  );
};

export default BulkPayer;
