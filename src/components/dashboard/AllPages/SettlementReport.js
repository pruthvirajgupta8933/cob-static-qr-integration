import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

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
    let history = useHistory();

   
    const {user} = useSelector((state)=>state.auth);
    let clientCode='';
    if (user && user.clientSuperMasterList === null) {
      history.push("/dashboard/profile");
    } else {
      var clientSuperMasterList = user.clientSuperMasterList;
      clientCode = clientSuperMasterList[0].clientCode;
    }

    const getFileName = async () => {
      await axios(
        `https://adminapi.sabpaisa.in/REST/settlementReport/getFileName/${clientCode}`
      )
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    React.useEffect(() => {
      getFileName();
    }, []);

    React.useEffect(() => {
      data.filter((item) => {
        folderArr.push(item.folder);
      });
      setFolderArr([...new Set(folderArr)]);
    }, [data]);

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

    React.useEffect(() => {
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
    }, [selectedSubFolder, selectedFolder]);

    const getSearchTerm = (e) => {
      setSearchArea(e.target.value);

      if (searchArea !== "") {
        SetShowFilterData(
          data.filter((item) =>
            item.file_name
              .toLowerCase()
              .includes(searchArea.toLocaleLowerCase())
          )
        );
      }

      // setSearchResults(newDataList);
    };

    return (
      <section className="ant-layout">
        <div className="profileBarStatus"></div>

        <div className="col-lg-12 row- bgcolor">
          <h1 className="col-lg-12">Settlement Report</h1>
          <hr />

          <label For="folder "></label>
          <div className="col-lg-3 nopad">
            <select
              value={selectedFolder}
              className="ant-input"
              onChange={(e) => onChangeFolder(e.target.value)}
            >
              <option value="">--Select Folder--</option>
              {folderArr &&
                folderArr.map((folder) => (
                  <option value={folder}>{folder}</option>
                ))}

              <input type="text" placeholder="Search.." />
            </select>
          </div>
          <div className="col-lg-3 nopad">
            <label For="folder"></label>
            <select
              onChange={(event) => SetSelectedSubFolder(event.target.value)}
              value={selectedSubFolder}
              className="ant-input"
            >
              <option value="">Select</option>
              {subFolderArr &&
                subFolderArr.map((subfolder) => (
                  <option value={subfolder}>{subfolder}</option>
                ))}
            </select>
          </div>

          <div className="col-lg-3 nopad">
            <input
              type="text"
              value={searchArea}
              placeholder="Search Here"
              className="ant-input"
              onChange={getSearchTerm}
            />
          </div>
          <div className="col-lg-3 nopad">
            {showFilterData.filter}

            <select className="ant-input">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">100</option>
              <option value="70">200</option>
              <option value="70">300</option>
              <option value="70">400</option>
              <option value="70">500</option>
            </select>
          </div>

          <table
            width="100%"
            cellPadding="10"
            cellspacing="0"
            className="tables col-lg-12 mar-top"
          >
            <tr>
              <th>S.No</th>
              <th>Client Code</th>
              <th>File Name</th>
              <th>Created On</th>
              <th>Action</th>
            </tr>

            {showFilterData.length > 0 ? (
              showFilterData.map((user, i) => (
                <tr key={user.Id}>
                  <td>{i + 1}</td>
                  <td>{user.client_code} </td>

                  <td>{user.file_name}</td>
                  <td>{user.created_on}</td>
                  {/* <td>{user.sub_folder}</td> */}
                  <td>
                    <a href={user.base_url_path}>Download</a>
                  </td>
                </tr>
              ))
            ) : (
              <>{""}</>
            )}
          </table>
        </div>
      </section>
    );
}

export default SettlementReport;
