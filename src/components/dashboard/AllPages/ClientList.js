import React,{useEffect,useState} from 'react';
import { useSelector } from 'react-redux';
import NavBar from '../NavBar/NavBar';

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
      <section className="ant-layout">
        <NavBar/>
      <div className="profileBarStatus">
        {/*  <div className="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span className="btn">Upload Here</span></span></div>*/}
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Client List sdf</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a" id="features08-3-">
            <div className="container">
              <div className="row">
                {/* <p>The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the
                  lazy dog.The quick brown fox jumps over the lazy dog.</p> */}
              
                <div className="mrg-btm- bgcolor col-sm-12 col-md-12 col-lg-12">
                  <div><label>Search</label></div>
                  <input type="text" className="ant-input col-lg-4 col-sm-12 col-md-12 " onChange={(e)=>{handleChange(e.currentTarget.value)}} placeholder="Search from here" />
                   
                  <div className='noOfRecord mt-20 mb-20 col-lg-12 col-sm-12 col-md-12 no-pad'>Number of Record: {clientListData.length}</div>
                  </div>
                
                <div style={{overflow:"scroll"}}>
                <table cellspaccing={0} cellPadding={10} border={0} width="100%" className="tables border">
                  <tbody><tr>
                      <th>Client Code</th>
                      <th>Client Name</th>
                      <th>Contact No.</th>
                      <th>Email ID</th>
                      <th>Configuration Status</th>
                      <th>Configuration Date Time</th>
                    </tr>
                   {clientListData && clientListData.map((item,i)=>{
                        return(
                          <tr>
                            <td className='border'>{item.clientCode}</td>
                            <td className='border'>{item.clientName}</td>
                            <td className='border'>{item.clientContact}</td>
                            <td className='border'>{item.clientEmail}</td>
                            <td className='border'>{item.configuration_status}</td>
                            <td className='border'>{item.subscribedTym}</td>
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
