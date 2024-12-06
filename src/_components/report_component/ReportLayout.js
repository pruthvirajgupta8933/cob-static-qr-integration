import { useState, useEffect } from "react";
import _ from "lodash";
import Table from "../table_components/table/Table";
import DropDownCountPerPage from "../reuseable_components/DropDownCountPerPage";

const ReportLayout = ({
  type,
  title,
  form,
  data,
  rowData,
  dataSummary,
  showSearch,
  showCountPerPage,
  onRowClick,
}) => {
  const [searchText, SetSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [selectedData, setSelectedData] = useState();
  const [paginatedata, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setSelectedData(data);
    // setShowData(data);
    // SetTxnList(data);
    setPaginatedData(_(data).slice(0).take(pageSize).value());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  useEffect(() => {
    setPaginatedData(_(selectedData).slice(0).take(pageSize).value());
    // setPageCount(
    //   showData.length > 0 ? Math.ceil(showData.length / pageSize) : 0
    // );
  }, [pageSize, selectedData]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedPost = _(selectedData)
      .slice(startIndex)
      .take(pageSize)
      .value();
    setPaginatedData(paginatedPost);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (searchText !== "") {
      setSelectedData(
        data.filter((txnItme) =>
          Object.values(txnItme)
            .join(" ")
            .toLowerCase()
            .includes(searchText.toLocaleLowerCase())
        )
      );
    } else {
      setSelectedData(data);
    }
  }, [searchText]);

  return (
    <div>
      <h5>{title}</h5>
      <section>
        <div className="container-fluid p-0 mt-4">
          {form}
          <hr className="hr" />
          {data?.length > 0 && (
            <div className="form-row">
              {showSearch && (
                <div className="form-group col-md-3">
                  <label>Search</label>
                  <input
                    type="text"
                    label="Search"
                    name="search"
                    placeholder="Search Here"
                    className="form-control rounded-0"
                    onChange={(e) => {
                      SetSearchText(e.target.value);
                    }}
                  />
                </div>
              )}
              {showCountPerPage && (
                <div className="form-group col-md-3">
                  <label>Count Per Page</label>
                  <select
                    value={pageSize}
                    rel={pageSize}
                    className="form-select"
                    onChange={(e) => setPageSize(parseInt(e.target.value))}
                  >
                    <DropDownCountPerPage datalength={data.length} />
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <section className="features8 cid-sg6XYTl25a flleft w-100">
        <div className="container-fluid p-0 my-3 ">
          {data?.length > 0 && (
            <h6>
              <strong>Total Record</strong> : {data.length}
              {dataSummary?.map((summary) => (
                <span className="px-2">
                  |<strong className="px-1">{summary.name} : </strong>
                  <span>{summary.value}</span>
                </span>
              ))}
            </h6>
          )}
          <div className="overflow-auto">
            <Table
              row={rowData}
              data={paginatedata}
              dataCount={data.length}
              pageSize={pageSize}
              currentPage={currentPage}
              changeCurrentPage={(page) => setCurrentPage(page)}
              onRowClick={(row) =>
                typeof onRowClick === "function" && onRowClick(row)
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
};
export default ReportLayout;
