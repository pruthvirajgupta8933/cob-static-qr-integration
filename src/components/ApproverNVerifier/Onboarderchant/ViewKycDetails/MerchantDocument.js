import React from 'react'

const MerchantDocument = (props) => {
    const{docList,docTypeList}=props;
    
    const getDocTypeName = (id) => {
      let data = docTypeList.filter((obj) => {
        if (obj?.key?.toString() === id?.toString()) {
          return obj;
        }
      });
  
      // console.log("data",data)
      return data[0]?.value;
    };
  
    const stringManulate = (str) => {
        let str1 = str.substring(0, 15)
        return `${str1}...`
    
      }
    
  return (
    <div className="row mb-4 border">
    <div class="col-lg-12">
      <h3 className="font-weight-bold">Merchant Docuemnts</h3>
    </div>

    <div className="col-lg-12 mt-4 m-2">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Document Type</th>
            <th>Document Name</th>
            <th>Document Status</th>
          </tr>
        </thead>
        <tbody>
          {docList?.length > 0 ? (
            docList?.map((doc, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{getDocTypeName(doc?.type)}</td>
                <td>
                  <a
                    href={doc?.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary"
                  >
                    {stringManulate(doc?.name)}
                  </a>
                  <p className="text-danger"> {doc?.comment}</p>
                </td>
                <td>{doc?.status}</td>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </table>
     
    </div>
  </div>
  )
}

export default MerchantDocument
