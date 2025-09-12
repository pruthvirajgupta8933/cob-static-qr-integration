import { useState, useEffect } from "react";
import _ from "lodash";
import Table from "../table_components/table/Table";
import DropDownCountPerPage from "../reuseable_components/DropDownCountPerPage";
import CustomLoader from "../../_components/loader";

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
  dynamicPagination,
  page_size,
  current_page,
  dataCount,
  change_currentPage,
  change_pageSize,
  loadingState,
  totalSettlementAmount
}) => {


  const [searchText, SetSearchText] = useState("");
  const [localPageSize, setLocalPageSize] = useState(10);
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const actualPageSize = dynamicPagination ? page_size : localPageSize;
  const actualCurrentPage = dynamicPagination ? current_page : localCurrentPage;




  useEffect(() => {

    let filtered = data;

    if (searchText.trim() !== "") {
      filtered = data.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }

    setFilteredData(filtered);


    if (dynamicPagination) {

      setPaginatedData(filtered);
    } else {
      const startIndex = (localCurrentPage - 1) * localPageSize;
      const paginated = _(filtered).slice(startIndex).take(localPageSize).value();
      setPaginatedData(paginated);
    }
  }, [data, searchText, localCurrentPage, localPageSize, dynamicPagination]);

  const handleLocalPageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setLocalPageSize(newSize);
    setLocalCurrentPage(1); // reset to first page
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center border-bottom mb-4">
        <h5>{title}</h5>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
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
                        placeholder="Search Here"
                        className="form-control"
                        onChange={(e) => {
                          SetSearchText(e.target.value);
                          if (!dynamicPagination) setLocalCurrentPage(1);
                        }}
                        value={searchText}
                      />
                    </div>
                  )}

                  {showCountPerPage && (
                    <div className="form-group col-md-3">
                      <label>Count Per Page</label>
                      <select
                        value={actualPageSize}
                        className="form-select"
                        onChange={(e) =>
                          dynamicPagination
                            ? change_pageSize(parseInt(e.target.value))
                            : handleLocalPageSizeChange(e)
                        }
                      >
                        <DropDownCountPerPage
                          datalength={dynamicPagination ? dataCount : filteredData?.length}
                        />
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="flleft w-100">
            {loadingState ? (
              <CustomLoader loadingState={loadingState} />
            ) : (
              <div className="container-fluid p-0 my-3">
                {data?.length > 0 && (
                  <h6 className="mb-2 d-flex flex-wrap align-items-center font_size_each">
                    <span className="me-3">
                      Total Count: {dynamicPagination ? dataCount : filteredData?.length || 0}
                    </span>
                    {dataSummary?.map((summary, index) => (
                      <span key={index} className="me-3 d-flex align-items-center">
                        <span className="mx-2">|</span>
                        <span>
                          {summary.name}:{" "}
                          {(typeof summary.value === "number"
                            ? summary.value.toFixed(2)
                            : parseFloat(summary.value).toFixed(2))}
                        </span>
                      </span>
                    ))}
                  </h6>
                )}


                <div className="overflow-auto">
                  <Table
                    row={rowData}
                    data={paginatedData}
                    dataCount={dynamicPagination ? dataCount : filteredData?.length || 0}
                    pageSize={actualPageSize}
                    currentPage={actualCurrentPage}
                    changeCurrentPage={(page) =>
                      dynamicPagination
                        ? change_currentPage(page)
                        : setLocalCurrentPage(page)
                    }
                    onRowClick={(row) =>
                      typeof onRowClick === "function" && onRowClick(row)
                    }
                    loadingState={loadingState}
                  />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReportLayout;
