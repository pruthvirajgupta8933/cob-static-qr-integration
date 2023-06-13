import React,{useEffect,useState} from 'react';
import { useSelector } from 'react-redux';
import NavBar from '../NavBar/NavBar';
import { uniqueId } from 'lodash';

function ClientList() {

  // const [isLoading,setIsLoading] = useState(false);
  const [search, SetSearch] = useState("");
  const [clientListData, SetClientList] = useState([]);

  var {user} = useSelector((state)=>state.auth);
  
  useEffect(() => {
   //ClientMerchantDetailList
  if(user.clientMerchantDetailsList?.length>0){
    var clientMerchantDetailsList = user.clientMerchantDetailsList;
    SetClientList(user.clientMerchantDetailsList);
  }
  if(search!==''){
    SetClientList(clientMerchantDetailsList.filter((Itme)=>
    Object.values(Itme).join(" ").toLowerCase().includes(search.toLocaleLowerCase())));
  
  }
    }, [search,user]);
  


const handleChange= (e)=>{
      SetSearch(e);
}
    return (
      <section className="">
  
      <main className="">
        <div className="">
          <div className="">
            <h5 className="">Client List</h5>
          </div>
          <section className="" >
            <div className="container">
              <div className="row mt-4">
               
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="col-lg-4 p-0">
                  <label>Search</label>
                  <input type="text" className="form-control" onChange={(e)=>{handleChange(e.currentTarget.value)}} placeholder="Search from here" />
                  </div>

                  
                   
                  <div className='noOfRecord mt-20 mb-20 col-lg-12 col-sm-12 col-md-12 no-pad'>Number of Record: {clientListData.length}</div>
                  </div>
                
                <div style={{overflow:"scroll"}}>
                <table cellspaccing={0} cellPadding={10} border={0} width="100%" className="tables border">
                  <tbody><tr>
                      <th>Client Code</th>
                      <th>Client Name</th>
                      <th>Contact No.</th>
                      {/* <th>Email ID</th>
                      <th>Configuration Status</th>
                      <th>Configuration Date Time</th> */}
                    </tr>
                   {clientListData && clientListData.map((item,i)=>{
                        return(
                          <tr>
                            <td className='border'>{item.clientCode}</td>
                            <td className='border'>{item.clientName}</td>
                            <td className='border'>{item.clientContact}</td>
                            {/* <td className='border'>{item.clientEmail}</td>
                            <td className='border'>{item.configuration_status}</td>
                            <td className='border'>{item.subscribedTym}</td> */}
                          </tr>

                        )
                      })}
                  </tbody>
                  </table>
                  </div>
              </div>
            </div></section>
        </div>
        
      </main>
    </section>
    )
}

export default ClientList
