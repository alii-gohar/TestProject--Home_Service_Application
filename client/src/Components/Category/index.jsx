import { useState, useEffect } from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
} from "mdb-react-ui-kit";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import axiosCall from "../../AxiosCall";

const Categories = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [modal, setModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  const toggle = () => setModal(!modal);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosCall("GET", "admin/getCategories");
        if (response.status === 200) setData(response.data);
        else setMessage(response?.response?.data?.error);
      } catch (error) {
        setMessage(error.message);
      }
    };
    fetchData();
  }, []);
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosCall(
        "DELETE",
        "admin/deleteCategory",
        {},
        e.target.id
      );
      setIsDeleting(true);
      if (response.status === 200) {
        setMessage("Data deleted successfully!");
        setData((prevData) =>
          prevData.filter((item) => item._id !== e.target.id)
        );
      } else setMessage(response?.response?.data?.error);
    } catch (error) {
      setMessage("Error deleting data");
    } finally {
      setIsDeleting(false);
      setTimeout(function () {
        setMessage("");
      }, 1500);
    }
  };
  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosCall("POST", "admin/addCategory", {
        name: categoryName,
      });
      if (response.status === 200) {
        window.location.reload();
      } else setMessage(response?.response?.data?.error);
    } catch (error) {
      setMessage("Error Adding Category");
    }
  };
  return (
    <div>
      <p className="text-center text-danger">{message}</p>
      <div className="d-flex justify-content-end mx-5">
        <button
          className="btn btn-success"
          size="sm"
          onClick={() => {
            setModal(true);
          }}
        >
          + Add Category
        </button>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <MDBTable className="w-75">
          <MDBTableHead>
            <tr>
              <th scope="col">Sr. No</th>
              <th scope="col">Title</th>
              <th scope="col">Delete</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {currentItems.map((item, index) => (
              <tr key={item._id}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="ms-3">
                      <p key={item._id} className="fw-bold mb-1">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <p key={item._id} className="fw-normal mb-1">
                    {item.name}
                  </p>
                </td>
                <td>
                  <button
                    id={item._id}
                    className="me-1 btn btn-danger"
                    color="danger"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </div>
      <nav className="d-flex justify-content-center align-items-center">
        <ul className="pagination">
          {pageNumbers.length > 1 &&
            pageNumbers.map((number) => (
              <li key={number} className="page-item">
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
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Category</ModalHeader>
        <ModalBody>
          <form onSubmit={addCategory}>
            <MDBInput
              wrapperClass="mb-4"
              label="Category Name"
              type="text"
              size="lg"
              required
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
              }}
            />
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary "
                onClick={toggle}
                type="submit"
              >
                Add Category
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};
export default Categories;