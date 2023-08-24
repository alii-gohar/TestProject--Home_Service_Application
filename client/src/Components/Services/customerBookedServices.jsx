import { useState, useEffect } from "react";
import axiosCall from "../../AxiosCall";
import GenericTable from "../Table/Table";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { MDBInput } from "mdb-react-ui-kit";
const CustomerBookedServices = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [ServiceStatus, setServiceStatus] = useState("OnGoing");
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [modal, setModal] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [serviceId, setServiceId] = useState("");
  const toggle = () => setModal(!modal);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          ServiceStatus === "OnGoing"
            ? "customer/viewOnGoingServices"
            : "customer/viewCompletedServices";
        const response = await axiosCall("GET", url);
        if (response.status === 200) setData(response.data.onGoingServices);
        else setMessage(response?.response?.data?.error);
      } catch (error) {
        setMessage(error.response?.data?.error);
      } finally {
        setTimeout(() => {
          setMessage("");
        }, 1500);
      }
    };
    fetchData();
  }, [ServiceStatus, shouldUpdate]);
  const addReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosCall(
        "POST",
        "customer/addReview",
        { rating: rating, review: comment },
        serviceId
      );
      if (response.status === 200) {
        setShouldUpdate(!shouldUpdate);
        setMessage("Review Added Successfully");
      }
    } catch (error) {
      setMessage(error.response?.data?.error);
    } finally {
      setTimeout(() => {
        setMessage("");
      }, 1500);
      setComment("");
      setRating(0);
    }
  };
  const setService = (id) => {
    setServiceId(id[0]);
    const service = data.filter((item) => item._id === id[0]);
    if (service[0]?.reviewed === false) toggle();
    else window.alert("Review Already Given");
  };
  const tableHead = ["Title", "Seller", "Category", "Status"];
  const tableData = data.map((item) => [
    item.serviceId.title,
    item.serviceId.sellerId.name,
    item.serviceId.categoryId.name,
    item.status,
  ]);
  const tableButtons = ["Give Review"];
  const tableButtonFunctions = [setService];
  const dataIds = data.map((item) => [item._id]);
  return (
    <div>
      <h1 className="text-center">
        {ServiceStatus === "OnGoing"
          ? "On-Going Services"
          : "Completed Services"}
      </h1>
      <p className="text-center text-danger">{message}</p>
      <div className="d-flex justify-content-center">
        <button
          className={`btn mx-1 ${
            ServiceStatus === "OnGoing" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setServiceStatus("OnGoing")}
        >
          On-Going
        </button>
        <button
          className={`btn mx-1 ${
            ServiceStatus === "Completed"
              ? "btn-success"
              : "btn-outline-success"
          }`}
          onClick={() => setServiceStatus("Completed")}
        >
          Completed
        </button>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        {data.length < 1 ? (
          <h1 className="text-center fw-bold">No Services Found</h1>
        ) : (
          <div className="w-75 min-vh-100">
            {ServiceStatus === "OnGoing" ? (
              <GenericTable
                key={ServiceStatus}
                tableHead={tableHead}
                tableData={tableData}
                dataIds={dataIds}
              />
            ) : (
              <GenericTable
                key={ServiceStatus}
                tableHead={tableHead.concat(["Give Review"])}
                tableData={tableData}
                buttons={tableButtons}
                buttonFunctions={tableButtonFunctions}
                dataIds={dataIds}
              />
            )}
          </div>
        )}
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Review</ModalHeader>
        <ModalBody>
          <form onSubmit={addReview}>
            <MDBInput
              wrapperClass="mb-4"
              label="Review"
              type="text"
              size="lg"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <div className="mb-4">
              <label className="form-label">Rating</label>
              <select
                className="form-select"
                value={rating}
                onChange={(e) => {
                  setRating(e.target.value);
                }}
                required
              >
                <option>Select Option</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </div>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary "
                onClick={toggle}
                type="submit"
              >
                Add Review
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};
export default CustomerBookedServices;