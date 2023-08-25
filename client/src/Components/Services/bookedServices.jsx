import { useState, useEffect } from "react";

import axiosCall from "../../Utils/AxiosCall";
import GenericTable from "../Table/Table";

const BookedServices = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [ServiceStatus, setServiceStatus] = useState("OnGoing");
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const handleServiceCompletion = async (id) => {
    try {
      const response = await axiosCall("PUT", "seller/completeService", {}, id);
      if (response.status === 200) {
        setMessage("Service Marked Completed Successfully");
        setData((prevData) => prevData.filter((item) => item._id !== id));
      } else setMessage(response?.response?.data?.error);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setTimeout(() => {
        setMessage("");
      }, 1500);
      setShouldUpdate(!shouldUpdate);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosCall(
          "GET",
          "seller/bookedServices",
          {},
          ServiceStatus
        );
        if (response.status === 200) setData(response.data.bookedServices);
        else setMessage(response?.response?.data?.error);
      } catch (error) {
        setMessage(error.response?.data?.error);
      }
    };
    fetchData();
  }, [ServiceStatus, shouldUpdate]);

  const tableHead = [
    "Customer",
    "Service",
    "Status",
    "Category",
    "Rating",
    "Mark Complete",
  ];
  const tableData = data.map((item) => [
    item.customerId.name,
    item.serviceId.title,
    item.status,
    item.serviceId.categoryId.name,
    item.serviceId.averageRating,
  ]);
  const tableButtons = ["Mark Complete"];
  const tableButtonFunctions = [handleServiceCompletion];
  const dataIds = data.map((item) => [item._id]);

  return (
    <>
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
              ServiceStatus === "OnGoing"
                ? "btn-primary"
                : "btn-outline-primary"
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
                  tableHead={tableHead}
                  tableData={tableData}
                  buttons={tableButtons}
                  buttonFunctions={tableButtonFunctions}
                  dataIds={dataIds}
                />
              ) : (
                <GenericTable
                  tableHead={tableHead.slice(0, -1)}
                  tableData={tableData}
                  dataIds={dataIds}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default BookedServices;
