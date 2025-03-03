import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API_URL from "../../../config";
import DropDownCountPerPage from "../../../_components/reuseable_components/DropDownCountPerPage";
// import NavBar from "../NavBar/NavBar";
import { v4 as uuidv4 } from 'uuid';

const SettlementReport = () => {
  const [searchArea, setSearchArea] = useState("");
  const [data, setData] = React.useState([]);
  const [folderArr, setFolderArr] = React.useState([]);
  const [subFolderArr, setSubFolderArr] = React.useState([]);
  const [showFilterData, SetShowFilterData] = React.useState([]);
  const [selectedFolder, SetSelectedFolder] = React.useState("");
  const [selectedSubFolder, SetSelectedSubFolder] = React.useState("");
  const [searchFilterData, setSearchFilterData] = React.useState([]);



  const { user } = useSelector((state) => state.auth);
  let clientCode = "";



  if (user && user?.clientMerchantDetailsList) {
    // history.push("/dashboard/profile");
    clientCode = user?.clientMerchantDetailsList[0].clientCode;
  } else {
    let clientMerchantDetailsList = user.clientMerchantDetailsList;

    if (user.clientMerchantDetailsList !== undefined) {
      clientCode = clientMerchantDetailsList[0].clientCode;
    }
  }

  useEffect(() => {
    axios(`${API_URL.GET_FILE_NAME}${clientCode}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {

      });
  }, []);

  useEffect(() => {
    data.filter((item) => folderArr.push(item.folder));
    setFolderArr([...new Set(folderArr)]);
  }, [data]);

  useEffect(() => {
    if (searchArea !== "") {
      const data = showFilterData.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchArea.toLocaleLowerCase())
      );

      setSearchFilterData(data);
    } else {
      setSearchFilterData(showFilterData);
    }

  }, [searchArea]);

  const onChangeFolder = (val) => {
    SetSelectedFolder(val);

    let tempArr = [];
    data.filter((item) =>
      item.folder === val ? tempArr.push(item.sub_folder) : null
    );
    setSubFolderArr([...new Set(tempArr)]);
  };

  useEffect(() => {
    let tempArr1 = [];
    data.filter((item) =>
      item.folder === selectedFolder && item.sub_folder === selectedSubFolder
        ? tempArr1.push(item)
        : null
    );

    SetShowFilterData(tempArr1);
    setSearchFilterData(tempArr1);
  }, [selectedSubFolder, selectedFolder]);

  const getSearchTerm = (e) => {
    setSearchArea(e.target.value);
  };

  return (
    <section className="">
      <main className="">
        <div className="">
          <div className="">
            <h5 className="">Settlement Report</h5>
          </div>
          <section>
            <div className="container-fluid ">
              <div className="row">
                <div className="col-lg-3">
                  <label>Select Folder</label>
                  <select
                    value={selectedFolder}
                    className="form-select"
                    onChange={(e) => onChangeFolder(e.target.value)}
                  >
                    <option value="">Select Folder</option>
                    {folderArr &&
                      folderArr.map((folder, i) => (
                        <option value={folder} key={uuidv4()}>
                          {folder}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-lg-3">
                  <label>Select Sub Folder</label>
                  <select
                    onChange={(event) =>
                      SetSelectedSubFolder(event.target.value)
                    }
                    value={selectedSubFolder}
                    className="form-select"
                  >
                    <option value="">Select</option>
                    {subFolderArr &&
                      subFolderArr.map((subfolder, i) => (
                        <option value={subfolder} key={uuidv4()}>
                          {subfolder}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="row mt-4">
                {data?.length > 0 ? (
                  <React.Fragment>
                    <div className="col-lg-3">
                      <label>Search</label>
                      <input
                        type="text"
                        value={searchArea}
                        placeholder="Search Here"
                        className="form-control"
                        onChange={getSearchTerm}
                      />
                      {showFilterData.filter}
                    </div>
                    {searchFilterData.length > 9 ? (
                      <div className="col-lg-3">
                        <label>Count Per Page</label>
                        <select className="form-select">
                          <DropDownCountPerPage
                            datalength={searchFilterData.length}
                          />
                        </select>
                      </div>
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </section>

          <section className="">
            <div className="container-fluid mt-5">
              {searchFilterData.length > 0 && (
                <h6>Total Record : {searchFilterData.length} </h6>
              )}
              {searchFilterData?.length === 0 ? "" : (
                <div className="scroll" style={{ overflow: "auto" }}>
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
              )}
            </div>
          </section>
        </div>
      </main>
    </section>

  );
}

export default SettlementReport;
