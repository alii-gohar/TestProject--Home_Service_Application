import { useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
const generateRandomKey = () => Math.random().toString();
const GenericTable = ({
  tableHead,
  tableData,
  buttons,
  buttonFunctions,
  dataIds,
  modal,
  setModal,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const currentDataIds = dataIds.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  return (
    <>
      <MDBTable>
        <MDBTableHead>
          <tr>
            <th key={generateRandomKey()}>Sr.No</th>
            {tableHead.map((head) => (
              <th key={generateRandomKey()}>{head}</th>
            ))}
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {currentItems.map((item, index) => (
            <tr key={currentDataIds[index] + generateRandomKey()}>
              <td key={generateRandomKey()}>
                <div className="d-flex align-items-center">
                  <div className="ms-3">
                    <p className="fw-bold mb-1">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </p>
                  </div>
                </div>
              </td>
              {item.map((data) => (
                <td key={generateRandomKey()}>{data}</td>
              ))}
              {buttons &&
                buttons.length > 0 &&
                buttons.map((button, btnIndex) => (
                  <td key={generateRandomKey()}>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        buttonFunctions[btnIndex](currentDataIds[index])
                      }
                    >
                      {button}
                    </button>
                  </td>
                ))}
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
      <nav className="d-flex justify-content-center align-items-center">
        <ul className="pagination">
          {pageNumbers.length > 1 &&
            pageNumbers.map((number) => (
              <li key={generateRandomKey()} className="page-item">
                <button
                  className={`page-link ${
                    currentPage === number ? "active" : ""
                  } mx-1`}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </button>
              </li>
            ))}
        </ul>
      </nav>
    </>
  );
};
export default GenericTable;