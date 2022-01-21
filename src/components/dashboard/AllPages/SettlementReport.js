import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

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
    const {user} = useSelector((state)=>state.auth);
    var clientMerchantDetailsList = user.clientMerchantDetailsList;
    const {clientCode} =clientMerchantDetailsList[0]; 
    //console.log(clientMerchantDetailsList);

    const getFileName = async () => {  
        await axios(`https://adminapi.sabpaisa.in/REST/settlementReport/getFileName/${clientCode}`)
        .then(res => {  
          setData(res.data);  
        })  
        .catch(err => {  
          console.log(err)
        });

    }

    React.useEffect(() => {
        getFileName();
    }, []);

    
    React.useEffect(() => {
        
        data.filter((item)=>{
            folderArr.push(item.folder);
        })
        setFolderArr( [...new Set(folderArr)]);
    }, [data]);

    const onChangeFolder=(val)=>{
        SetSelectedFolder(val);
        subFolderArr = [];
             data.filter((item)=>{
                if(item.folder === val){ 
                    subFolderArr.push(item.sub_folder)
                }
            })
            setSubFolderArr([...new Set(subFolderArr)])
    }
    // console.log('subFolderArr',subFolderArr);


    React.useEffect(() => {
        showFilterData=[];
        data.filter((item)=>{
          if(item.folder===selectedFolder && item.sub_folder===selectedSubFolder){
                // console.log('kkk',item);
                showFilterData.push(item);
            }
        })

        SetShowFilterData(showFilterData)

    }, [selectedSubFolder,selectedFolder])


    const getSearchTerm = (e) => {

        setSearchArea(e.target.value);
      
            if(searchArea !== ''){ SetShowFilterData(data.filter((item)=>item.file_name.toLowerCase().includes(searchArea.toLocaleLowerCase())))}
            
            // setSearchResults(newDataList);
    }



  


    return (
        <div>
            <h1 style={{ position: 'absolute', top: 70, left: 250 }}>Settlement Report</h1>
            <hr />
            <label For="folder "></label>
            <select value={selectedFolder} style={{ position: 'absolute', top: 150, left: 250, width: 300 }} onChange={(e)=>onChangeFolder(e.target.value)}>
            <option value="">--Select Folder--</option>
            {folderArr && (folderArr.map((folder) => (
                <option value={folder}>{folder}</option>
                )))}

                <input type="text" placeholder="Search.." />

            </select>

            <div>
                <label For="folder"></label>
                <select onChange={(event) => SetSelectedSubFolder(event.target.value)}  value={selectedSubFolder}style={{ position: 'absolute', top: 150, left: 650, width: 300 }} >
                <option value="" >Select</option>
                    {subFolderArr && (subFolderArr.map((subfolder) => (
                        <option value={subfolder} >{subfolder}</option>
                    )))}
                </select>

            </div>
            <input type="text" value= {searchArea} placeholder="Search Here" style={{ position: 'absolute', top: 200, left: 250, width: 300 }} 
            onChange = {getSearchTerm}  
            />
            {

                showFilterData.filter 
            }

            <div>
                <select style={{ position: 'absolute', top: 200, left: 650, width: 300 }}>
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
            <div>
                <table style={{ position: 'absolute', top: 300, left: 250, width: 550 }}>
                    <tr>
                        <th>S.No</th>
                        <th>Client Code</th>
                        <th>File Name</th>
                        <th>Created On</th>
                        <th>Action</th>
                    </tr>
                    <br />
                    {
                        showFilterData.length > 0 ? (
                            showFilterData.map((user, i) =>
                                <tr key={user.Id}>
                                    <td>{i + 1}</td>
                                    <td>{user.client_code}	</td>

                                    <td>{user.file_name}</td>
                                    <td>{user.created_on}</td>
                                    {/* <td>{user.sub_folder}</td> */}
                                    <td><a href={user.base_url_path}>Download</a></td>

                                </tr>
                            )) : (
                            <>
                                {""}
                            </>


                        )

                    }



                </table>
            </div>

        </div>


    )
}

export default SettlementReport;
