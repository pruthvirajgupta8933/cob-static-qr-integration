import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import API_URL from '../../../config';


function SettlementReport() {
    const initialState = {
        Id: "",
        client_code: "",
        base_url_path: "",
        file_name: "",
        created_by: "",
        created_on: "",
        folder: "",
        sub_folder: ""
    }

    const [input,setInput]=React.useState();
    const [searchArea, setSearchArea] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [data, setData] = React.useState([])
    const [users, setUsers] = React.useState(initialState);
    const [folderArr, setFolderArr] = React.useState([]);
    var [subFolderArr, setSubFolderArr] = React.useState([]);
    var [showFilterData,SetShowFilterData] =React.useState([]); 
    const [selectedFolder,SetSelectedFolder] = React.useState('');
    const [selectedSubFolder,SetSelectedSubFolder] = React.useState('');
    const [searchFilterData,setSearchFilterData] = React.useState([]);
    let history = useHistory();

  
    const {user} = useSelector((state)=>state.auth);
    let clientCode='';
    if (user && user.clientMerchantDetailsList === null) {
      history.push("/dashboard/profile");
    } else {
      var clientMerchantDetailsList = user.clientMerchantDetailsList;
      clientCode = clientMerchantDetailsList[0].clientCode;
    }

    const getFileName = async () => {
      await axios( `${API_URL.GET_FILE_NAME}${clientCode}` )
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    useEffect(() => {
      getFileName();
    }, []);

    useEffect(() => {
      data.filter((item) => {
        folderArr.push(item.folder);
      });
      setFolderArr([...new Set(folderArr)]);
    }, [data]);

    useEffect(() => {
      if (searchArea !== "") {
        const data = showFilterData.filter((item) =>
        Object.values(item).join(" ").toLowerCase().includes(searchArea.toLocaleLowerCase()));
        // console.log("data",data);
        setSearchFilterData(data);
      }else{
        setSearchFilterData(showFilterData)
      }
    }, [searchArea])

    const onChangeFolder = (val) => {
      SetSelectedFolder(val);
      subFolderArr = [];
      data.filter((item) => {
        if (item.folder === val) {
          subFolderArr.push(item.sub_folder);
        }
      });
      setSubFolderArr([...new Set(subFolderArr)]);
    };
    // console.log('subFolderArr',subFolderArr);

  useEffect(() => {
      showFilterData = [];
      data.filter((item) => {
        if (
          item.folder === selectedFolder &&
          item.sub_folder === selectedSubFolder
        ) {
          // console.log('kkk',item);
          showFilterData.push(item);
        }
      });

      SetShowFilterData(showFilterData);
      setSearchFilterData(showFilterData);
    }, [selectedSubFolder, selectedFolder]);


    const getSearchTerm = (e) => {
      setSearchArea(e.target.value);
    };

    return (
      <>

<section className="ant-layout">
      <div className="profileBarStatus">
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Settlement Report</h1>
          </div> 
          <section className="features8 cid-sg6XYTl25a flleft col-lg-12" id="features08-3-">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <label>Select Folder</label>
                  <select
                    value={selectedFolder}
                    className="ant-input"
                    onChange={(e) => onChangeFolder(e.target.value)}
                  >
                    <option value="">Select Folder</option>
                    {folderArr &&
                      folderArr.map((folder,i) => <option value={folder} key={i}>{folder}</option>)}
                  </select>
                </div>

                <div className="col-lg-6 mrg-btm- bgcolor">
                  <label>Select Sub Folder</label>
                   <select
                      onChange={(event) => SetSelectedSubFolder(event.target.value)}
                      value={selectedSubFolder}
                      className="ant-input"
                    >
                      <option value="">Select</option>
                      {subFolderArr &&
                        subFolderArr.map((subfolder,i) => (
                          <option value={subfolder} key={i}>{subfolder}</option>
                        ))}
                    </select>
                </div>
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <label>Search</label>
                  <input
                    type="text"
                    value={searchArea}
                    placeholder="Search Here"
                    className="ant-input"
                    onChange={getSearchTerm}
                  />
                  {showFilterData.filter}
                </div>
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <label>Count Per Page</label>
                  <select className="ant-input">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                  </select>
                </div>
                </div>
            </div>
          </section>


          <section className="" >
          <div className="container-fluid  p-3 my-3 ">

          {searchFilterData.length >0 ? <h4>Total Record : {searchFilterData.length} </h4> : <></>}
          
            <div className="scroll"  style={{"overflow": "auto"}}>
            <table className="table table-bordered">
              <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Client Code</th>
                    <th>File Name</th>
                    <th>Created On</th>
                    <th>Action</th>
                  </tr>
              </thead>
              <tbody>
                {searchFilterData.length > 0 ? (
                  searchFilterData.map((user, i) => (
                    <tr key={user.Id}>
                      <td>{i + 1}</td>
                      <td>{user.client_code} </td>
                      <td>{user.file_name}</td>
                      <td>{user.created_on}</td>
                      <td>
                        <a href={user.base_url_path}>Download</a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </table>
            </div>  
            </div>  
          </section> 
        </div>

        <footer className="ant-layout-footer">
          <div className="gx-layout-footer-content">
            © 2021 Ippopay. All Rights Reserved.{" "}
            <span className="pull-right">
              Ippopay's GST Number : 33AADCF9175D1ZP
            </span>
          </div>
        </footer>
      </main>
    </section>
   
      </>
    );
}

export default SettlementReport;
