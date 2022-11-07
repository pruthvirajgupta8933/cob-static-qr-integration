import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import API_URL from "../../../config";
import { isClientCodeCreated } from "../../../utilities/isClientCodeCreated";
import { isKycCompleted } from "../../../utilities/isKycCompleted";
import DropDownCountPerPage from "../../../_components/reuseable_components/DropDownCountPerPage";

function SettlementReport() {
  const [searchArea, setSearchArea] = useState("");
  const [data, setData] = React.useState([]);
  const [folderArr, setFolderArr] = React.useState([]);
  const [subFolderArr, setSubFolderArr] = React.useState([]);
  const [showFilterData, SetShowFilterData] = React.useState([]);
  const [selectedFolder, SetSelectedFolder] = React.useState("");
  const [selectedSubFolder, SetSelectedSubFolder] = React.useState("");
  const [searchFilterData, setSearchFilterData] = React.useState([]);
  const history = useHistory();

  const { user } = useSelector((state) => state.auth);
  let clientCode = "";
  if (isKycCompleted) {
    // console.log("kyc has completed");
    if (isClientCodeCreated) {
      // console.log("client code has created");
    } else {
      // console.log("kyc done client code is not create");
    }
  } else {
    // console.log("kyc not completed");
  }

  if (user && user?.clientMerchantDetailsList) {
    history.push("/dashboard/profile");
  } else {
    var clientMerchantDetailsList = user.clientMerchantDetailsList;
    // console.log(typeof(user.clientMerchantDetailsList))
    if (user.clientMerchantDetailsList !== undefined) {
      // console.log(clientMerchantDetailsList)
      clientCode = clientMerchantDetailsList[0].clientCode;
    }
  }

  useEffect(() => {
    axios(`${API_URL.GET_FILE_NAME}${clientCode}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        // console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    data.filter((item) => folderArr.push(item.folder));
    setFolderArr([...new Set(folderArr)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (searchArea !== "") {
      const data = showFilterData.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchArea.toLocaleLowerCase())
      );
      // console.log("data",data);
      setSearchFilterData(data);
    } else {
      setSearchFilterData(showFilterData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchArea]);

  const onChangeFolder = (val) => {
    SetSelectedFolder(val);

    var tempArr = [];
    data.filter((item) =>
      item.folder === val ? tempArr.push(item.sub_folder) : null
    );
    setSubFolderArr([...new Set(tempArr)]);
  };

  useEffect(() => {
    var tempArr1 = [];
    data.filter((item) =>
      item.folder === selectedFolder && item.sub_folder === selectedSubFolder
        ? tempArr1.push(item)
        : null
    );

    SetShowFilterData(tempArr1);
    setSearchFilterData(tempArr1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubFolder, selectedFolder]);

  const getSearchTerm = (e) => {
    setSearchArea(e.target.value);
  };

  return (
    <>
      <section className="ant-layout">
        <div className="profileBarStatus"></div>
        <main className="gx-layout-content ant-layout-content">
          <div className="gx-main-content-wrapper">
            <div className="right_layout my_account_wrapper right_side_heading">
              <h1 className="m-b-sm gx-float-left">Settlement Report</h1>
            </div>
            <section
              className="features8 cid-sg6XYTl25a flleft col-lg-12"
              id="features08-3-"
            >
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-6 mrg-btm">
                    <label>Select Folder</label>
                    <select
                      value={selectedFolder}
                      className="ant-input"
                      onChange={(e) => onChangeFolder(e.target.value)}
                    >
                      <option value="">Select Folder</option>
                      {folderArr &&
                        folderArr.map((folder, i) => (
                          <option value={folder} key={i}>
                            {folder}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="col-lg-6 mrg-btm">
                    <label>Select Sub Folder</label>
                    <select
                      onChange={(event) =>
                        SetSelectedSubFolder(event.target.value)
                      }
                      value={selectedSubFolder}
                      className="ant-input"
                    >
                      <option value="">Select</option>
                      {subFolderArr &&
                        subFolderArr.map((subfolder, i) => (
                          <option value={subfolder} key={i}>
                            {subfolder}
                          </option>
                        ))}
                    </select>
                  </div>
                  {data?.length > 0 ? (
                    <React.Fragment>
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
                      {searchFilterData.length > 9 ? (
                        <div className="col-lg-6 mrg-btm- bgcolor">
                          <label>Count Per Page</label>
                          <select className="ant-input">
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
              <div className="container-fluid  p-3 my-3 ">
                {searchFilterData.length > 0 ? (
                  <h4>Total Record : {searchFilterData.length} </h4>
                ) : (
                  <></>
                )}
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
              </div>
            </section>
          </div>
        </main>
      </section>
    </>
  );
}

export default SettlementReport;
