import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { MDBCardBody, MDBInput } from "mdb-react-ui-kit";

import axiosCall from "../../Utils/AxiosCall";
import GenericTable from "../Table/Table";
import "./sellerCss.css";
import serviceStatus from "../../Utils/ServiceStatus";

const SellerServices = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    categoryId: "",
  });
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(serviceStatus.approved);
  const [serviceId, setServiceId] = useState("");
  const [reviews, setReviews] = useState([]);
  let filteredItems = data.filter((item) => item.status === selectedStatus);
  const handleModalPopUp = () => setModal(!modal);
  const [isSeeingReviews, setIsSeeingReviews] = useState(true);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const hanleStatusChange = (status) => {
    setSelectedStatus(status);
    setIsSeeingReviews(false);
  };
  const handleServiceUpdate = (param) => {
    const id = param[0];
    const serviceToUpdate = filteredItems.filter((item) => item._id === id);
    const item = serviceToUpdate[0];
    setServiceId(item._id);
    setFormData({
      title: item.title,
      description: item.description,
      location: item.location,
      price: item.price,
      categoryId: item.categoryId?.categoryId,
    });
    setIsUpdating(true);
    handleModalPopUp();
  };
  const handleServiceReviews = async (id) => {
    const response = await axiosCall("GET", "seller/serviceReviews", {}, id);
    setReviews(response.data);
    setIsSeeingReviews(true);
    const reviewsSection = document.getElementById("review");
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleNewService = () => {
    setIsAdding(true);
    handleModalPopUp();
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosCall("GET", "admin/categories");
        setCategories(response.data);
        setIsSeeingReviews(false);
      } catch (error) {
        setMessage(error.response?.data?.error);
      }
    };
    const fetchData = async () => {
      try {
        const response = await axiosCall("GET", "seller/services");
        if (response.status === 200) setData(response.data);
        else setMessage(response?.response?.data?.error);
      } catch (error) {
        setMessage(error.response?.data?.error);
      }
    };
    fetchData();
    fetchCategories();
  }, [shouldUpdate]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    let method,
      url = "seller/service",
      param = "";
    if (isAdding) {
      method = "POST";
    }
    if (isUpdating) {
      method = "PUT";
      param = serviceId;
    }
    try {
      const response = await axiosCall(method, url, formData, param);
      if (response.status === 200) {
        setShouldUpdate(!shouldUpdate);
        setMessage("Service Updated Successfully");
        handleModalPopUp();
      } else setMessage(response?.response?.data?.error);
    } catch (error) {
      setMessage(error.response.data.error);
    } finally {
      setTimeout(() => {
        setMessage("");
      }, 1500);
      setFormData({
        title: "",
        description: "",
        location: "",
        price: "",
        categoryId: "", // New category field
      });
    }
  };
  const tableHead = [
    "Title",
    "Location",
    "Price",
    "Status",
    "Description",
    "Category",
    "Rating",
  ];
  const tableData = filteredItems.map((item) => [
    item.title,
    item.location,
    item.price,
    item.status,
    item.description,
    item.categoryId.name,
    item.averageRating,
  ]);
  const dataIds = filteredItems.map((item) => [item._id]);

  const handleTableRendering = (
    selectedStatus,
    tableHead,
    tableData,
    filteredItems,
    dataIds,
    handleServiceReviews,
    handleServiceUpdate
  ) => {
    if (selectedStatus === serviceStatus.approved) {
      return (
        <GenericTable
          tableHead={tableHead.concat(["View Reviews"])}
          tableData={tableData}
          buttons={["Reviews"]}
          buttonFunctions={[handleServiceReviews]}
          dataIds={dataIds}
        />
      );
    } else if (selectedStatus === serviceStatus.rejected) {
      const modifiedTableHead = tableHead
        .slice(0, -1)
        .concat(["Comment", "Update"]);
      const modifiedTableData = tableData.map((item, index) =>
        item.slice(0, -1).concat([filteredItems[index].comment])
      );

      return (
        <GenericTable
          tableHead={modifiedTableHead}
          tableData={modifiedTableData}
          buttons={["Update"]}
          buttonFunctions={[handleServiceUpdate]}
          dataIds={dataIds}
        />
      );
    } else {
      const simplifiedTableData = tableData.map((item) => item.slice(0, -1));

      return (
        <GenericTable
          tableHead={tableHead.slice(0, -1)}
          tableData={simplifiedTableData}
          dataIds={dataIds}
        />
      );
    }
  };

  return (
    <div>
      <h1 className="text-center">Seller Services</h1>
      <p className="text-center text-danger">{message}</p>
      <div className="d-flex justify-content-center">
        <button
          className={`btn mx-1 ${
            selectedStatus === "Approved"
              ? "btn-success"
              : "btn-outline-success"
          }`}
          onClick={() => hanleStatusChange(serviceStatus.approved)}
        >
          Approved
        </button>
        <button
          className={`btn mx-1 ${
            selectedStatus === "Pending" ? "btn-warning" : "btn-outline-warning"
          }`}
          onClick={() => hanleStatusChange(serviceStatus.pending)}
        >
          Pending
        </button>
        <button
          className={`btn mx-1 ${
            selectedStatus === "Rejected" ? "btn-danger" : "btn-outline-danger"
          }`}
          onClick={() => hanleStatusChange(serviceStatus.rejected)}
        >
          Rejected
        </button>
      </div>
      <div className="d-flex justify-content-end mx-5">
        <button
          className="btn btn-success"
          size="sm"
          onClick={handleNewService}
        >
          + Add Service
        </button>
      </div>
      <div className="d-flex justify-content-center  vh-100">
        {filteredItems.length < 1 ? (
          <h1 className="text-center fw-bold">No Services Found</h1>
        ) : (
          <div className="w-75 min-vh-100">
            {handleTableRendering(
              selectedStatus,
              tableHead,
              tableData,
              filteredItems,
              dataIds,
              handleServiceReviews,
              handleServiceUpdate
            )}
          </div>
        )}
      </div>
      <Modal isOpen={modal} toggle={handleModalPopUp} size="lg">
        <ModalHeader toggle={handleModalPopUp}></ModalHeader>
        <ModalBody>
          <h1 className="text-center">
            {isUpdating ? "Update Service" : "Add Service"}
          </h1>
          <form onSubmit={handleSubmit}>
            <MDBCardBody className="px-5">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <MDBInput
                wrapperClass="mb-1"
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
              />
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <MDBInput
                wrapperClass="mb-1"
                id="description"
                name="description"
                type="text"
                required
                value={formData.description}
                onChange={handleChange}
              />
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <MDBInput
                wrapperClass="mb-1"
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
              />
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <MDBInput
                wrapperClass="mb-1"
                id="price"
                name="price"
                type="number"
                required
                value={formData.price}
                onChange={handleChange}
              />
              <label htmlFor="categoryId" className="form-label">
                Select Category
              </label>
              <select
                className="form-select mb-1"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a Category
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                color="success"
                className="btn btn-lg btn-success px-5 my-2"
                size="lg"
                type="submit"
              >
                Submit
              </button>
            </MDBCardBody>
          </form>
        </ModalBody>
      </Modal>
      {isSeeingReviews && (
        <section className="mt-4 review-section" id="review">
          <h2 className="text-center">Reviews</h2>
          {reviews.length > 0 ? (
            <div className="review-container">
              {reviews.map((review) => (
                <div key={review._id} className="review">
                  <h3>{review.customerId?.name}</h3>
                  <p>Review: {review.description}</p>
                  <p>Rating: {review.rating}</p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h1>No Reviews Found</h1>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
export default SellerServices;
