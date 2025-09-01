import React, { useEffect, useState } from 'react'
import _, { map } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

function Pagination(props) {
  // console.log(props);
  const { data, tableHeader, tableBody } = props.paginationProps;
  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);


  const pageCount = data ? Math.ceil(data.length / pageSize) : 0;
  const pagination = (pageNo) => {
    setCurrentPage(pageNo);

    const startIndex = (pageNo - 1) * pageSize;
    const paginatedPost = _(data).slice(startIndex).take(pageSize).value();
    setPaginatedData(paginatedPost);

  }


  useEffect(() => {
    setPaginatedData(_(data).slice(0).take(pageSize).value())
  }, [pageSize]);

  // if ( pageCount === 1) return null;
  const pages = _.range(1, pageCount + 1)
  var tableContent = (<table className='table' style={{ marginLeft: 10 }}>
    {/* table head */}
    <tr>
      {tableHeader.map((thd, i) => <th key={uuidv4()}>{thd}</th>)}
    </tr>

    {/* table body */}
    {paginatedata.map((report, i) => (
      <tr key={uuidv4()}>
        {tableBody.map((allowedData, i) =>
          (Object.keys(report).includes(allowedData) ? <td>{Object.values(report)[i]}</td> : '')

        )}
      </tr>
    ))}
  </table>);


  return (
    <div>Pagination
      {tableContent}
    </div>
  )
}

export default Pagination