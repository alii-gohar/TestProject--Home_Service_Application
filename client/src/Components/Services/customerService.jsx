import React, { useState, useEffect } from "react";
import axiosCall from "../../AxiosCall";
import GenericTable from "../Table/Table";
import makePayment from "../../Payment";
import Loader from "../Loader";
const CustomerServices = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosCall("GET", "customer/viewAllServices");
        if (response.status === 200) {
          setData(response.data.services);
        } else {
          setMessage(response?.response?.data?.error);
        }
      } catch (error) {
        setMessage(error.response?.data?.error);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await axiosCall("GET", "admin/getCategories");
        setCategories(response.data);
      } catch (error) {
        setMessage(error.response?.data?.error);
      }
    };
    fetchData();
    fetchCategories();
  }, []);
  const bookService = async (id) => {
    setIsBooking(true);
    await makePayment(id);
  };
  const handleSortChange = () => {
    setSortAscending((prevState) => !prevState);
  };
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  const sortedData = data.slice().sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortAscending ? dateA - dateB : dateB - dateA;
  });
  const filteredData = selectedCategory
    ? sortedData.filter((item) => item.categoryId._id === selectedCategory)
    : sortedData;
  const tableHead = [
    "Title",
    "Location",
    "Description",
    "Seller",
    "Category",
    "Rating",
    "Book",
  ];
  const tableData = filteredData.map((item) => [
    item.title,
    item.location,
    item.description,
    item.sellerId.name,
    item.categoryId.name,
    item.averageRating,
  ]);
  const buttons = ["Book Service"];
  const buttonFunctions = [bookService];
  const dataIds = filteredData.map((item) => [item._id]);
  return (
    <div>
      {!isBooking ? (
        <div>
          <h1 className="text-center">Services</h1>
          <p className="text-center text-danger">{message}</p>
          <div className="d-flex justify-content-end mx-5">
            <label className="form-check-label">
              <select
                className="form-select mb-1"
                name="categoryId"
                onChange={handleCategoryChange}
                value={selectedCategory}
              >
                <option value="">All Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-check-label">
              <input
                type="checkbox"
                className="form-check-input mx-1"
                checked={!sortAscending}
                onChange={handleSortChange}
              />
              Sort by Date
            </label>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            {tableData.length < 1 ? (
              <h1 className="text-center fw-bold">No Services Found</h1>
            ) : (
              <div className="w-75 min-vh-100">
                <GenericTable
                  tableHead={tableHead}
                  tableData={tableData}
                  buttons={buttons}
                  buttonFunctions={buttonFunctions}
                  dataIds={dataIds}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="vh-100">
          <Loader />
        </div>
      )}
    </div>
  );
};
export default CustomerServices;