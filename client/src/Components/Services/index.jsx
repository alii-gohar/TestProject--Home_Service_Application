import { useState, useEffect } from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
} from "mdb-react-ui-kit";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import axiosCall from "../../AxiosCall";
import { useLocation } from "react-router-dom";
const Services = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(false);
  const [comment, setComment] = useState("");
  const [serviceId, setServiceId] = useState("");
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
  const location = useLocation().pathname;
  const toggle = () => setModal(!modal);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let status;
        location === "/viewNewServices"
          ? (status = "Pending")
          : location === "/viewApprovedServices"
          ? (status = "Approved")
          : (status = "Rejected");
        const response = await axiosCall(
          "GET",
          "admin/getServices",
          {},
          status
        );
        if (response.status === 200) setData(response.data);
        else setMessage(response?.response?.data?.error);
      } catch (error) {
        setMessage(error.response?.data?.error);
      }
    };
    fetchData();
  }, [location]);
  const approveService = async (e) => {
    try {
      const id = e.target.id;
      const response = await axiosCall("PUT", "admin/approveService", {}, id);
      if (response.status === 200) {
        setData((prevData) =>
          prevData.filter((item) => item._id !== e.target.id)
        );
        setMessage("Service Approved Successfully");
      } else setMessage(response?.response?.data?.error);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setTimeout(function () {
        setMessage("");
      }, 1500);
    }
  };
  const openRejectModal = (e) => {
    e.preventDefault();
    setServiceId(e.target.id);
    toggle();
  };
  const rejectService = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosCall(
        "PUT",
        "admin/rejectService",
        { comment: comment },
        serviceId
      );
      if (response.status === 200) {
        setMessage("Service Rejected Successfully");
        setData((prevData) =>
          prevData.filter((item) => item._id !== serviceId)
        );
      } else setMessage(response?.response?.data?.error);
      // Update UI logic here
    } catch (error) {
      setMessage("Error Rejecting Service");
    } finally {
      setComment("");
      setTimeout(function () {
        setMessage("");
      }, 1500);
    }
  };
  return (
    <div>
      <h1 className="text-center">
        {location === "/viewNewServices"
          ? "New Services"
          : location === "/viewApprovedServices"
          ? "Approved Services"
          : "Rejected Services"}
      </h1>
      <p className="text-center text-danger">{message}</p>
      <div className="d-flex justify-content-center align-items-center">
        <MDBTable className="w-75">
          <MDBTableHead>
            <tr>
              <th scope="col">Sr. No</th>
              <th scope="col">Title</th>
              <th scope="col">Location</th>
              <th scope="col">Price</th>
              <th scope="col">Status</th>
              <th scope="col">Description</th>
              <th scope="col">Seller Name</th>
              <th scope="col">Category</th>
              {location === "/viewApprovedServices" && (
                <th scope="col">Average Rating</th>
              )}
              {location === "/viewRejectedServices" && (
                <th scope="col">Comment</th>
              )}
              {(location === "/viewNewServices" ||
                location === "/viewRejectedServices") && (
                <th scope="col">Approve</th>
              )}
              {location === "/viewNewServices" && <th scope="col">Reject</th>}
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
                    {item.title}
                  </p>
                </td>
                <td>
                  <p key={item._id} className="fw-normal mb-1">
                    {item.location}
                  </p>
                </td>
                <td>
                  <p key={item._id} className="fw-normal mb-1">
                    {item.price}
                  </p>
                </td>
                <td>
                  <p key={item._id} className="fw-normal mb-1">
                    {item.status}
                  </p>
                </td>
                <td>
                  <p key={item._id} className="fw-normal mb-1">
                    {item.description}
                  </p>
                </td>
                <td>
                  <p key={item._id} className="fw-normal mb-1">
                    {item.sellerId?.name}
                  </p>
                </td>
                <td>
                  <p key={item._id} className="fw-normal mb-1">
                    {item.categoryId?.name}
                  </p>
                </td>
                {location === "/viewApprovedServices" && (
                  <td>
                    <p key={item._id} className="fw-normal mb-1">
                      {item?.averageRating}
                    </p>
                  </td>
                )}
                {location === "/viewRejectedServices" && (
                  <td>
                    <p key={item._id} className="fw-normal mb-1">
                      {item?.comment}
                    </p>
                  </td>
                )}
                {(location === "/viewNewServices" ||
                  location === "/viewRejectedServices") && (
                  <td>
                    <button
                      id={item._id}
                      className="me-1 btn btn-success"
                      color="danger"
                      size="sm"
                      onClick={approveService}
                      // disabled={isDeleting}
                    >
                      Approve
                    </button>
                  </td>
                )}
                {location === "/viewNewServices" && (
                  <td>
                    <button
                      id={item._id}
                      className="me-1 btn btn-danger"
                      color="danger"
                      size="sm"
                      onClick={openRejectModal}
                      // disabled={isDeleting}
                    >
                      Reject
                    </button>
                  </td>
                )}
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
        <ModalHeader toggle={toggle}>Reason to Reject Service</ModalHeader>
        <ModalBody>
          <form onSubmit={rejectService}>
            <MDBInput
              wrapperClass="mb-4"
              label="Reason"
              type="text"
              size="lg"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary "
                onClick={toggle}
                type="submit"
              >
                Add Comment
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};
export default Services;
