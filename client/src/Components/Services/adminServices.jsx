import { useState, useEffect } from "react";
import { MDBInput } from "mdb-react-ui-kit";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import axiosCall from "../../AxiosCall";
import { useLocation } from "react-router-dom";
import GenericTable from "../Table/Table";
const Services = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(false);
  const [comment, setComment] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [shouldUpdate, setShouldUpdate] = useState(false);
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
  }, [location, shouldUpdate]);
  const approveService = async (id) => {
    try {
      const response = await axiosCall("PUT", "admin/approveService", {}, id);
      if (response.status === 200) {
        setMessage("Service Approved Successfully");
      } else setMessage(response?.response?.data?.error);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setTimeout(function () {
        setMessage("");
      }, 1500);
      setShouldUpdate(!shouldUpdate);
    }
  };
  const openRejectModal = (id) => {
    setServiceId(id);
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
      } else setMessage(response?.response?.data?.error);
      // Update UI logic here
    } catch (error) {
      setMessage("Error Rejecting Service");
    } finally {
      setComment("");
      setTimeout(function () {
        setMessage("");
      }, 1500);
      setShouldUpdate(!shouldUpdate);
    }
  };
  const servicesTableHead = [
    "Title",
    "Location",
    "Price",
    "Status",
    "Description",
    "Seller Name",
    "Category",
    "Approve",
    "Reject",
  ];
  const servicesTableData = data.map((item) => [
    item.title,
    item.location,
    item.price,
    item.status,
    item.description,
    item.sellerId?.name,
    item.categoryId?.name,
  ]);
  const servicesTableButtons = ["Approve", "Reject"];
  const servicesTableButtonFunctions = [approveService, openRejectModal];
  const dataIds = data.map((item) => [item._id]);
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
        <div className="w-75 min-vh-100">
          {data.length < 1 ? (
            <h1 className="text-center fw-bold">No Services Found</h1>
          ) : location === "/viewNewServices" ? (
            <GenericTable
              tableHead={servicesTableHead}
              tableData={servicesTableData}
              buttons={servicesTableButtons}
              buttonFunctions={servicesTableButtonFunctions}
              dataIds={dataIds}
              modal={modal}
              setModal={setModal}
              key={location}
            />
          ) : location === "/viewRejectedServices" ? (
            <GenericTable
              tableHead={servicesTableHead.slice(0, -1)}
              tableData={servicesTableData}
              buttons={servicesTableButtons.slice(0, -1)}
              buttonFunctions={servicesTableButtonFunctions.slice(0, -1)}
              dataIds={dataIds}
              key={location}
            />
          ) : (
            <GenericTable
              tableHead={servicesTableHead.slice(0, -2).concat(["Rating"])}
              tableData={servicesTableData.map((arr, index) =>
                arr.concat(data[index].averageRating)
              )}
              dataIds={dataIds}
              key={location}
            />
          )}
        </div>
      </div>
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
