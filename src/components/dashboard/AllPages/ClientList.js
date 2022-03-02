import React,{useEffect,useState} from 'react';
import { useDispatch,useSelector } from 'react-redux';

function ClientList() {

  const [isLoading,setIsLoading] = useState(false);
  const [search, SetSearch] = useState("");
  const [clientListData, SetClientList] = useState([]);

  var {user} = useSelector((state)=>state.auth);
  
  useEffect(() => {
   
  if(user.clientSuperMasterList?.length>0){
    var clientSuperMasterList = user.clientSuperMasterList;
    SetClientList(user.clientSuperMasterList);
  }
  if(search!==''){
    SetClientList(clientSuperMasterList.filter((Itme)=>Itme.clientCode.toLowerCase().includes(search.toLocaleLowerCase())));
  
  }
    }, [search,user]);
  


const handleChange= (e)=>{
      SetSearch(e);
}
    return (
      <section className="ant-layout">
      <div className="profileBarStatus">
        {/*  <div class="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span class="btn">Upload Here</span></span></div>*/}
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Client List</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a" id="features08-3-">
            <div className="container-fluid">
              <div className="row">
                {/* <p>The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the
                  lazy dog.The quick brown fox jumps over the lazy dog.</p> */}
              
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <label>Search</label>
                  <input type="text" className="ant-input" onChange={(e)=>{handleChange(e.currentTarget.value)}} placeholder="Search from here" />
                  <div className='noOfRecord'>Number of Record: {clientListData.length}</div>
                </div>
                
                <table cellspaccing={0} cellPadding={10} border={0} width="100%" className="tables">
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
                            <td>{item.clientCode}</td>
                            <td>{item.clientName}</td>
                            <td>{item.clientContact}</td>
                            <td>{item.clientEmail}</td>
                            <td>{item.configuration_status}</td>
                            <td>{item.subscribedTym}</td>
                          </tr>

                        )
                      })}
                  </tbody>
                  </table>
              </div>
            </div></section>
        </div>
        <footer className="ant-layout-footer">
          <div className="gx-layout-footer-content">© 2021 Ippopay. All Rights Reserved. <span className="pull-right">Ippopay's GST Number : 33AADCF9175D1ZP</span></div>
        </footer>
      </main>
    </section>
    )
}

export default ClientList
